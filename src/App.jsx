import React from "react";

import styled, { createGlobalStyle } from "styled-components";
import {
  createBrowserRouter,
  RouterProvider,
  useNavigate,
} from "react-router-dom";

import { Result, Button } from "antd";
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
];

const router = createBrowserRouter(routes);

const App = () => (
  <>
    {/* <PageUnderConstruction /> */}
    <GlobalStyle />

    <RouterProvider router={router} />
  </>
);

export default App;
