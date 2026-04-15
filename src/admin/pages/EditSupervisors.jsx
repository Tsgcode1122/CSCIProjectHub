import React, { useEffect, useMemo, useState } from "react";
import { flushSync } from "react-dom";
import LoadingScreen from "../components/LoadingScreen";
import Dashboard from "../../components/Dashboard";
import { ETSU_NAVY, IconBtn } from "../dashboardStyles";
import CreateUser from "../../components/CreateUser";
import DeleteUserModal from "../../components/DeleteUserModal";
import EditUserModal from "../../components/EditUserModal";
import ViewUserModal from "../../components/ViewUserModal";
import {
  FaEye,
  FaEdit,
  FaTrash,
  FaUsers,
  FaUserGraduate,
} from "react-icons/fa";
import NoResultsState from "../../components/NoResultsState";

const API_BASE = "https://csciprojecthub.etsu.edu/api";
const STORAGE_KEY = "capstone_admin_session";

function safeLower(x) {
  return String(x ?? "").toLowerCase();
}

function normalizeUser(u) {
  return {
    id: u.id,
    name: u.fullname ?? "—",
    speciality: u.speciality ?? "—",
    supervisee: u.supervisee ?? "—",
    createdAt: u.created_at ? new Date(u.created_at).toLocaleDateString() : "—",
    raw: u,
  };
}

export default function EditSupervisors() {
  const [query, setQuery] = useState("");
  const [openModal, setOpenModal] = useState(false);

  const [users, setUsers] = useState([]);
  const [rows, setRows] = useState(null);
  const [error, setError] = useState("");

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = async (signal) => {
    try {
      setError("");
      setRows(null);

      const storedSession = sessionStorage.getItem(STORAGE_KEY);
      const session = storedSession ? JSON.parse(storedSession) : null;
      const token = session?.access_token;

      if (!token) {
        throw new Error("No access token found in session storage");
      }

      const headers = {
        Authorization: `Bearer ${token.trim()}`,
        Accept: "application/json",
      };

      const [supRes, projRes, researchRes] = await Promise.all([
        fetch(`${API_BASE}/supervisors/`, { signal, headers }),
        fetch(`${API_BASE}/projects/`, { signal, headers }),
        fetch(`${API_BASE}/research/`, { signal, headers }),
      ]);

      if (!supRes.ok) {
        throw new Error(`Supervisors fetch failed (${supRes.status})`);
      }

      const rawSupervisors = await supRes.json();
      const rawProjects = projRes.ok ? await projRes.json() : [];
      const rawResearch = researchRes.ok ? await researchRes.json() : [];

      const supervisorsArr = Array.isArray(rawSupervisors)
        ? rawSupervisors
        : [];
      const projectsArr = Array.isArray(rawProjects) ? rawProjects : [];
      const researchArr = Array.isArray(rawResearch) ? rawResearch : [];

      const enrichedSupervisors = supervisorsArr.map((supervisor) => {
        const supName = String(supervisor.fullname || "")
          .trim()
          .toLowerCase();

        const projectCount = projectsArr.filter(
          (p) =>
            String(p.supervisor || "")
              .trim()
              .toLowerCase() === supName,
        ).length;

        const researchCount = researchArr.filter(
          (r) =>
            String(r.supervisor || "")
              .trim()
              .toLowerCase() === supName,
        ).length;

        return {
          ...supervisor,
          supervisee: projectCount + researchCount,
        };
      });

      const normalizedRows = enrichedSupervisors.map(normalizeUser);

      flushSync(() => {
        setUsers(enrichedSupervisors);
        setRows(normalizedRows);
      });
    } catch (e) {
      if (e.name !== "AbortError") {
        setError(e.message || "Failed to load supervisors.");
        setUsers([]);
        setRows([]);
      }
    }
  };

  useEffect(() => {
    const ac = new AbortController();
    fetchUsers(ac.signal);
    return () => ac.abort();
  }, []);

  const allRows = rows ?? [];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return allRows.filter((r) => {
      if (!q) return true;

      return [r.name, r.speciality]
        .filter(Boolean)
        .some((x) => safeLower(x).includes(q));
    });
  }, [allRows, query]);

  const displayRows =
    query.trim() && filtered.length === 0
      ? [{ id: "no-results", isEmpty: true }]
      : filtered;

  const isEmptyState = query.trim() && filtered.length === 0;

  const tableColumns = isEmptyState
    ? [{ key: "empty", header: "" }]
    : [
        { key: "name", header: "Name" },
        { key: "speciality", header: "Speciality" },
        { key: "supervisee", header: "Total Project" },
        { key: "createdAt", header: "Created" },
      ];

  const stats = useMemo(() => {
    const totalSupervisors = allRows.length;

    const totalSupervisees = allRows.reduce((total, row) => {
      const count = typeof row.supervisee === "number" ? row.supervisee : 0;
      return total + count;
    }, 0);

    return [
      {
        label: "Total Supervisors",
        value: rows === null ? "—" : totalSupervisors,
        accent: ETSU_NAVY,
        icon: <FaUsers size={18} />,
        iconBg: "rgba(4,30,66,0.10)",
      },
      {
        label: "Total Project Supervised",
        value: rows === null ? "—" : totalSupervisees,
        accent: "#3B82F6",
        icon: <FaUserGraduate size={18} />,
        iconBg: "rgba(59,130,246,0.12)",
        valueColor: "#3B82F6",
      },
    ];
  }, [allRows, rows]);

  const handleDelete = async (supervisor) => {
    try {
      const storedSession = sessionStorage.getItem(STORAGE_KEY);
      const session = storedSession ? JSON.parse(storedSession) : null;
      const token = session?.access_token;

      if (!token) {
        throw new Error("No access token found in session storage");
      }

      const res = await fetch(`${API_BASE}/supervisors/${supervisor.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Failed to delete supervisor");
      }

      setDeleteOpen(false);
      setSelectedUser(null);
      await fetchUsers();
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to delete supervisor.");
    }
  };

  if (rows === null) {
    return (
      <LoadingScreen
        title="Loading supervisors"
        subtitle="Fetching supervisors data."
        compact
      />
    );
  }

  if (error) {
    return (
      <div style={{ padding: 16 }}>
        <div style={{ fontWeight: 900, color: ETSU_NAVY, marginBottom: 6 }}>
          Couldn’t load Supervisors
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
        addLabel="Add Supervisor"
        onAdd={() => setOpenModal(true)}
        // columns={[
        //   { key: "name", header: "Name" },
        //   { key: "speciality", header: "Speciality" },
        //   { key: "supervisee", header: "Total Project Supervised" },
        //   { key: "createdAt", header: "Created" },
        // ]}
        columns={tableColumns}
        rows={displayRows}
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
                  title="No supervisors found"
                  subtitle={`Could not find anything matching "${query}"`}
                />
              </div>
            );
          }

          if (key === "name") {
            return (
              <>
                <div style={{ fontWeight: 900 }}>{row.name}</div>
                <div style={{ fontSize: 12, opacity: 0.75, marginTop: 4 }}>
                  {row.speciality}
                </div>
              </>
            );
          }

          return row[key] ?? "—";
        }}
        renderActions={
          isEmptyState
            ? undefined
            : (row) => (
                <>
                  <IconBtn
                    title="View"
                    onClick={() => {
                      const matchedUser = users.find(
                        (u) => u.id === row.raw.id,
                      );
                      setSelectedUser(matchedUser || row.raw);
                      setViewOpen(true);
                    }}
                  >
                    <FaEye />
                  </IconBtn>

                  <IconBtn
                    title="Edit"
                    onClick={() => {
                      const matchedUser = users.find(
                        (u) => u.id === row.raw.id,
                      );
                      setSelectedUser(matchedUser || row.raw);
                      setEditOpen(true);
                    }}
                  >
                    <FaEdit />
                  </IconBtn>

                  <IconBtn
                    title="Delete"
                    onClick={() => {
                      setSelectedUser(row.raw);
                      setDeleteOpen(true);
                    }}
                  >
                    <FaTrash />
                  </IconBtn>
                </>
              )
        }
      />

      {openModal && (
        <CreateUser
          isSupervisor={true}
          onClose={() => setOpenModal(false)}
          onSuccess={() => {
            setOpenModal(false);
            fetchUsers();
          }}
        />
      )}

      {viewOpen && selectedUser && (
        <ViewUserModal
          user={selectedUser}
          onClose={() => {
            setViewOpen(false);
            setSelectedUser(null);
          }}
        />
      )}

      {editOpen && selectedUser && (
        <EditUserModal
          user={selectedUser}
          onClose={() => {
            setEditOpen(false);
            setSelectedUser(null);
          }}
          onSuccess={() => {
            setEditOpen(false);
            setSelectedUser(null);
            fetchUsers();
          }}
        />
      )}

      {deleteOpen && (
        <DeleteUserModal
          user={selectedUser}
          onClose={() => {
            setDeleteOpen(false);
            setSelectedUser(null);
          }}
          onConfirm={handleDelete}
        />
      )}
    </>
  );
}
