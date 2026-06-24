import { useEffect, useMemo, useState } from "react";
import API from "../services/api";
import { logError } from "../utils/logger";

function formatCurrency(value) {
  return Number(value || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
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

export default function PricingHistory() {
  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState("");
  const [marketplace, setMarketplace] = useState("Todos");
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadHistory();
  }, []);

  async function loadHistory() {
    try {
      setMessage("");
      const response = await API.get("/pricing-history");
      setHistory(response.data || []);
    } catch (error) {
      logError(error);
      setMessage("Nao foi possivel carregar o historico de precificacao.");
    }
  }

  const marketplaces = useMemo(() => {
    return [
      "Todos",
      ...Array.from(
        new Set(history.map((item) => item.marketplace).filter(Boolean))
      ),
    ];
  }, [history]);

  const filteredHistory = history.filter((item) => {
    const term = search.toLowerCase();
    const matchesSearch = [
      item.sku,
      item.product_name,
      item.marketplace,
      item.suggested_price,
    ]
      .join(" ")
      .toLowerCase()
      .includes(term);
    const matchesMarketplace =
      marketplace === "Todos" || item.marketplace === marketplace;

    return matchesSearch && matchesMarketplace;
  });

  const metrics = useMemo(() => {
    const totalPrice = filteredHistory.reduce(
      (sum, item) => sum + Number(item.suggested_price || 0),
      0
    );
    const totalProfit = filteredHistory.reduce(
      (sum, item) => sum + Number(item.profit || 0),
      0
    );
    const averageMargin =
      filteredHistory.length > 0
        ? filteredHistory.reduce((sum, item) => sum + Number(item.margin || 0), 0) /
          filteredHistory.length
        : 0;

    return { totalPrice, totalProfit, averageMargin };
  }, [filteredHistory]);

  return (
    <div className="page">
      <section className="settings-title-card">
        <div>
          <span className="section-kicker">Precificacao</span>
          <h1>Historico de precificacao</h1>
          <p>
            Consulte os calculos salvos pela calculadora e acompanhe preco,
            lucro e margem por produto e marketplace.
          </p>
        </div>
        <button type="button" onClick={loadHistory}>
          Atualizar
        </button>
      </section>

      <section className="finance-summary-strip">
        <article className="neutral">
          <span>Calculos salvos</span>
          <strong>{filteredHistory.length}</strong>
          <small>{history.length} registros no historico</small>
        </article>
        <article className="positive">
          <span>Preco sugerido total</span>
          <strong>{formatCurrency(metrics.totalPrice)}</strong>
          <small>Base filtrada</small>
        </article>
        <article className={metrics.totalProfit >= 0 ? "positive" : "negative"}>
          <span>Lucro estimado</span>
          <strong>{formatCurrency(metrics.totalProfit)}</strong>
          <small>Somatorio dos calculos</small>
        </article>
        <article className={metrics.averageMargin >= 0 ? "positive" : "negative"}>
          <span>Margem media</span>
          <strong>{metrics.averageMargin.toFixed(2)}%</strong>
          <small>Base filtrada</small>
        </article>
      </section>

      <section className="box">
        <div className="finance-filter-row">
          <select
            value={marketplace}
            onChange={(event) => setMarketplace(event.target.value)}
          >
            {marketplaces.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
          <input
            placeholder="Buscar SKU, produto, marketplace ou preco"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <button
            type="button"
            disabled={filteredHistory.length === 0}
            onClick={() =>
              exportCsv(
                "historico-precificacao.csv",
                filteredHistory.map((item) => ({
                  id: item.id,
                  sku: item.sku,
                  produto: item.product_name,
                  marketplace: item.marketplace,
                  preco_sugerido: item.suggested_price,
                  lucro: item.profit,
                  margem: item.margin,
                  criado_em: item.created_at,
                }))
              )
            }
          >
            Exportar CSV
          </button>
        </div>

        {message && <strong className="bulk-message">{message}</strong>}

        <table>
          <thead>
            <tr>
              <th>Data</th>
              <th>SKU</th>
              <th>Produto</th>
              <th>Marketplace</th>
              <th>Preco sugerido</th>
              <th>Lucro</th>
              <th>Margem</th>
            </tr>
          </thead>
          <tbody>
            {filteredHistory.map((item) => (
              <tr key={item.id}>
                <td>
                  {item.created_at
                    ? new Date(item.created_at).toLocaleString("pt-BR")
                    : "-"}
                </td>
                <td>{item.sku || "-"}</td>
                <td>{item.product_name || "Produto sem nome"}</td>
                <td>{item.marketplace || "-"}</td>
                <td>{formatCurrency(item.suggested_price)}</td>
                <td>{formatCurrency(item.profit)}</td>
                <td>{Number(item.margin || 0).toFixed(2)}%</td>
              </tr>
            ))}

            {filteredHistory.length === 0 && (
              <tr>
                <td colSpan="7">Nenhum historico encontrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
