import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await axios.get(
          "https://csciprojecthub.etsu.edu/api/projects/",
        );
        const data = res.data ?? [];
        console.log(res.data);

        setProjects(Array.isArray(data) ? data.reverse() : []);
      } catch (err) {
        console.error("Error fetching projects:", err);
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
    <ProjectContext.Provider value={{ projects, loading, error, setProjects }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjectContext = () => useContext(ProjectContext);
