import { useEffect, useMemo, useState } from "react";
import API from "../services/api";
import { logError } from "../utils/logger";

const MARKETPLACES = ["Todas", "Shopee", "Mercado Livre", "Amazon", "Shein", "TikTok Shop", "Temu"];

const STATE_TABS = [
  { key: "all", label: "Tudo" },
  { key: "para_receber", label: "Para Receber" },
  { key: "recebido", label: "Recebido" },
  { key: "completo", label: "Completo" },
  { key: "excecao", label: "Excecao" },
];

const STATE_LABEL = {
  para_receber: "Para Receber",
  recebido: "Recebido",
  completo: "Completo",
  excecao: "Excecao",
};

function formatCurrency(value) {
  return Number(value || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function Returns() {
  const [data, setData] = useState({ returns: [], counts: {}, total: 0, total_value: 0 });
  const [tab, setTab] = useState("all");
  const [marketplace, setMarketplace] = useState("Todas");
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const response = await API.get("/returns");
      setData(response.data || { returns: [], counts: {}, total: 0, total_value: 0 });
    } catch (error) {
      logError(error);
      setMessage("Nao foi possivel carregar as devolucoes.");
    }
  }

  async function sync() {
    setMessage(
      "A sincronizacao de devolucoes entra automaticamente quando as APIs dos marketplaces forem conectadas em Integracoes."
    );
  }

  async function remove(id) {
    if (!window.confirm("Remover esta devolucao?")) return;
    try {
      await API.delete(`/returns/${id}`);
      await load();
    } catch (error) {
      logError(error);
    }
  }

  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return (data.returns || []).filter((item) => {
      const matchTab = tab === "all" || item.state === tab;
      const matchMarket = marketplace === "Todas" || item.marketplace === marketplace;
      const matchSearch = `${item.return_number} ${item.order_number} ${item.product_name} ${item.buyer}`
        .toLowerCase()
        .includes(term);
      return matchTab && matchMarket && matchSearch;
    });
  }, [data, tab, marketplace, search]);

  function exportCsv() {
    if (!filtered.length) return;
    const headers = ["return_number", "order_number", "marketplace", "product_name", "quantity", "value", "reason", "buyer", "state", "return_time"];
    const csv = [
      headers.join(";"),
      ...filtered.map((r) => headers.map((h) => `"${r[h] ?? ""}"`).join(";")),
    ].join("\n");
    const blob = new Blob([`﻿${csv}`], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "devolucoes.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="page returns-page">
      <section className="settings-title-card">
        <div>
          <span className="section-kicker">Pedidos / Pos-venda</span>
          <h1>Devolucoes</h1>
          <p>
            Rastreamento de devolucoes e reembolsos de todas as plataformas, com
            as mesmas informacoes dos marketplaces. Total: {formatCurrency(data.total_value)}.
          </p>
        </div>
        <div className="returns-head-actions">
          <button type="button" className="secondary" onClick={exportCsv}>Exportar</button>
          <button type="button" onClick={sync}>Sincronizar</button>
        </div>
      </section>

      <section className="box returns-filters">
        <input
          placeholder="N de Devolucao, pedido, produto ou comprador"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={marketplace} onChange={(e) => setMarketplace(e.target.value)}>
          {MARKETPLACES.map((m) => (
            <option key={m}>{m}</option>
          ))}
        </select>
      </section>

      <section className="box">
        <div className="up-tabs returns-tabs">
          {STATE_TABS.map((t) => (
            <button key={t.key} type="button" className={tab === t.key ? "active" : ""} onClick={() => setTab(t.key)}>
              {t.label} <span>{t.key === "all" ? data.total : data.counts?.[t.key] || 0}</span>
            </button>
          ))}
        </div>

        {message && <strong className="bulk-message">{message}</strong>}

        <table className="up-table returns-table">
          <thead>
            <tr>
              <th>Produtos</th>
              <th>Qtd</th>
              <th>Razao / Comprador</th>
              <th>Logistica de Devolucao</th>
              <th>Status na Plataforma</th>
              <th>Estado</th>
              <th>Tempo</th>
              <th>Acoes</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={item.id}>
                <td>
                  <div className="up-sku-cell">
                    {item.image_url ? (
                      <img src={item.image_url} alt="" className="up-thumb" />
                    ) : (
                      <div className="up-thumb placeholder">IMG</div>
                    )}
                    <div>
                      <strong>{item.product_name || "-"}</strong>
                      <span>
                        Dev: {item.return_number} · Pedido: {item.order_number || "-"} · {item.marketplace}
                      </span>
                    </div>
                  </div>
                </td>
                <td>x{item.quantity} · {formatCurrency(item.value)}</td>
                <td>
                  <strong>{item.reason || "-"}</strong>
                  <span className="up-muted">{item.buyer || "-"}</span>
                </td>
                <td>
                  {item.logistics_status || "-"}
                  {item.tracking && <div className="up-muted">{item.tracking}</div>}
                </td>
                <td>{item.platform_status || "-"}</td>
                <td>
                  <span className={`returns-state ${item.state}`}>{STATE_LABEL[item.state] || item.state}</span>
                </td>
                <td className="up-muted">{item.return_time || "-"}</td>
                <td className="up-actions">
                  <button type="button" className="danger" onClick={() => remove(item.id)}>Excluir</button>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan="8" className="up-empty">
                  Nenhuma devolucao. Quando as APIs dos marketplaces conectarem, as devolucoes aparecem aqui automaticamente.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
