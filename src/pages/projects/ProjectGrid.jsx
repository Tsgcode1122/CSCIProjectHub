import React, { useMemo, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import SectionDiv from "../../fixedComponent/SectionDiv";
import { Colors, Shadows } from "../../theme/Colors";
import { media } from "../../theme/Breakpoints";
import {
  FiSearch,
  FiUsers,
  FiCalendar,
  FiArrowUpRight,
  FiFilter,
} from "react-icons/fi";
import { BiSliderAlt } from "react-icons/bi";
import ProjectFilters from "./ProjectFilters";

import BackButton from "../../fixedComponent/BackButton";
import { useProjectContext } from "../../context/ProjectContext";
import ProjectCartItem from "./ProjectCardItem";

const ProjectGrid = () => {
  const navigate = useNavigate();
  const { projects, loading, error } = useProjectContext();
  const [showFilters, setShowFilters] = useState(false);

  const [search, setSearch] = useState("");

  // Sidebar filter state
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
    const statuses = uniq(
      projects.map((p) => p.project_status || p.project_status),
    ).sort();
    const advisors = uniq(projects.map((p) => p.supervisor)).sort();

    return { years, departments, statuses, advisors };
  }, [projects]);

  //  filters + search
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
    setFilters((prev) => ({ ...prev, ...patch }));
  };

  const clearFilters = () => {
    setFilters({
      year: "",
      department: "",
      projectStatus: "",
      facultyAdvisor: "",
    });
  };

  const HandleShowFilter = () => {
    setShowFilters(!showFilters);
  };

  return (
    <>
      {/* PAGE HEADER */}
      <HeaderWrap>
        <SectionDiv>
          <HeaderInner>
            <BackButton label="back" />
            <HeaderText>
              <HeaderTitle>All Projects</HeaderTitle>
              <HeaderSubtitle>
                Browse and filter student and faculty-led projects in the
                Department of Computing.
              </HeaderSubtitle>
            </HeaderText>
          </HeaderInner>
        </SectionDiv>
      </HeaderWrap>
      <GridContainer>
        {/* Sticky search/filter bar OUTSIDE HeaderWrap */}
        <StickyBar>
          <SectionContainer>
            <Filter>
              <SearchWrap>
                <FiSearch />
                <SearchInput
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search projects by title, tag, or keyword..."
                />
              </SearchWrap>
              <FilterBtn type="button" onClick={() => HandleShowFilter()}>
                <BiSliderAlt />
              </FilterBtn>
            </Filter>
          </SectionContainer>
        </StickyBar>
        {/* BODY */}
        <SectionDiv>
          <BodyGrid>
            {/* LEFT SIDEBAR FILTER */}
            <>
              <ProjectFilters
                options={filterOptions}
                value={filters}
                onChange={handleFilterChange}
                onClear={clearFilters}
                show={showFilters}
                onClose={() => setShowFilters(false)}
                resultCount={filteredProjects.length}
              />
            </>
            {/* RIGHT LIST */}
            <ListCol>
              <ResultRow>
                <ResultCount>
                  Showing <b>{filteredProjects.length}</b> project(s)
                </ResultCount>
              </ResultRow>
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
                  <p>Try clearing filters or searching a different keyword.</p>
                </EmptyState>
              ) : (
                <List>
                  {filteredProjects.map((p) => (
                    <ProjectCartItem
                      key={p.id || p._id}
                      project={p}
                      onOpen={(id) => navigate(`/projects/${id}`)}
                    />
                  ))}
                </List>
              )}
            </ListCol>
          </BodyGrid>
        </SectionDiv>
      </GridContainer>
    </>
  );
};

export default ProjectGrid;

// ---------------- styles ----------------
const GridContainer = styled.div`
  position: relative;
  /* This container defines the "track" the sticky bar can slide on. 
     Once the bottom of this div is reached, the bar stops sticking. */
`;
const HeaderWrap = styled.div`
  background: ${Colors.brightBlue};
  /* padding: 0.2rem 0; */
  position: relative;
  /* height: 40vh; */
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

  /* Extra small screens  */
  @media ${media.mobileXS} {
    padding: 0rem 0.8rem;
  }

  @media ${media.mobileS} {
    padding: 0rem 1rem;
  }

  /* Medium phones (576px and above) */
  @media ${media.mobileM} {
    padding: 0rem 1.5rem;
  }

  /* Large phones (679px and above) */
  @media ${media.mobileL} {
    padding: 0rem 3rem;
  }

  /* Tablets (768px and above) */
  @media ${media.tablet} {
    padding: 0rem 4rem;
  }

  /* Small laptops (1024px and above) */
  @media ${media.laptop} {
    max-width: 1200px;
    padding: 0rem 4rem 1rem 4rem;
  }

  /* Desktops (1440px and above) */
  @media ${media.desktop} {
    max-width: 1200px;
    padding: 0rem 6rem 1rem 6rem;
  }

  /* Extra large desktops / 4K screens (1920px) */
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
  /* MOBILE: search + filter button in grid */
  position: sticky;
  /* background-color: white; */
  top: 202px;
  display: grid;
  grid-template-columns: 1fr 44px;
  gap: 0.75rem;

  z-index: 20;

  padding: 0.7rem 0 0 0;

  /* TABLET+ : no grid, normal */
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

  /* hide again on tablet and up */
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
  /* font-weight: 200; */

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
