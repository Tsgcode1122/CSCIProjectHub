import React, { useMemo, useState } from "react";

import styled from "styled-components";
import { Colors, Shadows } from "../../theme/Colors";
import { media } from "../../theme/Breakpoints";

const ProjectFilters = ({
  options,
  value,
  onChange,
  onClear,
  show,
  onClose,
  resultCount,
}) => {
  const {
    years = [],
    departments = [],
    statuses = [],
    advisors = [],
  } = options;
  const CHUNK = 5;

  // sort years (newest -> oldest)
  const sortedYears = useMemo(() => {
    return [...years].sort((a, b) => Number(b) - Number(a));
  }, [years]);

  const [visibleCount, setVisibleCount] = useState(CHUNK);

  const canShowMore = visibleCount < sortedYears.length;
  const canShowLess = sortedYears.length > CHUNK && visibleCount > CHUNK;

  const visibleYears = sortedYears.slice(0, visibleCount);

  const handleShowMoreYears = () => {
    setVisibleCount((prev) => Math.min(prev + CHUNK, sortedYears.length));
  };

  const handleShowLessYears = () => {
    setVisibleCount(CHUNK);
  };

  return (
    <>
      <Overlay $show={show} onClick={onClose} />
      <Panel $show={show}>
        <PanelHeader>
          {/* Row 1: Title and X */}
          <TopHeaderRow>
            <PanelTitle>Filters</PanelTitle>
            <MobileCloseBtn type="button" onClick={onClose}>
              ✕
            </MobileCloseBtn>
          </TopHeaderRow>

          {/* Row 2: Result count and Clear */}
          <SubHeaderRow>
            <ResultCountText>
              Showing <b>{resultCount}</b> result{resultCount !== 1 ? "s" : ""}
            </ResultCountText>
            <ClearBtn type="button" onClick={onClear}>
              Clear
            </ClearBtn>
          </SubHeaderRow>
        </PanelHeader>
        <Divider />
        <Group>
          <GroupTitle>Year</GroupTitle>

          {/* Always show "All" as radio */}
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

        <Group>
          <GroupTitle>Department</GroupTitle>
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

        <Group>
          <GroupTitle>Faculty Advisor</GroupTitle>
          <Select
            value={value.facultyAdvisor}
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
      </Panel>
    </>
  );
};

export default ProjectFilters;
const Overlay = styled.div`
  /* Show only if the panel is open */
  display: ${({ $show }) => ($show ? "block" : "none")};

  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;

  /* Dim the background slightly and apply the blur */
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px); /* Safari support */

  z-index: 999;
  cursor: pointer;

  /* Completely hide the overlay on desktop where the panel is just a sidebar */
  @media ${media.laptop} {
    display: none;
  }
`;

const Panel = styled.aside`
  background: ${Colors.white};
  border: 1px solid rgba(132, 172, 227, 0.306);
  border-radius: 16px 0 0 0;
  padding: 1.1rem;
  @media ${media.laptop} {
    border-radius: 16px;
  }
  /* --- MOBILE / TABLET VIEW --- */

  display: ${({ $show }) => ($show ? "block" : "none")};

  position: fixed;
  top: 70px; /* Distance from top of screen */
  right: 0px;
  z-index: 1000;

  width: 230px;
  max-height: calc(100vh - 100px);
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
  overflow-y: auto;

  /* --- DESKTOP / LAPTOP VIEW --- */
  @media ${media.laptop} {
    display: block !important; /* Always show on desktop */
    position: sticky;
    top: 82px;
    right: auto;
    width: auto;
    z-index: 10;
    box-shadow: none; /* Remove popup shadow */

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

  /* Make it stick to the top of the Panel */
  position: sticky;
  top: 0;
  z-index: 10;

  background: ${Colors.white};

  margin: -1.1rem -1.1rem 0.9rem -1.1rem;
  padding: 0rem 1.1rem 0.9rem 1.1rem;

  border-bottom: 1px solid rgba(4, 30, 66, 0.08);

  /*  */
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

const SubHeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const PanelTitle = styled.h5`
  margin: 0;
  color: ${Colors.etsuBlue};
  font-size: 1.1rem;
`;
const MobileCloseBtn = styled.button`
  /* Center the X perfectly */
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;

  /* Make it a perfect circle */
  width: 36px;
  height: 36px;
  border-radius: 50%;

  /* Make it stand out with a white background and drop shadow */
  background: ${Colors.white};
  border: 1px solid rgba(4, 30, 66, 0.05); /* Very subtle border for crisp edges */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15); /* The drop shadow */

  /* Typography */
  font-size: 1.1rem;
  font-weight: bold;
  color: ${Colors.etsuBlue};
  cursor: pointer;

  /* Smooth transitions for hover effects */
  transition: all 0.2s ease-in-out;

  /* Interactive hover effect */
  &:hover {
    background: ${Colors.brightBlue};
    color: ${Colors.white};
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2); /* Slightly deeper shadow on hover */
    transform: translateY(-1px); /* Slight lift effect */
  }

  /* Hide on desktop/laptop where the panel acts as a permanent sidebar */
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
const Group = styled.div`
  margin-top: 0.9rem;
`;

const GroupTitle = styled.div`
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
