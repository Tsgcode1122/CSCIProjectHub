// src/admin/dashboardStyles.jsx
import styled from "styled-components";

export const ETSU_NAVY = "#041E42";
export const ETSU_GOLD = "#FFC72C";
export const BORDER = "#E5E7EB";
export const MUTED = "#6B7280";

/* ===== Top Stat Cards ===== */
export const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;

export const StatCard = styled.div`
  background: white;
  border: 1px solid ${BORDER};
  border-radius: 16px;
  padding: 18px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  /* left accent like screenshot */
  box-shadow: inset 4px 0 0 ${({ accent }) => accent || ETSU_NAVY};
`;

export const StatLabel = styled.div`
  font-size: 13px;
  color: ${MUTED};
  margin-bottom: 8px;
`;

export const StatValue = styled.div`
  font-size: 32px;
  font-weight: 900;
  color: ${ETSU_NAVY};
  line-height: 1;
`;

export const StatIcon = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: ${({ accent }) => accent || "rgba(4, 30, 66, 0.10)"};
  color: ${ETSU_NAVY};
  font-size: 18px;
`;

/* ===== Panels / Toolbar ===== */
export const Panel = styled.div`
  background: white;
  border: 1px solid ${BORDER};
  border-radius: 16px;
  padding: 14px;
  margin-top: 14px;
`;

export const Toolbar = styled.div`
  display: grid;
  grid-template-columns: 1fr 170px 140px;
  gap: 12px;
  align-items: center;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;

export const SearchWrap = styled.div`
  position: relative;
`;

export const Search = styled.input`
  width: 90%;
  border: 1px solid ${BORDER};
  border-radius: 12px;
  padding: 12px 12px 12px 40px;
  outline: none;
  font-size: 14px;
  background: white;

  &:focus {
    border-color: rgba(4, 30, 66, 0.35);
    box-shadow: 0 0 0 3px rgba(4, 30, 66, 0.1);
  }
`;

export const SearchIcon = styled.div`
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: ${MUTED};
  font-size: 16px;
`;

export const Select = styled.select`
  width: 100%;
  border: 1px solid ${BORDER};
  border-radius: 12px;
  padding: 12px;
  background: white;
  font-weight: 800;
  color: ${ETSU_NAVY};
`;

export const AddBtn = styled.button`
  width: 100%;
  border: none;
  border-radius: 12px;
  padding: 12px 12px;
  background: ${ETSU_NAVY};
  color: white;
  font-weight: 900;
  cursor: pointer;
  display: inline-flex;
  gap: 10px;
  align-items: center;
  justify-content: center;

  &:hover {
    filter: brightness(0.95);
  }
`;

/* ===== Table ===== */
// export const TableWrap = styled.div`
//   background: white;
//   border: 1px solid ${BORDER};
//   border-radius: 16px;
//   overflow: hidden;
//   margin-top: 14px;
// `;

export const TableWrap = styled.div`
  background: white;
  border: 1px solid ${BORDER};
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  width: 100%;
`;

export const TableScroll = styled.div`
  overflow-y: auto;
  flex: 1;
  min-height: 0;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

// export const TH = styled.th`
//   text-align: left;
//   font-size: 13px;
//   color: ${ETSU_NAVY};
//   font-weight: 900;
//   padding: 14px 14px;
//   background: #f9fafb;
//   border-bottom: 1px solid ${BORDER};
//   white-space: nowrap;
// `;

export const TH = styled.th`
  position: sticky;
  top: 0;
  z-index: 2;

  text-align: left;
  font-size: 13px;
  color: ${ETSU_NAVY};
  font-weight: 900;
  padding: 14px 14px;
  background: #f9fafb;
  border-bottom: 1px solid ${BORDER};
  white-space: nowrap;
`;

export const TD = styled.td`
  padding: 14px 14px;
  border-bottom: 1px solid ${BORDER};
  vertical-align: top;
  color: ${ETSU_NAVY};
  font-size: 14px;
`;

export const TypeBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border-radius: 999px;
  padding: 6px 10px;
  font-weight: 900;
  font-size: 12px;

  background: ${({ kind }) => (kind === "Project" ? ETSU_GOLD : ETSU_NAVY)};
  color: ${({ kind }) => (kind === "Project" ? "#111827" : "white")};
`;

export const ChipRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 6px;
`;

export const Chip = styled.span`
  font-size: 12px;
  color: #374151;
  background: #f3f4f6;
  border: 1px solid ${BORDER};
  border-radius: 8px;
  padding: 3px 8px;
`;

export const Actions = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

export const IconBtn = styled.button`
  border: none;
  background: transparent;
  cursor: pointer;
  color: ${ETSU_NAVY};
  font-size: 16px;

  &:hover {
    filter: brightness(0.85);
  }
`;

/* Optional helpers */
export const HSpacer = styled.div`
  height: ${({ h }) => (typeof h === "number" ? `${h}px` : h || "12px")};
`;

export const Right = styled.div`
  display: flex;
  justify-content: flex-end;
`;

// Layout helpers
export const PageCol = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%; 
  gap: 14px;
  min-height: 0;
`;

export const StickyTop = styled.div`
  // position: sticky;
  // top: 0;
  // z-index: 20;
  // background: #f5f7fb; 
  // padding-top: 10px;
  flex: 0 0 auto;
`;

export const TableArea = styled.div`
  flex: 1;
  min-height: 0; 
  border-radius: 16px;
`;

