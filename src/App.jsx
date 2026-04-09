import React from "react";

import styled, { createGlobalStyle } from "styled-components";
import {
  createBrowserRouter,
  RouterProvider,
  useNavigate,
  Navigate,
} from "react-router-dom";

import { Result, Button, App as AntApp } from "antd";
import Layout from "./fixedComponent/Layout";
import Home from "./pages/Home";
import ThesesGrid from "./pages/theses/ThesesGrid";
import ThesisDetail from "./pages/theses/ThesisDetail";

import ProjectGrid from "./pages/projects/ProjectGrid";

import Contact from "./pages/Contact";
import GlobalStyle from "./fixedComponent/GlobalStyle";
import About from "./pages/About";
import ProjectDetail from "./pages/projects/ProjectDetail";
import Policy from "./pages/footerPages/Policy";
import Accessibility from "./pages/footerPages/Accessibility";
import TermsofUse from "./pages/footerPages/TermsofUse";

import { AdminAuthProvider } from "./admin/AdminAuthContext";
import { RequireAdmin } from "./admin/AdminRouteGuards";
import AdminLayout from "./admin/AdminLayout";
import AdminLogin from "./admin/pages/AdminLogin";
import AdminProjects from "./admin/pages/Projects";
import AdminUsers from "./admin/pages/Users";

import AddProject from "./admin/pages/AddProject";
import AdminEntryView from "./admin/pages/AdminEntryView";
import AdminEntryEdit from "./admin/pages/AdminEntryEdit";
import AdminEntryCreate from "./admin/pages/AdminEntryCreate";
import EditSupervisors from "./admin/pages/EditSupervisors";

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
      { path: "/theses", element: <ThesesGrid /> },
      { path: "/theses/:thesisId", element: <ThesisDetail /> },
      { path: "/policy", element: <Policy /> },
      { path: "/accessibility", element: <Accessibility /> },
      { path: "/termsofuse", element: <TermsofUse /> },
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
          { path: "editsupervisors", element: <EditSupervisors /> },
          { path: "projects/new", element: <AddProject /> },

          { path: "entries/:kind/:id", element: <AdminEntryView /> },
          { path: "entries/:kind/:id/edit", element: <AdminEntryEdit /> },
          { path: "create/:kind", element: <AdminEntryCreate /> },

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
    <GlobalStyle />

    <AntApp>
      <AdminAuthProvider>
        <RouterProvider router={router} />
      </AdminAuthProvider>
    </AntApp>

    {/* <RouterProvider router={router} /> */}
  </>
);

export default App;
