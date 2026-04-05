// src/admin/pages/EditSupervisors.jsx
import React, { useEffect, useMemo, useState } from "react";
import Dashboard from "../../components/Dashboard";
import { ETSU_NAVY, IconBtn } from "../dashboardStyles";
import CreateUser from "../../components/CreateUser";
import DeleteUserModal from "../../components/DeleteUserModal";
import EditUserModal from "../../components/EditUserModal";
import ViewUserModal from "../../components/ViewUserModal";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
const API_BASE = "https://crpp-project.onrender.com";
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // 1. Single, reusable fetch function
  const fetchUsers = async (signal) => {
    try {
      setLoading(true);
      setError("");

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

      // 1. Fetch Supervisors, Projects, and Research concurrently so it loads lightning fast!
      const [supRes, projRes, researchRes] = await Promise.all([
        fetch(`${API_BASE}/supervisors/`, { signal, headers }),
        fetch(`${API_BASE}/projects/`, { signal, headers }),
        fetch(`${API_BASE}/research/`, { signal, headers }),
      ]);

      if (!supRes.ok) {
        throw new Error(`Supervisors fetch failed (${supRes.status})`);
      }

      // 2. Parse the JSON (gracefully handle if projects/research are empty)
      const rawSupervisors = await supRes.json();
      const rawProjects = projRes.ok ? await projRes.json() : [];
      const rawResearch = researchRes.ok ? await researchRes.json() : [];

      const supervisorsArr = Array.isArray(rawSupervisors)
        ? rawSupervisors
        : [];
      const projectsArr = Array.isArray(rawProjects) ? rawProjects : [];
      const researchArr = Array.isArray(rawResearch) ? rawResearch : [];

      // 3. Loop through supervisors and calculate their supervisee count
      const enrichedSupervisors = supervisorsArr.map((supervisor) => {
        // Normalize the name to lowercase so "Dr. Smith" matches "dr. smith"
        const supName = String(supervisor.fullname || "")
          .trim()
          .toLowerCase();

        // Count how many projects have this exact supervisor
        const projectCount = projectsArr.filter(
          (p) =>
            String(p.supervisor || "")
              .trim()
              .toLowerCase() === supName,
        ).length;

        // Count how many thesis/research papers have this exact supervisor
        const researchCount = researchArr.filter(
          (r) =>
            String(r.supervisor || "")
              .trim()
              .toLowerCase() === supName,
        ).length;

        // Attach the combined total directly to the supervisor object!
        return {
          ...supervisor,
          supervisee: projectCount + researchCount,
        };
      });

      // 4. Save to state
      setUsers(enrichedSupervisors);
    } catch (e) {
      if (e.name !== "AbortError") {
        setError(e.message || "Failed to load supervisors.");
      }
    } finally {
      setLoading(false);
    }
  };
  // 2. Trigger fetch on component load
  useEffect(() => {
    const ac = new AbortController();
    fetchUsers(ac.signal);
    return () => ac.abort();
  }, []);

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
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const allRows = useMemo(() => users.map(normalizeUser), [users]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return allRows.filter((r) => {
      if (!q) return true;

      // Fixed: Matches properties mapped in normalizeUser
      return [r.name, r.speciality]
        .filter(Boolean)
        .some((x) => safeLower(x).includes(q));
    });
  }, [allRows, query]);

  const stats = useMemo(() => {
    // 1. Total number of supervisors
    const totalSupervisors = allRows.length;

    // 2. Add up all the supervisees from every supervisor
    const totalSupervisees = allRows.reduce((total, row) => {
      // row.supervisee might be "—" if it didn't load, so we check if it's a real number
      const count = typeof row.supervisee === "number" ? row.supervisee : 0;
      return total + count;
    }, 0);

    return [
      {
        label: "Total Supervisors",
        value: loading ? "—" : totalSupervisors,
        accent: ETSU_NAVY,
        icon: "👥",
        iconBg: "rgba(4,30,66,0.10)",
      },
      {
        label: "Total Project Supervised",
        value: loading ? "—" : totalSupervisees,
        accent: "#3B82F6",
        icon: "🎓", // Changed to a graduation cap for students!
        iconBg: "rgba(59,130,246,0.12)",
        valueColor: "#3B82F6",
      },
    ];
  }, [allRows, loading]);

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
        columns={[
          { key: "name", header: "Name" },
          { key: "speciality", header: "Speciality" },
          { key: "supervisee", header: "Total Project Supervised" },
          { key: "createdAt", header: "Created" },
        ]}
        rows={filtered}
        renderCell={(row, key) => {
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
        renderActions={(row) => (
          <>
            <IconBtn
              title="View"
              onClick={() => {
                const matchedUser = users.find((u) => u.id === row.raw.id);
                setSelectedUser(matchedUser || row.raw);
                setViewOpen(true);
              }}
            >
              <FaEye />
            </IconBtn>
            <IconBtn
              title="Edit"
              onClick={() => {
                const matchedUser = users.find((u) => u.id === row.raw.id);
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
        )}
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
