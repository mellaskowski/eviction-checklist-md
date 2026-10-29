import React from "react";
import { createRoot } from "react-dom/client";
import "@fontsource/inter/400.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import ScreenerApp from "./components/ScreenerApp.jsx";
import "./styles/tokens.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ScreenerApp />
  </React.StrictMode>
);
