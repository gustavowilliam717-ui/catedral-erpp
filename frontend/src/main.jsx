import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

import AccountSettings from "./pages/AccountSettings";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Finance from "./pages/Finance";
import Pricing from "./pages/Pricing";
import Stock from "./pages/Stock";
import AdvancedSettings from "./pages/AdvancedSettings";
import Chat from "./pages/Chat";
import AppDownload from "./pages/AppDownload";
import DataSpace from "./pages/DataSpace";
import ImportShopee from "./pages/ImportShopee";
import Login from "./pages/Login";
import ModulePlaceholder from "./pages/ModulePlaceholder";
import OrderSettings from "./pages/OrderSettings";
import Plans from "./pages/Plans";
import ProductImporter from "./pages/ProductImporter";
import SacReviews from "./pages/SacReviews";
import ShippingSettings from "./pages/ShippingSettings";
import ShopeeIntegration from "./pages/ShopeeIntegration";
import StoreIntegrations from "./pages/StoreIntegrations";
import API from "./services/api";

import "./style.css";

function App() {
  const [page, setPage] = useState("dashboard");
  const [pricingProductId, setPricingProductId] = useState("");
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("catedral_user");
    return stored ? JSON.parse(stored) : null;
  });
  const [checkingSession, setCheckingSession] = useState(
    Boolean(localStorage.getItem("catedral_token"))
  );
  const knownPages = [
    "dashboard",
    "products",
    "finance",
    "pricing",
    "stock",
    "chat",
    "plans",
    "app-download",
    "product-importer",
    "data-space",
    "importShopee",
    "store-integrations",
    "shopee-api",
    "settings-orders",
    "settings-nfe",
    "settings-dce",
    "settings-auto-program",
    "settings-allocation",
    "settings-shopee-labels",
    "settings-shein-labels",
    "settings-tiktok-labels",
    "settings-3pl",
    "settings-print-model",
    "settings-sku-label",
    "settings-shelf-label",
    "settings-stock",
    "settings-finance",
    "settings-permissions",
    "settings-accountant",
    "settings-activity-log",
    "sac-reviews",
    "sac-review-auto",
    "sac-review-template",
    "sac-returns",
    "account-profile",
    "account-language",
    "account-security",
    "account-subscription",
    "account-services",
    "account-rewards",
    "account-transactions",
    "account-help",
  ];
  const shippingSettingsPages = [
    "settings-shopee-labels",
    "settings-shein-labels",
    "settings-tiktok-labels",
    "settings-3pl",
  ];
  const advancedSettingsPages = [
    "settings-allocation",
    "settings-print-model",
    "settings-sku-label",
    "settings-shelf-label",
    "settings-dce",
    "settings-stock",
    "settings-finance",
    "settings-permissions",
    "settings-accountant",
    "settings-activity-log",
  ];
  const sacPages = [
    "sac-reviews",
    "sac-review-auto",
    "sac-review-template",
    "sac-returns",
  ];
  const accountPages = [
    "account-profile",
    "account-language",
    "account-security",
    "account-subscription",
    "account-services",
    "account-rewards",
    "account-transactions",
    "account-help",
  ];

  useEffect(() => {
    async function validateSession() {
      const token = localStorage.getItem("catedral_token");

      if (!token) {
        setCheckingSession(false);
        return;
      }

      try {
        const response = await API.get("/auth/me");
        localStorage.setItem("catedral_user", JSON.stringify(response.data));
        setUser(response.data);
      } catch (error) {
        console.log(error);
        localStorage.removeItem("catedral_token");
        localStorage.removeItem("catedral_user");
        setUser(null);
      } finally {
        setCheckingSession(false);
      }
    }

    validateSession();

    function handleLogoutEvent() {
      setUser(null);
    }

    window.addEventListener("catedral:logout", handleLogoutEvent);
    return () => window.removeEventListener("catedral:logout", handleLogoutEvent);
  }, []);

  async function logout() {
    try {
      await API.post("/auth/logout");
    } catch (error) {
      console.log(error);
    } finally {
      localStorage.removeItem("catedral_token");
      localStorage.removeItem("catedral_user");
      setUser(null);
      setPage("dashboard");
    }
  }

  if (checkingSession) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <strong>Validando sessao...</strong>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login onAuthenticated={setUser} />;
  }

  return (
    <div className="layout">
      <Sidebar page={page} setPage={setPage} user={user} onLogout={logout} />

      <main className="content">
        <Topbar page={page} />

        {page === "dashboard" && <Dashboard />}
        {page === "products" && (
          <Products
            setPage={setPage}
            setPricingProductId={setPricingProductId}
          />
        )}
        {page === "finance" && <Finance />}
        {page === "pricing" && (
          <Pricing
            initialProductId={pricingProductId}
            clearInitialProductId={() => setPricingProductId("")}
          />
        )}
        {page === "stock" && <Stock />}
        {page === "chat" && <Chat />}
        {page === "plans" && <Plans />}
        {page === "app-download" && <AppDownload />}
        {page === "product-importer" && <ProductImporter />}
        {page === "data-space" && <DataSpace />}
        {page === "importShopee" && <ImportShopee />}
        {page === "store-integrations" && <StoreIntegrations />}
        {page === "shopee-api" && <ShopeeIntegration />}
        {accountPages.includes(page) && (
          <AccountSettings activePage={page} setPage={setPage} user={user} />
        )}
        {sacPages.includes(page) && (
          <SacReviews activePage={page} setPage={setPage} />
        )}
        {shippingSettingsPages.includes(page) && (
          <ShippingSettings activePage={page} setPage={setPage} />
        )}
        {advancedSettingsPages.includes(page) && (
          <AdvancedSettings activePage={page} setPage={setPage} />
        )}
        {page.startsWith("settings-") &&
          !shippingSettingsPages.includes(page) &&
          !advancedSettingsPages.includes(page) && (
          <OrderSettings activePage={page} setPage={setPage} />
        )}
        {!knownPages.includes(page) && <ModulePlaceholder page={page} />}
      </main>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
