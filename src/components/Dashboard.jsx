// import React from "react";
// import {
//   StatsRow,
//   StatCard,
//   StatLabel,
//   StatValue,
//   StatIcon,
//   Panel,
//   Toolbar,
//   SearchWrap,
//   Search,
//   SearchIcon,
//   Select,
//   AddBtn,
//   TableWrap,
//   Table,
//   TH,
//   TD,
//   Actions,
//   IconBtn,
// } from "../admin/dashboardStyles";

// export default function Dashboard({
//   stats = [],
//   query,
//   onQueryChange,
//   filterValue,
//   onFilterChange,
//   filterOptions = [],
//   addLabel,
//   onAdd,

//   columns = [],
//   rows = [],
//   renderCell,
//   renderActions,
// }) {
//   return (
//     <>
//       {/* Stats */}
//       <StatsRow style={{ gridTemplateColumns: `repeat(${stats.length || 1}, 1fr)` }}>
//         {stats.map((s) => (
//           <StatCard key={s.label} accent={s.accent}>
//             <div>
//               <StatLabel>{s.label}</StatLabel>
//               <StatValue style={s.valueColor ? { color: s.valueColor } : undefined}>
//                 {s.value}
//               </StatValue>
//             </div>
//             <StatIcon accent={s.iconBg || undefined}>{s.icon}</StatIcon>
//           </StatCard>
//         ))}
//       </StatsRow>

//       {/* Toolbar */}
//       <Panel style={{ marginTop: 14 }}>
//         <Toolbar>
//           <SearchWrap>
//             <SearchIcon>🔍</SearchIcon>
//             <Search
//               value={query}
//               onChange={(e) => onQueryChange(e.target.value)}
//               placeholder="Search..."
//             />
//           </SearchWrap>

//           {!!filterOptions.length ? (
//             <select
//               value={filterValue}
//               onChange={(e) => onFilterChange(e.target.value)}
//               style={{
//                 width: "100%",
//                 borderRadius: 12,
//                 padding: 12,
//                 fontWeight: 700,
//               }}
//             >
//               {filterOptions.map((opt) => (
//                 <option key={opt.value} value={opt.value}>
//                   {opt.label}
//                 </option>
//               ))}
//             </select>
//           ) : (
//             <div />
//           )}

//           {onAdd ? (
//             <AddBtn onClick={onAdd}>
//               <span style={{ fontSize: 18, lineHeight: 0 }}>＋</span> {addLabel || "Add New"}
//             </AddBtn>
//           ) : (
//             <div />
//           )}
//         </Toolbar>
//       </Panel>

//       {/* Table */}
//       <TableWrap style={{ marginTop: 14 }}>
//         <Table>
//           <thead>
//             <tr>
//               {columns.map((c) => (
//                 <TH key={c.key} style={c.align ? { textAlign: c.align } : undefined}>
//                   {c.header}
//                 </TH>
//               ))}
//               <TH style={{ textAlign: "right" }}>Actions</TH>
//             </tr>
//           </thead>

//           <tbody>
//             {rows.map((row) => (
//               <tr key={row.id ?? JSON.stringify(row)}>
//                 {columns.map((c) => (
//                   <TD key={c.key}>{renderCell(row, c.key)}</TD>
//                 ))}
//                 <TD>
//                   <Actions style={{ justifyContent: "flex-end" }}>
//                     {renderActions ? (
//                       renderActions(row)
//                     ) : (
//                       <IconBtn title="View" onClick={() => alert("View")}>
//                         👁
//                       </IconBtn>
//                     )}
//                   </Actions>
//                 </TD>
//               </tr>
//             ))}
//           </tbody>
//         </Table>
//       </TableWrap>
//     </>
//   );
// }


// 

// src/components/Dashboard.jsx
import React from "react";
import {
  PageCol,
  StickyTop,
  StatsRow,
  StatCard,
  StatLabel,
  StatValue,
  StatIcon,
  Panel,
  Toolbar,
  SearchWrap,
  Search,
  SearchIcon,
  Select,
  AddBtn,
  TableWrap,
  TableScroll,
  Table,
  TH,
  TD,
  Actions,
} from "../admin/dashboardStyles";

export default function Dashboard({
  stats = [],
  query,
  onQueryChange,
  filterValue,
  onFilterChange,
  filterOptions = [],
  addLabel = "Add New",
  onAdd,
  columns = [],
  rows = [],
  renderCell,
  renderActions,
}) {
  return (
    <PageCol>
      {/* ✅ Everything above table stays static */}
      <StickyTop>
        <StatsRow>
          {stats.map((s) => (
            <StatCard key={s.label} accent={s.accent}>
              <div>
                <StatLabel>{s.label}</StatLabel>
                <StatValue style={{ color: s.valueColor || undefined }}>
                  {s.value}
                </StatValue>
              </div>
              <StatIcon accent={s.iconBg}>{s.icon}</StatIcon>
            </StatCard>
          ))}
        </StatsRow>

        <Panel>
          <Toolbar>
            <SearchWrap>
              <SearchIcon>🔍</SearchIcon>
              <Search
                value={query}
                onChange={(e) => onQueryChange?.(e.target.value)}
                placeholder="Search..."
              />
            </SearchWrap>

            <Select
              value={filterValue}
              onChange={(e) => onFilterChange?.(e.target.value)}
            >
              {filterOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Select>

            <AddBtn onClick={onAdd}>
              <span style={{ fontSize: 18, lineHeight: 0 }}>＋</span> {addLabel}
            </AddBtn>
          </Toolbar>
        </Panel>
      </StickyTop>

      {/* ✅ Table fills remaining height; ONLY body scrolls */}
      <TableWrap>
        <TableScroll>
          <Table>
            <thead>
              <tr>
                {columns.map((c) => (
                  <TH key={c.key}>{c.header}</TH>
                ))}
                <TH style={{ textAlign: "right" }}>Actions</TH>
              </tr>
            </thead>

            <tbody>
              {rows.map((row) => (
                <tr key={row.id || row.title}>
                  {columns.map((c) => (
                    <TD key={c.key}>
                      {renderCell ? renderCell(row, c.key) : row[c.key]}
                    </TD>
                  ))}

                  <TD>
                    <Actions>{renderActions?.(row)}</Actions>
                  </TD>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableScroll>
      </TableWrap>
    </PageCol>
  );
}