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

const profitChannels = [
  { key: "all", label: "Todos canais" },
  { key: "shopee", label: "Shopee" },
  { key: "shein", label: "Shein" },
  { key: "tiktok", label: "TikTok Shop" },
  { key: "physical", label: "Pedidos de Vendas" },
  { key: "store", label: "Lucro da Loja" },
];

const invoiceModes = [
  { key: "company", label: "Por empresa" },
  { key: "store", label: "Por loja" },
];

const ncmPages = [
  { page: "ncm-sales-report", label: "Relatorios de Vendas" },
  { page: "ncm-purchase-report", label: "Relatorio de Compras" },
  { page: "ncm-stock-report", label: "Relatorio de Estatisticas" },
];

const pageMeta = {
  finance: {
    title: "Resumo financeiro",
    notice: "Acompanhe receitas, despesas, margem e movimentacoes em uma visao unica da operacao.",
    totalLabel: "Resultado liquido",
  },
  "cash-flow": {
    title: "Caixa e bancos",
    notice: "Fluxo consolidado das contas onde recebimentos e pagamentos foram concluidos ou planejados.",
    totalLabel: "Saldo do periodo",
  },
  "accounts-payable": {
    title: "Contas a pagar",
    notice: "Gerencie pagamentos a fornecedores, despesas fixas e prazos para evitar atrasos.",
    totalLabel: "Valor total a pagar",
  },
  "accounts-receivable": {
    title: "Contas a receber",
    notice: "Controle recebimentos de clientes e marketplaces com previsao de liquidacao.",
    totalLabel: "Valor total a receber",
  },
  "profit-report": {
    title: "Relatorio de lucros",
    notice: "Resumo de lucro por origem, considerando receitas, custos cadastrados e despesas do periodo.",
    totalLabel: "Lucro total",
  },
  "invoice-report": {
    title: "Relatorio de NF-e",
    notice: "Visao gerencial das notas e valores fiscais relacionados ao financeiro da empresa.",
    totalLabel: "Valor total NF-e",
  },
  "ncm-sales-report": {
    title: "NCM de vendas",
    notice: "Resumo fiscal por NCM para notas emitidas, quantidade vendida e preco unitario medio.",
    totalLabel: "Valor total",
  },
  "ncm-purchase-report": {
    title: "NCM de compras",
    notice: "Resumo fiscal por NCM para compras e fornecedores vinculados aos lancamentos.",
    totalLabel: "Valor total",
  },
  "ncm-stock-report": {
    title: "NCM de estoque",
    notice: "Estatistica fiscal de estoque por NCM com entradas, saidas e saldo final estimado.",
    totalLabel: "Estoque final",
  },
  taxes: {
    title: "Impostos",
    notice: "Acompanhe impostos estimados e categorias fiscais usadas nos lancamentos financeiros.",
    totalLabel: "Impostos estimados",
  },
};

function resolveChannel(text = "") {
  const value = text.toLowerCase();

  if (value.includes("shopee")) return "shopee";
  if (value.includes("shein")) return "shein";
  if (value.includes("tiktok")) return "tiktok";
  if (value.includes("mercado") || value.includes("amazon")) return "store";
  if (value.includes("direta") || value.includes("loja")) return "physical";
  return "store";
}

function formatCurrency(value) {
  return Number(value || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function formatPercent(value) {
  return `${Number(value || 0).toFixed(2)}%`;
}

function exportCsv(filename, rows) {
  if (!rows.length) return;

  const headers = Object.keys(rows[0]);
  const escape = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;
  const csv = [
    headers.join(";"),
    ...rows.map((row) => headers.map((header) => escape(row[header])).join(";")),
  ].join("\n");
  const blob = new Blob([`\ufeff${csv}`], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export default function Finance({ activePage = "finance", setPage }) {
  const [revenues, setRevenues] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [search, setSearch] = useState("");
  const [period, setPeriod] = useState("Este mes");
  const [status, setStatus] = useState("Todos");
  const [profitChannel, setProfitChannel] = useState("all");
  const [invoiceMode, setInvoiceMode] = useState("company");
  const [message, setMessage] = useState("");

  const [revenueForm, setRevenueForm] = useState({
    description: "",
    value: "",
    category: "Venda Shopee",
  });

  const [expenseForm, setExpenseForm] = useState({
    name: "",
    value: "",
    category: "Fixa",
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [rev, exp] = await Promise.all([
        API.get("/revenues"),
        API.get("/expenses"),
      ]);

      setRevenues(rev.data || []);
      setExpenses(exp.data || []);
    } catch (error) {
      logError(error);
      setMessage("Nao foi possivel carregar os dados financeiros.");
    }
  }

  async function createRevenue(event) {
    event.preventDefault();
    setMessage("");

    if (!revenueForm.description || !revenueForm.value) {
      setMessage("Preencha descricao e valor da receita.");
      return;
    }

    try {
      await API.post("/revenues", {
        description: revenueForm.description,
        value: Number(revenueForm.value),
        category: revenueForm.category,
      });

      setRevenueForm({ description: "", value: "", category: "Venda Shopee" });
      await loadData();
    } catch (error) {
      logError(error);
      setMessage("Nao foi possivel registrar a receita.");
    }
  }

  async function createExpense(event) {
    event.preventDefault();
    setMessage("");

    if (!expenseForm.name || !expenseForm.value) {
      setMessage("Preencha descricao e valor da despesa.");
      return;
    }

    try {
      await API.post("/expenses", {
        name: expenseForm.name,
        value: Number(expenseForm.value),
        category: expenseForm.category,
      });

      setExpenseForm({ name: "", value: "", category: "Fixa" });
      await loadData();
    } catch (error) {
      logError(error);
      setMessage("Nao foi possivel registrar a despesa.");
    }
  }

  async function deleteRevenue(id) {
    if (!window.confirm("Deseja excluir esta receita?")) return;

    try {
      await API.delete("/revenues/" + id);
      await loadData();
    } catch (error) {
      logError(error);
      setMessage("Nao foi possivel excluir a receita.");
    }
  }

  async function deleteExpense(id) {
    if (!window.confirm("Deseja excluir esta despesa?")) return;

    try {
      await API.delete("/expenses/" + id);
      await loadData();
    } catch (error) {
      logError(error);
      setMessage("Nao foi possivel excluir a despesa.");
    }
  }

  const totalRevenue = revenues.reduce((sum, item) => sum + Number(item.value || 0), 0);
  const totalExpense = expenses.reduce((sum, item) => sum + Number(item.value || 0), 0);
  const profit = totalRevenue - totalExpense;
  const margin = totalRevenue > 0 ? (profit / totalRevenue) * 100 : 0;

  const rows = useMemo(() => {
    const revenueRows = revenues.map((item) => ({
      channel: resolveChannel(`${item.category} ${item.description}`),
      id: `revenue-${item.id}`,
      rawId: item.id,
      source: "Receita",
      number: `CR-${String(item.id).padStart(5, "0")}`,
      orderNumber: `PV-${String(item.id).padStart(6, "0")}`,
      date: "Hoje",
      settlementDate: "Hoje",
      description: item.description || "Receita sem descricao",
      category: item.category || "Receita",
      store: item.category || "Canal NEXTERP",
      party: "Cliente / Marketplace",
      account: "Conta NEXTERP",
      status: "Recebido",
      value: Number(item.value || 0),
      cost: 0,
      platformFee: Number(item.value || 0) * 0.08,
      refund: 0,
      signedValue: Number(item.value || 0),
      canDelete: true,
    }));
    const expenseRows = expenses.map((item) => ({
      channel: resolveChannel(`${item.category} ${item.name}`),
      id: `expense-${item.id}`,
      rawId: item.id,
      source: "Despesa",
      number: `CP-${String(item.id).padStart(5, "0")}`,
      orderNumber: `NF-${String(item.id).padStart(6, "0")}`,
      date: "Hoje",
      settlementDate: "Pendente",
      description: item.name || "Despesa sem descricao",
      category: item.category || "Despesa",
      store: "Centro de custo",
      party: "Fornecedor / Prestador",
      account: "Conta NEXTERP",
      status: "Nao pago",
      value: Number(item.value || 0),
      cost: Number(item.value || 0),
      platformFee: 0,
      refund: 0,
      signedValue: Number(item.value || 0) * -1,
      canDelete: true,
    }));

    return [...revenueRows, ...expenseRows];
  }, [revenues, expenses]);

  const pageRows = rows.filter((row) => {
    if (activePage === "accounts-payable") return row.source === "Despesa";
    if (activePage === "accounts-receivable") return row.source === "Receita";
    if (activePage === "profit-report") {
      return profitChannel === "all" || row.channel === profitChannel;
    }
    if (activePage === "invoice-report") return row.source === "Receita";
    if (activePage === "ncm-sales-report") return row.source === "Receita";
    if (activePage === "ncm-purchase-report") return row.source === "Despesa";
    if (activePage === "ncm-stock-report") return true;
    if (activePage === "taxes") return row.source === "Despesa";
    return true;
  });

  const filteredRows = pageRows.filter((row) => {
    const term = search.toLowerCase();
    const matchesSearch = [
      row.number,
      row.description,
      row.category,
      row.party,
      row.account,
    ].join(" ").toLowerCase().includes(term);
    const matchesStatus = status === "Todos" || row.status === status || row.source === status;

    return matchesSearch && matchesStatus;
  });

  const meta = pageMeta[activePage] || pageMeta.finance;
  const isProfitReport = activePage === "profit-report";
  const isInvoiceReport = activePage === "invoice-report";
  const isNcmReport = activePage.startsWith("ncm-");
  const reportRevenue = filteredRows
    .filter((row) => row.source === "Receita")
    .reduce((sum, row) => sum + row.value, 0);
  const reportCost = filteredRows
    .filter((row) => row.source === "Despesa")
    .reduce((sum, row) => sum + row.value, 0);
  const reportFees = filteredRows.reduce((sum, row) => sum + Number(row.platformFee || 0), 0);
  const reportRefunds = filteredRows.reduce((sum, row) => sum + Number(row.refund || 0), 0);
  const reportProfit = reportRevenue - reportCost - reportFees - reportRefunds;
  const reportMargin = reportRevenue > 0 ? (reportProfit / reportRevenue) * 100 : 0;
  const invoiceReturned = filteredRows.reduce((sum, row) => sum + Number(row.platformFee || 0) * 0.35, 0);
  const invoiceCanceled = filteredRows.reduce((sum, row) => sum + Number(row.refund || 0), 0);
  const invoiceIssued = filteredRows.reduce((sum, row) => sum + row.value, 0);
  const ncmTotalQty = filteredRows.reduce((sum, row) => sum + (row.source === "Receita" ? 3 : 1), 0);
  const ncmTotalValue = filteredRows.reduce((sum, row) => sum + row.value, 0);
  const ncmAverageUnit = ncmTotalQty > 0 ? ncmTotalValue / ncmTotalQty : 0;
  const pageTotal = filteredRows.reduce((sum, row) => {
    if (activePage === "accounts-payable" || activePage === "taxes") {
      return sum + row.value;
    }

    if (activePage === "accounts-receivable" || activePage === "invoice-report") {
      return sum + row.value;
    }

    return sum + row.signedValue;
  }, 0);

  const summaryCards = [
    ...(isProfitReport
      ? [
          { label: "Lucro total", value: formatCurrency(reportProfit), hint: "Periodo filtrado", tone: reportProfit >= 0 ? "positive" : "negative" },
          { label: "Margem media", value: formatPercent(reportMargin), hint: "Sobre recebimentos", tone: reportMargin >= 0 ? "positive" : "negative" },
          { label: "Pedidos", value: filteredRows.filter((row) => row.source === "Receita").length, hint: "Lancamentos de venda", tone: "neutral" },
          { label: "Recebimento", value: formatCurrency(reportRevenue), hint: "Receitas brutas", tone: "positive" },
          { label: "Custo total", value: formatCurrency(reportCost), hint: "Despesas vinculadas", tone: "negative" },
          { label: "Taxas", value: formatCurrency(reportFees), hint: "Estimativa do canal", tone: "negative" },
          { label: "Reembolso", value: formatCurrency(reportRefunds), hint: "Ocorrencias", tone: "neutral" },
        ]
      : isInvoiceReport
        ? [
            { label: "Valor total NF-e", value: formatCurrency(invoiceIssued - invoiceReturned), hint: "Total liquido", tone: "positive" },
            { label: "Valor emitido", value: formatCurrency(invoiceIssued), hint: "Notas emitidas", tone: "positive" },
            { label: "Valor devolvido", value: formatCurrency(invoiceReturned * -1), hint: "Devolucoes", tone: "negative" },
            { label: "Valor cancelado", value: formatCurrency(invoiceCanceled), hint: "Cancelamentos", tone: "neutral" },
          ]
        : isNcmReport
          ? [
              { label: "NCM total", value: Math.max(filteredRows.length, 0), hint: "Codigos agrupados", tone: "neutral" },
              { label: "Quantidade total", value: ncmTotalQty, hint: "Unidades estimadas", tone: "positive" },
              { label: "Valor total", value: formatCurrency(ncmTotalValue), hint: "Periodo filtrado", tone: "positive" },
              { label: "Preco unitario medio", value: formatCurrency(ncmAverageUnit), hint: "Media fiscal", tone: "neutral" },
            ]
      : [
          { label: "Receitas", value: formatCurrency(totalRevenue), hint: "Entradas", tone: "positive" },
          { label: "Despesas", value: formatCurrency(totalExpense), hint: "Saidas", tone: "negative" },
          { label: "Lucro liquido", value: formatCurrency(profit), hint: "Resultado", tone: profit >= 0 ? "positive" : "negative" },
          { label: "Margem", value: formatPercent(margin), hint: "Rentabilidade", tone: margin >= 0 ? "positive" : "negative" },
        ]),
  ];

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
                className={activePage === item.page ? "active" : ""}
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
          <p>{meta.notice}</p>
          <button type="button" onClick={loadData}>Atualizar</button>
        </section>

        <section className="finance-control-surface">
          <div className="finance-title-row">
            <div>
              <span>{period}</span>
              <h2>{meta.title}</h2>
            </div>
            <strong>{meta.totalLabel}: {formatCurrency(pageTotal)}</strong>
          </div>

          <div className="finance-filter-row">
            <select value={period} onChange={(event) => setPeriod(event.target.value)}>
              <option>Este mes</option>
              <option>Ultimos 7 dias</option>
              <option>Ultimos 30 dias</option>
              <option>Este ano</option>
            </select>
            <input
              placeholder="Pesquisar numero, categoria, cliente ou fornecedor"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <select value={status} onChange={(event) => setStatus(event.target.value)}>
              <option>Todos</option>
              <option>Receita</option>
              <option>Despesa</option>
              <option>Recebido</option>
              <option>Nao pago</option>
            </select>
            <button
              type="button"
              onClick={() =>
                exportCsv(
                  "financeiro-catedral.csv",
                  filteredRows.map((row) => ({
                    numero: row.number,
                    data: row.date,
                    tipo: row.source,
                    descricao: row.description,
                    categoria: row.category,
                    participante: row.party,
                    conta: row.account,
                    status: row.status,
                    valor: row.value,
                  }))
                )
              }
              disabled={filteredRows.length === 0}
            >
              Exportar
            </button>
          </div>
        </section>

        {isProfitReport && (
          <section className="finance-report-switcher">
            <strong>Lucros por canal</strong>
            <div>
              {profitChannels.map((channel) => (
                <button
                  type="button"
                  key={channel.key}
                  className={profitChannel === channel.key ? "active" : ""}
                  onClick={() => setProfitChannel(channel.key)}
                >
                  {channel.label}
                </button>
              ))}
            </div>
          </section>
        )}

        {isInvoiceReport && (
          <section className="finance-report-switcher">
            <strong>Relatorio de nota fiscal</strong>
            <div>
              {invoiceModes.map((mode) => (
                <button
                  type="button"
                  key={mode.key}
                  className={invoiceMode === mode.key ? "active" : ""}
                  onClick={() => setInvoiceMode(mode.key)}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </section>
        )}

        {isNcmReport && (
          <section className="finance-report-switcher">
            <strong>Relatorio NCM</strong>
            <div>
              {ncmPages.map((item) => (
                <button
                  type="button"
                  key={item.page}
                  className={activePage === item.page ? "active" : ""}
                  onClick={() => setPage?.(item.page)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </section>
        )}

        <section className="finance-summary-strip">
          {summaryCards.map((card) => (
            <article key={card.label} className={card.tone}>
              <span>{card.label}</span>
              <strong>{card.value}</strong>
              <small>{card.hint}</small>
            </article>
          ))}
        </section>

        <section className="finance-main-grid">
          <div className="finance-table-card">
            <div className="finance-table-tools">
              <strong>Total {filteredRows.length}</strong>
              <div>
                <button type="button">Ordem</button>
                <select defaultValue="50">
                  <option value="20">20/pag.</option>
                  <option value="50">50/pag.</option>
                  <option value="100">100/pag.</option>
                </select>
              </div>
            </div>

            {isProfitReport ? (
              <ProfitReportTable rows={filteredRows} />
            ) : isInvoiceReport ? (
              <InvoiceReportTable rows={filteredRows} mode={invoiceMode} />
            ) : isNcmReport ? (
              <NcmReportTable rows={filteredRows} activePage={activePage} />
            ) : (
              <table className="finance-ledger-table">
                <thead>
                  <tr>
                    <th>Numero</th>
                    <th>Data</th>
                    <th>Descricao</th>
                    <th>Cliente/Fornecedor</th>
                    <th>Conta</th>
                    <th>Categoria</th>
                    <th>Status</th>
                    <th>Valor</th>
                    <th>Acoes</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRows.map((row) => (
                    <tr key={row.id}>
                      <td>{row.number}</td>
                      <td>{row.date}</td>
                      <td>
                        <strong>{row.description}</strong>
                        <span>{row.source}</span>
                      </td>
                      <td>{row.party}</td>
                      <td>{row.account}</td>
                      <td>{row.category}</td>
                      <td>
                        <span className={`finance-status ${row.source === "Receita" ? "received" : "pending"}`}>
                          {row.status}
                        </span>
                      </td>
                      <td>{formatCurrency(row.value)}</td>
                      <td>
                        <button
                          type="button"
                          onClick={() =>
                            row.source === "Receita"
                              ? deleteRevenue(row.rawId)
                              : deleteExpense(row.rawId)
                          }
                        >
                          Excluir
                        </button>
                      </td>
                    </tr>
                  ))}

                  {filteredRows.length === 0 && (
                    <tr>
                      <td colSpan="9">
                        <FinanceEmptyState />
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>

          <aside className="finance-entry-panel">
            <h3>Lancamento rapido</h3>
            {message && <strong className="finance-form-message">{message}</strong>}

            <form onSubmit={createRevenue}>
              <span>Nova receita</span>
              <input
                placeholder="Descricao da receita"
                value={revenueForm.description}
                onChange={(event) =>
                  setRevenueForm({ ...revenueForm, description: event.target.value })
                }
              />
              <input
                placeholder="Valor"
                inputMode="decimal"
                value={revenueForm.value}
                onChange={(event) =>
                  setRevenueForm({ ...revenueForm, value: event.target.value })
                }
              />
              <select
                value={revenueForm.category}
                onChange={(event) =>
                  setRevenueForm({ ...revenueForm, category: event.target.value })
                }
              >
                <option>Venda Shopee</option>
                <option>Venda Mercado Livre</option>
                <option>Venda Amazon</option>
                <option>Venda TikTok Shop</option>
                <option>Venda Direta</option>
                <option>Outras receitas</option>
              </select>
              <button type="submit">Adicionar receita</button>
            </form>

            <form onSubmit={createExpense}>
              <span>Nova despesa</span>
              <input
                placeholder="Descricao da despesa"
                value={expenseForm.name}
                onChange={(event) =>
                  setExpenseForm({ ...expenseForm, name: event.target.value })
                }
              />
              <input
                placeholder="Valor"
                inputMode="decimal"
                value={expenseForm.value}
                onChange={(event) =>
                  setExpenseForm({ ...expenseForm, value: event.target.value })
                }
              />
              <select
                value={expenseForm.category}
                onChange={(event) =>
                  setExpenseForm({ ...expenseForm, category: event.target.value })
                }
              >
                <option>Fixa</option>
                <option>Aluguel</option>
                <option>Energia</option>
                <option>Funcionarios</option>
                <option>Pro-labore</option>
                <option>MDF</option>
                <option>Insumos</option>
                <option>Impostos</option>
                <option>Marketing</option>
                <option>Outras despesas</option>
              </select>
              <button type="submit">Adicionar despesa</button>
            </form>
          </aside>
        </section>
      </main>
    </div>
  );
}

function ProfitReportTable({ rows }) {
  const revenueRows = rows.filter((row) => row.source === "Receita");
  const totalRevenue = revenueRows.reduce((sum, row) => sum + row.value, 0);
  const totalFees = revenueRows.reduce((sum, row) => sum + Number(row.platformFee || 0), 0);
  const totalCost = rows
    .filter((row) => row.source === "Despesa")
    .reduce((sum, row) => sum + row.value, 0);
  const totalProfit = totalRevenue - totalFees - totalCost;

  return (
    <table className="finance-ledger-table finance-profit-table">
      <thead>
        <tr>
          <th>Ordenado</th>
          <th>Liquidacao</th>
          <th>Pedido</th>
          <th>Loja</th>
          <th>Valor do pedido</th>
          <th>Recebimento</th>
          <th>Vendas de produtos</th>
          <th>Taxas do canal</th>
          <th>Lucro estimado</th>
        </tr>
      </thead>
      <tbody>
        {revenueRows.length > 0 && (
          <tr className="finance-total-row">
            <td>Resumo</td>
            <td>-</td>
            <td>{revenueRows.length}</td>
            <td>Todos</td>
            <td>{formatCurrency(totalRevenue)}</td>
            <td>{formatCurrency(totalRevenue)}</td>
            <td>{formatCurrency(totalRevenue)}</td>
            <td>{formatCurrency(totalFees + totalCost)}</td>
            <td>{formatCurrency(totalProfit)}</td>
          </tr>
        )}

        {revenueRows.map((row) => {
          const profit = row.value - Number(row.platformFee || 0);

          return (
            <tr key={row.id}>
              <td>{row.date}</td>
              <td>{row.settlementDate}</td>
              <td>
                <strong>{row.orderNumber}</strong>
                <span>{row.description}</span>
              </td>
              <td>
                <strong>{row.store}</strong>
                <span>{profitChannels.find((item) => item.key === row.channel)?.label || "NEXTERP"}</span>
              </td>
              <td>{formatCurrency(row.value)}</td>
              <td>{formatCurrency(row.value)}</td>
              <td>{formatCurrency(row.value)}</td>
              <td>{formatCurrency(row.platformFee)}</td>
              <td>{formatCurrency(profit)}</td>
            </tr>
          );
        })}

        {revenueRows.length === 0 && (
          <tr>
            <td colSpan="9">
              <FinanceEmptyState />
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

function InvoiceReportTable({ rows, mode }) {
  const groupedRows = Object.values(
    rows.reduce((acc, row) => {
      const key = mode === "company" ? row.party : row.store;
      const current = acc[key] || {
        key,
        label: key,
        document: mode === "company" ? "37.443.486/0001-42" : row.channel,
        issued: 0,
        returned: 0,
        canceled: 0,
      };

      current.issued += row.value;
      current.returned += Number(row.platformFee || 0) * 0.35;
      current.canceled += Number(row.refund || 0);
      acc[key] = current;
      return acc;
    }, {})
  );
  const totalIssued = groupedRows.reduce((sum, row) => sum + row.issued, 0);
  const totalReturned = groupedRows.reduce((sum, row) => sum + row.returned, 0);
  const totalCanceled = groupedRows.reduce((sum, row) => sum + row.canceled, 0);

  return (
    <table className="finance-ledger-table finance-invoice-table">
      <thead>
        <tr>
          <th>{mode === "company" ? "Contas NF-e/CNPJ" : "Loja"}</th>
          {mode === "store" && <th>Plataforma</th>}
          <th>Valor total NF-e</th>
          <th>Valor emitido</th>
          <th>Valor devolvido</th>
          <th>Valor cancelado</th>
        </tr>
      </thead>
      <tbody>
        {groupedRows.length > 0 && (
          <tr className="finance-total-row">
            <td>Resumo</td>
            {mode === "store" && <td>Todos</td>}
            <td>{formatCurrency(totalIssued - totalReturned)}</td>
            <td>{formatCurrency(totalIssued)}</td>
            <td>{formatCurrency(totalReturned * -1)}</td>
            <td>{formatCurrency(totalCanceled)}</td>
          </tr>
        )}

        {groupedRows.map((row) => (
          <tr key={row.key}>
            <td>
              <strong>{row.label}</strong>
              <span>{row.document}</span>
            </td>
            {mode === "store" && <td>{row.document}</td>}
            <td>{formatCurrency(row.issued - row.returned)}</td>
            <td>{formatCurrency(row.issued)}</td>
            <td>{formatCurrency(row.returned * -1)}</td>
            <td>{formatCurrency(row.canceled)}</td>
          </tr>
        ))}

        {groupedRows.length === 0 && (
          <tr>
            <td colSpan={mode === "store" ? "6" : "5"}>
              <FinanceEmptyState />
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

function NcmReportTable({ rows, activePage }) {
  const isPurchase = activePage === "ncm-purchase-report";
  const isStock = activePage === "ncm-stock-report";
  const groupedRows = Object.values(
    rows.reduce((acc, row, index) => {
      const ncm = ["44209000", "40012990", "20021000"][index % 3];
      const qty = row.source === "Receita" ? 3 + index : 1 + index;
      const current = acc[ncm] || {
        ncm,
        party: row.party,
        supplier: row.party,
        qty: 0,
        value: 0,
        imported: 0,
        stockStart: -4 * (index + 1),
        stockEnd: -5 * (index + 1),
      };

      current.qty += qty;
      current.imported += isPurchase ? qty : 0;
      current.value += row.value;
      acc[ncm] = current;
      return acc;
    }, {})
  );
  const totals = groupedRows.reduce(
    (acc, row) => ({
      qty: acc.qty + row.qty,
      value: acc.value + row.value,
      imported: acc.imported + row.imported,
      stockStart: acc.stockStart + row.stockStart,
      stockEnd: acc.stockEnd + row.stockEnd,
    }),
    { qty: 0, value: 0, imported: 0, stockStart: 0, stockEnd: 0 }
  );

  return (
    <table className="finance-ledger-table finance-ncm-table">
      <thead>
        {isStock ? (
          <tr>
            <th>NCM</th>
            <th>Contas NF-e/CNPJ</th>
            <th>Estoque inicial</th>
            <th>Estoque final</th>
            <th>Entrada</th>
            <th>Quantidade de compras</th>
            <th>Saidas</th>
          </tr>
        ) : (
          <tr>
            <th>NCM</th>
            <th>Contas NF-e/CNPJ</th>
            {isPurchase && <th>Fornecedores</th>}
            <th>Quantidade total</th>
            <th>Valor total</th>
            <th>Preco unitario medio</th>
            <th>{isPurchase ? "Quantidade importada" : "Quantidade emitida"}</th>
            <th>Valor emitido</th>
          </tr>
        )}
      </thead>
      <tbody>
        {groupedRows.length > 0 && (
          <tr className="finance-total-row">
            <td>Resumo</td>
            <td>-</td>
            {isPurchase && !isStock && <td>-</td>}
            {isStock ? (
              <>
                <td>{totals.stockStart}</td>
                <td>{totals.stockEnd}</td>
                <td>0</td>
                <td>{totals.imported}</td>
                <td>{totals.qty}</td>
              </>
            ) : (
              <>
                <td>{totals.qty}</td>
                <td>{formatCurrency(totals.value)}</td>
                <td>{formatCurrency(totals.qty > 0 ? totals.value / totals.qty : 0)}</td>
                <td>{isPurchase ? totals.imported : totals.qty}</td>
                <td>{formatCurrency(totals.value)}</td>
              </>
            )}
          </tr>
        )}

        {groupedRows.map((row) => (
          <tr key={row.ncm}>
            <td>{row.ncm}</td>
            <td>
              <strong>{row.party}</strong>
              <span>37.443.486/0002-23</span>
            </td>
            {isPurchase && !isStock && <td>{row.supplier}</td>}
            {isStock ? (
              <>
                <td>{row.stockStart}</td>
                <td className={row.stockEnd < 0 ? "finance-negative-cell" : ""}>{row.stockEnd}</td>
                <td>0</td>
                <td>{row.imported}</td>
                <td>{row.qty}</td>
              </>
            ) : (
              <>
                <td>{row.qty}</td>
                <td>{formatCurrency(row.value)}</td>
                <td>{formatCurrency(row.qty > 0 ? row.value / row.qty : 0)}</td>
                <td>{isPurchase ? row.imported : row.qty}</td>
                <td>{formatCurrency(row.value)}</td>
              </>
            )}
          </tr>
        ))}

        {groupedRows.length === 0 && (
          <tr>
            <td colSpan={isStock ? "7" : isPurchase ? "8" : "7"}>
              <FinanceEmptyState />
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

function FinanceEmptyState() {
  return (
    <div className="finance-empty-state">
      <span />
      <strong>Nenhum dado disponivel</strong>
      <p>Use os filtros ou cadastre um lancamento rapido para popular esta visao.</p>
    </div>
  );
}
