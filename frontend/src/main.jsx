import React, { Suspense, lazy, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

import Login from "./pages/Login";
import API from "./services/api";
import { logError } from "./utils/logger";

import "./style.css";

const AccountSettings = lazy(() => import("./pages/AccountSettings"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Products = lazy(() => import("./pages/Products"));
const Finance = lazy(() => import("./pages/Finance"));
const FiscalSettings = lazy(() => import("./pages/FiscalSettings"));
const Pricing = lazy(() => import("./pages/Pricing"));
const Stock = lazy(() => import("./pages/Stock"));
const AdvancedSettings = lazy(() => import("./pages/AdvancedSettings"));
const Chat = lazy(() => import("./pages/Chat"));
const AppDownload = lazy(() => import("./pages/AppDownload"));
const DataSpace = lazy(() => import("./pages/DataSpace"));
const ImportShopee = lazy(() => import("./pages/ImportShopee"));
const MarketplaceConnect = lazy(() => import("./pages/MarketplaceConnect"));
const MarketplaceFees = lazy(() => import("./pages/MarketplaceFees"));
const MercadoLivreIntegration = lazy(() => import("./pages/MercadoLivreIntegration"));
const ModulePlaceholder = lazy(() => import("./pages/ModulePlaceholder"));
const OrderSettings = lazy(() => import("./pages/OrderSettings"));
const Orders = lazy(() => import("./pages/Orders"));
const Plans = lazy(() => import("./pages/Plans"));
const PricingHistory = lazy(() => import("./pages/PricingHistory"));
const PricingRules = lazy(() => import("./pages/PricingRules"));
const ProductCategories = lazy(() => import("./pages/ProductCategories"));
const ProductImporter = lazy(() => import("./pages/ProductImporter"));
const ProductMapping = lazy(() => import("./pages/ProductMapping"));
const SacReviews = lazy(() => import("./pages/SacReviews"));
const Purchases = lazy(() => import("./pages/Purchases"));
const ShippingSettings = lazy(() => import("./pages/ShippingSettings"));
const ShopeeIntegration = lazy(() => import("./pages/ShopeeIntegration"));
const StoreIntegrations = lazy(() => import("./pages/StoreIntegrations"));

function PageLoader() {
  return (
    <div className="page-loading" role="status" aria-live="polite">
      <span />
      <strong>Carregando modulo...</strong>
    </div>
  );
}

function resolveInitialPage() {
  const params = new URLSearchParams(window.location.search);

  if (params.has("shopee_status")) return "store-integrations";
  if (params.has("ml_status")) return "mercado-livre-integration";

  return params.get("page") || "dashboard";
}

function App() {
  const [page, setPage] = useState(resolveInitialPage);
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
    "mercado-livre-integration",
    "amazon-integration",
    "shein-integration",
    "tiktok-integration",
    "temu-integration",
    "stock-temu",
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
    "stock-temu",
    "stock-reposition-rules",
  ];
  const marketplaceConnectPages = {
    "amazon-integration": { provider: "amazon", label: "Amazon" },
    "shein-integration": { provider: "shein", label: "Shein" },
    "tiktok-integration": { provider: "tiktok", label: "TikTok Shop" },
    "temu-integration": { provider: "temu", label: "Temu" },
  };

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

        <Suspense fallback={<PageLoader />}>
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
          {page === "product-importer" && <ProductImporter setPage={setPage} />}
          {page === "data-space" && <DataSpace />}
          {page === "importShopee" && <ImportShopee />}
          {page === "store-integrations" && <StoreIntegrations />}
          {page === "shopee-api" && <ShopeeIntegration />}
          {page === "mercado-livre-integration" && <MercadoLivreIntegration />}
          {marketplaceConnectPages[page] && (
            <MarketplaceConnect
              provider={marketplaceConnectPages[page].provider}
              label={marketplaceConnectPages[page].label}
              page={page}
            />
          )}
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
          {page === "settings-nfe" && <FiscalSettings />}
          {page.startsWith("settings-") &&
            page !== "settings-nfe" &&
            !shippingSettingsPages.includes(page) &&
            !advancedSettingsPages.includes(page) && (
            <OrderSettings activePage={page} setPage={setPage} />
          )}
          {!knownPages.includes(page) && <ModulePlaceholder page={page} />}
        </Suspense>
      </main>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
