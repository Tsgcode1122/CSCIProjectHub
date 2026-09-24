import React, { useMemo, useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate, useSearchParams } from "react-router-dom";
import SectionDiv from "../../fixedComponent/SectionDiv";
import { Colors } from "../../theme/Colors";
import { media } from "../../theme/Breakpoints";
import { FiSearch } from "react-icons/fi";
import { BiSliderAlt } from "react-icons/bi";
import ProjectFilters from "./ProjectFilters";
import PageHeader from "../../fixedComponent/PageHeader";
import { useProjectContext } from "../../context/ProjectContext";
import ProjectCardItem from "./ProjectCardItem";

// Main projects listing page. It connects the API data from ProjectContext

const ProjectGrid = () => {
  const navigate = useNavigate();
  const { projects, loading, error } = useProjectContext();

  // showFilters controls the mobile filter drawer. Search and filters are

  const [showFilters, setShowFilters] = useState(false);

  const [search, setSearch] = useState("");
  const [searchParams] = useSearchParams();
  // These controls are local UI state; the project collection stays in context.

  const [filters, setFilters] = useState({
    year: "",
    department: "",
    projectStatus: "",
    facultyAdvisor: "",
  });

  const filterOptions = useMemo(() => {
    const uniq = (arr) => Array.from(new Set(arr)).filter(Boolean);

    const years = uniq(
      projects.map((p) => {
        if (!p.duration_end) return null;

        const parts = p.duration_end.split(" ");
        return parts[parts.length - 1];
      }),
    ).sort((a, b) => b - a);

    const departments = uniq(projects.map((p) => p.department)).sort();
    const statuses = uniq(projects.map((p) => p.project_status)).sort();
    const advisors = uniq(projects.map((p) => p.supervisor)).sort();

    return { years, departments, statuses, advisors };
  }, [projects]);
  useEffect(() => {
    // Program cards can open this page with a department query parameter.
    const departmentFromUrl = searchParams.get("department");
    if (departmentFromUrl) {
      setFilters((prev) => ({
        ...prev,
        department: departmentFromUrl,
      }));
    }
  }, [searchParams]);
  // Apply search and every active filter without changing the source array.

  const filteredProjects = useMemo(() => {
    const q = search.trim().toLowerCase();

    return projects.filter((p) => {
      const matchesSearch =
        !q ||
        p.title?.toLowerCase().includes(q) ||
        p.short_description?.toLowerCase().includes(q) ||
        (p.tags || []).some((t) => String(t).toLowerCase().includes(q));
      const matchesYear =
        !filters.year ||
        (p.duration_end && p.duration_end.split(" ").pop() === filters.year);

      const matchesDept =
        !filters.department || p.department === filters.department;

      const matchesStatus =
        !filters.projectStatus || p.project_status === filters.projectStatus;

      const matchesAdvisor =
        !filters.facultyAdvisor || p.supervisor === filters.facultyAdvisor;
      // Each condition uses AND logic, so a project must match every selected
      return (
        matchesSearch &&
        matchesYear &&
        matchesDept &&
        matchesStatus &&
        matchesAdvisor
      );
    });
  }, [search, filters, projects]);

  const handleFilterChange = (patch) => {
    // The filter panel sends only the field that changed; merge it with the existing state
    setFilters((prev) => ({ ...prev, ...patch }));
  };

  const clearFilters = () => {
    // Reset all filter fields while leaving the user's search text unchanged.
    setFilters({
      year: "",
      department: "",
      projectStatus: "",
      facultyAdvisor: "",
    });
  };

  const handleShowFilter = () => {
    // On smaller screens this opens or closes the filter drawer.
    setShowFilters(!showFilters);
  };

  return (
    <>
      {/* Shared page header keeps the projects page consistent with other lists. */}
      <PageHeader
        title="All Projects"
        subtitle="  Browse and filter student and faculty-led projects in the

                Department of Computing."
        backLabel="back"
      />

      <GridContainer>
        {/* Search and filter controls remain visible while the user scrolls. */}
        <StickyBar>
          <SectionContainer>
            <Filter>
              <SearchWrap>
                <FiSearch aria-hidden="true" />
                <SearchInput
                  id="project-search"
                  name="project-search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search projects by title, tag, or keyword..."
                  aria-label="Search projects by title, tag, or keyword"
                  aria-controls="project-results"
                />
              </SearchWrap>
              <FilterBtn
                type="button"
                onClick={handleShowFilter}
                aria-label="Open project filters"
                aria-controls="project-filters"
                aria-expanded={showFilters}
              >
                <BiSliderAlt aria-hidden="true" />
              </FilterBtn>
            </Filter>
          </SectionContainer>
        </StickyBar>
        <SectionDiv>
          <BodyGrid>
            {/* ProjectFilters is controlled by this page through props. */}
            <ProjectFilters
              options={filterOptions}
              value={filters}
              onChange={handleFilterChange}
              onClear={clearFilters}
              show={showFilters}
              onClose={() => setShowFilters(false)}
              resultCount={filteredProjects.length}
            />
            <ListCol>
              <ResultRow>
                <ResultCount>
                  Showing <b>{filteredProjects.length}</b> project(s)
                </ResultCount>
              </ResultRow>
              <div id="project-results" aria-live="polite" aria-atomic="true">
                {/* Render one clear state at a time: loading, error, empty, or data. */}
                {loading ? (
                  <EmptyState>
                    <h4>Loading projects...</h4>
                    <p>Please wait.</p>
                  </EmptyState>
                ) : error ? (
                  <EmptyState>
                    <h4>Could not load projects.</h4>
                    <p>{error}</p>
                  </EmptyState>
                ) : filteredProjects.length === 0 ? (
                  <EmptyState>
                    <h4>No projects match your filters.</h4>
                    <p>
                      Try clearing filters or searching a different keyword.
                    </p>
                  </EmptyState>
                ) : (
                  <List>
                    {/* this page only supplies data and navigation. */}
                    {filteredProjects.map((p) => (
                      <ProjectCardItem
                        key={p.id || p._id}
                        project={p}
                        onOpen={(id) => navigate(`/projects/${id}`)}
                      />
                    ))}
                  </List>
                )}
              </div>
            </ListCol>
          </BodyGrid>
        </SectionDiv>
      </GridContainer>
    </>
  );
};

export default ProjectGrid;

const GridContainer = styled.div`
  position: relative;
`;
const HeaderWrap = styled.div`
  background: ${Colors.brightBlue};
  position: relative;
`;

const HeaderInner = styled.div`
  display: grid;
  gap: 1.2rem;
  position: relative;
  max-width: 1400px;
  margin: 0 auto;
  @media ${media.tablet} {
    gap: 1.4rem;
  }
`;

const HeaderText = styled.div``;

const HeaderTitle = styled.h2`
  margin: 0;
  color: ${Colors.white};
  font-weight: 600;
`;

const HeaderSubtitle = styled.p`
  margin: 0.6rem 0 0 0;

  color: rgba(255, 255, 255, 0.85);
  max-width: 900px;
`;
const SectionContainer = styled.div`
  padding: 0rem 1.5rem;
  margin: 0 auto;

  @media ${media.mobileXS} {
    padding: 0rem 0.8rem;
  }

  @media ${media.mobileS} {
    padding: 0rem 1rem;
  }

  @media ${media.mobileM} {
    padding: 0rem 1.5rem;
  }

  @media ${media.mobileL} {
    padding: 0rem 3rem;
  }

  @media ${media.tablet} {
    padding: 0rem 4rem;
  }

  @media ${media.laptop} {
    max-width: 1200px;
    padding: 0rem 4rem 1rem 4rem;
  }

  @media ${media.desktop} {
    max-width: 1200px;
    padding: 0rem 6rem 1rem 6rem;
  }

  @media ${media.desktopXL} {
    max-width: 1600px;
    padding: 0rem 8rem 1rem 8rem;
  }
`;
const StickyBar = styled.div`
  top: 70px;
  z-index: 50;
  background: ${Colors.brightBlue};
  padding: 0rem 0 1rem 0;
  position: sticky;
  @media ${media.laptop} {
    position: relative;
    top: 0px;
  }
`;

const SearchWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 0.7rem;

  background: rgb(255, 255, 255);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 14px;

  padding: 0.9rem 1rem;
  color: rgba(0, 0, 0, 0.9);

  svg {
    font-size: 1.1rem;
  }
`;
const Filter = styled.div`
  position: sticky;
  top: 202px;
  display: grid;
  grid-template-columns: 1fr 44px;
  gap: 0.75rem;

  z-index: 20;

  padding: 0.7rem 0 0 0;

  @media ${media.laptop} {
    position: static;
    padding: 0;
  }
`;

const FilterBtn = styled.button`
  border: none;
  background: ${Colors.white};
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.18);

  svg {
    font-size: 1.4rem;
    color: ${Colors.etsuBlue};
  }

  &:hover svg {
    color: ${Colors.etsuGold};
  }

  @media ${media.laptop} {
    display: none;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  color: ${Colors.black};

  &:focus-visible {
    outline: 3px solid ${Colors.etsuGold};
    outline-offset: 2px;
  }

  &::placeholder {
    color: rgba(3, 3, 3, 0.626);
    font-weight: 500;
  }
`;

const BodyGrid = styled.div`
  padding: 2rem 0;
  display: grid;
  gap: 1.4rem;
  max-width: 1400px;
  margin: 0 auto;
  grid-template-columns: 1fr;
  @media ${media.laptop} {
    grid-template-columns: 280px 1fr;
    align-items: start;
  }
`;

const ListCol = styled.div`
  display: grid;
  gap: 1rem;
`;

const ResultRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ResultCount = styled.div`
  color: rgba(0, 0, 0, 0.65);
  margin-top: -1rem;
  @media ${media.laptop} {
    margin-top: 0;
  }
`;

const List = styled.div`
  display: grid;
  gap: 2rem;
`;

const EmptyState = styled.div`
  padding: 1.4rem 1.2rem;
  border-radius: 16px;
  border: 1px dashed rgba(4, 30, 66, 0.2);
  background: rgba(4, 30, 66, 0.03);

  h4 {
    margin: 0;
    color: ${Colors.etsuBlue};
  }

  p {
    margin: 0.5rem 0 0 0;
    color: rgba(0, 0, 0, 0.65);
  }
`;
