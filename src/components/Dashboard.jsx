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
import { FaSearch } from "react-icons/fa";

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
              <SearchIcon><FaSearch size={14}/></SearchIcon>
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