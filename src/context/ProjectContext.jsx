import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
  // Shared server data used by the home, listing, and detail views.
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch the collection once when the provider mounts.
    const fetchProjects = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await axios.get(
          "https://crpp-project.onrender.com/projects/",
        );
        const data = res.data ?? [];
        console.log(res.data);

        // Keep user safe if the API returns a non-array response.
        setProjects(Array.isArray(data) ? data : []);
      } catch (err) {
        // console.error("Error fetching projects:", err);
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to fetch projects",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    // Expose data and request state through one shared hook.
    <ProjectContext.Provider value={{ projects, loading, error, setProjects }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjectContext = () => useContext(ProjectContext);
