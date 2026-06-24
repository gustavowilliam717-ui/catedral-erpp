import { useState } from "react";
import { erpModules } from "../modules/erpModules";

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
          <span className="rocket-logo" aria-hidden="true">
            <span className="rocket-trail" />
            <span className="rocket-flame" />
            <span className="rocket-ship">
              <span className="rocket-window" />
            </span>
          </span>
          <strong>Catedral ERP</strong>
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
                            {column.marketplaces.map((marketplace) => (
                              <div
                                className="marketplace-ad-row"
                                key={marketplace.key}
                              >
                                <strong className={`marketplace-brand ${marketplace.key}`}>
                                  {marketplace.label}
                                </strong>
                                <div>
                                  {marketplace.actions.map((action) => (
                                    <button
                                      type="button"
                                      key={action.page}
                                      className={
                                        page === action.page ? "selected" : ""
                                      }
                                      onClick={() => setPage(action.page)}
                                    >
                                      {action.label}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {column.unauthorized && (
                          <div className="not-authorized-block">
                            <strong>Nao Autorizado</strong>
                            <div>
                              {column.unauthorized.map((marketplace) => (
                                <span key={marketplace}>{marketplace}</span>
                              ))}
                            </div>
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
          <button type="button" title="Ajuda">
            ?
          </button>
          <button type="button" title="Alertas">
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
                  <span>Catedral ERP Pro</span>
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
