import React, { useMemo, useState } from "react";

import styled from "styled-components";
import { Colors } from "../../theme/Colors";
import { media } from "../../theme/Breakpoints";

// Filter sidebar/drawer for the projects list. It does not own the selected
// values; ProjectGrid owns that state and passes it in through props.
const ProjectFilters = ({
  options,
  value,
  onChange,
  onClear,
  show,
  onClose,
  resultCount,
}) => {
  // Default empty arrays make the component safe while filter options are
  // still being built or if a category has no available values.
  const {
    years = [],
    departments = [],
    statuses = [],
    advisors = [],
  } = options;
  // Display years in groups of five so a long list does not overwhelm the panel.
  const CHUNK = 5;

  // Keep long year lists compact until the user expands them.
  const sortedYears = useMemo(() => {
    return [...years].sort((a, b) => Number(b) - Number(a));
  }, [years]);

  // This is presentation state only; it does not change the selected year.
  const [visibleCount, setVisibleCount] = useState(CHUNK);

  const canShowMore = visibleCount < sortedYears.length;
  const canShowLess = sortedYears.length > CHUNK && visibleCount > CHUNK;

  const visibleYears = sortedYears.slice(0, visibleCount);

  const handleShowMoreYears = () => {
    // Reveal the next group without exceeding the number of available years.
    setVisibleCount((prev) => Math.min(prev + CHUNK, sortedYears.length));
  };

  const handleShowLessYears = () => {
    // Collapse the list back to its initial five-year view.
    setVisibleCount(CHUNK);
  };

  return (
    // Inputs are controlled by ProjectGrid through value and callbacks. This
    // keeps filtering logic in one place while this component focuses on UI.
    <>
      <Overlay $show={show} aria-hidden="true" onClick={onClose} />
      <Panel
        id="project-filters"
        $show={show}
        aria-labelledby="project-filters-title"
      >
        <PanelHeader>
          <TopHeaderRow>
            <PanelTitle id="project-filters-title">Filters</PanelTitle>
            <MobileCloseBtn
              type="button"
              onClick={onClose}
              aria-label="Close project filters"
            >
              ✕
            </MobileCloseBtn>
          </TopHeaderRow>
        </PanelHeader>
        <Divider />
        <Group>
          {/* Each radio group maps to one field in the shared filter object. */}
          <GroupTitle>Year</GroupTitle>

          <RadioList>
            <RadioItem>
              <input
                type="radio"
                name="year"
                checked={!value.year}
                onChange={() => onChange({ year: "" })}
              />
              <span>All</span>
            </RadioItem>

            <>
              {visibleYears.map((y) => (
                <RadioItem key={y}>
                  <input
                    type="radio"
                    name="year"
                    checked={String(value.year) === String(y)}
                    onChange={() => onChange({ year: String(y) })}
                  />
                  <span>{y}</span>
                </RadioItem>
              ))}

              <YearActions>
                {canShowMore && (
                  <ShowBtn type="button" onClick={handleShowMoreYears}>
                    Show more
                  </ShowBtn>
                )}

                {canShowLess && (
                  <ShowLessBtn type="button" onClick={handleShowLessYears}>
                    Show less
                  </ShowLessBtn>
                )}
              </YearActions>
            </>
          </RadioList>
        </Group>

        <Divider />

        {/* Departments and statuses use the same controlled-radio pattern. */}
        <Group>
          <GroupTitle>Discipline</GroupTitle>
          <RadioList>
            <RadioItem>
              <input
                type="radio"
                name="department"
                checked={!value.department}
                onChange={() => onChange({ department: "" })}
              />
              <span>All</span>
            </RadioItem>

            {departments.map((d) => (
              <RadioItem key={d}>
                <input
                  type="radio"
                  name="department"
                  checked={value.department === d}
                  onChange={() => onChange({ department: d })}
                />
                <span>{d}</span>
              </RadioItem>
            ))}
          </RadioList>
        </Group>

        <Divider />

        <Group>
          <GroupTitle>Project Status</GroupTitle>
          <RadioList>
            <RadioItem>
              <input
                type="radio"
                name="status"
                checked={!value.projectStatus}
                onChange={() => onChange({ projectStatus: "" })}
              />
              <span>All</span>
            </RadioItem>

            {statuses.map((s) => (
              <RadioItem key={s}>
                <input
                  type="radio"
                  name="status"
                  checked={value.projectStatus === s}
                  onChange={() => onChange({ projectStatus: s })}
                />
                <span>{s}</span>
              </RadioItem>
            ))}
          </RadioList>
        </Group>

        <Divider />

        {/* The advisor list uses a select because names can be longer than a radio list. */}
        <Group>
          <GroupTitle id="project-advisor-label">Faculty Advisor</GroupTitle>
          <Select
            id="project-advisor-filter"
            value={value.facultyAdvisor}
            aria-labelledby="project-advisor-label"
            onChange={(e) => onChange({ facultyAdvisor: e.target.value })}
          >
            <option value="">All</option>
            {advisors.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </Select>
        </Group>
        {/* The count updates as ProjectGrid recalculates filteredProjects. */}
        <PanelFooter>
          <ResultCountText>
            Showing <b>{resultCount}</b> result{resultCount !== 1 ? "s" : ""}
          </ResultCountText>
          <ClearBtn type="button" onClick={onClear}>
            Clear
          </ClearBtn>
        </PanelFooter>
      </Panel>
    </>
  );
};

export default ProjectFilters;
const Overlay = styled.div`
  display: ${({ $show }) => ($show ? "block" : "none")};

  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;

  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);

  z-index: 999;
  cursor: pointer;

  @media ${media.laptop} {
    display: none;
  }
`;

const Panel = styled.aside`
  background: ${Colors.white};
  border: 1px solid rgba(132, 172, 227, 0.306);
  border-radius: 16px 0 0 0;
  padding: 0 1.1rem 1.1rem 1.1rem;
  @media ${media.laptop} {
    border-radius: 16px;
  }
  display: ${({ $show }) => ($show ? "block" : "none")};

  position: fixed;
  top: 70px;
  right: 0px;
  z-index: 1000;

  width: 230px;
  max-height: calc(100vh - 100px);
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
  overflow-y: auto;

  @media ${media.laptop} {
    display: block !important;
    position: sticky;
    top: 82px;
    right: auto;
    width: auto;
    z-index: 10;
    box-shadow: none;
    max-height: calc(100vh - 108px - 24px);

    &::-webkit-scrollbar {
      display: none;
    }
    overscroll-behavior: contain;
  }
`;

const PanelHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  position: sticky;
  top: 0;
  z-index: 10;

  background: ${Colors.white};

  margin: -1.1rem -1.1rem 0.9rem -1.1rem;
  padding: 0.9rem;

  border-bottom: 1px solid rgba(4, 30, 66, 0.08);

  @media ${media.laptop} {
    position: static;
    margin: 0 0 0.9rem 0;
    padding: 0;
    border-bottom: none;
  }
`;

const TopHeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const PanelFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;

  position: sticky;

  bottom: -1.1rem;
  z-index: 10;

  background: ${Colors.white};

  border-top: 1px solid rgba(4, 30, 66, 0.08);

  margin: 1.5rem -1.1rem -1.1rem -1.1rem;
  padding: 1rem 1.1rem;

  @media ${media.laptop} {
    position: static;
    margin: 1.5rem 0 0 0;
    padding: 1rem 0 0 0;
  }
`;

const PanelTitle = styled.h5`
  margin: 0;
  padding-top: 1rem;
  color: ${Colors.etsuBlue};
  font-size: 1.1rem;
`;
const MobileCloseBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  width: 36px;
  height: 36px;
  border-radius: 50%;

  background: ${Colors.white};
  border: 1px solid rgba(4, 30, 66, 0.05);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

  font-size: 1.1rem;
  font-weight: bold;
  color: ${Colors.etsuBlue};
  cursor: pointer;

  transition: all 0.2s ease-in-out;

  &:hover {
    background: ${Colors.brightBlue};
    color: ${Colors.white};
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    transform: translateY(-1px);
  }

  @media ${media.laptop} {
    display: none;
  }
`;
const ResultCountText = styled.span`
  font-size: 0.85rem;
  color: rgba(0, 0, 0, 0.65);

  b {
    color: ${Colors.etsuBlue};
  }

  @media ${media.laptop} {
    display: none;
  }
`;
const ClearBtn = styled.button`
  border: none;
  background: transparent;
  cursor: pointer;
  color: rgba(4, 30, 66, 0.75);
  font-weight: 600;
  font-size: 0.85rem;
  padding: 0;

  &:hover {
    text-decoration: underline;
    color: ${Colors.etsuBlue};
  }
`;
const Group = styled.fieldset`
  border: 0;
  padding: 0;
  min-width: 0;
  margin-top: 0.9rem;
`;

const GroupTitle = styled.legend`
  padding: 0;
  font-weight: 700;
  color: ${Colors.etsuBlue};
  margin-bottom: 0.6rem;
`;

const RadioList = styled.div`
  display: grid;
  gap: 0.55rem;
`;

const RadioItem = styled.label`
  display: flex;
  align-items: center;
  gap: 0.55rem;
  cursor: pointer;
  color: rgba(0, 0, 0, 0.72);

  input {
    accent-color: ${Colors.etsuGold};
  }

  span {
    line-height: 1.1rem;
    font-weight: 500;
    font-size: 0.92rem;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.85rem 0.9rem;
  border-radius: 12px;
  border: 1px solid rgba(4, 30, 66, 0.18);
  outline: none;
  background: ${Colors.white};

  &:focus {
    border-color: ${Colors.etsuGold};
    box-shadow: 0 0 0 4px rgba(255, 184, 28, 0.25);
  }

  &:focus-visible {
    outline: 3px solid ${Colors.etsuGold};
    outline-offset: 2px;
  }
`;

const Divider = styled.div`
  margin-top: 1rem;
  height: 1px;
  background: rgba(4, 30, 66, 0.08);
`;
const MoreBtn = styled.button`
  margin-top: 0.4rem;
  width: fit-content;

  border: none;
  background: transparent;
  cursor: pointer;

  color: ${Colors.etsuBlue};
  font-weight: 600;

  &:hover {
    text-decoration: underline;
  }
`;

const YearActions = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 0.6rem;
`;

const ShowBtn = styled.button`
  border: none;
  background: transparent;
  cursor: pointer;

  color: ${Colors.etsuBlue};
  font-weight: 600;

  &:hover {
    text-decoration: underline;
  }
`;

const ShowLessBtn = styled(ShowBtn)`
  color: rgba(4, 30, 66, 0.7);
`;
