import React, { useMemo, useState } from "react";

import styled from "styled-components";
import { Colors, Shadows } from "../../theme/Colors";
import { media } from "../../theme/Breakpoints";

const ProjectFilters = ({ options, value, onChange, onClear }) => {
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
    <Panel>
      <PanelHeader>
        <PanelTitle>Filters</PanelTitle>
        <ClearBtn type="button" onClick={onClear}>
          Clear
        </ClearBtn>
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
  );
};

export default ProjectFilters;

// ---------------- styles ----------------
const Panel = styled.aside`
  background: ${Colors.white};
  border: 1px solid rgba(132, 172, 227, 0.306);
  border-radius: 16px;
  padding: 1.1rem;

  @media ${media.tablet} {
    position: sticky;
    top: 82px;

    max-height: calc(100vh - 92px - 24px);
    overflow-y: auto;

    /* hide scrollbar indicator */
    scrollbar-width: none; /* Firefox */
    &::-webkit-scrollbar {
      display: none; /* Chrome/Safari */
    }

    overscroll-behavior: contain;
  }
`;

const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.9rem;
`;

const PanelTitle = styled.h5`
  margin: 0;
  color: ${Colors.etsuBlue};
`;

const ClearBtn = styled.button`
  border: none;
  background: transparent;
  cursor: pointer;
  color: rgba(4, 30, 66, 0.75);
  font-weight: 600;

  &:hover {
    text-decoration: underline;
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

const LessBtn = styled(MoreBtn)`
  margin-top: 0.6rem;
`;

const YearSelect = styled.select`
  width: 100%;
  padding: 0.75rem 0.9rem;
  border-radius: 12px;
  border: 1px solid rgba(4, 30, 66, 0.18);
  outline: none;
  background: ${Colors.white};
  margin-top: 0.2rem;

  &:focus {
    border-color: ${Colors.etsuGold};
    box-shadow: 0 0 0 4px rgba(255, 184, 28, 0.25);
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
