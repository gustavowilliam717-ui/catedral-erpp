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

const CATEGORIES = [
  { key: "fixa", label: "Conta fixa" },
  { key: "variavel", label: "Conta variavel" },
  { key: "boleto", label: "Boleto" },
];

function formatCurrency(value) {
  return Number(value || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatDate(value) {
  if (!value) return "-";
  const [y, m, d] = value.split("-");
  if (!y || !m || !d) return value;
  return `${d}/${m}/${y}`;
}

function daysUntil(value) {
  if (!value) return null;
  const due = new Date(`${value}T00:00:00`);
  if (Number.isNaN(due.getTime())) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((due - today) / 86400000);
}

const emptyForm = {
  description: "",
  party: "",
  category: "fixa",
  value: "",
  due_date: "",
  reminder_enabled: false,
};

export default function AccountsPayable({ setPage }) {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("todas");
  const [message, setMessage] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [boleto, setBoleto] = useState({ line: "", file: null, reminder: true });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const response = await API.get("/finance/payables");
      setItems(response.data || []);
    } catch (error) {
      logError(error);
      setMessage("Nao foi possivel carregar as contas a pagar.");
    }
  }

  async function addManual(event) {
    event.preventDefault();
    if (!form.description || !form.value) {
      setMessage("Informe a descricao e o valor.");
      return;
    }
    try {
      setBusy(true);
      const response = await API.post("/finance/payables", {
        ...form,
        value: Number(form.value),
      });
      setForm(emptyForm);
      setMessage(response.data?.message || "Conta cadastrada.");
      await load();
    } catch (error) {
      logError(error);
      setMessage(error?.response?.data?.detail || "Nao foi possivel cadastrar.");
    } finally {
      setBusy(false);
    }
  }

  async function importBoleto(event) {
    event.preventDefault();
    if (!boleto.line && !boleto.file) {
      setMessage("Envie a imagem do boleto ou cole a linha digitavel.");
      return;
    }
    try {
      setBusy(true);
      const data = new FormData();
      data.append("boleto_line", boleto.line || "");
      data.append("reminder_enabled", boleto.reminder ? "true" : "false");
      if (boleto.file) data.append("file", boleto.file);

      const response = await API.post("/finance/payables/boleto", data);
      const p = response.data?.payable;
      setBoleto({ line: "", file: null, reminder: true });
      setMessage(
        `Boleto lancado: ${p?.party || p?.description || "conta"} - ${formatCurrency(p?.value)} - vence ${formatDate(p?.due_date)}.` +
          (response.data?.ai_used ? " (lido por IA)" : "")
      );
      await load();
    } catch (error) {
      logError(error);
      setMessage(error?.response?.data?.detail || "Nao foi possivel identificar o boleto.");
    } finally {
      setBusy(false);
    }
  }

  async function triggerReminder(id) {
    try {
      const response = await API.post(`/finance/payables/${id}/reminder`);
      setMessage(response.data?.message || "Lembrete acionado.");
      await load();
    } catch (error) {
      logError(error);
      setMessage(error?.response?.data?.detail || "Nao foi possivel acionar o lembrete.");
    }
  }

  async function togglePaid(item) {
    try {
      await API.put(`/finance/payables/${item.id}`, {
        status: item.status === "pago" ? "nao_pago" : "pago",
      });
      await load();
    } catch (error) {
      logError(error);
      setMessage("Nao foi possivel atualizar o status.");
    }
  }

  async function remove(id) {
    if (!window.confirm("Excluir esta conta a pagar?")) return;
    try {
      await API.delete(`/finance/payables/${id}`);
      await load();
    } catch (error) {
      logError(error);
      setMessage("Nao foi possivel excluir.");
    }
  }

  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return items.filter((item) => {
      const matchFilter = filter === "todas" || item.category === filter;
      const matchSearch = `${item.description} ${item.party} ${item.category}`
        .toLowerCase()
        .includes(term);
      return matchFilter && matchSearch;
    });
  }, [items, search, filter]);

  const openItems = items.filter((item) => item.status !== "pago");
  const totalOpen = openItems.reduce((sum, item) => sum + Number(item.value || 0), 0);
  const sumBy = (cat) =>
    openItems.filter((item) => item.category === cat).reduce((sum, item) => sum + Number(item.value || 0), 0);

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
                className={item.page === "accounts-payable" ? "active" : ""}
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
            Gerencie vencimentos, ative lembretes por e-mail (3, 2, 1 dia antes e
            no dia) e lance boletos automaticamente pela imagem ou linha digitavel.
          </p>
          <button type="button" onClick={load}>Atualizar</button>
        </section>

        <section className="finance-control-surface">
          <div className="finance-title-row">
            <div>
              <span>Este mes</span>
              <h2>Contas a pagar</h2>
            </div>
            <strong>Valor total a pagar: {formatCurrency(totalOpen)}</strong>
          </div>

          <div className="finance-filter-row">
            <select value={filter} onChange={(event) => setFilter(event.target.value)}>
              <option value="todas">Todas as categorias</option>
              <option value="fixa">Conta fixa</option>
              <option value="variavel">Conta variavel</option>
              <option value="boleto">Boleto</option>
            </select>
            <input
              placeholder="Pesquisar descricao, beneficiario ou categoria"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
        </section>

        <section className="finance-summary-strip">
          <article className="negative">
            <span>Total a pagar</span>
            <strong>{formatCurrency(totalOpen)}</strong>
            <small>{openItems.length} em aberto</small>
          </article>
          <article className="payable-card fixa">
            <span>Contas fixas</span>
            <strong>{formatCurrency(sumBy("fixa"))}</strong>
            <small>{openItems.filter((i) => i.category === "fixa").length} contas</small>
          </article>
          <article className="payable-card variavel">
            <span>Contas variaveis</span>
            <strong>{formatCurrency(sumBy("variavel"))}</strong>
            <small>{openItems.filter((i) => i.category === "variavel").length} contas</small>
          </article>
          <article className="payable-card boleto">
            <span>Boletos</span>
            <strong>{formatCurrency(sumBy("boleto"))}</strong>
            <small>{openItems.filter((i) => i.category === "boleto").length} boletos</small>
          </article>
        </section>

        <section className="finance-main-grid">
          <div className="finance-table-card">
            <div className="finance-table-tools">
              <strong>Total {filtered.length}</strong>
              {message && <span className="bulk-message">{message}</span>}
            </div>

            <table className="finance-ledger-table payable-table">
              <thead>
                <tr>
                  <th>Tipo</th>
                  <th>Descricao</th>
                  <th>Beneficiario</th>
                  <th>Vencimento</th>
                  <th>Status</th>
                  <th>Valor</th>
                  <th>Acoes</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => {
                  const dleft = daysUntil(item.due_date);
                  const overdue = item.status !== "pago" && dleft !== null && dleft < 0;
                  const soon = item.status !== "pago" && dleft !== null && dleft >= 0 && dleft <= 3;
                  return (
                    <tr key={item.id} className={`payable-row ${item.category}`}>
                      <td>
                        <span className={`payable-chip ${item.category}`}>
                          {CATEGORIES.find((c) => c.key === item.category)?.label || item.category}
                        </span>
                      </td>
                      <td>
                        <strong>{item.description}</strong>
                        {item.source === "boleto" && <span>Boleto importado</span>}
                      </td>
                      <td>{item.party || "-"}</td>
                      <td>
                        {formatDate(item.due_date)}
                        {overdue && <span className="payable-due overdue">Vencido</span>}
                        {soon && <span className="payable-due soon">Vence em {dleft}d</span>}
                      </td>
                      <td>
                        <span className={`finance-status ${item.status === "pago" ? "received" : "pending"}`}>
                          {item.status === "pago" ? "Pago" : "Nao pago"}
                        </span>
                        {item.reminder_enabled && <span className="payable-bell" title="Lembrete ativo">🔔</span>}
                      </td>
                      <td>{formatCurrency(item.value)}</td>
                      <td className="payable-actions">
                        <button type="button" onClick={() => triggerReminder(item.id)}>
                          Acionar lembrete
                        </button>
                        <button type="button" className="secondary" onClick={() => togglePaid(item)}>
                          {item.status === "pago" ? "Reabrir" : "Marcar pago"}
                        </button>
                        <button type="button" className="danger" onClick={() => remove(item.id)}>
                          Excluir
                        </button>
                      </td>
                    </tr>
                  );
                })}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan="7">
                      <div className="finance-empty-state">
                        <span />
                        <strong>Nenhuma conta a pagar</strong>
                        <p>Cadastre uma conta ou importe um boleto ao lado.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <aside className="finance-entry-panel">
            <h3>Nova conta a pagar</h3>

            <form onSubmit={addManual}>
              <span>Cadastro manual</span>
              <input
                placeholder="Descricao"
                value={form.description}
                onChange={(event) => setForm({ ...form, description: event.target.value })}
              />
              <input
                placeholder="Beneficiario / fornecedor"
                value={form.party}
                onChange={(event) => setForm({ ...form, party: event.target.value })}
              />
              <select
                value={form.category}
                onChange={(event) => setForm({ ...form, category: event.target.value })}
              >
                {CATEGORIES.map((c) => (
                  <option key={c.key} value={c.key}>{c.label}</option>
                ))}
              </select>
              <input
                placeholder="Valor"
                inputMode="decimal"
                value={form.value}
                onChange={(event) => setForm({ ...form, value: event.target.value })}
              />
              <label className="payable-field-label">
                Data de vencimento
                <input
                  type="date"
                  value={form.due_date}
                  onChange={(event) => setForm({ ...form, due_date: event.target.value })}
                />
              </label>
              <label className="payable-check">
                <input
                  type="checkbox"
                  checked={form.reminder_enabled}
                  onChange={(event) => setForm({ ...form, reminder_enabled: event.target.checked })}
                />
                Acionar lembrete por e-mail
              </label>
              <button type="submit" disabled={busy}>Adicionar conta</button>
            </form>

            <form onSubmit={importBoleto} className="payable-boleto-form">
              <span>Boleto (imagem ou linha digitavel)</span>
              <p className="payable-hint">
                A NEXT identifica o beneficiario, o vencimento e o valor e lanca
                sozinha.
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={(event) => setBoleto({ ...boleto, file: event.target.files?.[0] || null })}
              />
              <input
                placeholder="Cole a linha digitavel do boleto"
                value={boleto.line}
                onChange={(event) => setBoleto({ ...boleto, line: event.target.value })}
              />
              <label className="payable-check">
                <input
                  type="checkbox"
                  checked={boleto.reminder}
                  onChange={(event) => setBoleto({ ...boleto, reminder: event.target.checked })}
                />
                Acionar lembrete por e-mail
              </label>
              <button type="submit" disabled={busy}>
                {busy ? "Identificando..." : "Identificar e lancar"}
              </button>
            </form>
          </aside>
        </section>
      </main>
    </div>
  );
}
