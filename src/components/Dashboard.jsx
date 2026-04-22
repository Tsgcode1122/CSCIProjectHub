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
  AddBtn,
  TableWrap,
  TableScroll,
  Table,
  TH,
  TD,
  Actions,
} from "../admin/dashboardStyles";
import { FaSearch } from "react-icons/fa";
import FormSelect from "../admin/components/FormSelect";

export default function Dashboard({
  stats = [],
  query,
  onQueryChange,
  filterValue,
  onFilterChange,
  filterOptions = [],
  sortValue,
  variant,
  onSortChange,
  sortOptions = [],
  addLabel = "Add New",
  onAdd,
  columns = [],
  rows = [],
  renderCell,
  renderActions,
}) {
  return (
    <PageCol>
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
          <Toolbar variant={variant}>
            <SearchWrap>
              <SearchIcon>
                <FaSearch size={14} />
              </SearchIcon>
              <Search
                value={query}
                onChange={(e) => onQueryChange?.(e.target.value)}
                placeholder="Search..."
              />
            </SearchWrap>

            {/* ✅ Custom Sort with ReactSelect */}
            {sortOptions && sortOptions.length > 0 && (
              <FormSelect
                options={sortOptions}
                value={sortValue}
                onChange={onSortChange}
                placeholder="Sort By"
              />
            )}

            {/* ✅ Custom Filter with ReactSelect */}
            {filterOptions && filterOptions.length > 0 && (
              <FormSelect
                options={filterOptions}
                value={filterValue}
                onChange={onFilterChange}
                placeholder="Filter By"
              />
            )}

            <AddBtn onClick={onAdd}>
              <span style={{ fontSize: 18, lineHeight: 0 }}>＋</span> {addLabel}
            </AddBtn>
          </Toolbar>
        </Panel>
      </StickyTop>

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
