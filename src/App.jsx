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
import ThesisGrid from "./pages/thesis/ThesisGrid";
import ThesisDetail from "./pages/thesis/ThesisDetail";

import ProjectGrid from "./pages/projects/ProjectGrid";
import ProjectDetail from "./pages/Projects/ProjectDetail";
import Contact from "./pages/Contact";
import GlobalStyle from "./fixedComponent/GlobalStyle";
import About from "./pages/About";

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
