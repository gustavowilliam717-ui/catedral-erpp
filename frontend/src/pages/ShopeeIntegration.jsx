import { useMemo, useState } from "react";

const requiredItems = [
  "Conta na Shopee Open Platform",
  "Partner ID",
  "Partner Key",
  "Shop ID da loja",
  "Redirect URL cadastrada",
  "Autorizacao da loja",
];

const orderSteps = [
  {
    title: "1. Criar app",
    text: "Criar um aplicativo Seller/In-house na Shopee Open Platform.",
  },
  {
    title: "2. Autorizar loja",
    text: "O lojista faz login e autoriza o Catedral ERP a acessar a loja.",
  },
  {
    title: "3. Buscar pedidos",
    text: "Usar get_order_list para trazer os numeros dos pedidos por periodo/status.",
  },
  {
    title: "4. Detalhar pedido",
    text: "Usar get_order_detail para obter itens, comprador, valores e envio.",
  },
];

export default function ShopeeIntegration() {
  const [draft, setDraft] = useState({
    partnerId: "",
    partnerKey: "",
    shopId: "",
    redirectUrl: "http://127.0.0.1:8000/shopee/callback",
    environment: "Producao",
    syncStatus: "READY_TO_SHIP",
  });

  const completedCount = useMemo(
    () =>
      [
        draft.partnerId,
        draft.partnerKey,
        draft.shopId,
        draft.redirectUrl,
      ].filter(Boolean).length,
    [draft]
  );

  const progress = Math.round((completedCount / 4) * 100);

  function update(field, value) {
    setDraft({ ...draft, [field]: value });
  }

  function copyRedirectUrl() {
    navigator.clipboard.writeText(draft.redirectUrl);
  }

  return (
    <div className="page shopee-page">
      <section className="shopee-hero">
        <div>
          <span>Shopee Open Platform</span>
          <h1>Pedidos automaticos da Shopee</h1>
          <p>
            A planilha de Informacoes de Vendas importa produtos manualmente. Para
            puxar pedidos sozinho, precisamos conectar a loja pela API oficial da
            Shopee.
          </p>
        </div>

        <div className="connection-score">
          <strong>{progress}%</strong>
          <span>configuracao preenchida</span>
        </div>
      </section>

      <section className="integration-grid">
        <div className="box credential-card">
          <span className="section-kicker">Credenciais necessarias</span>
          <h2>Dados que vou te pedir</h2>

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
              placeholder="Shop ID"
              value={draft.shopId}
              onChange={(event) => update("shopId", event.target.value)}
            />
            <select
              value={draft.environment}
              onChange={(event) => update("environment", event.target.value)}
            >
              <option>Producao</option>
              <option>Sandbox</option>
            </select>
            <input
              placeholder="Redirect URL"
              value={draft.redirectUrl}
              onChange={(event) => update("redirectUrl", event.target.value)}
            />
            <select
              value={draft.syncStatus}
              onChange={(event) => update("syncStatus", event.target.value)}
            >
              <option>READY_TO_SHIP</option>
              <option>PROCESSED</option>
              <option>SHIPPED</option>
              <option>COMPLETED</option>
              <option>ALL</option>
            </select>
          </div>

          <div className="integration-actions">
            <button type="button" onClick={copyRedirectUrl}>
              Copiar Redirect URL
            </button>
            <button type="button" disabled>
              Conectar loja
            </button>
          </div>

          <p className="integration-note">
            O botao Conectar loja sera ativado quando criarmos o app na Shopee e
            configurarmos o callback real. Ainda nao coloque credenciais de
            producao sem login e permissoes no ERP.
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
            <strong>GET /api/v2/order/get_order_list</strong>
            <span>Busca os pedidos por periodo, status e paginacao.</span>
          </div>
          <div>
            <strong>GET /api/v2/order/get_order_detail</strong>
            <span>Busca os detalhes dos pedidos retornados na lista.</span>
          </div>
          <div>
            <strong>POST /api/v2/auth/token/get</strong>
            <span>Troca o codigo de autorizacao por access token e refresh token.</span>
          </div>
        </div>
      </section>
    </div>
  );
}
