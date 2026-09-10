import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const ThesesContext = createContext();

export const ThesesProvider = ({ children }) => {
  const [theses, setTheses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTheses = async () => {
      setLoading(true);
      setError("");

      try {
        // NOTE: Update this URL if your thesis endpoint is different
        const res = await axios.get(
          "https://crpp-project.onrender.com/research/",
        );
        const data = res.data ?? [];
        console.log(res.data);

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
    <ThesesContext.Provider value={{ theses, loading, error, setTheses }}>
      {children}
    </ThesesContext.Provider>
  );
};

export const useThesesContext = () => useContext(ThesesContext);
