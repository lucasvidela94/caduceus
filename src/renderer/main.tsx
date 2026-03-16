import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app";
import "./styles/global.css";
import { getRxDatabase } from "@/database/database";

getRxDatabase().catch((err) => console.error("RxDB init failed:", err));

const container = document.getElementById("root");

if (container === null) {
  throw new Error("Root element not found");
}

const root = createRoot(container);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
