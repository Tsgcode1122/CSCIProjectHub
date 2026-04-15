// // src/admin/pages/Users.jsx
// import React, { useEffect, useMemo, useState } from "react";
// import { flushSync } from "react-dom";
// import LoadingScreen from "../components/LoadingScreen";
// import Dashboard from "../../components/Dashboard";
// import { ETSU_NAVY, IconBtn } from "../dashboardStyles";
// import CreateUser from "../../components/CreateUser";
// import DeleteUserModal from "../../components/DeleteUserModal";
// import EditUserModal from "../../components/EditUserModal";
// import ViewUserModal from "../../components/ViewUserModal";
// import {
//   FaEye,
//   FaEdit,
//   FaTrash,
//   FaUsers,
//   FaUniversity,
//   FaUserShield,
//   FaUserGraduate,
// } from "react-icons/fa";

// const API_BASE = "https://csciprojecthub.etsu.edu/api";
// const STORAGE_KEY = "capstone_admin_session";

// function safeLower(x) {
//   return String(x ?? "").toLowerCase();
// }

// function formatName(u) {
//   const first = u.first_name ?? "";
//   const last = u.last_name ?? "";
//   const full = `${first} ${last}`.trim();
//   return full || "—";
// }

// /**
//  * Normalize: convert API user object into ONE consistent shape
//  * that your table/dashboard knows how to render.
//  */
// function normalizeUser(u) {
//   return {
//     id: u.id,
//     name: formatName(u),
//     email: u.etsu_email ?? "—",
//     role: u.role ?? "—",
//     department: u.department ?? "—",
//     major: u.major ?? "—",
//     createdAt: u.created_at ? new Date(u.created_at).toLocaleDateString() : "—",
//     raw: u, // keep original object for view/edit/delete later
//   };
// }

// export default function Users() {
//   const [query, setQuery] = useState("");
//   const [deptFilter, setDeptFilter] = useState("All");
//   const [openModal, setOpenModal] = useState(false);
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [rows, setRows] = useState(null);

//   const [deleteOpen, setDeleteOpen] = useState(false);
//   const [viewOpen, setViewOpen] = useState(false);

//   const [editOpen, setEditOpen] = useState(false);
//   const [selectedUser, setSelectedUser] = useState(null);
//   useEffect(() => {
//     const ac = new AbortController();

//     async function load() {
//       try {
//         setLoading(true);
//         setError("");

//         const storedSession = sessionStorage.getItem("capstone_admin_session");

//         const session = storedSession ? JSON.parse(storedSession) : null;
//         const token = session?.access_token;

//         console.log("session:", session);
//         console.log("token:", token);

//         if (!token) {
//           throw new Error("No access token found in session storage");
//         }

//         const res = await fetch(`${API_BASE}/users/`, {
//           signal: ac.signal,
//           headers: {
//             Authorization: `Bearer ${token.trim()}`,
//             Accept: "application/json",
//           },
//         });

//         if (!res.ok) {
//           throw new Error(`Users fetch failed (${res.status})`);
//         }

//         const json = await res.json();

//         setUsers(Array.isArray(json) ? json : []);
//       } catch (e) {
//         if (e.name !== "AbortError") {
//           setError(e.message || "Failed to load users.");
//         }
//       } finally {
//         setLoading(false);
//       }
//     }

//     load();
//     return () => ac.abort();
//   }, []);

//   const allRows = useMemo(() => users.map(normalizeUser), [users]);

//   // Build department options from current data
//   const deptOptions = useMemo(() => {
//     const set = new Set();
//     for (const r of allRows) {
//       if (r.department && r.department !== "—") set.add(r.department);
//     }
//     return ["All", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
//   }, [allRows]);

//   const filtered = useMemo(() => {
//     const q = query.trim().toLowerCase();

//     return allRows.filter((r) => {
//       const matchesDept =
//         deptFilter === "All" ? true : r.department === deptFilter;

//       const matchesQuery = !q
//         ? true
//         : [r.name, r.email, r.role, r.department, r.major]
//             .filter(Boolean)
//             .some((x) => safeLower(x).includes(q));

//       return matchesDept && matchesQuery;
//     });
//   }, [allRows, query, deptFilter]);

//   // Stats cards (top boxes)
//   const stats = useMemo(() => {
//     const total = allRows.length;

//     // example: count roles if you want
//     const admins = allRows.filter((u) => safeLower(u.role) === "admin").length;
//     const students = allRows.filter(
//       (u) => safeLower(u.role) === "faculty",
//     ).length;

//     return [
//       {
//         label: "Total Users",
//         value: loading ? "—" : total,
//         accent: ETSU_NAVY,
//         icon: <FaUsers size={18} />,
//         iconBg: "rgba(4,30,66,0.10)",
//       },
//       {
//         label: "Admins",
//         value: loading ? "—" : admins,
//         accent: "#3B82F6",
//         icon: <FaUserShield size={18} />,
//         iconBg: "rgba(59,130,246,0.12)",
//         valueColor: "#3B82F6",
//       },
//       {
//         label: "Faculty",
//         value: loading ? "—" : students,
//         accent: "#111827",
//         icon: <FaUserGraduate size={18} />,
//         iconBg: "rgba(17,24,39,0.10)",
//       },
//       {
//         label: "Departments",
//         value: loading ? "—" : Math.max(0, deptOptions.length - 1),
//         accent: "#FFC72C",
//         icon: <FaUniversity size={18} />,
//         iconBg: "rgba(255,199,44,0.20)",
//       },
//     ];
//   }, [allRows, loading, deptOptions]);
//   const handleDelete = async (user) => {
//     console.log(user);

//     try {
//       const storedUser = sessionStorage.getItem(STORAGE_KEY);
//       const users = storedUser ? JSON.parse(storedUser) : null;
//       const token = users?.access_token;

//       if (!token) {
//         throw new Error("No access token found in session storage");
//       }

//       const res = await fetch(`${API_BASE}/users/${user.id}`, {
//         method: "DELETE",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//           Accept: "application/json",
//         },
//       });

//       if (!res.ok) {
//         throw new Error("Failed to delete user");
//       }
//       setDeleteOpen(false);
//       fetchUsers();
//     } catch (err) {
//       console.error(err);
//     }
//   };
//   // 1. to reload users
//   const fetchUsers = async (signal) => {
//     try {
//       setLoading(true);
//       setError("");

//       const storedSession = sessionStorage.getItem("capstone_admin_session");
//       const session = storedSession ? JSON.parse(storedSession) : null;
//       const token = session?.access_token;

//       if (!token) {
//         throw new Error("No access token found in session storage");
//       }

//       const res = await fetch(`${API_BASE}/users/`, {
//         signal, // Pass the abort signal if it exists
//         headers: {
//           Authorization: `Bearer ${token.trim()}`,
//           Accept: "application/json",
//         },
//       });

//       if (!res.ok) {
//         throw new Error(`Users fetch failed (${res.status})`);
//       }

//       const json = await res.json();
//       setUsers(Array.isArray(json) ? json : []);
//     } catch (e) {
//       if (e.name !== "AbortError") {
//         setError(e.message || "Failed to load users.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   // useeffect to update users instantly
//   useEffect(() => {
//     const ac = new AbortController();
//     fetchUsers(ac.signal);
//     return () => ac.abort();
//   }, []);
//   if (error) {
//     return (
//       <div style={{ padding: 16 }}>
//         <div style={{ fontWeight: 900, color: ETSU_NAVY, marginBottom: 6 }}>
//           Couldn’t load Users
//         </div>
//         <div style={{ color: "#b91c1c", marginBottom: 12 }}>{error}</div>
//         <button
//           onClick={() => window.location.reload()}
//           style={{
//             border: "none",
//             background: ETSU_NAVY,
//             color: "white",
//             borderRadius: 10,
//             padding: "10px 12px",
//             fontWeight: 800,
//             cursor: "pointer",
//           }}
//         >
//           Reload
//         </button>
//       </div>
//     );
//   }

//   return (
//     <>
//       <Dashboard
//         stats={stats}
//         query={query}
//         onQueryChange={setQuery}
//         filterValue={deptFilter}
//         onFilterChange={setDeptFilter}
//         filterOptions={deptOptions.map((d) => ({
//           value: d,
//           label: d === "All" ? "All Programs" : d,
//         }))}
//         addLabel="Add User"
//         onAdd={() => setOpenModal(true)}
//         columns={[
//           { key: "name", header: "Name" },
//           { key: "email", header: "ETSU Email" },
//           { key: "role", header: "Role" },
//           { key: "department", header: "Program" },

//           { key: "createdAt", header: "Created" },
//         ]}
//         rows={filtered}
//         renderCell={(row, key) => {
//           if (key === "name") {
//             return (
//               <>
//                 <div style={{ fontWeight: 900 }}>{row.name}</div>
//                 <div style={{ fontSize: 12, opacity: 0.75, marginTop: 4 }}>
//                   {row.role} • {row.department}
//                 </div>
//               </>
//             );
//           }

//           return row[key] ?? "—";
//         }}
//         renderActions={(row) => (
//           <>
//             <IconBtn
//               title="View"
//               onClick={() => {
//                 const matchedUser = users.find((u) => u.id === row.raw.id);
//                 setSelectedUser(matchedUser || row.raw);
//                 setViewOpen(true);
//               }}
//             >
//               <FaEye />
//             </IconBtn>
//             <IconBtn
//               title="Edit"
//               onClick={() => {
//                 const matchedUser = users.find((u) => u.id === row.raw.id);
//                 setSelectedUser(matchedUser || row.raw);
//                 setEditOpen(true);
//               }}
//             >
//               <FaEdit />
//             </IconBtn>
//             <IconBtn
//               title="Delete"
//               onClick={() => {
//                 setSelectedUser(row.raw);
//                 setDeleteOpen(true);
//               }}
//             >
//               <FaTrash />
//             </IconBtn>
//           </>
//         )}
//       />
//       {openModal && (
//         <CreateUser
//           onClose={() => setOpenModal(false)}
//           onSuccess={() => {
//             setOpenModal(false);
//             fetchUsers();
//           }}
//         />
//       )}
//       {viewOpen && selectedUser && (
//         <ViewUserModal
//           user={selectedUser}
//           onClose={() => {
//             setViewOpen(false);
//             setSelectedUser(null);
//           }}
//         />
//       )}
//       {editOpen && selectedUser && (
//         <EditUserModal
//           user={selectedUser}
//           onClose={() => {
//             setEditOpen(false);
//             setSelectedUser(null);
//           }}
//           onSuccess={() => {
//             setEditOpen(false);
//             setSelectedUser(null);
//             fetchUsers();
//           }}
//         />
//       )}
//       {deleteOpen && (
//         <DeleteUserModal
//           user={selectedUser}
//           onClose={() => {
//             setDeleteOpen(false);
//             setSelectedUser(null);
//           }}
//           onConfirm={handleDelete}
//         />
//       )}
//     </>
//   );
// }

import React, { useEffect, useMemo, useState } from "react";
import { flushSync } from "react-dom";
import LoadingScreen from "../components/LoadingScreen";
import Dashboard from "../../components/Dashboard";
import { ETSU_NAVY, IconBtn } from "../dashboardStyles";
import CreateUser from "../../components/CreateUser";
import DeleteUserModal from "../../components/DeleteUserModal";
import EditUserModal from "../../components/EditUserModal";
import ViewUserModal from "../../components/ViewUserModal";
import NoResultsState from "../../components/NoResultsState";
import {
  FaEye,
  FaEdit,
  FaTrash,
  FaUsers,
  FaUniversity,
  FaUserShield,
  FaUserGraduate,
} from "react-icons/fa";

const API_BASE = "https://csciprojecthub.etsu.edu/api";
const STORAGE_KEY = "capstone_admin_session";

function safeLower(x) {
  return String(x ?? "").toLowerCase();
}

function formatName(u) {
  const first = u.first_name ?? "";
  const last = u.last_name ?? "";
  const full = `${first} ${last}`.trim();
  return full || "—";
}

function normalizeUser(u) {
  return {
    id: u.id,
    name: formatName(u),
    email: u.etsu_email ?? "—",
    role: u.role ?? "—",
    department: u.department ?? "—",
    major: u.major ?? "—",
    createdAt: u.created_at ? new Date(u.created_at).toLocaleDateString() : "—",
    raw: u,
  };
}

export default function Users() {
  const [query, setQuery] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");
  const [openModal, setOpenModal] = useState(false);

  const [users, setUsers] = useState([]);
  const [rows, setRows] = useState(null); // null = loading
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

      const res = await fetch(`${API_BASE}/users/`, {
        signal,
        headers: {
          Authorization: `Bearer ${token.trim()}`,
          Accept: "application/json",
        },
      });

      if (!res.ok) {
        throw new Error(`Users fetch failed (${res.status})`);
      }

      const json = await res.json();
      const safeUsers = Array.isArray(json) ? json : [];
      const normalizedRows = safeUsers.map(normalizeUser);

      flushSync(() => {
        setUsers(safeUsers);
        setRows(normalizedRows);
      });
    } catch (e) {
      if (e.name !== "AbortError") {
        setError(e.message || "Failed to load users.");
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

  const deptOptions = useMemo(() => {
    const set = new Set();
    for (const r of allRows) {
      if (r.department && r.department !== "—") set.add(r.department);
    }
    return ["All", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [allRows]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return allRows.filter((r) => {
      const matchesDept =
        deptFilter === "All" ? true : r.department === deptFilter;

      const matchesQuery = !q
        ? true
        : [r.name, r.email, r.role, r.department, r.major]
            .filter(Boolean)
            .some((x) => safeLower(x).includes(q));

      return matchesDept && matchesQuery;
    });
  }, [allRows, query, deptFilter]);

  const isEmptyState = query.trim() && filtered.length === 0;

  const displayRows = isEmptyState
    ? [{ id: "no-results", isEmpty: true }]
    : filtered;

  const tableColumns = isEmptyState
    ? [{ key: "empty", header: "" }]
    : [
        { key: "name", header: "Name" },
        { key: "email", header: "ETSU Email" },
        { key: "role", header: "Role" },
        { key: "department", header: "Program" },
        { key: "createdAt", header: "Created" },
      ];

  const stats = useMemo(() => {
    const total = allRows.length;
    const admins = allRows.filter((u) => safeLower(u.role) === "admin").length;
    const faculty = allRows.filter(
      (u) => safeLower(u.role) === "faculty",
    ).length;

    return [
      {
        label: "Total Users",
        value: rows === null ? "—" : total,
        accent: ETSU_NAVY,
        icon: <FaUsers size={18} />,
        iconBg: "rgba(4,30,66,0.10)",
      },
      {
        label: "Admins",
        value: rows === null ? "—" : admins,
        accent: "#3B82F6",
        icon: <FaUserShield size={18} />,
        iconBg: "rgba(59,130,246,0.12)",
        valueColor: "#3B82F6",
      },
      {
        label: "Faculty",
        value: rows === null ? "—" : faculty,
        accent: "#111827",
        icon: <FaUserGraduate size={18} />,
        iconBg: "rgba(17,24,39,0.10)",
      },
      {
        label: "Departments",
        value: rows === null ? "—" : Math.max(0, deptOptions.length - 1),
        accent: "#FFC72C",
        icon: <FaUniversity size={18} />,
        iconBg: "rgba(255,199,44,0.20)",
      },
    ];
  }, [allRows, rows, deptOptions]);

  const handleDelete = async (user) => {
    try {
      const storedSession = sessionStorage.getItem(STORAGE_KEY);
      const session = storedSession ? JSON.parse(storedSession) : null;
      const token = session?.access_token;

      if (!token) {
        throw new Error("No access token found in session storage");
      }

      const res = await fetch(`${API_BASE}/users/${user.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Failed to delete user");
      }

      setDeleteOpen(false);
      setSelectedUser(null);
      await fetchUsers();
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to delete user.");
    }
  };

  if (rows === null) {
    return (
      <LoadingScreen
        title="Loading users"
        subtitle="Fetching users from the system."
        compact
      />
    );
  }

  if (error) {
    return (
      <div style={{ padding: 16 }}>
        <div style={{ fontWeight: 900, color: ETSU_NAVY, marginBottom: 6 }}>
          Couldn’t load Users
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
        filterValue={deptFilter}
        onFilterChange={setDeptFilter}
        filterOptions={deptOptions.map((d) => ({
          value: d,
          label: d === "All" ? "All Programs" : d,
        }))}
        addLabel="Add User"
        onAdd={() => setOpenModal(true)}
        // columns={[
        //   { key: "name", header: "Name" },
        //   { key: "email", header: "ETSU Email" },
        //   { key: "role", header: "Role" },
        //   { key: "department", header: "Program" },
        //   { key: "createdAt", header: "Created" },
        // ]}
        // rows={filtered}
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
                  title="No users found"
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
                  {row.role} • {row.department}
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
