import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Dashboard from "../../components/Dashboard";
import {
  TypeBadge,
  ChipRow,
  Chip,
  ETSU_NAVY,
  ETSU_GOLD,
  IconBtn,
} from "../dashboardStyles";


const API_BASE = "https://crpp-project.onrender.com";

function safeLower(x) {
  return String(x ?? "").toLowerCase();
}

function formatDuration(start, end) {
  if (start && end) return `${start} – ${end}`;
  if (start) return start;
  if (end) return end;
  return "—";
}

function normalizeProject(p) {
  // projects endpoint shape (from your payload)
  return {
    id: p.id,
    kind: "Project",
    title: p.title ?? "Untitled Project",
    author: (p.team_members && p.team_members.length)
      ? p.team_members.join(", ")
      : "—",
    advisor: p.supervisor ?? "—",
    year: p.year ?? "—",
    department: p.department ?? "—",
    status: p.status ?? p.project_status ?? "—",
    duration: formatDuration(p.duration_start, p.duration_end),
    tags: Array.isArray(p.tags) ? p.tags : [],
    // keep raw if you need it later (view modal, edit, etc.)
    raw: p,
  };
}

function normalizeThesis(r) {
  // research endpoint shape (from your payload)
  // these are thesis-like entries
  return {
    id: r.id,
    kind: "Thesis",
    title: r.short_description || r.overview?.slice(0, 80) || "Untitled Thesis",
    author: r.student ?? "—",
    advisor: r.supervisor ?? "—",
    year: r.year ?? "—",
    department: r.department ?? "—",
    status: r.status ?? r.research_status ?? "—",
    duration: formatDuration(r.duration_start, r.duration_end),
    tags: Array.isArray(r.tags) ? r.tags : [],
    raw: r,
  };
}

export default function Projects() {
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");

  const [projects, setProjects] = useState([]);
  const [thesis, setThesis] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const ac = new AbortController();

    async function load() {
      try {
        setLoading(true);
        setError("");

        const [pRes, rRes] = await Promise.all([
          fetch(`${API_BASE}/projects/`, { signal: ac.signal }),
          fetch(`${API_BASE}/research/`, { signal: ac.signal }),
        ]);

        if (!pRes.ok) throw new Error(`Projects fetch failed (${pRes.status})`);
        if (!rRes.ok) throw new Error(`Research fetch failed (${rRes.status})`);

        const pJson = await pRes.json();
        const rJson = await rRes.json();

        setProjects(Array.isArray(pJson) ? pJson : []);
        setThesis(Array.isArray(rJson) ? rJson : []);
      } catch (e) {
        if (e.name !== "AbortError") {
          setError(e.message || "Failed to load data.");
        }
      } finally {
        setLoading(false);
      }
    }

    load();
    return () => ac.abort();
  }, []);

  // Merge into one list that the table can display
  const allRows = useMemo(() => {
    const pRows = projects.map(normalizeProject);
    const tRows = thesis.map(normalizeThesis);

    // Optional: sort newest-ish first (using year if present)
    const merged = [...pRows, ...tRows].sort((a, b) => {
      const ay = Number(a.year) || 0;
      const by = Number(b.year) || 0;
      if (by !== ay) return by - ay;
      return safeLower(a.title).localeCompare(safeLower(b.title));
    });

    return merged;
  }, [projects, thesis]);

  // Filtered list for search + type filter
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return allRows.filter((r) => {
      const matchesType = typeFilter === "All" ? true : r.kind === typeFilter;

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

      return matchesType && matchesQuery;
    });
  }, [allRows, query, typeFilter]);

  // Stats for the top cards
  const stats = useMemo(() => {
    const total = allRows.length;
    const projectCount = allRows.filter((x) => x.kind === "Project").length;
    const thesisCount = allRows.filter((x) => x.kind === "Thesis").length;

    // "Active Projects" — your projects data uses status: "Active" (seen in your JSON)
    const activeProjects = allRows.filter(
      (x) => x.kind === "Project" && safeLower(x.status) === "active"
    ).length;

    return [
      {
        label: "Total Entries",
        value: loading ? "—" : total,
        accent: ETSU_NAVY,
        icon: "📄",
        iconBg: "rgba(4,30,66,0.10)",
      },
      {
        label: "Active Projects",
        value: loading ? "—" : activeProjects,
        accent: "#3B82F6",
        icon: "⚡",
        iconBg: "rgba(59,130,246,0.12)",
        valueColor: "#3B82F6",
      },
      {
        label: "Projects",
        value: loading ? "—" : projectCount,
        accent: ETSU_GOLD,
        icon: "🧾",
        iconBg: "rgba(255,199,44,0.20)",
      },
      {
        label: "Thesis",
        value: loading ? "—" : thesisCount,
        accent: "#111827",
        icon: "📘",
        iconBg: "rgba(17,24,39,0.10)",
      },
    ];
  }, [allRows, loading]);

  // Optional: handle top-of-page error state
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
    <Dashboard
      stats={stats}
      query={query}
      onQueryChange={setQuery}
      filterValue={typeFilter}
      onFilterChange={setTypeFilter}
      filterOptions={[
        { value: "All", label: "Filter By" },
        { value: "Project", label: "Project" },
        { value: "Thesis", label: "Thesis" },
      ]}
      addLabel="Add New"
      onAdd={() => alert("Open Add modal/page")}
      columns={[
        { key: "kind", header: "Type" },
        { key: "title", header: "Title" },
        { key: "author", header: "Author / Team" },
        { key: "duration", header: "Duration" },
        { key: "advisor", header: "Advisor" },
        { key: "year", header: "Year" },
      ]}
      rows={filtered}
      renderCell={(row, key) => {
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
      renderActions={(row) => (
        <>
          <IconBtn title="View" onClick={() => console.log("VIEW", row.raw)}>
            👁
          </IconBtn>
          <IconBtn title="Edit" onClick={() => console.log("EDIT", row.raw)}>
            ✎
          </IconBtn>
          <IconBtn title="Delete" onClick={() => console.log("DELETE", row.raw)}>
            🗑
          </IconBtn>
        </>
      )}
    />
  );
}