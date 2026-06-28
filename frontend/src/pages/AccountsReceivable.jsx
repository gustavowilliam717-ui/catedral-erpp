import { useEffect, useMemo, useState } from "react";
import API from "../services/api";
import { logError } from "../utils/logger";

const financeGroups = [
  {
    title: "Gestao Financeira",
    items: [
      { page: "finance", label: "Painel financeiro" },
      { page: "cash-flow", label: "Caixa e Bancos" },
      { page: "accounts-payable", label: "Contas a Pagar" },
      { page: "accounts-receivable", label: "Contas a Receber" },
    ],
  },
  {
    title: "Relatorios",
    items: [
      { page: "profit-report", label: "Relatorio de Lucros" },
      { page: "invoice-report", label: "Relatorio de NF-e" },
      { page: "ncm-sales-report", label: "NCM Vendas" },
      { page: "ncm-purchase-report", label: "NCM Compras" },
      { page: "ncm-stock-report", label: "NCM Estoque" },
      { page: "taxes", label: "Impostos" },
    ],
  },
];

function formatCurrency(value) {
  return Number(value || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatDate(value) {
  if (!value) return "-";
  const [y, m, d] = String(value).split("-");
  if (!y || !m || !d) return value;
  return `${d}/${m}/${y}`;
}

function formatPeriod(value) {
  const [y, m] = String(value).split("-");
  const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
  return `${months[Number(m) - 1] || m}/${y}`;
}

export default function AccountsReceivable({ setPage }) {
  const [data, setData] = useState(null);
  const [tab, setTab] = useState("released");
  const [search, setSearch] = useState("");
  const [marketplace, setMarketplace] = useState("Todos");
  const [message, setMessage] = useState("");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const response = await API.get("/finance/receivables");
      setData(response.data || null);
    } catch (error) {
      logError(error);
      setMessage("Nao foi possivel carregar as contas a receber.");
    }
  }

  const orders = data?.orders || [];
  const marketplaces = useMemo(
    () => ["Todos", ...Array.from(new Set(orders.map((o) => o.marketplace).filter(Boolean)))],
    [orders]
  );

  const filtered = orders.filter((o) => {
    const matchTab = tab === "all" || o.status === tab;
    const matchMarket = marketplace === "Todos" || o.marketplace === marketplace;
    const matchSearch = `${o.order_id} ${o.buyer} ${o.marketplace}`.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchMarket && matchSearch;
  });

  const maxWithdrawal = Math.max(1, ...(data?.withdrawals || []).map((w) => w.amount));

  return (
    <div className="finance-workspace">
      <aside className="finance-side-panel">
        <h2>Financeiro</h2>
        {financeGroups.map((group) => (
          <div key={group.title}>
            <strong>{group.title}</strong>
            {group.items.map((item) => (
              <button
                type="button"
                key={item.page}
                className={item.page === "accounts-receivable" ? "active" : ""}
                onClick={() => setPage?.(item.page)}
              >
                {item.label}
              </button>
            ))}
          </div>
        ))}
      </aside>

      <main className="finance-board">
        <section className="finance-alert-bar">
          <span>i</span>
          <p>
            Renda consolidada de todas as plataformas (Shopee, Mercado Livre,
            Amazon, Shein, TikTok Shop e Temu). Sincroniza automaticamente quando
            as APIs forem conectadas.
          </p>
          <button type="button" onClick={load}>Atualizar</button>
        </section>

        <section className="finance-control-surface">
          <div className="finance-title-row">
            <div>
              <span>Visao geral da minha renda</span>
              <h2>Contas a receber</h2>
            </div>
            <strong>A liberar: {formatCurrency(data?.pending_total)}</strong>
          </div>
        </section>

        <section className="finance-summary-strip">
          <article className="neutral">
            <span>Pendente (a liberar)</span>
            <strong>{formatCurrency(data?.pending_total)}</strong>
            <small>Saldo que vai cair</small>
          </article>
          <article className="positive">
            <span>Liberado essa semana</span>
            <strong>{formatCurrency(data?.released_week)}</strong>
            <small>Ultimos 7 dias</small>
          </article>
          <article className="positive">
            <span>Liberado esse mes</span>
            <strong>{formatCurrency(data?.released_month)}</strong>
            <small>Mes atual</small>
          </article>
          <article className="positive">
            <span>Total liberado</span>
            <strong>{formatCurrency(data?.released_total)}</strong>
            <small>Que ja caiu</small>
          </article>
        </section>

        <section className="finance-main-grid receivable-grid">
          <div className="finance-table-card">
            <div className="receivable-tabs">
              <button type="button" className={tab === "pending" ? "active" : ""} onClick={() => setTab("pending")}>
                Pendente
              </button>
              <button type="button" className={tab === "released" ? "active" : ""} onClick={() => setTab("released")}>
                Liberados
              </button>
              <button type="button" className={tab === "all" ? "active" : ""} onClick={() => setTab("all")}>
                Todos
              </button>
              <select value={marketplace} onChange={(event) => setMarketplace(event.target.value)}>
                {marketplaces.map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>
              <input
                placeholder="Procurar pedido, comprador ou loja"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>

            {message && <strong className="bulk-message">{message}</strong>}

            <table className="finance-ledger-table">
              <thead>
                <tr>
                  <th>Pedido</th>
                  <th>Plataforma</th>
                  <th>Comprador</th>
                  <th>Data</th>
                  <th>Status</th>
                  <th>Valor liberado</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((o, index) => (
                  <tr key={`${o.marketplace}-${o.order_id}-${index}`}>
                    <td>{o.order_id || "-"}</td>
                    <td>{o.marketplace}</td>
                    <td>{o.buyer || "-"}</td>
                    <td>{formatDate(o.date)}</td>
                    <td>
                      <span className={`finance-status ${o.status === "released" ? "received" : "pending"}`}>
                        {o.status === "released" ? "Liberado" : "A liberar"}
                      </span>
                    </td>
                    <td>{formatCurrency(o.value)}</td>
                  </tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan="6">
                      <div className="finance-empty-state">
                        <span />
                        <strong>Nenhum recebivel ainda</strong>
                        <p>Conecte e sincronize um marketplace em Integracoes para ver a renda aqui.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <aside className="finance-entry-panel">
            <h3>Saldo por plataforma</h3>
            <div className="receivable-market-list">
              {(data?.by_marketplace || []).map((m) => (
                <div key={m.marketplace} className="receivable-market-row">
                  <strong>{m.marketplace}</strong>
                  <div>
                    <span className="rec-released">Liberado {formatCurrency(m.released)}</span>
                    <span className="rec-pending">A liberar {formatCurrency(m.pending)}</span>
                  </div>
                </div>
              ))}
              {(data?.by_marketplace || []).length === 0 && (
                <p className="payable-hint">Sem dados ainda. As plataformas aparecem aqui apos a sincronizacao.</p>
              )}
            </div>

            <h3 style={{ marginTop: 18 }}>Saques ao longo do tempo</h3>
            <div className="receivable-withdrawals">
              {(data?.withdrawals || []).map((w) => (
                <div key={w.period} className="receivable-bar-row">
                  <span>{formatPeriod(w.period)}</span>
                  <div className="receivable-bar">
                    <i style={{ width: `${Math.round((w.amount / maxWithdrawal) * 100)}%` }} />
                  </div>
                  <strong>{formatCurrency(w.amount)}</strong>
                </div>
              ))}
              {(data?.withdrawals || []).length === 0 && (
                <p className="payable-hint">O historico mensal de saques aparece aqui conforme a renda for liberada.</p>
              )}
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}
