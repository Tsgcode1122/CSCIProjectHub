import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const ThesesContext = createContext();

export const ThesesProvider = ({ children }) => {
  const [theses, setTheses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch the collection once when the provider mounts.
    const fetchTheses = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await axios.get(
          "https://crpp-project.onrender.com/research/",
        );
        const data = res.data ?? [];
        console.log(res.data);
        // Keep consumers safe if the API returns a non-array response.
        setTheses(Array.isArray(data) ? data.reverse() : []);
      } catch (err) {
        console.error("Error fetching theses:", err);
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to fetch theses",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTheses();
  }, []);

  return (
    // Expose data and request state through one shared hook.
    <ThesesContext.Provider value={{ theses, loading, error, setTheses }}>
      {children}
    </ThesesContext.Provider>
  );
};

export const useThesesContext = () => useContext(ThesesContext);
