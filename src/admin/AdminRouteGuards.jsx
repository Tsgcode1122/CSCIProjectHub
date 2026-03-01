// import React from "react";
// import { Navigate } from "react-router-dom";
// import { useAdminAuth } from "./AdminAuthContext";

// export function RequireAdmin({ children }) {
//   const { adminUser } = useAdminAuth();
//   if (!adminUser) return <Navigate to="/admin/login" replace />;
//   return children;
// }

import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAdminAuth } from "./AdminAuthContext";

export function RequireAdmin() {
  const { adminUser } = useAdminAuth();

  if (!adminUser?.access_token) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />; 
}