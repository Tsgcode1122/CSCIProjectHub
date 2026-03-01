// src/admin/pages/Users.jsx
import React, { useEffect, useMemo, useState } from "react";
import Dashboard from "../../components/Dashboard";
import { ETSU_NAVY, IconBtn } from "../dashboardStyles";

const API_BASE = "https://crpp-project.onrender.com";

function safeLower(x) {
  return String(x ?? "").toLowerCase();
}

function formatName(u) {
  const first = u.first_name ?? "";
  const last = u.last_name ?? "";
  const full = `${first} ${last}`.trim();
  return full || "—";
}

/**
 * Normalize: convert API user object into ONE consistent shape
 * that your table/dashboard knows how to render.
 */
function normalizeUser(u) {
  return {
    id: u.id,
    name: formatName(u),
    email: u.etsu_email ?? "—",
    role: u.role ?? "—",
    department: u.department ?? "—",
    major: u.major ?? "—",
    createdAt: u.created_at ? new Date(u.created_at).toLocaleDateString() : "—",
    raw: u, // keep original object for view/edit/delete later
  };
}

export default function Users() {
  const [query, setQuery] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const ac = new AbortController();

    async function load() {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(`${API_BASE}/users/`, { signal: ac.signal });
        if (!res.ok) throw new Error(`Users fetch failed (${res.status})`);

        const json = await res.json();
        setUsers(Array.isArray(json) ? json : []);
      } catch (e) {
        if (e.name !== "AbortError") {
          setError(e.message || "Failed to load users.");
        }
      } finally {
        setLoading(false);
      }
    }

    load();
    return () => ac.abort();
  }, []);

  const allRows = useMemo(() => users.map(normalizeUser), [users]);

  // Build department options from current data
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
      const matchesDept = deptFilter === "All" ? true : r.department === deptFilter;

      const matchesQuery = !q
        ? true
        : [r.name, r.email, r.role, r.department, r.major]
            .filter(Boolean)
            .some((x) => safeLower(x).includes(q));

      return matchesDept && matchesQuery;
    });
  }, [allRows, query, deptFilter]);

  // Stats cards (top boxes)
  const stats = useMemo(() => {
    const total = allRows.length;

    // example: count roles if you want
    const admins = allRows.filter((u) => safeLower(u.role) === "admin").length;
    const students = allRows.filter((u) => safeLower(u.role) === "student").length;

    return [
      {
        label: "Total Users",
        value: loading ? "—" : total,
        accent: ETSU_NAVY,
        icon: "👥",
        iconBg: "rgba(4,30,66,0.10)",
      },
      {
        label: "Admins",
        value: loading ? "—" : admins,
        accent: "#3B82F6",
        icon: "🛡️",
        iconBg: "rgba(59,130,246,0.12)",
        valueColor: "#3B82F6",
      },
      {
        label: "Students",
        value: loading ? "—" : students,
        accent: "#111827",
        icon: "🎓",
        iconBg: "rgba(17,24,39,0.10)",
      },
      {
        label: "Departments",
        value: loading ? "—" : Math.max(0, deptOptions.length - 1),
        accent: "#FFC72C",
        icon: "🏛️",
        iconBg: "rgba(255,199,44,0.20)",
      },
    ];
  }, [allRows, loading, deptOptions]);

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
    <Dashboard
      stats={stats}
      query={query}
      onQueryChange={setQuery}
      filterValue={deptFilter}
      onFilterChange={setDeptFilter}
      filterOptions={deptOptions.map((d) => ({
        value: d,
        label: d === "All" ? "All Departments" : d,
      }))}
      addLabel="Add User"
      onAdd={() => alert("Open Add User modal/page")}
      columns={[
        { key: "name", header: "Name" },
        { key: "email", header: "ETSU Email" },
        { key: "role", header: "Role" },
        { key: "department", header: "Department" },
        { key: "major", header: "Major" },
        { key: "createdAt", header: "Created" },
      ]}
      rows={filtered}
      renderCell={(row, key) => {
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
      renderActions={(row) => (
        <>
          <IconBtn title="View" onClick={() => console.log("VIEW USER", row.raw)}>
            👁
          </IconBtn>
          <IconBtn title="Edit" onClick={() => console.log("EDIT USER", row.raw)}>
            ✎
          </IconBtn>
          <IconBtn title="Delete" onClick={() => console.log("DELETE USER", row.raw)}>
            🗑
          </IconBtn>
        </>
      )}
    />
  );
}