import { useEffect, useMemo, useState } from "react";
import API from "../services/api";
import { logError } from "../utils/logger";

const MARKETPLACES = ["Todas", "Shopee", "Mercado Livre", "Amazon", "Shein", "TikTok Shop", "Temu"];

function formatCurrency(value) {
  return Number(value || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function Pct({ value }) {
  const up = Number(value) >= 0;
  return (
    <small className={`sa-delta ${up ? "up" : "down"}`}>
      {up ? "▲" : "▼"} {Math.abs(Number(value || 0)).toFixed(1)}%
    </small>
  );
}

function SalesChart({ series, prevSeries }) {
  const width = 900;
  const height = 280;
  const pad = 30;
  const values = series.map((p) => p.value);
  const allValues = [...values, ...prevSeries];
  const max = Math.max(1, ...allValues);
  const n = Math.max(series.length, 1);

  const toPoints = (arr) =>
    arr
      .map((v, i) => {
        const x = pad + (i * (width - pad * 2)) / Math.max(n - 1, 1);
        const y = height - pad - (Number(v) / max) * (height - pad * 2);
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(" ");

  const curPoints = toPoints(values);
  const prevPoints = toPoints(prevSeries.slice(0, n));

  return (
    <svg className="sa-chart" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      {[0.25, 0.5, 0.75, 1].map((g) => (
        <line key={g} x1={pad} x2={width - pad} y1={height - pad - g * (height - pad * 2)} y2={height - pad - g * (height - pad * 2)} stroke="#eef1f5" />
      ))}
      {prevSeries.length > 0 && (
        <polyline points={prevPoints} fill="none" stroke="#22c55e" strokeWidth="2" strokeDasharray="6 5" opacity="0.7" />
      )}
      <polyline points={curPoints} fill="none" stroke="#2563eb" strokeWidth="2.5" />
    </svg>
  );
}

export default function SalesAnalysis() {
  const [period, setPeriod] = useState("30d");
  const [marketplace, setMarketplace] = useState("Todas");
  const [tab, setTab] = useState("date");
  const [data, setData] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period, marketplace]);

  async function load() {
    try {
      const params = { period };
      if (marketplace !== "Todas") params.marketplace = marketplace;
      const response = await API.get("/analytics/sales", { params });
      setData(response.data || null);
    } catch (error) {
      logError(error);
      setMessage("Nao foi possivel carregar a analise de vendas.");
    }
  }

  const kpis = data?.kpis || {};
  const cmp = data?.comparison || {};

  const cards = [
    { key: "total_sales", label: "Valor Total de Vendas", value: formatCurrency(kpis.total_sales) },
    { key: "total_orders", label: "Total de Pedidos", value: kpis.total_orders ?? 0 },
    { key: "valid_sales", label: "Valor de Vendas Validas", value: formatCurrency(kpis.valid_sales) },
    { key: "valid_orders", label: "Pedidos Validos", value: kpis.valid_orders ?? 0 },
    { key: "clients", label: "Clientes", value: kpis.clients ?? 0 },
    { key: "sales_per_client", label: "Vendas por Cliente", value: formatCurrency(kpis.sales_per_client) },
  ];

  function exportCsv() {
    const rows = tab === "date" ? data?.series || [] : data?.by_marketplace || [];
    if (!rows.length) return;
    const headers = Object.keys(rows[0]);
    const csv = [
      headers.join(";"),
      ...rows.map((r) => headers.map((h) => `"${r[h]}"`).join(";")),
    ].join("\n");
    const blob = new Blob([`﻿${csv}`], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "analise-de-vendas.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  const periodLabel = useMemo(() => {
    if (!data?.period) return "";
    const f = (v) => v.split("-").reverse().join("/");
    return `${f(data.period.start)} ~ ${f(data.period.end)}`;
  }, [data]);

  return (
    <div className="page sales-analysis-page">
      <section className="settings-title-card">
        <div>
          <span className="section-kicker">Analises / Relatorios de Vendas</span>
          <h1>Performance das Vendas</h1>
          <p>Vendas consolidadas de todas as plataformas, comparadas com o periodo anterior.</p>
        </div>
        <button type="button" onClick={exportCsv}>Exportar</button>
      </section>

      <section className="box sa-filters">
        <div className="sa-period-buttons">
          <button type="button" className={period === "7d" ? "active" : ""} onClick={() => setPeriod("7d")}>Ultimos 7 dias</button>
          <button type="button" className={period === "30d" ? "active" : ""} onClick={() => setPeriod("30d")}>Ultimos 30 dias</button>
          <button type="button" className={period === "month" ? "active" : ""} onClick={() => setPeriod("month")}>Este mes</button>
          <span className="sa-period-label">{periodLabel}</span>
        </div>
        <select value={marketplace} onChange={(e) => setMarketplace(e.target.value)}>
          {MARKETPLACES.map((m) => (
            <option key={m}>{m}</option>
          ))}
        </select>
      </section>

      <section className="box">
        <div className="sa-resume-head">
          <h2>Resumo (R$)</h2>
          <div className="sa-tabs">
            <button type="button" className={tab === "date" ? "active" : ""} onClick={() => setTab("date")}>Por Data</button>
            <button type="button" className={tab === "store" ? "active" : ""} onClick={() => setTab("store")}>Por Loja</button>
            <span className="sa-legend"><i className="cur" /> Periodo atual <i className="prev" /> Periodo anterior</span>
          </div>
        </div>

        {message && <strong className="bulk-message">{message}</strong>}

        <div className="sa-kpi-strip">
          {cards.map((card) => (
            <article key={card.key}>
              <span>{card.label}</span>
              <strong>{card.value}</strong>
              <Pct value={cmp[card.key]} />
            </article>
          ))}
        </div>

        {tab === "date" ? (
          <SalesChart series={data?.series || []} prevSeries={data?.prev_series || []} />
        ) : (
          <table className="finance-ledger-table">
            <thead>
              <tr>
                <th>Loja / Plataforma</th>
                <th>Pedidos</th>
                <th>Valor de vendas</th>
                <th>% do total</th>
              </tr>
            </thead>
            <tbody>
              {(data?.by_marketplace || []).map((m) => (
                <tr key={m.marketplace}>
                  <td><span className="up-chip">{m.marketplace}</span></td>
                  <td>{m.orders}</td>
                  <td>{formatCurrency(m.value)}</td>
                  <td>{kpis.total_sales ? `${((m.value / kpis.total_sales) * 100).toFixed(1)}%` : "-"}</td>
                </tr>
              ))}
              {(data?.by_marketplace || []).length === 0 && (
                <tr>
                  <td colSpan="4" className="up-empty">Sem vendas no periodo. Conecte e sincronize um marketplace.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
