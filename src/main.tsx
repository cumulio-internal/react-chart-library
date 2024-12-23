import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./app.tsx";
import "./styles/base.css";
import "./styles/grid-layout.css";
import "./styles/dashboard.css";
import "./styles/edit-mode-toggle.css";
import "./styles/chart-library.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
