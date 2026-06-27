import { useEffect, useMemo, useState } from "react";
import API from "../services/api";
import { logError } from "../utils/logger";

const defaultDraft = {
  partnerId: "",
  partnerKey: "",
  shopId: "",
  shopName: "",
  environment: "production",
  redirectUrl: "http://127.0.0.1:8000/shopee/callback",
  frontendReturnUrl: "/",
  authUrl: "https://partner.shopeemobile.com/api/v2/shop/auth_partner",
  tokenUrl: "https://partner.shopeemobile.com/api/v2/auth/token/get",
  refreshUrl: "https://partner.shopeemobile.com/api/v2/auth/access_token/get",
  shopInfoUrl: "https://partner.shopeemobile.com/api/v2/shop/get_shop_info",
  apiBase: "https://partner.shopeemobile.com",
};

const requiredItems = [
  "Conta na Shopee Open Platform",
  "Partner ID",
  "Partner Key",
  "Shop ID da loja (se ja tiver)",
  "Redirect URL cadastrada",
  "Autorizacao da loja",
];

const orderSteps = [
  {
    title: "1. Criar app",
    text: "Criar um aplicativo Seller/In-house na Shopee Open Platform.",
  },
  {
    title: "2. Salvar credenciais",
    text: "Preencher Partner ID, Partner Key, Shop ID e URLs do callback.",
  },
  {
    title: "3. Autorizar loja",
    text: "Abrir a URL de autorizacao gerada pelo backend e concluir o login.",
  },
  {
    title: "4. Testar conexao",
    text: "Consultar os dados da loja conectada antes de seguir para pedidos.",
  },
];

function readReturnStatus() {
  const params = new URLSearchParams(window.location.search);
  const status = params.get("shopee_status");

  if (!status) return "";

  params.delete("shopee_status");
  const query = params.toString();
  const newUrl =
    window.location.pathname + (query ? `?${query}` : "") + window.location.hash;
  window.history.replaceState({}, "", newUrl);

  return status;
}

function formatDate(value) {
  if (!value) return "-";
  return new Date(value).toLocaleString("pt-BR");
}

function mapStatusToDraft(status = {}) {
  return {
    partnerId: status.partner_id || "",
    shopId: status.shop_id || "",
    shopName: status.shop_name || "",
    environment: status.environment || "production",
    redirectUrl: status.redirect_url || defaultDraft.redirectUrl,
    frontendReturnUrl: status.frontend_return_url || "/",
    authUrl: status.auth_url || defaultDraft.authUrl,
    tokenUrl: status.token_url || defaultDraft.tokenUrl,
    refreshUrl: status.refresh_url || defaultDraft.refreshUrl,
    shopInfoUrl: status.shop_info_url || defaultDraft.shopInfoUrl,
    apiBase: status.api_base || defaultDraft.apiBase,
  };
}

export default function ShopeeIntegration() {
  const [draft, setDraft] = useState(defaultDraft);
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  useEffect(() => {
    const returnStatus = readReturnStatus();

    if (returnStatus === "conectado") {
      setMessage("Conta Shopee conectada com sucesso.");
    } else if (returnStatus.startsWith("erro:")) {
      setMessage(`Falha ao conectar: ${returnStatus.slice(5)}`);
    }

    loadStatus();
  }, []);

  async function loadStatus() {
    try {
      const response = await API.get("/integrations/shopee/status");
      const data = response.data || {};
      setStatus(data);
      setDraft((current) => ({ ...current, ...mapStatusToDraft(data) }));
    } catch (error) {
      logError(error);
      setMessage("Nao foi possivel carregar o status da Shopee.");
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
      const response = await API.put("/integrations/shopee/config", {
        partner_id: draft.partnerId,
        partner_key: draft.partnerKey,
        shop_id: draft.shopId,
        shop_name: draft.shopName,
        environment: draft.environment,
        redirect_url: draft.redirectUrl,
        frontend_return_url: draft.frontendReturnUrl,
        auth_url: draft.authUrl,
        token_url: draft.tokenUrl,
        refresh_url: draft.refreshUrl,
        shop_info_url: draft.shopInfoUrl,
        api_base: draft.apiBase,
      });

      setStatus(response.data || null);
      setDraft((current) => ({
        ...current,
        ...mapStatusToDraft(response.data || {}),
      }));

      if (!silent) {
        setMessage("Configuracao da Shopee salva.");
      }

      return response.data;
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
      const response = await API.get("/integrations/shopee/connect");
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
      const response = await API.get("/integrations/shopee/me");
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

  async function disconnect() {
    if (!window.confirm("Deseja desconectar a conta da Shopee?")) {
      return;
    }

    try {
      setIsDisconnecting(true);
      setMessage("");
      await API.post("/integrations/shopee/disconnect");
      setMessage("Conta Shopee desconectada.");
      await loadStatus();
    } catch (error) {
      logError(error);
      setMessage(error?.response?.data?.detail || "Nao foi possivel desconectar.");
    } finally {
      setIsDisconnecting(false);
    }
  }

  function copyRedirectUrl() {
    navigator.clipboard.writeText(draft.redirectUrl);
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
      draft.partnerId || status?.partner_id,
      status?.partner_key_configured ? "configured" : draft.partnerKey,
      draft.shopId || status?.shop_id,
      draft.redirectUrl || status?.redirect_url,
      draft.authUrl || status?.auth_url,
      draft.tokenUrl || status?.token_url,
      draft.refreshUrl || status?.refresh_url,
      draft.shopInfoUrl || status?.shop_info_url,
      draft.apiBase || status?.api_base,
    ].filter(Boolean).length;

    return Math.round((filled / 9) * 100);
  }, [draft, status]);

  return (
    <div className="page shopee-page">
      <section className="shopee-hero">
        <div>
          <span>Shopee Open Platform</span>
          <h1>Pedidos automaticos da Shopee</h1>
          <p>
            A planilha de Informacoes de Vendas importa produtos manualmente.
            Para puxar pedidos sozinho, precisamos conectar a loja pela API
            oficial da Shopee.
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
              placeholder="Partner ID"
              value={draft.partnerId}
              onChange={(event) => update("partnerId", event.target.value)}
            />
            <input
              placeholder="Partner Key"
              type="password"
              value={draft.partnerKey}
              onChange={(event) => update("partnerKey", event.target.value)}
            />
            <input
              placeholder="Shop ID (opcional antes da autorizacao)"
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
            <input
              placeholder="Redirect URL"
              value={draft.redirectUrl}
              onChange={(event) => update("redirectUrl", event.target.value)}
            />
            <input
              placeholder="Frontend return URL"
              value={draft.frontendReturnUrl}
              onChange={(event) => update("frontendReturnUrl", event.target.value)}
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
              placeholder="API Base"
              value={draft.apiBase}
              onChange={(event) => update("apiBase", event.target.value)}
            />
          </div>

          <div className="integration-actions">
            <button type="button" onClick={copyRedirectUrl}>
              Copiar Redirect URL
            </button>
            <button
              type="button"
              onClick={() => persistConfig().catch(() => {})}
              disabled={isSaving}
            >
              {isSaving ? "Salvando..." : "Salvar configuracao"}
            </button>
            <button
              type="button"
              onClick={connect}
              disabled={isConnecting || isSaving}
            >
              {isConnecting ? "Conectando..." : "Conectar loja"}
            </button>
          </div>

          <div className="integration-actions">
            <button
              type="button"
              onClick={testConnection}
              disabled={isTesting || !connected}
            >
              {isTesting ? "Testando..." : "Testar conexao"}
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
            O backend guarda a configuracao e gera a URL de autorizacao. Depois
            da Shopee redirecionar de volta, a conta aparece como conectada.
          </p>
        </div>

        <div className="box checklist-card">
          <span className="section-kicker">Checklist</span>
          <h2>Antes de sincronizar</h2>

          <div className="checklist-items">
            {requiredItems.map((item, index) => (
              <div key={item}>
                <span>{index + 1}</span>
                <strong>{item}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="box order-flow-card">
        <span className="section-kicker">Fluxo automatico</span>
        <h2>Como os pedidos vao entrar no ERP</h2>

        <div className="order-flow-grid">
          {orderSteps.map((step) => (
            <article key={step.title}>
              <strong>{step.title}</strong>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="box api-reference-card">
        <span className="section-kicker">APIs Shopee usadas</span>
        <h2>Endpoints principais</h2>

        <div className="api-reference-list">
          <div>
            <strong>GET /api/v2/shop/auth_partner</strong>
            <span>Abre a autorizacao da conta da loja.</span>
          </div>
          <div>
            <strong>POST /api/v2/auth/token/get</strong>
            <span>Troca o codigo por access token e refresh token.</span>
          </div>
          <div>
            <strong>GET /api/v2/shop/get_shop_info</strong>
            <span>Consulta a loja conectada e valida a sessao atual.</span>
          </div>
          <div>
            <strong>GET /api/v2/order/get_order_list</strong>
            <span>Busca pedidos por periodo, status e paginacao.</span>
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
