import React, { useState } from "react";
import { createRoot } from "react-dom/client";

import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Finance from "./pages/Finance";
import Pricing from "./pages/Pricing";
import Stock from "./pages/Stock"; // ← ADICIONE ESTA LINHA

import "./style.css";

function App() {
  const [page, setPage] = useState("dashboard");

  return (
    <div className="layout">
      <Sidebar setPage={setPage} />

      <main className="content">
        <Topbar />

        {page === "dashboard" && <Dashboard />}
        {page === "products" && <Products />}
        {page === "finance" && <Finance />}
        {page === "pricing" && <Pricing />}
        {page === "stock" && <Stock />} {/* ← ADICIONE ESTA LINHA */}
      </main>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
