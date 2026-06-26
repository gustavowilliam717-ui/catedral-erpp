import { useEffect, useState } from "react";
import { erpModules } from "../modules/erpModules";
import API from "../services/api";

const appShortcuts = [
  { page: "plans", label: "Planos", icon: "P" },
  { page: "app-download", label: "Baixe APP", icon: "A" },
  { page: "product-importer", label: "Importacao de Produto", icon: "I" },
  { page: "chat", label: "Chatbot de IA", icon: "AI" },
  { page: "data-space", label: "Espaco de Dados", icon: "IMG" },
];

const accountMenuItems = [
  { page: "account-profile", label: "Perfil", icon: "U" },
  { page: "account-language", label: "Idioma", icon: "BR" },
  { page: "account-security", label: "Seguranca", icon: "S" },
  { page: "account-subscription", label: "Faturas", icon: "F" },
  { page: "plans", label: "Planos", icon: "P" },
  { page: "settings-activity-log", label: "Registros de Atividades", icon: "R" },
  { page: "account-help", label: "Central de Ajuda", icon: "?" },
];

export default function Sidebar({ page, setPage, user, onLogout }) {
  const [appsOpen, setAppsOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [liveMarketplaces, setLiveMarketplaces] = useState([]);

  useEffect(() => {
    let active = true;

    API.get("/integrations/marketplaces")
      .then((response) => {
        if (active) {
          setLiveMarketplaces(response.data?.connected || []);
        }
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, []);

  function getFirstPage(module) {
    const firstColumn = module.columns?.[0];
    return (
      module.page ||
      firstColumn?.items?.[0]?.page ||
      firstColumn?.marketplaces?.[0]?.actions?.[0]?.page ||
      "dashboard"
    );
  }

  function openModule(module) {
    setPage(getFirstPage(module));
  }

  function moduleHasPage(module, currentPage) {
    if (module.key === "purchases") {
      if (
        currentPage.startsWith("purchase-") ||
        currentPage === "suppliers" ||
        currentPage === "supplier-relations"
      ) {
        return true;
      }
    }

    return module.columns?.some((column) => columnHasPage(column, currentPage)) ?? false;
  }

  function columnHasPage(column, currentPage = page) {
    const itemMatch = column.items?.some((item) => item.page === currentPage);
    const marketplaceMatch = column.marketplaces?.some((marketplace) =>
      marketplace.actions.some((action) => action.page === currentPage)
    );
    return Boolean(itemMatch || marketplaceMatch);
  }

  function openShortcut(shortcutPage) {
    setPage(shortcutPage);
    setAppsOpen(false);
  }

  function openAccountPage(accountPage) {
    setPage(accountPage);
    setAccountOpen(false);
    setAppsOpen(false);
  }

  return (
    <header className="app-header">
      <div className="app-shell">
        <button
          type="button"
          className="app-logo"
          onClick={() => setPage("dashboard")}
        >
          <img className="brand-mark" src="/catedral-erp-logo.png" alt="" />
          <strong>NEXT ERP</strong>
        </button>

        <nav className="main-nav" aria-label="Navegacao principal">
          {erpModules.map((module) => {
            const isActive =
              page === module.page || moduleHasPage(module, page);

            return (
              <div className="nav-module" key={module.key}>
                <button
                  type="button"
                  className={isActive ? "active" : ""}
                  onClick={() => openModule(module)}
                >
                  {module.label}
                </button>

                {module.columns && (
                  <div className={`mega-menu ${module.menuVariant || ""}`}>
                    {module.columns.map((column) => (
                      <div className="mega-column" key={column.title}>
                        <h3>{column.title}</h3>

                        {column.items?.map((item) => (
                          <button
                            type="button"
                            key={item.page}
                            className={page === item.page ? "selected" : ""}
                            onClick={() => setPage(item.page)}
                          >
                            {item.label}
                            {(item.badge || item.active) && (
                              <span>{item.badge || "Ativo"}</span>
                            )}
                          </button>
                        ))}

                        {column.marketplaces && (
                          <div className="marketplace-ad-list">
                            {liveMarketplaces.length === 0 ? (
                              <button
                                type="button"
                                className="marketplace-connect-hint"
                                onClick={() =>
                                  setPage("mercado-livre-integration")
                                }
                              >
                                Conecte um marketplace para ver os anuncios
                                ativos e pausados aqui.
                              </button>
                            ) : (
                              liveMarketplaces.map((marketplace) => (
                                <div
                                  className="marketplace-ad-row"
                                  key={marketplace.key}
                                >
                                  <button
                                    type="button"
                                    className={`marketplace-brand ${marketplace.key}`}
                                    onClick={() =>
                                      setPage(
                                        marketplace.products_page || "products"
                                      )
                                    }
                                  >
                                    {marketplace.label}
                                    {marketplace.nickname
                                      ? ` @${marketplace.nickname}`
                                      : ""}
                                  </button>
                                  <div className="marketplace-ad-counts">
                                    <span className="ads-active">
                                      Ativos: {marketplace.active_ads || 0}
                                    </span>
                                    <span className="ads-paused">
                                      Pausados: {marketplace.paused_ads || 0}
                                    </span>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="header-actions">
          <div className="apps-menu-wrap">
            <button
              type="button"
              title="Aplicativos"
              onClick={() => {
                setAppsOpen((current) => !current);
                setAccountOpen(false);
              }}
            >
              ::
            </button>

            {appsOpen && (
              <div className="apps-popover">
                {appShortcuts.map((shortcut) => (
                  <button
                    type="button"
                    key={shortcut.page}
                    className={page === shortcut.page ? "active" : ""}
                    onClick={() => openShortcut(shortcut.page)}
                  >
                    <span>{shortcut.icon}</span>
                    <strong>{shortcut.label}</strong>
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            type="button"
            title="Ajuda"
            onClick={() => setPage("account-help")}
          >
            ?
          </button>
          <button
            type="button"
            title="Alertas"
            onClick={() => setPage("stock-low")}
          >
            !
          </button>
          <div className="account-menu-wrap">
            <button
              type="button"
              className="account-button"
              onClick={() => {
                setAccountOpen((current) => !current);
                setAppsOpen(false);
              }}
            >
              {user?.name || "Perfil"}
            </button>

            {accountOpen && (
              <div className="account-popover">
                <div className="account-plan-card">
                  <span>NEXT ERP Pro</span>
                  <strong>12/07/2026</strong>
                  <button
                    type="button"
                    onClick={() => openAccountPage("plans")}
                  >
                    R$ 389,00
                  </button>
                </div>

                {accountMenuItems.map((item) => (
                  <button
                    type="button"
                    key={item.page}
                    className={page === item.page ? "active" : ""}
                    onClick={() => openAccountPage(item.page)}
                  >
                    <span>{item.icon}</span>
                    {item.label}
                  </button>
                ))}

                <button type="button" className="logout-row" onClick={onLogout}>
                  <span>X</span>
                  Sair
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
