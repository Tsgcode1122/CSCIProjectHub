import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const AdminAuthContext = createContext(null);

const STORAGE_KEY = "capstone_admin_session";
const API_BASE = "https://crpp-project.onrender.com";

export function AdminAuthProvider({ children }) {
  const [adminUser, setAdminUser] = useState(null);

  // Load saved session (so refresh keeps you logged in)
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) setAdminUser(JSON.parse(raw));
    } catch {
      // ignore bad storage
    }
  }, []);

  const login = async ({ email, password }) => {
    const res = await fetch(
      `${API_BASE}/auth/login`,
      {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          etsu_email: email,
          password,
        }),
      }
    );

    if (!res.ok) {
      throw new Error("Invalid credentials, You need to be authorized");
    }

    const data = await res.json();

    const user = {
      email,
      access_token: data.access_token,
      token_type: data.token_type,
    };

    
    // if (!email || !password) throw new Error("Email and password required");

    // const user = { email, role: "admin" };
    setAdminUser(user);
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  };

  const logout = () => {
    setAdminUser(null);
    sessionStorage.removeItem(STORAGE_KEY);
  };

  const value = useMemo(() => ({ adminUser, login, logout }), [adminUser]);

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}