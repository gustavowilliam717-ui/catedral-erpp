import { useEffect, useState } from "react";
import API from "../services/api";
import { logError } from "../utils/logger";

const setupSteps = [
  {
    title: "1. Criar aplicacao",
    text: "Acesse developers.mercadolivre.com.br > Minhas aplicacoes > Criar aplicacao.",
  },
  {
    title: "2. Copiar credenciais",
    text: "Copie o App ID (Client ID) e a Secret Key para o backend/.env (ML_APP_ID e ML_SECRET_KEY).",
  },
  {
    title: "3. Cadastrar redirect",
    text: "Cadastre a URI de redirect (HTTPS) terminando em /mercadolivre/callback e replique em ML_REDIRECT_URI.",
  },
  {
    title: "4. Conectar a conta",
    text: "Clique em Conectar Mercado Livre, faca login e autorize o Catedral ERP a acessar a conta.",
  },
];

function formatDate(value) {
  if (!value) return "-";
  return new Date(value).toLocaleString("pt-BR");
}

function readReturnStatus() {
  const params = new URLSearchParams(window.location.search);
  const status = params.get("ml_status");

  if (!status) return "";

  params.delete("ml_status");
  const query = params.toString();
  const newUrl =
    window.location.pathname + (query ? `?${query}` : "") + window.location.hash;
  window.history.replaceState({}, "", newUrl);

  return status;
}

export default function MercadoLivreIntegration() {
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const returnStatus = readReturnStatus();

    if (returnStatus === "conectado") {
      setMessage("Conta Mercado Livre conectada com sucesso.");
    } else if (returnStatus.startsWith("erro:")) {
      setMessage(`Falha ao conectar: ${decodeURIComponent(returnStatus.slice(5))}`);
    }

    loadStatus();
  }, []);

  async function loadStatus() {
    try {
      const response = await API.get("/integrations/mercadolivre/status");
      setStatus(response.data);
    } catch (error) {
      logError(error);
      setMessage("Nao foi possivel carregar o status do Mercado Livre.");
    }
  }

  async function connect() {
    setMessage("");

    try {
      setIsLoading(true);
      const response = await API.get("/integrations/mercadolivre/connect");
      window.location.href = response.data.authorization_url;
    } catch (error) {
      logError(error);
      setMessage(error?.response?.data?.detail || "Nao foi possivel iniciar a conexao.");
      setIsLoading(false);
    }
  }

  async function testConnection() {
    setMessage("");

    try {
      setIsLoading(true);
      const response = await API.get("/integrations/mercadolivre/me");
      setMessage(`Conexao ativa. Vendedor: ${response.data.nickname} (ID ${response.data.id}).`);
      await loadStatus();
    } catch (error) {
      logError(error);
      setMessage(error?.response?.data?.detail || "Nao foi possivel validar a conexao.");
    } finally {
      setIsLoading(false);
    }
  }

  async function disconnect() {
    setMessage("");

    try {
      setIsLoading(true);
      await API.post("/integrations/mercadolivre/disconnect");
      setMessage("Conta Mercado Livre desconectada.");
      await loadStatus();
    } catch (error) {
      logError(error);
      setMessage(error?.response?.data?.detail || "Nao foi possivel desconectar.");
    } finally {
      setIsLoading(false);
    }
  }

  const configured = status?.configured;
  const connected = status?.connected;
  const connectionLabel = connected
    ? "Conectado"
    : configured
    ? "Pronto para conectar"
    : "Credenciais pendentes";

  return (
    <div className="page shopee-page">
      <section className="shopee-hero">
        <div>
          <span>Mercado Livre Developers</span>
          <h1>Integracao com o Mercado Livre</h1>
          <p>
            Conecte a conta do Mercado Livre via OAuth para o Catedral ERP acessar
            pedidos, anuncios e estoque pela API oficial. Este e o primeiro passo:
            autorizar a conta.
          </p>
        </div>

        <div className="connection-score">
          <strong>{connectionLabel}</strong>
          <span>{status?.nickname ? `@${status.nickname}` : "status da conexao"}</span>
        </div>
      </section>

      {message && (
        <section className="box">
          <strong>{message}</strong>
        </section>
      )}

      <section className="integration-grid">
        <div className="box credential-card">
          <span className="section-kicker">Conexao OAuth</span>
          <h2>Conta do Mercado Livre</h2>

          <div className="fiscal-detail-grid">
            <div>
              <span>Credenciais no backend</span>
              <strong>{configured ? "Configuradas" : "Pendentes"}</strong>
            </div>
            <div>
              <span>Conta conectada</span>
              <strong>{connected ? "Sim" : "Nao"}</strong>
            </div>
            <div>
              <span>Vendedor</span>
              <strong>{status?.nickname || "-"}</strong>
            </div>
            <div>
              <span>ID do vendedor</span>
              <strong>{status?.external_user_id || "-"}</strong>
            </div>
            <div>
              <span>Token expira em</span>
              <strong>{formatDate(status?.expires_at)}</strong>
            </div>
            <div>
              <span>Redirect URI</span>
              <strong>{status?.redirect_uri || "-"}</strong>
            </div>
          </div>

          <div className="integration-actions">
            <button type="button" onClick={connect} disabled={isLoading || !configured}>
              {connected ? "Reconectar" : "Conectar Mercado Livre"}
            </button>
            <button type="button" onClick={testConnection} disabled={isLoading || !connected}>
              Testar conexao
            </button>
            {connected && (
              <button type="button" onClick={disconnect} disabled={isLoading}>
                Desconectar
              </button>
            )}
          </div>

          {!configured && (
            <p className="integration-note">
              Configure ML_APP_ID, ML_SECRET_KEY e ML_REDIRECT_URI no backend/.env e
              reinicie o backend para liberar a conexao.
            </p>
          )}
        </div>

        <div className="box checklist-card">
          <span className="section-kicker">Passo a passo</span>
          <h2>Como conectar</h2>

          <div className="order-flow-grid">
            {setupSteps.map((step) => (
              <article key={step.title}>
                <strong>{step.title}</strong>
                <p>{step.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="box api-reference-card">
        <span className="section-kicker">APIs Mercado Livre usadas</span>
        <h2>Endpoints principais</h2>

        <div className="api-reference-list">
          <div>
            <strong>GET /authorization</strong>
            <span>Tela de autorizacao onde o vendedor libera o acesso do ERP.</span>
          </div>
          <div>
            <strong>POST /oauth/token</strong>
            <span>Troca o codigo de autorizacao por access token e refresh token.</span>
          </div>
          <div>
            <strong>GET /users/me</strong>
            <span>Confere a conta conectada (nickname, ID, site).</span>
          </div>
        </div>
      </section>
    </div>
  );
}
