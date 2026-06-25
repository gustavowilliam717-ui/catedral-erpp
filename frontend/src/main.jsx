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
import MarketplaceFees from "./pages/MarketplaceFees";
import ModulePlaceholder from "./pages/ModulePlaceholder";
import OrderSettings from "./pages/OrderSettings";
import Orders from "./pages/Orders";
import Plans from "./pages/Plans";
import PricingHistory from "./pages/PricingHistory";
import PricingRules from "./pages/PricingRules";
import ProductCategories from "./pages/ProductCategories";
import ProductImporter from "./pages/ProductImporter";
import ProductMapping from "./pages/ProductMapping";
import SacReviews from "./pages/SacReviews";
import Purchases from "./pages/Purchases";
import ShippingSettings from "./pages/ShippingSettings";
import ShopeeIntegration from "./pages/ShopeeIntegration";
import StoreIntegrations from "./pages/StoreIntegrations";
import API from "./services/api";
import { logError } from "./utils/logger";

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
    "product-mapping",
    "product-categories",
    "finance",
    "cash-flow",
    "accounts-payable",
    "accounts-receivable",
    "profit-report",
    "invoice-report",
    "ncm-sales-report",
    "ncm-purchase-report",
    "ncm-stock-report",
    "taxes",
    "pricing",
    "pricing-history-view",
    "marketplace-fees",
    "pricing-rules",
    "purchase-suggestions",
    "purchase-orders",
    "purchase-orders-to-purchase",
    "purchase-orders-in-transit",
    "purchase-orders-partial",
    "purchase-orders-completed",
    "purchase-orders-canceled",
    "purchase-nfe-brasil",
    "suppliers",
    "supplier-relations",
    "stock",
    "marketplace-stock",
    "stock-low",
    "stock-report",
    "stock-shopee",
    "stock-mercado-livre",
    "stock-shein",
    "stock-tiktok",
    "stock-amazon",
    "stock-reposition-rules",
    "chat",
    "plans",
    "app-download",
    "product-importer",
    "data-space",
    "importShopee",
    "orders",
    "orders-to-invoice",
    "orders-to-ship",
    "orders-to-print",
    "orders-pickup",
    "orders-shipped",
    "orders-history",
    "orders-canceled",
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
  const purchasePages = [
    "purchase-suggestions",
    "purchase-orders",
    "purchase-orders-to-purchase",
    "purchase-orders-in-transit",
    "purchase-orders-partial",
    "purchase-orders-completed",
    "purchase-orders-canceled",
    "purchase-nfe-brasil",
    "suppliers",
    "supplier-relations",
  ];
  const orderPages = [
    "orders",
    "orders-to-invoice",
    "orders-to-ship",
    "orders-to-print",
    "orders-pickup",
    "orders-shipped",
    "orders-history",
    "orders-canceled",
  ];
  const financePages = [
    "finance",
    "cash-flow",
    "accounts-payable",
    "accounts-receivable",
    "profit-report",
    "invoice-report",
    "ncm-sales-report",
    "ncm-purchase-report",
    "ncm-stock-report",
    "taxes",
  ];
  const stockPages = [
    "stock",
    "marketplace-stock",
    "stock-low",
    "stock-report",
    "stock-shopee",
    "stock-mercado-livre",
    "stock-shein",
    "stock-tiktok",
    "stock-amazon",
    "stock-reposition-rules",
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
        logError(error);
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
      logError(error);
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
        {page === "product-mapping" && <ProductMapping setPage={setPage} />}
        {page === "product-categories" && (
          <ProductCategories setPage={setPage} />
        )}
        {financePages.includes(page) && (
          <Finance activePage={page} setPage={setPage} />
        )}
        {purchasePages.includes(page) && (
          <Purchases activePage={page} setPage={setPage} />
        )}
        {orderPages.includes(page) && (
          <Orders activePage={page} setPage={setPage} />
        )}
        {page === "pricing" && (
          <Pricing
            initialProductId={pricingProductId}
            clearInitialProductId={() => setPricingProductId("")}
          />
        )}
        {page === "pricing-history-view" && <PricingHistory />}
        {page === "marketplace-fees" && <MarketplaceFees />}
        {page === "pricing-rules" && <PricingRules setPage={setPage} />}
        {stockPages.includes(page) && (
          <Stock activePage={page} setPage={setPage} />
        )}
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
