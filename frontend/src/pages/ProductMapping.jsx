import { useEffect, useMemo, useState } from "react";
import API from "../services/api";
import { logError } from "../utils/logger";

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

function getMappingStatus(product) {
  const missing = [];

  if (!product.sku) missing.push("SKU");
  if (!product.marketplace) missing.push("marketplace");
  if (!product.category) missing.push("categoria");

  if (missing.length === 0) {
    return { label: "Mapeado", tone: "success", missing };
  }

  return {
    label: "Pendente",
    tone: missing.includes("SKU") ? "danger" : "warning",
    missing,
  };
}

export default function ProductMapping({ setPage }) {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [marketplace, setMarketplace] = useState("Todos");
  const [status, setStatus] = useState("Todos");
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      setMessage("");
      const response = await API.get("/products");
      setProducts(response.data || []);
    } catch (error) {
      logError(error);
      setMessage("Nao foi possivel carregar os produtos.");
    }
  }

  const rows = useMemo(() => {
    const term = search.toLowerCase();

    return products
      .map((product) => ({
        ...product,
        mappingStatus: getMappingStatus(product),
      }))
      .filter((product) => {
        const matchesSearch = [
          product.sku,
          product.name,
          product.category,
          product.marketplace,
          product.barcode,
        ]
          .join(" ")
          .toLowerCase()
          .includes(term);
        const matchesMarketplace =
          marketplace === "Todos" || product.marketplace === marketplace;
        const matchesStatus =
          status === "Todos" || product.mappingStatus.label === status;

        return matchesSearch && matchesMarketplace && matchesStatus;
      });
  }, [products, search, marketplace, status]);

  const marketplaces = useMemo(() => {
    return [
      "Todos",
      ...Array.from(
        new Set(products.map((product) => product.marketplace).filter(Boolean))
      ),
    ];
  }, [products]);

  const mappedCount = products.filter(
    (product) => getMappingStatus(product).label === "Mapeado"
  ).length;

  return (
    <div className="page">
      <section className="settings-title-card">
        <div>
          <span className="section-kicker">Produtos</span>
          <h1>Gerenciar mapeamento</h1>
          <p>
            Confira se cada produto tem SKU interno, marketplace e categoria
            suficientes para ser usado nos fluxos de estoque e precificacao.
          </p>
        </div>
        <button type="button" onClick={() => setPage?.("products")}>
          Abrir cadastro
        </button>
      </section>

      <section className="finance-summary-strip">
        <article className="neutral">
          <span>Total de produtos</span>
          <strong>{products.length}</strong>
          <small>Base cadastrada</small>
        </article>
        <article className="positive">
          <span>Mapeados</span>
          <strong>{mappedCount}</strong>
          <small>Prontos para operacao local</small>
        </article>
        <article className={products.length - mappedCount > 0 ? "negative" : "positive"}>
          <span>Pendentes</span>
          <strong>{products.length - mappedCount}</strong>
          <small>Precisam completar campos</small>
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
          <select value={status} onChange={(event) => setStatus(event.target.value)}>
            <option>Todos</option>
            <option>Mapeado</option>
            <option>Pendente</option>
          </select>
          <input
            placeholder="Buscar SKU, produto, categoria ou marketplace"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <button type="button" onClick={loadProducts}>
            Atualizar
          </button>
          <button
            type="button"
            disabled={rows.length === 0}
            onClick={() =>
              exportCsv(
                "mapeamento-produtos.csv",
                rows.map((product) => ({
                  sku: product.sku,
                  produto: product.name,
                  marketplace: product.marketplace,
                  categoria: product.category,
                  codigo_barras: product.barcode,
                  status: product.mappingStatus.label,
                  pendencias: product.mappingStatus.missing.join(", "),
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
              <th>SKU interno</th>
              <th>Produto</th>
              <th>Marketplace</th>
              <th>Categoria</th>
              <th>Codigo de barras</th>
              <th>Status</th>
              <th>Pendencias</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((product) => (
              <tr key={product.id}>
                <td>{product.sku || "-"}</td>
                <td>{product.name || "Produto sem nome"}</td>
                <td>{product.marketplace || "-"}</td>
                <td>{product.category || "-"}</td>
                <td>{product.barcode || "-"}</td>
                <td>
                  <span className={`stock-status ${product.mappingStatus.tone}`}>
                    {product.mappingStatus.label}
                  </span>
                </td>
                <td>{product.mappingStatus.missing.join(", ") || "-"}</td>
              </tr>
            ))}

            {rows.length === 0 && (
              <tr>
                <td colSpan="7">Nenhum produto encontrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
