import React from "react";

import styled, { createGlobalStyle } from "styled-components";
import {
  createBrowserRouter,
  RouterProvider,
  useNavigate,
  Navigate,
} from "react-router-dom";

import { Result, Button } from "antd";
import Layout from "./fixedComponent/Layout";
import Home from "./pages/Home";
import ThesisGrid from "./pages/thesis/ThesisGrid";
import ThesisDetail from "./pages/thesis/ThesisDetail";

import ProjectGrid from "./pages/projects/ProjectGrid";
import ProjectDetail from "./pages/Projects/ProjectDetail";
import Contact from "./pages/Contact";
import GlobalStyle from "./fixedComponent/GlobalStyle";
import About from "./pages/About";

import { AdminAuthProvider } from "./admin/AdminAuthContext";
import { RequireAdmin } from "./admin/AdminRouteGuards";
import AdminLayout from "./admin/AdminLayout";
import AdminLogin from "./admin/pages/AdminLogin";
import AdminProjects from "./admin/pages/Projects";
import AdminUsers from "./admin/pages/Users";

const StyledResult = styled(Result)`
  .ant-result-title {
    color: black !important;
  }
  .ant-result-subtitle {
    color: black !important;
  }
`;

// Component for handling invalid paths
const InvalidPath = () => {
  const navigate = useNavigate();

  const handleBackHome = () => {
    navigate("/");
  };

  return (
    <StyledResult
      status="404"
      title="404 Not Found"
      subTitle="Oops! The page you are looking for does not exist."
      extra={
        <Button
          type="primary"
          onClick={handleBackHome}
          style={{ background: "black" }}
        >
          Back Home
        </Button>
      }
    />
  );
};

//routes
const routes = [
  {
    element: (
      <>
        <Layout />
      </>
    ),
    children: [
      { index: true, path: "/", element: <Home /> },
      { path: "/contact", element: <Contact /> },
      { path: "/about", element: <About /> },
      { path: "/projects", element: <ProjectGrid /> },
      { path: "/projects/:projectId", element: <ProjectDetail /> },
      { path: "/theses", element: <ThesisGrid /> },
      { path: "/thesis/:thesisId", element: <ThesisDetail /> },
      { path: "*", element: <InvalidPath /> },
    ],
  },

  {
    path: "/admin/login",
    element: <AdminLogin />,
  },

  {
    path: "/admin",
    element: <RequireAdmin />, // if authed -> Outlet, else redirect to /admin/login
    children: [
      {
        element: <AdminLayout />, // sidebar + topbar layout
        children: [
          // /admin -> redirect to /admin/projects
          { index: true, element: <Navigate to="/admin/projects" replace /> },

          // /admin/projects
          { path: "projects", element: <AdminProjects /> },

          // /admin/users
          { path: "users", element: <AdminUsers /> },
        ],
      },
    ],
  },

];

const router = createBrowserRouter(routes);

const App = () => (
  <>
    {/* <PageUnderConstruction /> */}
    <GlobalStyle />

    <AdminAuthProvider>
      <RouterProvider router={router} />
    </AdminAuthProvider>

    {/* <RouterProvider router={router} /> */}
  </>
);

export default App;
