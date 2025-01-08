import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./styles/base.css";
import "./styles/grid-layout.css";
import "./styles/dashboard.css";
import "./styles/edit-mode-toggle.css";
import "./styles/chart-library.css";
import "./styles/pointing-arrow.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
