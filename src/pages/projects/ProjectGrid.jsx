import React, { useMemo, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import SectionDiv from "../../fixedComponent/SectionDiv";
import { Colors, Shadows } from "../../theme/Colors";
import { media } from "../../theme/Breakpoints";
import { FiSearch, FiUsers, FiCalendar, FiArrowUpRight } from "react-icons/fi";

import ProjectFilters from "./ProjectFilters";
import projectsData from "../../projects.json";
import BackButton from "../../fixedComponent/BackButton";

const ProjectGrid = () => {
  const navigate = useNavigate();

  // Search is in the header
  const [search, setSearch] = useState("");

  // Sidebar filter state
  const [filters, setFilters] = useState({
    year: "",
    department: "",
    projectStatus: "",
    facultyAdvisor: "",
  });

  // Build options dynamically from JSON
  const filterOptions = useMemo(() => {
    const uniq = (arr) => Array.from(new Set(arr)).filter(Boolean);

    const years = uniq(projectsData.map((p) => p.year)).sort((a, b) => b - a);
    const departments = uniq(projectsData.map((p) => p.department)).sort();
    const statuses = uniq(projectsData.map((p) => p.projectStatus)).sort();
    const advisors = uniq(projectsData.map((p) => p.facultyAdvisor)).sort();

    return { years, departments, statuses, advisors };
  }, []);

  //  filters + search
  const filteredProjects = useMemo(() => {
    const q = search.trim().toLowerCase();

    return projectsData.filter((p) => {
      const matchesSearch =
        !q ||
        p.title?.toLowerCase().includes(q) ||
        p.shortDescription?.toLowerCase().includes(q) ||
        (p.tags || []).some((t) => String(t).toLowerCase().includes(q));

      const matchesYear =
        !filters.year || String(p.year) === String(filters.year);
      const matchesDept =
        !filters.department || p.department === filters.department;
      const matchesStatus =
        !filters.projectStatus || p.projectStatus === filters.projectStatus;
      const matchesAdvisor =
        !filters.facultyAdvisor || p.facultyAdvisor === filters.facultyAdvisor;

      return (
        matchesSearch &&
        matchesYear &&
        matchesDept &&
        matchesStatus &&
        matchesAdvisor
      );
    });
  }, [search, filters]);

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

  const handleOpenProject = (id) => {
    navigate(`/projects/${id}`);
  };

  return (
    <>
      {/* PAGE HEADER */}
      <HeaderWrap>
        <SectionDiv>
          <HeaderInner>
            <BackButton />
            <HeaderText>
              <HeaderTitle>All Projects</HeaderTitle>
              <HeaderSubtitle>
                Browse and filter student and faculty-led projects in the
                Department of Computing.
              </HeaderSubtitle>
            </HeaderText>

            <SearchWrap>
              <FiSearch />
              <SearchInput
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search projects by title, tag, or keyword..."
              />
            </SearchWrap>
          </HeaderInner>
        </SectionDiv>
      </HeaderWrap>

      {/* BODY */}
      <SectionDiv>
        <BodyGrid>
          {/* LEFT SIDEBAR FILTER */}
          <ProjectFilters
            options={filterOptions}
            value={filters}
            onChange={handleFilterChange}
            onClear={clearFilters}
          />

          {/* RIGHT LIST */}
          <ListCol>
            <ResultRow>
              <ResultCount>
                Showing <b>{filteredProjects.length}</b> project(s)
              </ResultCount>
            </ResultRow>

            {filteredProjects.length === 0 ? (
              <EmptyState>
                <h4>No projects match your filters.</h4>
                <p>Try clearing filters or searching a different keyword.</p>
              </EmptyState>
            ) : (
              <List>
                {filteredProjects.map((p) => (
                  <ProjectCard
                    key={p.id}
                    onClick={() => handleOpenProject(p.id)}
                  >
                    <Thumb>
                      <img
                        src={p.thumbnail || "/images/projects/placeholder.png"}
                        alt={p.title}
                        onError={(e) => {
                          e.currentTarget.src =
                            "/images/projects/placeholder.png";
                        }}
                      />
                    </Thumb>

                    <CardContent>
                      <TopRow>
                        <TitleRow>
                          <CardTitle>{p.title}</CardTitle>
                          <StatusBadge $active={p.acceptingMembers}>
                            {p.projectStatus ||
                              (p.acceptingMembers ? "Accepting Members" : "—")}
                          </StatusBadge>
                        </TitleRow>

                        <CornerIcon aria-hidden="true">
                          <FiArrowUpRight />
                        </CornerIcon>
                      </TopRow>

                      <Tags>
                        {(p.tags || []).slice(0, 4).map((tag) => (
                          <Tag key={tag}>{tag}</Tag>
                        ))}
                      </Tags>

                      <MiniDesc>{p.shortDescription}</MiniDesc>

                      <MetaRow>
                        <MetaItem>
                          <FiUsers />
                          <span>{p.memberCount ?? 0} members</span>
                        </MetaItem>
                        <MetaItem>
                          <FiCalendar />
                          <span>
                            {p.duration?.start || "—"} –{" "}
                            {p.duration?.end || "—"}
                          </span>
                        </MetaItem>
                        <MetaRight>
                          <small>{p.department}</small>
                        </MetaRight>
                      </MetaRow>
                    </CardContent>
                  </ProjectCard>
                ))}
              </List>
            )}
          </ListCol>
        </BodyGrid>
      </SectionDiv>
    </>
  );
};

export default ProjectGrid;

// ---------------- styles ----------------

const HeaderWrap = styled.div`
  background: ${Colors.brightBlue};
  padding: 0.2rem 0;
`;

const HeaderInner = styled.div`
  display: grid;
  gap: 1.2rem;

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

const SearchInput = styled.input`
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  color: ${Colors.black};
  font-weight: 600;

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
  @media ${media.tablet} {
    grid-template-columns: 320px 1fr;
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
`;

const List = styled.div`
  display: grid;
  gap: 1rem;
`;

const ProjectCard = styled.button`
  width: 100%;
  border: none;
  text-align: left;
  cursor: pointer;

  display: grid;
  grid-template-columns: 110px 1fr;
  gap: 1rem;

  padding: 1rem;
  background: ${Colors.white};
  border-radius: 16px;
  border: 1px solid rgba(4, 30, 66, 0.12);
  box-shadow: ${Shadows.light};

  transition:
    transform 160ms ease,
    box-shadow 160ms ease,
    border-color 160ms ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: ${Shadows.medium};
    border-color: rgba(4, 30, 66, 0.22);
  }

  @media ${media.mobileS} {
    grid-template-columns: 120px 1fr;
  }

  @media ${media.tablet} {
    grid-template-columns: 140px 1fr;
    padding: 1.1rem;
    gap: 1.1rem;
  }
`;

const Thumb = styled.div`
  border-radius: 14px;
  overflow: hidden;
  background: rgba(4, 30, 66, 0.06);
  border: 1px solid rgba(4, 30, 66, 0.08);

  img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
    aspect-ratio: 1 / 1;
  }
`;

const CardContent = styled.div`
  min-width: 0;
`;

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 0.8rem;
`;

const TitleRow = styled.div`
  display: grid;
  gap: 0.45rem;
  min-width: 0;
`;

const CardTitle = styled.h4`
  margin: 0;
  color: ${Colors.etsuBlue};
  font-weight: 700;
  line-height: 1.35rem;

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const StatusBadge = styled.span`
  width: fit-content;
  padding: 0.35rem 0.6rem;
  border-radius: 999px;
  font-weight: 700;
  font-size: 0.78rem;

  background: ${({ $active }) =>
    $active ? "rgba(255, 184, 28, 0.22)" : "rgba(4, 30, 66, 0.08)"};
  color: ${({ $active }) =>
    $active ? Colors.etsuBlue : "rgba(4, 30, 66, 0.85)"};
  border: 1px solid
    ${({ $active }) =>
      $active ? "rgba(255, 184, 28, 0.45)" : "rgba(4, 30, 66, 0.12)"};
`;

const CornerIcon = styled.div`
  color: rgba(4, 30, 66, 0.65);
  font-size: 1.15rem;
  margin-top: 0.15rem;
`;

const Tags = styled.div`
  margin-top: 0.6rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
`;

const Tag = styled.span`
  padding: 0.28rem 0.55rem;
  border-radius: 999px;
  background: rgba(4, 30, 66, 0.06);
  border: 1px solid rgba(4, 30, 66, 0.1);
  color: rgba(4, 30, 66, 0.9);
  font-weight: 700;
  font-size: 0.78rem;
`;

const MiniDesc = styled.p`
  margin: 0.65rem 0 0 0;
  color: rgba(0, 0, 0, 0.68);
  line-height: 1.3rem;

  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const MetaRow = styled.div`
  margin-top: 0.8rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
`;

const MetaItem = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  color: rgba(0, 0, 0, 0.62);
  font-weight: 600;

  svg {
    color: ${Colors.etsuGold};
  }
`;

const MetaRight = styled.div`
  margin-left: auto;
  color: rgba(0, 0, 0, 0.5);
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
