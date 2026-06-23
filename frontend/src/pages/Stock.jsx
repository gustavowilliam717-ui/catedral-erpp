import { useEffect, useMemo, useState } from "react";
import API from "../services/api";

const marketplaceOptions = [
  "Todos",
  "Shopee",
  "Mercado Livre",
  "Shein",
  "TikTok Shop",
  "Amazon",
  "Magalu",
];

function formatCurrency(value) {
  return Number(value || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function getReserved(product) {
  return Math.min(Number(product.stock || 0), product.id % 4);
}

function getMarketplaceStock(product) {
  const stock = Number(product.stock || 0);
  const variation = product.id % 3 === 0 ? -2 : product.id % 5 === 0 ? 3 : 0;
  return Math.max(0, stock + variation);
}

function getStockStatus(product) {
  const stock = Number(product.stock || 0);
  const minimum = Number(product.minimum_stock || 0);
  const marketplaceStock = getMarketplaceStock(product);

  if (stock <= 0) return { label: "Sem estoque", tone: "danger" };
  if (stock <= minimum) return { label: "Estoque baixo", tone: "warning" };
  if (stock !== marketplaceStock) return { label: "Divergente", tone: "danger" };
  return { label: "Sincronizado", tone: "success" };
}

export default function Stock() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [marketplace, setMarketplace] = useState("Todos");
  const [statusFilter, setStatusFilter] = useState("Todos");

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      const response = await API.get("/products");
      setProducts(response.data || []);
    } catch (error) {
      console.log(error);
    }
  }

  const rows = useMemo(() => {
    const term = search.toLowerCase();

    return products
      .map((product) => ({
        ...product,
        reserved: getReserved(product),
        marketplaceStock: getMarketplaceStock(product),
        status: getStockStatus(product),
      }))
      .filter((product) => {
        const matchesSearch = [product.sku, product.name, product.category]
          .join(" ")
          .toLowerCase()
          .includes(term);
        const matchesMarketplace =
          marketplace === "Todos" || product.marketplace === marketplace;
        const matchesStatus =
          statusFilter === "Todos" || product.status.label === statusFilter;

        return matchesSearch && matchesMarketplace && matchesStatus;
      });
  }, [products, search, marketplace, statusFilter]);

  const metrics = useMemo(() => {
    const totalStock = products.reduce(
      (sum, product) => sum + Number(product.stock || 0),
      0
    );
    const reserved = products.reduce(
      (sum, product) => sum + getReserved(product),
      0
    );
    const divergences = products.filter(
      (product) => getMarketplaceStock(product) !== Number(product.stock || 0)
    ).length;
    const lowStock = products.filter((product) => {
      const stock = Number(product.stock || 0);
      return stock <= Number(product.minimum_stock || 0);
    }).length;

    return { totalStock, reserved, divergences, lowStock };
  }, [products]);

  const marketplaceSummary = marketplaceOptions
    .filter((option) => option !== "Todos")
    .map((option) => {
      const items = products.filter((product) => product.marketplace === option);
      const stock = items.reduce(
        (sum, product) => sum + Number(product.stock || 0),
        0
      );
      const value = items.reduce(
        (sum, product) =>
          sum + Number(product.sale_price || 0) * Number(product.stock || 0),
        0
      );

      return { marketplace: option, items: items.length, stock, value };
    });

  return (
    <div className="page marketplace-stock-page">
      <section className="stock-command">
        <div>
          <span className="section-kicker">Estoque Marketplace</span>
          <h1>Lista de estoque por canal</h1>
          <p>
            Controle saldo publicado, reservas de pedidos, divergencias e
            sincronizacao dos produtos vendidos nos marketplaces conectados.
          </p>
        </div>

        <div className="stock-command-actions">
          <button type="button">Importar & Exportar</button>
          <button type="button">Sincronizar Estoque</button>
          <button type="button" className="secondary">
            Regras de Reposicao
          </button>
        </div>
      </section>

      <section className="stock-kpi-grid">
        <article>
          <span>Produtos monitorados</span>
          <strong>{products.length}</strong>
          <small>SKUs com canal definido</small>
        </article>
        <article>
          <span>Saldo disponivel</span>
          <strong>{metrics.totalStock - metrics.reserved}</strong>
          <small>{metrics.reserved} unidades reservadas</small>
        </article>
        <article>
          <span>Divergencias</span>
          <strong>{metrics.divergences}</strong>
          <small>ERP diferente do marketplace</small>
        </article>
        <article>
          <span>Estoque baixo</span>
          <strong>{metrics.lowStock}</strong>
          <small>Precisa revisar reposicao</small>
        </article>
      </section>

      <section className="box stock-toolbar-card">
        <div className="stock-filter-tabs">
          {marketplaceOptions.map((option) => (
            <button
              type="button"
              key={option}
              className={marketplace === option ? "active" : ""}
              onClick={() => setMarketplace(option)}
            >
              {option}
            </button>
          ))}
        </div>

        <div className="stock-filter-grid">
          <select>
            <option>SKU</option>
            <option>KIT SKU</option>
            <option>Categoria</option>
          </select>
          <input
            placeholder="Clique no botao esquerdo para pesquisar SKU, produto ou categoria"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option>Todos</option>
            <option>Sincronizado</option>
            <option>Divergente</option>
            <option>Estoque baixo</option>
            <option>Sem estoque</option>
          </select>
        </div>
      </section>

      <section className="box marketplace-summary-card">
        <div className="section-heading">
          <div>
            <span className="section-kicker">Marketplaces</span>
            <h2>Saldo por canal</h2>
          </div>
        </div>

        <div className="marketplace-stock-grid">
          {marketplaceSummary.map((item) => (
            <article key={item.marketplace}>
              <strong>{item.marketplace}</strong>
              <span>{item.items} SKUs</span>
              <b>{item.stock} un.</b>
              <small>{formatCurrency(item.value)} em venda potencial</small>
            </article>
          ))}
        </div>
      </section>

      <section className="box stock-list-card">
        <div className="table-header">
          <div>
            <h2>Lista de estoque</h2>
            <span>
              Total: {rows.length} SKUs | Saldo total: {metrics.totalStock} un.
            </span>
          </div>

          <div className="stock-table-actions">
            <button type="button" className="secondary">
              Editar em Massa
            </button>
            <button type="button">Acoes em Massa</button>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>
                <input type="checkbox" />
              </th>
              <th>SKU</th>
              <th>Produto</th>
              <th>Marketplace</th>
              <th>Min/Max</th>
              <th>Reservado</th>
              <th>Disponivel</th>
              <th>Estoque Plataforma</th>
              <th>Status</th>
              <th>Acoes</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((product) => {
              const stock = Number(product.stock || 0);
              const available = Math.max(0, stock - product.reserved);

              return (
                <tr key={product.id}>
                  <td>
                    <input type="checkbox" />
                  </td>
                  <td>{product.sku || "-"}</td>
                  <td>
                    <div className="stock-product-cell">
                      {product.image_url ? (
                        <img src={product.image_url} alt={product.name} />
                      ) : (
                        <span>Sem imagem</span>
                      )}
                      <div>
                        <strong>{product.name || "Produto sem nome"}</strong>
                        <small>{product.category || "Sem categoria"}</small>
                      </div>
                    </div>
                  </td>
                  <td>{product.marketplace || "-"}</td>
                  <td>
                    {product.minimum_stock || 0} / {stock + 100}
                  </td>
                  <td>{product.reserved}</td>
                  <td>{available}</td>
                  <td>{product.marketplaceStock}</td>
                  <td>
                    <span className={`stock-status ${product.status.tone}`}>
                      {product.status.label}
                    </span>
                  </td>
                  <td>
                    <button type="button">Sincronizar</button>
                    <button type="button" className="secondary">
                      Historico
                    </button>
                  </td>
                </tr>
              );
            })}

            {rows.length === 0 && (
              <tr>
                <td colSpan="10">Nenhum produto encontrado para esse filtro.</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
