import { useEffect, useMemo, useState } from "react";
import API from "../services/api";
import { logError } from "../utils/logger";

const emptyDraft = {
  appKey: "",
  appSecret: "",
  shopId: "",
  shopName: "",
  environment: "production",
  signMethod: "hmac",
  redirectUrl: "",
  frontendReturnUrl: "/",
  authUrl: "",
  tokenUrl: "",
  refreshUrl: "",
  shopInfoUrl: "",
  productsUrl: "",
  ordersUrl: "",
  apiBase: "",
};

function getBackendCallbackUrl(provider) {
  const baseUrl = (API.defaults.baseURL || "http://127.0.0.1:8000").replace(/\/+$/, "");
  return `${baseUrl}/integrations/${provider}/callback`;
}

function getFrontendReturnUrl(page) {
  return `${window.location.origin}${window.location.pathname}?page=${page}`;
}

function mapStatusToDraft(status = {}) {
  return {
    appKey: status.app_key || "",
    shopId: status.shop_id || "",
    shopName: status.shop_name || "",
    environment: status.environment || "production",
    signMethod: status.sign_method || "hmac",
    redirectUrl: status.redirect_url || "",
    frontendReturnUrl: status.frontend_return_url || "/",
    authUrl: status.auth_url || "",
    tokenUrl: status.token_url || "",
    refreshUrl: status.refresh_url || "",
    shopInfoUrl: status.shop_info_url || "",
    productsUrl: status.products_url || "",
    ordersUrl: status.orders_url || "",
    apiBase: status.api_base || "",
  };
}

function formatDate(value) {
  if (!value) return "-";
  return new Date(value).toLocaleString("pt-BR");
}

export default function MarketplaceConnect({ provider, label, page }) {
  const [draft, setDraft] = useState(emptyDraft);
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const returnStatus = params.get(`${provider}_status`);

    if (returnStatus) {
      params.delete(`${provider}_status`);
      params.set("page", page);
      const query = params.toString();
      window.history.replaceState(
        {},
        "",
        window.location.pathname + (query ? `?${query}` : "") + window.location.hash
      );

      if (returnStatus === "conectado") {
        setMessage(`Conta ${label} conectada com sucesso.`);
      } else if (returnStatus.startsWith("erro:")) {
        setMessage(`Falha ao conectar: ${returnStatus.slice(5)}`);
      }
    }

    loadStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provider]);

  async function loadStatus() {
    try {
      const response = await API.get(`/integrations/${provider}/status`);
      const data = response.data || {};
      setStatus(data);
      setDraft((current) => ({
        ...current,
        ...mapStatusToDraft(data),
        appSecret: current.appSecret,
        redirectUrl: data.redirect_url || current.redirectUrl || getBackendCallbackUrl(provider),
        frontendReturnUrl: getFrontendReturnUrl(page),
      }));
    } catch (error) {
      logError(error);
      setMessage(`Nao foi possivel carregar o status de ${label}.`);
    }
  }

  function update(field, value) {
    setDraft((current) => ({ ...current, [field]: value }));
  }

  async function persistConfig(options = {}) {
    const { silent = false } = options;

    if (!silent) {
      setMessage("");
    }

    try {
      setIsSaving(true);
      const response = await API.put(`/integrations/${provider}/config`, {
        app_key: draft.appKey,
        app_secret: draft.appSecret,
        shop_id: draft.shopId,
        shop_name: draft.shopName,
        environment: draft.environment,
        sign_method: draft.signMethod,
        redirect_url: draft.redirectUrl || getBackendCallbackUrl(provider),
        frontend_return_url: getFrontendReturnUrl(page),
        auth_url: draft.authUrl,
        token_url: draft.tokenUrl,
        refresh_url: draft.refreshUrl,
        shop_info_url: draft.shopInfoUrl,
        products_url: draft.productsUrl,
        orders_url: draft.ordersUrl,
        api_base: draft.apiBase,
      });
      const data = response.data || {};
      setStatus(data);
      setDraft((current) => ({ ...current, ...mapStatusToDraft(data), appSecret: "" }));

      if (!silent) {
        setMessage(`Configuracao de ${label} salva.`);
      }

      return data;
    } catch (error) {
      logError(error);

      if (!silent) {
        setMessage(error?.response?.data?.detail || "Nao foi possivel salvar a configuracao.");
      }

      throw error;
    } finally {
      setIsSaving(false);
    }
  }

  async function connect() {
    try {
      setIsConnecting(true);
      await persistConfig({ silent: true });
      const response = await API.get(`/integrations/${provider}/connect`);
      window.location.href = response.data.authorization_url;
    } catch (error) {
      logError(error);
      setMessage(error?.response?.data?.detail || "Nao foi possivel iniciar a conexao.");
    } finally {
      setIsConnecting(false);
    }
  }

  async function testConnection() {
    try {
      setIsTesting(true);
      setMessage("");
      const response = await API.get(`/integrations/${provider}/me`);
      const shopName = response.data?.shop_name || response.data?.nickname || "-";
      const shopId = response.data?.shop_id || "-";
      setMessage(`Conexao ativa. Loja: ${shopName} (ID ${shopId}).`);
      await loadStatus();
    } catch (error) {
      logError(error);
      setMessage(error?.response?.data?.detail || "Nao foi possivel validar a conexao.");
    } finally {
      setIsTesting(false);
    }
  }

  async function syncNow() {
    try {
      setIsSyncing(true);
      setMessage("");
      const response = await API.post(`/integrations/${provider}/sync`);
      const products = response.data?.products || {};
      const orders = response.data?.orders || {};
      setMessage(
        `Sincronizacao concluida. Produtos: ${products.created || 0} novos / ${products.updated || 0} atualizados. ` +
          `Pedidos: ${orders.created || 0} novos / ${orders.updated || 0} atualizados.`
      );
    } catch (error) {
      logError(error);
      setMessage(error?.response?.data?.detail || "Nao foi possivel sincronizar.");
    } finally {
      setIsSyncing(false);
    }
  }

  async function disconnect() {
    if (!window.confirm(`Deseja desconectar a conta de ${label}?`)) {
      return;
    }

    try {
      setIsDisconnecting(true);
      setMessage("");
      await API.post(`/integrations/${provider}/disconnect`);
      setMessage(`Conta ${label} desconectada.`);
      await loadStatus();
    } catch (error) {
      logError(error);
      setMessage(error?.response?.data?.detail || "Nao foi possivel desconectar.");
    } finally {
      setIsDisconnecting(false);
    }
  }

  function copyRedirectUrl() {
    navigator.clipboard.writeText(draft.redirectUrl || getBackendCallbackUrl(provider));
    setMessage("Redirect URL copiada.");
  }

  const configured = status?.configured;
  const connected = status?.connected;
  const tokenExpired = status?.token_expired;
  const connectionLabel = connected
    ? tokenExpired
      ? "Conectado com token expirado"
      : "Conectado"
    : configured
      ? "Pronto para conectar"
      : "Credenciais pendentes";

  const progress = useMemo(() => {
    const filled = [
      draft.appKey || status?.app_key,
      status?.secret_configured ? "configured" : draft.appSecret,
      draft.redirectUrl || status?.redirect_url,
      draft.authUrl || status?.auth_url,
      draft.tokenUrl || status?.token_url,
      draft.refreshUrl || status?.refresh_url,
      draft.shopInfoUrl || status?.shop_info_url,
      draft.apiBase || status?.api_base,
    ].filter(Boolean).length;

    return Math.round((filled / 8) * 100);
  }, [draft, status]);

  return (
    <div className="page shopee-page">
      <section className="shopee-hero">
        <div>
          <span>{label} Open API</span>
          <h1>Integracao {label}</h1>
          <p>
            Conecte a loja {label} pela API oficial para sincronizar produtos e
            pedidos automaticamente, no mesmo padrao do Mercado Livre e da Shopee.
          </p>
        </div>

        <div className="connection-score">
          <strong>{progress}%</strong>
          <span>{connectionLabel}</span>
        </div>
      </section>

      {message && (
        <section className="box">
          <strong>{message}</strong>
        </section>
      )}

      <section className="integration-grid">
        <div className="box credential-card">
          <span className="section-kicker">Credenciais necessarias</span>
          <h2>Dados da aplicacao</h2>

          <div className="credential-form">
            <input
              placeholder="App Key / Client ID"
              value={draft.appKey}
              onChange={(event) => update("appKey", event.target.value)}
            />
            <input
              placeholder={status?.secret_configured ? "App Secret ja salvo" : "App Secret / Client Secret"}
              type="password"
              value={draft.appSecret}
              onChange={(event) => update("appSecret", event.target.value)}
            />
            <input
              placeholder="Shop ID / Seller ID (opcional)"
              value={draft.shopId}
              onChange={(event) => update("shopId", event.target.value)}
            />
            <input
              placeholder="Nome da loja"
              value={draft.shopName}
              onChange={(event) => update("shopName", event.target.value)}
            />
            <select
              value={draft.environment}
              onChange={(event) => update("environment", event.target.value)}
            >
              <option value="production">Producao</option>
              <option value="sandbox">Sandbox</option>
            </select>
            <select
              value={draft.signMethod}
              onChange={(event) => update("signMethod", event.target.value)}
            >
              <option value="hmac">Assinatura HMAC</option>
              <option value="bearer">OAuth Bearer</option>
            </select>
            <input
              placeholder="Redirect URL"
              value={draft.redirectUrl}
              onChange={(event) => update("redirectUrl", event.target.value)}
            />
            <input
              placeholder="Auth URL"
              value={draft.authUrl}
              onChange={(event) => update("authUrl", event.target.value)}
            />
            <input
              placeholder="Token URL"
              value={draft.tokenUrl}
              onChange={(event) => update("tokenUrl", event.target.value)}
            />
            <input
              placeholder="Refresh URL"
              value={draft.refreshUrl}
              onChange={(event) => update("refreshUrl", event.target.value)}
            />
            <input
              placeholder="Shop info URL"
              value={draft.shopInfoUrl}
              onChange={(event) => update("shopInfoUrl", event.target.value)}
            />
            <input
              placeholder="Products URL"
              value={draft.productsUrl}
              onChange={(event) => update("productsUrl", event.target.value)}
            />
            <input
              placeholder="Orders URL"
              value={draft.ordersUrl}
              onChange={(event) => update("ordersUrl", event.target.value)}
            />
            <input
              placeholder="API Base"
              value={draft.apiBase}
              onChange={(event) => update("apiBase", event.target.value)}
            />
          </div>

          <div className="integration-actions">
            <button type="button" onClick={copyRedirectUrl}>
              Copiar Redirect URL
            </button>
            <button type="button" onClick={() => persistConfig().catch(() => {})} disabled={isSaving}>
              {isSaving ? "Salvando..." : "Salvar configuracao"}
            </button>
            <button type="button" onClick={connect} disabled={isConnecting || isSaving}>
              {isConnecting ? "Conectando..." : "Conectar loja"}
            </button>
          </div>

          <div className="integration-actions">
            <button type="button" onClick={testConnection} disabled={isTesting || !connected}>
              {isTesting ? "Testando..." : "Testar conexao"}
            </button>
            <button type="button" onClick={syncNow} disabled={isSyncing || !connected}>
              {isSyncing ? "Sincronizando..." : "Sincronizar produtos e pedidos"}
            </button>
            {connected && (
              <button
                type="button"
                className="secondary"
                onClick={disconnect}
                disabled={isDisconnecting}
              >
                {isDisconnecting ? "Desconectando..." : "Desconectar"}
              </button>
            )}
          </div>

          <p className="integration-note">
            O backend guarda a configuracao e gera a URL de autorizacao. Preencha as
            URLs oficiais de {label} (a tela ja vem com os valores mais comuns).
          </p>
        </div>

        <div className="box checklist-card">
          <span className="section-kicker">Checklist</span>
          <h2>Antes de sincronizar</h2>

          <div className="checklist-items">
            {[
              `Conta de vendedor ativa em ${label}`,
              "App registrado no portal de desenvolvedor",
              "App Key e App Secret",
              "Redirect URL cadastrada no app",
              "Autorizacao da loja concluida",
            ].map((item, index) => (
              <div key={item}>
                <span>{index + 1}</span>
                <strong>{item}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>

      {status && (
        <section className="box">
          <span className="section-kicker">Status</span>
          <div className="fiscal-detail-grid">
            <div>
              <span>Configurado</span>
              <strong>{configured ? "Sim" : "Nao"}</strong>
            </div>
            <div>
              <span>Conectado</span>
              <strong>{connected ? "Sim" : "Nao"}</strong>
            </div>
            <div>
              <span>Loja</span>
              <strong>{status.shop_name || draft.shopName || "-"}</strong>
            </div>
            <div>
              <span>Shop ID</span>
              <strong>{status.external_user_id || status.shop_id || draft.shopId || "-"}</strong>
            </div>
            <div>
              <span>Ambiente</span>
              <strong>{status.environment || draft.environment}</strong>
            </div>
            <div>
              <span>Token expira em</span>
              <strong>{formatDate(status.expires_at)}</strong>
            </div>
            <div>
              <span>Redirect</span>
              <strong>{status.redirect_url || draft.redirectUrl}</strong>
            </div>
            <div>
              <span>API base</span>
              <strong>{status.api_base || draft.apiBase}</strong>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
