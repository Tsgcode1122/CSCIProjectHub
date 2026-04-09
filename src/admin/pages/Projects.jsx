import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { flushSync } from "react-dom";
import styled from "styled-components";
import Dashboard from "../../components/Dashboard";
import NoResultsState from "../../components/NoResultsState";
import {
  TypeBadge,
  ChipRow,
  Chip,
  ETSU_NAVY,
  ETSU_GOLD,
  IconBtn,
  BORDER,
  MUTED,
} from "../dashboardStyles";
import {
  FaEye,
  FaEdit,
  FaTrash,
  FaFolderOpen,
  FaBolt,
  FaFolder,
  FaBookOpen,
  FaExclamationTriangle,
  FaTimes,
} from "react-icons/fa";
import { useAdminAuth } from "../AdminAuthContext";
import LoadingScreen from "../components/LoadingScreen";

const API_BASE = "https://crpp-project.onrender.com";

function safeLower(x) {
  return String(x ?? "").toLowerCase();
}

function formatDuration(start, end, projectStatus) {
  const status = safeLower(projectStatus).trim();

  if (status === "accepting members" || status === "in progress") {
    return start ? `${start} – Ongoing` : "Ongoing";
  }

  if (start && end) return `${start} – ${end}`;
  if (start) return start;
  if (end) return end;
  return "—";
}

function isOngoingStatus(status) {
  const s = safeLower(status).trim();
  return (
    s === "active" || s === "ongoing" || s === "current" || s === "in progress"
  );
}

function normalizeProject(p) {
  const currentStatus = p.project_status || p.status || "—";

  return {
    id: p.id,
    kind: "Project",
    title: p.title ?? "Untitled Project",
    author:
      p.team_members && p.team_members.length ? p.team_members.join(", ") : "—",
    advisor: p.supervisor ?? "—",
    year: p.year ?? "—",
    department: p.department ?? "—",
    status: currentStatus,
    duration: formatDuration(p.duration_start, p.duration_end, currentStatus),
    tags: Array.isArray(p.tags) ? p.tags : [],
    raw: p,
  };
}

function normalizeThesis(r) {
  const currentStatus = r.research_status || r.status || "—";

  return {
    id: r.id,
    kind: "Thesis",
    title:
      r.title ??
      r.short_description ??
      r.overview?.slice(0, 80) ??
      "Untitled Thesis",
    author: r.student ?? "—",
    advisor: r.supervisor ?? "—",
    year: r.year ?? "—",
    department: r.department ?? "—",
    status: currentStatus,
    duration: formatDuration(r.duration_start, r.duration_end, currentStatus),
    tags: Array.isArray(r.tags) ? r.tags : [],
    raw: r,
  };
}

function sortRows(rows) {
  return [...rows].sort((a, b) => {
    const ay = Number(a.year) || 0;
    const by = Number(b.year) || 0;
    if (by !== ay) return by - ay;
    return safeLower(a.title).localeCompare(safeLower(b.title));
  });
}

export default function Projects() {
  const navigate = useNavigate();
  const location = useLocation();
  const { adminUser } = useAdminAuth();

  const [query, setQuery] = useState("");
  const [filterBy, setFilterBy] = useState("All");

  const [rows, setRows] = useState(null); // null = still loading page
  const [error, setError] = useState("");

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const [showCreateOptions, setShowCreateOptions] = useState(false);

  async function loadData(signal) {
    try {
      setError("");
      setRows(null);

      const headers = {
        Accept: "application/json",
        ...(adminUser?.access_token
          ? { Authorization: `Bearer ${adminUser.access_token}` }
          : {}),
      };

      const [pRes, rRes] = await Promise.all([
        fetch(`${API_BASE}/projects/`, { signal, headers }),
        fetch(`${API_BASE}/research/`, { signal, headers }),
      ]);

      if (!pRes.ok) throw new Error(`Projects fetch failed (${pRes.status})`);
      if (!rRes.ok) throw new Error(`Research fetch failed (${rRes.status})`);

      const pJson = await pRes.json();
      const rJson = await rRes.json();

      const mergedRows = sortRows([
        ...(Array.isArray(pJson) ? pJson : []).map(normalizeProject),
        ...(Array.isArray(rJson) ? rJson : []).map(normalizeThesis),
      ]);

      flushSync(() => {
        setRows(mergedRows);
      });
    } catch (e) {
      if (e.name !== "AbortError") {
        setError(e.message || "Failed to load data.");
        setRows([]);
      }
    }
  }

  useEffect(() => {
    const ac = new AbortController();
    loadData(ac.signal);
    return () => ac.abort();
  }, [adminUser?.access_token, location.pathname]);

  const safeRows = rows ?? [];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return safeRows.filter((r) => {
      const matchesFilter =
        filterBy === "All"
          ? true
          : filterBy === "Project"
            ? r.kind === "Project"
            : filterBy === "Thesis"
              ? r.kind === "Thesis"
              : filterBy === "Current/Ongoing"
                ? isOngoingStatus(r.status)
                : safeLower(r.status) === safeLower(filterBy);

      const matchesQuery = !q
        ? true
        : [
            r.title,
            r.author,
            r.advisor,
            r.department,
            r.status,
            ...(r.tags || []),
          ]
            .filter(Boolean)
            .some((x) => safeLower(x).includes(q));

      return matchesFilter && matchesQuery;
    });
  }, [safeRows, query, filterBy]);

  const isEmptyState = query.trim() && filtered.length === 0;

  const displayRows = isEmptyState
    ? [{ id: "no-results", isEmpty: true }]
    : filtered;

  const tableColumns = isEmptyState
    ? [{ key: "empty", header: "" }]
    : [
        { key: "kind", header: "Type" },
        { key: "title", header: "Title" },
        { key: "author", header: "Author / Team" },
        { key: "duration", header: "Duration" },
        { key: "advisor", header: "Advisor" },
      ];
      
  const stats = useMemo(() => {
    const total = safeRows.length;
    const projectCount = safeRows.filter((x) => x.kind === "Project").length;
    const thesisCount = safeRows.filter((x) => x.kind === "Thesis").length;
    const activeProjects = safeRows.filter(
      (x) => x.kind === "Project" && isOngoingStatus(x.status),
    ).length;

    return [
      {
        label: "Total Entries",
        value: rows === null ? "—" : total,
        accent: ETSU_NAVY,
        icon: <FaFolderOpen size={18} />,
        iconBg: "rgba(4,30,66,0.10)",
      },
      {
        label: "Active Projects",
        value: rows === null ? "—" : activeProjects,
        accent: "#3B82F6",
        icon: <FaBolt size={18} />,
        iconBg: "rgba(59,130,246,0.12)",
        valueColor: "#3B82F6",
      },
      {
        label: "Projects",
        value: rows === null ? "—" : projectCount,
        accent: ETSU_GOLD,
        icon: <FaFolder size={18} />,
        iconBg: "rgba(255,199,44,0.20)",
      },
      {
        label: "Thesis",
        value: rows === null ? "—" : thesisCount,
        accent: "#111827",
        icon: <FaBookOpen size={18} />,
        iconBg: "rgba(17,24,39,0.10)",
      },
    ];
  }, [safeRows, rows]);

  async function handleDeleteConfirmed() {
    if (!deleteTarget) return;

    try {
      setIsDeleting(true);
      setDeleteError("");

      const endpoint =
        deleteTarget.kind === "Project"
          ? `${API_BASE}/projects/${deleteTarget.id}`
          : `${API_BASE}/research/${deleteTarget.id}`;

      const res = await fetch(endpoint, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          ...(adminUser?.access_token
            ? { Authorization: `Bearer ${adminUser.access_token}` }
            : {}),
        },
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        const msg = errData?.detail
          ? Array.isArray(errData.detail)
            ? errData.detail.map((d) => d.msg).join(", ")
            : String(errData.detail)
          : `Delete failed (${res.status})`;
        throw new Error(msg);
      }

      setDeleteTarget(null);
      await loadData();
    } catch (err) {
      setDeleteError(err.message || "Failed to delete entry.");
    } finally {
      setIsDeleting(false);
    }
  }

  if (rows === null) {
    return (
      <LoadingScreen
        title="Loading data"
        subtitle="Fetching projects and thesis from the repository."
        compact
      />
    );
  }

  if (error) {
    return (
      <div style={{ padding: 16 }}>
        <div style={{ fontWeight: 900, color: ETSU_NAVY, marginBottom: 6 }}>
          Couldn’t load Projects / Thesis
        </div>
        <div style={{ color: "#b91c1c", marginBottom: 12 }}>{error}</div>
        <button
          onClick={() => window.location.reload()}
          style={{
            border: "none",
            background: ETSU_NAVY,
            color: "white",
            borderRadius: 10,
            padding: "10px 12px",
            fontWeight: 800,
            cursor: "pointer",
          }}
        >
          Reload
        </button>
      </div>
    );
  }

  return (
    <>
      <Dashboard
        stats={stats}
        query={query}
        onQueryChange={setQuery}
        filterValue={filterBy}
        onFilterChange={setFilterBy}
        filterOptions={[
          { value: "All", label: "Filter By" },
          { value: "Project", label: "Project" },
          { value: "Thesis", label: "Thesis" },
          { value: "Completed", label: "Completed" },
          { value: "In Progress", label: "In Progress" },
          { value: "Accepting Members", label: "Accepting Members" },
        ]}
        addLabel="Add New"
        onAdd={() => setShowCreateOptions(true)}
        // columns={[
        //   { key: "kind", header: "Type" },
        //   { key: "title", header: "Title" },
        //   { key: "author", header: "Author / Team" },
        //   { key: "duration", header: "Duration" },
        //   { key: "advisor", header: "Advisor" },
        // ]}
        // rows={filtered}
        columns={tableColumns}
        rows={displayRows}
        // renderCell={(row, key) => {
        //   if (key === "kind") {
        //     return (
        //       <TypeBadge kind={row.kind}>
        //         <span aria-hidden="true">▢</span> {row.kind}
        //       </TypeBadge>
        //     );
        //   }

        //   if (key === "title") {
        //     if (row.isEmpty) {
        //       return (
        //         <div
        //           style={{
        //             width: "100%",
        //             minHeight: 260,
        //             display: "flex",
        //             justifyContent: "center",
        //             alignItems: "center",
        //           }}
        //         >
        //           <NoResultsState
        //             query={query}
        //             title="No entries found"
        //             subtitle={`Could not find anything matching "${query}"`}
        //           />
        //         </div>
        //       );
        //     }

        //     return (
        //       <>
        //         <div style={{ fontWeight: 800 }}>{row.title}</div>
        //         <div style={{ fontSize: 12, opacity: 0.75, marginTop: 4 }}>
        //           {row.department} • {row.status}
        //         </div>
        //         <ChipRow>
        //           {(row.tags || []).slice(0, 4).map((t) => (
        //             <Chip key={t}>{t}</Chip>
        //           ))}
        //         </ChipRow>
        //       </>
        //     );
        //   }

        //   return row[key] ?? "—";
        // }}
        renderCell={(row, key) => {
          if (row.isEmpty) {
            return (
              <div
                style={{
                  width: "100%",
                  minHeight: 260,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <NoResultsState
                  query={query}
                  title="No entries found"
                  subtitle={`Could not find anything matching "${query}"`}
                />
              </div>
            );
          }

          if (key === "kind") {
            return (
              <TypeBadge kind={row.kind}>
                <span aria-hidden="true">▢</span> {row.kind}
              </TypeBadge>
            );
          }

          if (key === "title") {
            return (
              <>
                <div style={{ fontWeight: 800 }}>{row.title}</div>
                <div style={{ fontSize: 12, opacity: 0.75, marginTop: 4 }}>
                  {row.department} • {row.status}
                </div>
                <ChipRow>
                  {(row.tags || []).slice(0, 4).map((t) => (
                    <Chip key={t}>{t}</Chip>
                  ))}
                </ChipRow>
              </>
            );
          }

          return row[key] ?? "—";
        }}
        renderActions={
          isEmptyState ? undefined : (row) => (
          <>
            <IconBtn
              title="View"
              onClick={() =>
                navigate(
                  `/admin/entries/${row.kind === "Project" ? "project" : "thesis"}/${row.id}`,
                )
              }
            >
              <FaEye />
            </IconBtn>

            <IconBtn
              title="Edit"
              onClick={() =>
                navigate(
                  `/admin/entries/${row.kind === "Project" ? "project" : "thesis"}/${row.id}/edit`,
                )
              }
            >
              <FaEdit />
            </IconBtn>

            <IconBtn
              title="Delete"
              onClick={() => {
                setDeleteError("");
                setDeleteTarget(row);
              }}
            >
              <FaTrash />
            </IconBtn>
          </>
        )}
      />

      {deleteTarget ? (
        <DeleteOverlay>
          <DeleteModal>
            <DeleteHeader>
              <DeleteIconWrap>
                <FaExclamationTriangle />
              </DeleteIconWrap>

              <DeleteCopy>
                <DeleteTitle>Are you sure?</DeleteTitle>
                <DeleteText>
                  This action cannot be undone. This will permanently delete
                  this {deleteTarget.kind.toLowerCase()} from the system.
                </DeleteText>
                <DeleteName>{deleteTarget.title}</DeleteName>
              </DeleteCopy>
            </DeleteHeader>

            {deleteError ? <DeleteError>{deleteError}</DeleteError> : null}

            <DeleteActions>
              <CancelBtn
                type="button"
                disabled={isDeleting}
                onClick={() => {
                  setDeleteTarget(null);
                  setDeleteError("");
                }}
              >
                <FaTimes />
                <span>Cancel</span>
              </CancelBtn>

              <ConfirmDeleteBtn
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteConfirmed}
              >
                <FaTrash />
                <span>{isDeleting ? "Deleting..." : "Delete"}</span>
              </ConfirmDeleteBtn>
            </DeleteActions>
          </DeleteModal>
        </DeleteOverlay>
      ) : null}

      {showCreateOptions ? (
        <CreateOverlay>
          <CreateModal>
            <CreateTitle>Add New Entry</CreateTitle>
            <CreateText>Select what you want to create.</CreateText>

            <CreateOptions>
              <CreateOptionButton
                type="button"
                onClick={() => navigate("/admin/create/project")}
              >
                <FaFolder />
                <span>Add New Project</span>
              </CreateOptionButton>

              <CreateOptionButton
                type="button"
                onClick={() => navigate("/admin/create/thesis")}
              >
                <FaBookOpen />
                <span>Add New Thesis</span>
              </CreateOptionButton>
            </CreateOptions>

            <CreateFooter>
              <CancelBtn
                type="button"
                onClick={() => setShowCreateOptions(false)}
              >
                Cancel
              </CancelBtn>
            </CreateFooter>
          </CreateModal>
        </CreateOverlay>
      ) : null}
    </>
  );
}

const DeleteOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  backdrop-filter: blur(2px);
  display: grid;
  place-items: center;
  z-index: 9999;
  padding: 20px;
`;

const DeleteModal = styled.div`
  width: 100%;
  max-width: 520px;
  background: white;
  border-radius: 20px;
  border: 1px solid ${BORDER};
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.18);
  padding: 24px;
`;

const DeleteHeader = styled.div`
  display: flex;
  gap: 16px;
  align-items: flex-start;
`;

const DeleteIconWrap = styled.div`
  width: 52px;
  height: 52px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  background: rgba(239, 68, 68, 0.12);
  color: #dc2626;
  font-size: 18px;
  flex-shrink: 0;
`;

const DeleteCopy = styled.div`
  flex: 1;
`;

const DeleteTitle = styled.h3`
  margin: 0 0 8px;
  color: ${ETSU_NAVY};
  font-size: 24px;
  line-height: 1.1;
`;

const DeleteText = styled.p`
  margin: 0;
  color: ${MUTED};
  line-height: 1.6;
  font-size: 16px;
`;

const DeleteName = styled.div`
  margin-top: 14px;
  color: ${ETSU_NAVY};
  font-weight: 800;
  font-size: 15px;
`;

const DeleteError = styled.div`
  margin-top: 16px;
  border: 1px solid #fecaca;
  background: #fef2f2;
  color: #b91c1c;
  border-radius: 12px;
  padding: 12px 14px;
  font-size: 14px;
`;

const DeleteActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
`;

const CancelBtn = styled.button`
  border: 1px solid ${BORDER};
  background: white;
  color: ${ETSU_NAVY};
  border-radius: 12px;
  padding: 10px 16px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;

  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }
`;

const ConfirmDeleteBtn = styled.button`
  border: none;
  background: #ef4444;
  color: white;
  border-radius: 12px;
  padding: 10px 16px;
  font-weight: 800;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;

  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }
`;

const CreateOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  display: grid;
  place-items: center;
  z-index: 9999;
  padding: 20px;
`;

const CreateModal = styled.div`
  width: 100%;
  max-width: 460px;
  background: white;
  border-radius: 20px;
  border: 1px solid ${BORDER};
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.18);
  padding: 24px;
`;

const CreateTitle = styled.h3`
  margin: 0 0 8px;
  color: ${ETSU_NAVY};
  font-size: 24px;
`;

const CreateText = styled.p`
  margin: 0 0 18px;
  color: ${MUTED};
  line-height: 1.6;
`;

const CreateOptions = styled.div`
  display: grid;
  gap: 12px;
`;

const CreateOptionButton = styled.button`
  border: 1px solid ${BORDER};
  background: white;
  color: ${ETSU_NAVY};
  border-radius: 14px;
  padding: 14px 16px;
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  justify-content: flex-start;

  &:hover {
    background: #f8fafc;
  }
`;

const CreateFooter = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 18px;
`;