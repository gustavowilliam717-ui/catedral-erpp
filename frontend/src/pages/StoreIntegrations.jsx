import { useEffect, useMemo, useState } from "react";
import API from "../services/api";
import { logError } from "../utils/logger";

const marketplaces = [
  "Mercado Livre",
  "Shopee",
  "Amazon",
  "Shein",
  "TikTok Shop",
  "Temu",
];

const emptyForm = {
  marketplace: "Shopee",
  store_name: "",
  country: "BR",
  shop_id: "",
  status: "Pendente",
  auth_date: "",
  notes: "",
};

const shopeeApiDefaults = {
  authUrl: "https://partner.shopeemobile.com/api/v2/shop/auth_partner",
  tokenUrl: "https://partner.shopeemobile.com/api/v2/auth/token/get",
  refreshUrl: "https://partner.shopeemobile.com/api/v2/auth/access_token/get",
  shopInfoUrl: "https://partner.shopeemobile.com/api/v2/shop/get_shop_info",
  apiBase: "https://partner.shopeemobile.com",
};

function getBackendCallbackUrl() {
  const baseUrl = (API.defaults.baseURL || "http://127.0.0.1:8000").replace(/\/+$/, "");
  return `${baseUrl}/shopee/callback`;
}

function getFrontendReturnUrl() {
  return `${window.location.origin}${window.location.pathname}?page=store-integrations`;
}

function createShopeeDraft() {
  return {
    partnerId: "",
    partnerKey: "",
    shopId: "",
    shopName: "",
    environment: "production",
    redirectUrl: getBackendCallbackUrl(),
    frontendReturnUrl: getFrontendReturnUrl(),
    authUrl: shopeeApiDefaults.authUrl,
    tokenUrl: shopeeApiDefaults.tokenUrl,
    refreshUrl: shopeeApiDefaults.refreshUrl,
    shopInfoUrl: shopeeApiDefaults.shopInfoUrl,
    apiBase: shopeeApiDefaults.apiBase,
  };
}

function mapShopeeStatusToDraft(status = {}) {
  return {
    partnerId: status.partner_id || "",
    shopId: status.shop_id || "",
    shopName: status.shop_name || "",
    environment: status.environment || "production",
    redirectUrl: status.redirect_url || getBackendCallbackUrl(),
    frontendReturnUrl: status.frontend_return_url || getFrontendReturnUrl(),
    authUrl: status.auth_url || shopeeApiDefaults.authUrl,
    tokenUrl: status.token_url || shopeeApiDefaults.tokenUrl,
    refreshUrl: status.refresh_url || shopeeApiDefaults.refreshUrl,
    shopInfoUrl: status.shop_info_url || shopeeApiDefaults.shopInfoUrl,
    apiBase: status.api_base || shopeeApiDefaults.apiBase,
  };
}

function readShopeeReturnStatus() {
  const params = new URLSearchParams(window.location.search);
  const status = params.get("shopee_status");

  if (!status) return "";

  params.delete("shopee_status");
  params.set("page", "store-integrations");
  const query = params.toString();
  const newUrl =
    window.location.pathname + (query ? `?${query}` : "") + window.location.hash;
  window.history.replaceState({}, "", newUrl);

  return status;
}

function getShopeePopupFeatures() {
  const width = 1060;
  const height = 820;
  const left = Math.max(0, Math.round((window.screen.width - width) / 2));
  const top = Math.max(0, Math.round((window.screen.height - height) / 2));

  return [
    "popup=yes",
    `width=${width}`,
    `height=${height}`,
    `left=${left}`,
    `top=${top}`,
    "menubar=no",
    "toolbar=no",
    "location=yes",
    "status=no",
    "resizable=yes",
    "scrollbars=yes",
  ].join(",");
}

function openShopeePopup(url = "") {
  const popup = window.open(url || "about:blank", "next_erp_shopee_login", getShopeePopupFeatures());

  if (popup) {
    popup.focus();
  }

  return popup;
}

export default function StoreIntegrations() {
  const [integrations, setIntegrations] = useState([]);
  const [selectedMarketplace, setSelectedMarketplace] = useState("Shopee");
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");
  const [shopeeStatus, setShopeeStatus] = useState(null);
  const [shopeeDraft, setShopeeDraft] = useState(createShopeeDraft);
  const [showShopeeConfig, setShowShopeeConfig] = useState(false);
  const [authUrl, setAuthUrl] = useState("");
  const [isSavingShopee, setIsSavingShopee] = useState(false);
  const [isConnectingShopee, setIsConnectingShopee] = useState(false);
  const [isTestingShopee, setIsTestingShopee] = useState(false);
  const [isDisconnectingShopee, setIsDisconnectingShopee] = useState(false);

  useEffect(() => {
    const returnStatus = readShopeeReturnStatus();

    if (returnStatus === "conectado") {
      setSelectedMarketplace("Shopee");
      setMessage("Loja Shopee conectada.");
    } else if (returnStatus.startsWith("erro:")) {
      setSelectedMarketplace("Shopee");
      setMessage(`Falha ao conectar Shopee: ${returnStatus.slice(5)}`);
    }

    loadIntegrations();
    loadShopeeStatus();
  }, []);

  useEffect(() => {
    if (!authUrl) return undefined;

    const interval = window.setInterval(async () => {
      const status = await loadShopeeStatus({ silent: true });

      if (status?.connected) {
        setAuthUrl("");
        setMessage("Loja Shopee conectada.");
        loadIntegrations();
      }
    }, 3000);

    return () => window.clearInterval(interval);
  }, [authUrl]);

  async function loadIntegrations() {
    try {
      const response = await API.get("/store-integrations");
      setIntegrations(response.data || []);
    } catch (error) {
      logError(error);
      setMessage("Nao foi possivel carregar as lojas conectadas.");
    }
  }

  async function loadShopeeStatus(options = {}) {
    const { silent = false } = options;

    try {
      const response = await API.get("/integrations/shopee/status");
      const data = response.data || {};
      setShopeeStatus(data);
      setShopeeDraft((current) => ({
        ...current,
        ...mapShopeeStatusToDraft(data),
        partnerKey: current.partnerKey,
      }));
      return data;
    } catch (error) {
      logError(error);

      if (!silent) {
        setMessage("Nao foi possivel carregar a conexao da Shopee.");
      }

      return null;
    }
  }

  function update(field, value) {
    setForm({ ...form, [field]: value });
  }

  function updateShopee(field, value) {
    setShopeeDraft((current) => ({ ...current, [field]: value }));
  }

  async function saveIntegration(event) {
    event.preventDefault();

    if (!form.store_name.trim()) {
      setMessage("Informe o nome da loja.");
      return;
    }

    try {
      if (editingId) {
        await API.put(`/store-integrations/${editingId}`, form);
        setMessage("Loja atualizada.");
      } else {
        await API.post("/store-integrations", form);
        setMessage("Loja adicionada.");
      }

      setForm({ ...emptyForm, marketplace: selectedMarketplace });
      setEditingId(null);
      setShowForm(false);
      loadIntegrations();
    } catch (error) {
      logError(error);
      setMessage("Nao foi possivel salvar a loja.");
    }
  }

  function editIntegration(integration) {
    setEditingId(integration.id);
    setForm({
      marketplace: integration.marketplace || "Shopee",
      store_name: integration.store_name || "",
      country: integration.country || "BR",
      shop_id: integration.shop_id || "",
      status: integration.status || "Pendente",
      auth_date: integration.auth_date || "",
      notes: integration.notes || "",
    });
    setShowForm(true);
  }

  async function deleteIntegration(id) {
    if (!window.confirm("Deseja remover esta loja integrada?")) return;

    try {
      await API.delete(`/store-integrations/${id}`);
      setMessage("Loja removida.");
      loadIntegrations();
    } catch (error) {
      logError(error);
      setMessage("Nao foi possivel remover a loja.");
    }
  }

  function startNewIntegration() {
    setEditingId(null);
    setForm({ ...emptyForm, marketplace: selectedMarketplace });
    setShowForm(true);
    setMessage("");
  }

  async function persistShopeeConfig(options = {}) {
    const { silent = false } = options;

    if (!silent) {
      setMessage("");
    }

    try {
      setIsSavingShopee(true);
      const response = await API.put("/integrations/shopee/config", {
        partner_id: shopeeDraft.partnerId,
        partner_key: shopeeDraft.partnerKey,
        shop_id: shopeeDraft.shopId,
        shop_name: shopeeDraft.shopName,
        environment: shopeeDraft.environment,
        redirect_url: shopeeDraft.redirectUrl || getBackendCallbackUrl(),
        frontend_return_url: getFrontendReturnUrl(),
        auth_url: shopeeDraft.authUrl,
        token_url: shopeeDraft.tokenUrl,
        refresh_url: shopeeDraft.refreshUrl,
        shop_info_url: shopeeDraft.shopInfoUrl,
        api_base: shopeeDraft.apiBase,
      });
      const data = response.data || {};
      setShopeeStatus(data);
      setShopeeDraft((current) => ({
        ...current,
        ...mapShopeeStatusToDraft(data),
        partnerKey: "",
      }));

      if (!silent) {
        setMessage("Credenciais da Shopee salvas.");
      }

      return data;
    } catch (error) {
      logError(error);

      if (!silent) {
        setMessage(error?.response?.data?.detail || "Nao foi possivel salvar a Shopee.");
      }

      throw error;
    } finally {
      setIsSavingShopee(false);
    }
  }

  async function connectShopee() {
    const hasPartnerId = shopeeDraft.partnerId || shopeeStatus?.partner_id_present;
    const hasPartnerKey = shopeeDraft.partnerKey || shopeeStatus?.partner_key_configured;

    if (!hasPartnerId || !hasPartnerKey) {
      setShowShopeeConfig(true);
      setMessage("Informe Partner ID e Partner Key antes de conectar a loja.");
      return;
    }

    const popup = openShopeePopup();

    try {
      setIsConnectingShopee(true);
      setMessage("");
      await persistShopeeConfig({ silent: true });
      const response = await API.get("/integrations/shopee/connect");
      const authorizationUrl = response.data.authorization_url;
      setAuthUrl(authorizationUrl);

      if (popup && !popup.closed) {
        popup.location.href = authorizationUrl;
        popup.focus();
        setMessage("Login da Shopee aberto em uma nova janela.");
      } else {
        setMessage("Clique em Abrir login da Shopee para continuar.");
      }
    } catch (error) {
      if (popup && !popup.closed) {
        popup.close();
      }

      logError(error);
      setMessage(error?.response?.data?.detail || "Nao foi possivel abrir a Shopee.");
    } finally {
      setIsConnectingShopee(false);
    }
  }

  async function testShopeeConnection() {
    try {
      setIsTestingShopee(true);
      setMessage("");
      const response = await API.get("/integrations/shopee/me");
      const shopName = response.data?.shop_name || response.data?.nickname || "Loja Shopee";
      const shopId = response.data?.shop_id || "-";
      setMessage(`Conexao ativa: ${shopName} (ID ${shopId}).`);
      await loadShopeeStatus();
      await loadIntegrations();
    } catch (error) {
      logError(error);
      setMessage(error?.response?.data?.detail || "Nao foi possivel validar a Shopee.");
    } finally {
      setIsTestingShopee(false);
    }
  }

  async function disconnectShopee() {
    if (!window.confirm("Deseja desconectar a conta da Shopee?")) return;

    try {
      setIsDisconnectingShopee(true);
      setMessage("");
      await API.post("/integrations/shopee/disconnect");
      setMessage("Conta Shopee desconectada.");
      await loadShopeeStatus();
      await loadIntegrations();
    } catch (error) {
      logError(error);
      setMessage(error?.response?.data?.detail || "Nao foi possivel desconectar a Shopee.");
    } finally {
      setIsDisconnectingShopee(false);
    }
  }

  const marketplaceCounts = useMemo(() => {
    return marketplaces.reduce((acc, marketplace) => {
      acc[marketplace] = integrations.filter(
        (item) => item.marketplace === marketplace
      ).length;
      return acc;
    }, {});
  }, [integrations]);

  const filteredIntegrations = integrations.filter((item) => {
    const term = search.toLowerCase();
    const marketplaceMatch =
      selectedMarketplace === "Todas" || item.marketplace === selectedMarketplace;
    const searchMatch =
      item.store_name?.toLowerCase().includes(term) ||
      item.shop_id?.toLowerCase().includes(term) ||
      item.status?.toLowerCase().includes(term);

    return marketplaceMatch && searchMatch;
  });

  const isShopeeSelected = selectedMarketplace === "Shopee";
  const shopeeConnected = Boolean(shopeeStatus?.connected);
  const shopeeConfigured = Boolean(shopeeStatus?.configured);
  const shopeeStatusLabel = shopeeConnected
    ? shopeeStatus?.token_expired
      ? "Token expirado"
      : "Conectada"
    : shopeeConfigured
      ? "Pronta para login"
      : "Credenciais pendentes";

  return (
    <div className="integrations-page">
      <aside className="integration-sidebar">
        <h2>Integracoes</h2>
        <button
          type="button"
          className={selectedMarketplace === "Todas" ? "active" : ""}
          onClick={() => setSelectedMarketplace("Todas")}
        >
          <span>Todas</span>
          <strong>{integrations.length}</strong>
        </button>

        {marketplaces.map((marketplace) => (
          <button
            type="button"
            key={marketplace}
            className={selectedMarketplace === marketplace ? "active" : ""}
            onClick={() => setSelectedMarketplace(marketplace)}
          >
            <span>{marketplace}</span>
            <strong>{marketplaceCounts[marketplace] || 0}</strong>
          </button>
        ))}
      </aside>

      <main className="integration-content">
        <section className="integration-header-card">
          <div>
            <span className="section-kicker">{selectedMarketplace}</span>
            <h1>Conectar lojas</h1>
            <p>
              Selecione o marketplace, entre com a conta oficial e confirme a
              autorizacao da loja.
            </p>
          </div>

          <button
            type="button"
            onClick={isShopeeSelected ? connectShopee : startNewIntegration}
            disabled={isShopeeSelected && isConnectingShopee}
          >
            {isShopeeSelected && isConnectingShopee ? "Abrindo..." : "+ Conectar loja"}
          </button>
        </section>

        <section className="integration-toolbar">
          <select
            value={selectedMarketplace}
            onChange={(event) => setSelectedMarketplace(event.target.value)}
          >
            <option>Todas</option>
            {marketplaces.map((marketplace) => (
              <option key={marketplace}>{marketplace}</option>
            ))}
          </select>

          <input
            placeholder="Nome da sua loja, Shop ID ou status"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </section>

        {isShopeeSelected && (
          <section className="box shopee-connect-panel">
            <div className="section-heading">
              <div>
                <span className="section-kicker">Shopee</span>
                <h2>Conta da loja</h2>
              </div>
              <span
                className={`integration-status ${
                  shopeeConnected ? "ativo" : shopeeConfigured ? "" : "erro"
                }`}
              >
                {shopeeStatusLabel}
              </span>
            </div>

            <div className="shopee-connect-summary">
              <div>
                <span>Loja</span>
                <strong>{shopeeStatus?.shop_name || shopeeDraft.shopName || "-"}</strong>
              </div>
              <div>
                <span>Shop ID</span>
                <strong>
                  {shopeeStatus?.external_user_id || shopeeStatus?.shop_id || shopeeDraft.shopId || "-"}
                </strong>
              </div>
              <div>
                <span>Ambiente</span>
                <strong>{shopeeStatus?.environment || shopeeDraft.environment}</strong>
              </div>
              <div>
                <span>Callback</span>
                <strong>{shopeeDraft.redirectUrl || getBackendCallbackUrl()}</strong>
              </div>
            </div>

            <div className="integration-actions">
              <button type="button" onClick={connectShopee} disabled={isConnectingShopee}>
                {isConnectingShopee ? "Abrindo Shopee..." : "Conectar com Shopee"}
              </button>
              <button
                type="button"
                onClick={testShopeeConnection}
                disabled={isTestingShopee || !shopeeConnected}
              >
                {isTestingShopee ? "Validando..." : "Validar conexao"}
              </button>
              {shopeeConnected && (
                <button
                  type="button"
                  className="secondary"
                  onClick={disconnectShopee}
                  disabled={isDisconnectingShopee}
                >
                  {isDisconnectingShopee ? "Desconectando..." : "Desconectar"}
                </button>
              )}
              <button
                type="button"
                className="secondary"
                onClick={() => setShowShopeeConfig((current) => !current)}
              >
                Credenciais
              </button>
            </div>

            {(showShopeeConfig || !shopeeConfigured) && (
              <form
                className="shopee-credential-grid"
                onSubmit={(event) => {
                  event.preventDefault();
                  persistShopeeConfig().catch(() => {});
                }}
              >
                <input
                  placeholder="Partner ID"
                  value={shopeeDraft.partnerId}
                  onChange={(event) => updateShopee("partnerId", event.target.value)}
                />
                <input
                  type="password"
                  placeholder={
                    shopeeStatus?.partner_key_configured
                      ? "Partner Key ja salva"
                      : "Partner Key"
                  }
                  value={shopeeDraft.partnerKey}
                  onChange={(event) => updateShopee("partnerKey", event.target.value)}
                />
                <input
                  placeholder="Shop ID"
                  value={shopeeDraft.shopId}
                  onChange={(event) => updateShopee("shopId", event.target.value)}
                />
                <input
                  placeholder="Nome da loja"
                  value={shopeeDraft.shopName}
                  onChange={(event) => updateShopee("shopName", event.target.value)}
                />
                <select
                  value={shopeeDraft.environment}
                  onChange={(event) => updateShopee("environment", event.target.value)}
                >
                  <option value="production">Producao</option>
                  <option value="sandbox">Sandbox</option>
                </select>
                <input
                  placeholder="Redirect URL"
                  value={shopeeDraft.redirectUrl}
                  onChange={(event) => updateShopee("redirectUrl", event.target.value)}
                />
                <button type="submit" disabled={isSavingShopee}>
                  {isSavingShopee ? "Salvando..." : "Salvar credenciais"}
                </button>
              </form>
            )}
          </section>
        )}

        {showForm && (
          <section className="box integration-form-card">
            <div className="section-heading">
              <div>
                <span className="section-kicker">
                  {editingId ? "Editar loja" : "Nova loja"}
                </span>
                <h2>{editingId ? "Atualizar integracao" : "Conectar loja"}</h2>
              </div>
              <button type="button" onClick={() => setShowForm(false)}>
                Fechar
              </button>
            </div>

            <form className="integration-form-grid" onSubmit={saveIntegration}>
              <select
                value={form.marketplace}
                onChange={(event) => update("marketplace", event.target.value)}
              >
                {marketplaces.map((marketplace) => (
                  <option key={marketplace}>{marketplace}</option>
                ))}
              </select>
              <input
                placeholder="Nome da loja"
                value={form.store_name}
                onChange={(event) => update("store_name", event.target.value)}
              />
              <input
                placeholder="Pais"
                value={form.country}
                onChange={(event) => update("country", event.target.value)}
              />
              <input
                placeholder="ID da loja / Shop ID"
                value={form.shop_id}
                onChange={(event) => update("shop_id", event.target.value)}
              />
              <select
                value={form.status}
                onChange={(event) => update("status", event.target.value)}
              >
                <option>Ativo</option>
                <option>Pendente</option>
                <option>Expirado</option>
                <option>Erro</option>
              </select>
              <input
                placeholder="Data de autenticacao"
                value={form.auth_date}
                onChange={(event) => update("auth_date", event.target.value)}
              />
              <input
                placeholder="Observacoes"
                value={form.notes}
                onChange={(event) => update("notes", event.target.value)}
              />
              <button type="submit">
                {editingId ? "Salvar alteracoes" : "Adicionar loja"}
              </button>
            </form>
          </section>
        )}

        <section className="box integration-table-card">
          <div className="section-heading">
            <h2>{selectedMarketplace} - Integracoes de loja</h2>
            {message && <strong className="bulk-message">{message}</strong>}
          </div>

          <table>
            <thead>
              <tr>
                <th>Nome da sua loja</th>
                <th>Marketplace</th>
                <th>Site</th>
                <th>ID da loja</th>
                <th>Status</th>
                <th>Autenticacao</th>
                <th>Acoes</th>
              </tr>
            </thead>

            <tbody>
              {filteredIntegrations.map((integration) => (
                <tr key={integration.id}>
                  <td>{integration.store_name}</td>
                  <td>{integration.marketplace}</td>
                  <td>{integration.country || "BR"}</td>
                  <td>{integration.shop_id || "-"}</td>
                  <td>
                    <span
                      className={`integration-status ${String(
                        integration.status || ""
                      ).toLowerCase()}`}
                    >
                      {integration.status}
                    </span>
                  </td>
                  <td>{integration.auth_date || "-"}</td>
                  <td>
                    <button type="button" onClick={() => editIntegration(integration)}>
                      Editar
                    </button>
                    <button
                      type="button"
                      className="danger"
                      onClick={() => deleteIntegration(integration.id)}
                    >
                      Remover
                    </button>
                  </td>
                </tr>
              ))}

              {filteredIntegrations.length === 0 && (
                <tr>
                  <td colSpan="7">Nenhuma loja cadastrada para este filtro.</td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      </main>

      {authUrl && (
        <div className="shopee-auth-overlay" role="dialog" aria-modal="true">
          <section className="shopee-auth-modal">
            <div className="section-heading">
              <div>
                <span className="section-kicker">Shopee</span>
                <h2>Login da loja</h2>
              </div>
              <button type="button" onClick={() => setAuthUrl("")}>
                Fechar
              </button>
            </div>

            <div className="shopee-auth-frame">
              <strong>Janela de login aberta.</strong>
              <span>
                Autorize a loja na pagina da Shopee. Depois da confirmacao, volte
                aqui para validar a conexao.
              </span>
            </div>

            <div className="integration-actions">
              <button type="button" onClick={() => openShopeePopup(authUrl)}>
                Abrir login da Shopee
              </button>
              <button
                type="button"
                className="secondary"
                onClick={() => {
                  setAuthUrl("");
                  loadShopeeStatus();
                  loadIntegrations();
                }}
              >
                Ja confirmei
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
