import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ProjectProvider } from "./context/ProjectContext.jsx";
import { ThesesProvider } from "./context/ThesesContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ProjectProvider>
      <ThesesProvider>
        <App />
      </ThesesProvider>
    </ProjectProvider>
  </StrictMode>,
);
