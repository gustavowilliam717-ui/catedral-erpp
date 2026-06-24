import { useEffect, useMemo, useState } from "react";
import API from "../services/api";
import { logError } from "../utils/logger";

const marketplaceOptions = [
  "Todos",
  "Shopee",
  "Mercado Livre",
  "Shein",
  "TikTok Shop",
  "Amazon",
  "Magalu",
];

const stockPageConfig = {
  stock: {
    kicker: "Estoque ERP",
    title: "Lista de estoque por canal",
    description:
      "Controle saldos cadastrados no ERP, estoque minimo e valor potencial por marketplace.",
  },
  "marketplace-stock": {
    kicker: "Marketplaces",
    title: "Saldo ERP por marketplace",
    description:
      "Veja o saldo cadastrado no ERP agrupado por canal de venda.",
  },
  "stock-low": {
    kicker: "Reposicao",
    title: "Produtos com estoque baixo",
    description:
      "Produtos cujo saldo atual esta igual ou abaixo do estoque minimo cadastrado.",
    lowOnly: true,
  },
  "stock-report": {
    kicker: "Relatorio",
    title: "Relatorio de estoque",
    description:
      "Resumo operacional do estoque cadastrado, valores e alertas de reposicao.",
    mode: "report",
  },
  "stock-shopee": {
    kicker: "Shopee",
    title: "Estoque ERP - Shopee",
    description: "Produtos cadastrados com marketplace Shopee.",
    marketplace: "Shopee",
  },
  "stock-mercado-livre": {
    kicker: "Mercado Livre",
    title: "Estoque ERP - Mercado Livre",
    description: "Produtos cadastrados com marketplace Mercado Livre.",
    marketplace: "Mercado Livre",
  },
  "stock-shein": {
    kicker: "Shein",
    title: "Estoque ERP - Shein",
    description: "Produtos cadastrados com marketplace Shein.",
    marketplace: "Shein",
  },
  "stock-tiktok": {
    kicker: "TikTok Shop",
    title: "Estoque ERP - TikTok Shop",
    description: "Produtos cadastrados com marketplace TikTok Shop.",
    marketplace: "TikTok Shop",
  },
  "stock-amazon": {
    kicker: "Amazon",
    title: "Estoque ERP - Amazon",
    description: "Produtos cadastrados com marketplace Amazon.",
    marketplace: "Amazon",
  },
  "stock-reposition-rules": {
    kicker: "Reposicao",
    title: "Regras de reposicao",
    description:
      "Cadastre regras locais de estoque minimo, alvo e lead time por marketplace.",
    mode: "rules",
  },
};

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

function getReserved(product) {
  return Number(product.reserved_stock || 0);
}

function getMarketplaceStock(product) {
  return Number(product.marketplace_stock ?? product.stock ?? 0);
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

function getStockView(activePage) {
  return stockPageConfig[activePage] || stockPageConfig.stock;
}

export default function Stock({ activePage = "stock", setPage }) {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [marketplace, setMarketplace] = useState("Todos");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [selectedIds, setSelectedIds] = useState([]);
  const [message, setMessage] = useState("");
  const view = getStockView(activePage);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    setMarketplace(view.marketplace || "Todos");
    setStatusFilter(view.status || "Todos");
    setSelectedIds([]);
    setMessage("");
  }, [activePage]);

  async function loadProducts() {
    try {
      const response = await API.get("/products");
      setProducts(response.data || []);
    } catch (error) {
      logError(error);
    }
  }

  async function refreshStock() {
    await loadProducts();
    setMessage("Saldos atualizados com os dados cadastrados no ERP.");
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
        const matchesLowOnly =
          !view.lowOnly ||
          Number(product.stock || 0) <= Number(product.minimum_stock || 0);

        return matchesSearch && matchesMarketplace && matchesStatus && matchesLowOnly;
      });
  }, [products, search, marketplace, statusFilter, activePage]);

  const selectedRows = rows.filter((product) => selectedIds.includes(product.id));
  const allVisibleSelected =
    rows.length > 0 && rows.every((product) => selectedIds.includes(product.id));

  function toggleProduct(id) {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  }

  function toggleAllVisible() {
    const ids = rows.map((product) => product.id);

    setSelectedIds((current) =>
      allVisibleSelected
        ? current.filter((id) => !ids.includes(id))
        : Array.from(new Set([...current, ...ids]))
    );
  }

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

  if (view.mode === "rules") {
    return <StockRepositionRules setPage={setPage} />;
  }

  return (
    <div className="page marketplace-stock-page">
      <section className="stock-command">
        <div>
          <span className="section-kicker">{view.kicker}</span>
          <h1>{view.title}</h1>
          <p>{view.description}</p>
        </div>

        <div className="stock-command-actions">
          <button
            type="button"
            onClick={() =>
              exportCsv(
                "estoque-catedral.csv",
                rows.map((product) => ({
                  sku: product.sku,
                  produto: product.name,
                  marketplace: product.marketplace,
                  categoria: product.category,
                  estoque: product.stock,
                  estoque_minimo: product.minimum_stock,
                  reservado: product.reserved,
                  disponivel: Math.max(
                    0,
                    Number(product.stock || 0) - Number(product.reserved || 0)
                  ),
                  status: product.status.label,
                }))
              )
            }
          >
            Exportar CSV
          </button>
          <button type="button" onClick={refreshStock}>Atualizar saldos</button>
          <button
            type="button"
            className="secondary"
            onClick={() => setPage?.("stock-reposition-rules")}
          >
            Regras de Reposicao
          </button>
        </div>
      </section>

      {message && <strong className="bulk-message">{message}</strong>}

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

      {view.mode === "report" && (
        <StockReport
          products={products}
          metrics={metrics}
          marketplaceSummary={marketplaceSummary}
        />
      )}

      <section className="box stock-list-card">
        <div className="table-header">
          <div>
            <h2>Lista de estoque</h2>
            <span>
              Total: {rows.length} SKUs | Saldo total: {metrics.totalStock} un.
            </span>
          </div>

          <div className="stock-table-actions">
            <button
              type="button"
              className="secondary"
              onClick={() => setPage?.("products")}
            >
              Editar em Massa
            </button>
            <button
              type="button"
              disabled={selectedRows.length === 0}
              onClick={() =>
                exportCsv(
                  "estoque-selecionado.csv",
                  selectedRows.map((product) => ({
                    sku: product.sku,
                    produto: product.name,
                    marketplace: product.marketplace,
                    estoque: product.stock,
                    estoque_minimo: product.minimum_stock,
                    status: product.status.label,
                  }))
                )
              }
            >
              Exportar Selecionados
            </button>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={allVisibleSelected}
                  onChange={toggleAllVisible}
                />
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
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(product.id)}
                      onChange={() => toggleProduct(product.id)}
                    />
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
                    <button
                      type="button"
                      onClick={() =>
                        setMessage(
                          `${product.sku || product.name} atualizado com o saldo cadastrado no ERP.`
                        )
                      }
                    >
                      Atualizar
                    </button>
                    <button
                      type="button"
                      className="secondary"
                      onClick={() =>
                        setMessage(
                          `Historico local: saldo atual ${stock}, estoque minimo ${product.minimum_stock || 0}.`
                        )
                      }
                    >
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

function StockReport({ products, metrics, marketplaceSummary }) {
  const categorySummary = Object.values(
    products.reduce((acc, product) => {
      const key = product.category?.trim() || "Sem categoria";
      const current = acc[key] || {
        category: key,
        items: 0,
        stock: 0,
        value: 0,
        lowStock: 0,
      };
      const stock = Number(product.stock || 0);
      const minimum = Number(product.minimum_stock || 0);

      current.items += 1;
      current.stock += stock;
      current.value += Number(product.cost || 0) * stock;
      if (stock <= minimum) current.lowStock += 1;
      acc[key] = current;
      return acc;
    }, {})
  ).sort((a, b) => b.value - a.value);

  return (
    <section className="box">
      <div className="section-heading">
        <div>
          <span className="section-kicker">Resumo</span>
          <h2>Indicadores do estoque</h2>
        </div>
      </div>

      <div className="finance-summary-strip">
        <article className="neutral">
          <span>SKUs cadastrados</span>
          <strong>{products.length}</strong>
          <small>Produtos no ERP</small>
        </article>
        <article className="positive">
          <span>Saldo total</span>
          <strong>{metrics.totalStock}</strong>
          <small>Unidades cadastradas</small>
        </article>
        <article className={metrics.lowStock > 0 ? "negative" : "positive"}>
          <span>Estoque baixo</span>
          <strong>{metrics.lowStock}</strong>
          <small>Produtos para revisar</small>
        </article>
      </div>

      <div className="finance-main-grid">
        <div className="finance-table-card">
          <h2>Por categoria</h2>
          <table>
            <thead>
              <tr>
                <th>Categoria</th>
                <th>SKUs</th>
                <th>Saldo</th>
                <th>Valor em estoque</th>
                <th>Estoque baixo</th>
              </tr>
            </thead>
            <tbody>
              {categorySummary.map((item) => (
                <tr key={item.category}>
                  <td>{item.category}</td>
                  <td>{item.items}</td>
                  <td>{item.stock}</td>
                  <td>{formatCurrency(item.value)}</td>
                  <td>{item.lowStock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="finance-table-card">
          <h2>Por marketplace</h2>
          <table>
            <thead>
              <tr>
                <th>Marketplace</th>
                <th>SKUs</th>
                <th>Saldo</th>
                <th>Venda potencial</th>
              </tr>
            </thead>
            <tbody>
              {marketplaceSummary.map((item) => (
                <tr key={item.marketplace}>
                  <td>{item.marketplace}</td>
                  <td>{item.items}</td>
                  <td>{item.stock}</td>
                  <td>{formatCurrency(item.value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function StockRepositionRules({ setPage }) {
  const emptyRule = {
    marketplace: "Todos",
    minimumStock: "10",
    targetStock: "30",
    leadTime: "7",
    supplier: "",
  };
  const [rules, setRules] = useState([]);
  const [form, setForm] = useState(emptyRule);
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadRules();
  }, []);

  async function loadRules() {
    try {
      const response = await API.get("/settings?group=stock_rules");
      const stored = response.data.find((item) => item.key === "reposition_rules");

      setRules(stored?.value ? JSON.parse(stored.value) : []);
    } catch (error) {
      logError(error);
      setMessage("Nao foi possivel carregar as regras.");
    }
  }

  async function saveRules(nextRules, successMessage) {
    try {
      setIsSaving(true);
      await API.post("/settings", {
        key: "reposition_rules",
        value: JSON.stringify(nextRules),
        group: "stock_rules",
      });
      setRules(nextRules);
      setMessage(successMessage);
    } catch (error) {
      logError(error);
      setMessage("Nao foi possivel salvar as regras.");
    } finally {
      setIsSaving(false);
    }
  }

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function addRule(event) {
    event.preventDefault();

    const nextRule = {
      id: Date.now(),
      marketplace: form.marketplace,
      minimumStock: Number(form.minimumStock || 0),
      targetStock: Number(form.targetStock || 0),
      leadTime: Number(form.leadTime || 0),
      supplier: form.supplier.trim(),
    };

    saveRules([nextRule, ...rules], "Regra de reposicao criada.");
    setForm(emptyRule);
  }

  function removeRule(id) {
    saveRules(
      rules.filter((rule) => rule.id !== id),
      "Regra de reposicao removida."
    );
  }

  return (
    <div className="page marketplace-stock-page">
      <section className="settings-title-card">
        <div>
          <span className="section-kicker">Estoque</span>
          <h1>Regras de reposicao</h1>
          <p>
            Cadastre parametros locais para orientar sugestoes de compra e
            revisao de estoque minimo por marketplace.
          </p>
        </div>
        <button type="button" onClick={() => setPage?.("stock-low")}>
          Ver estoque baixo
        </button>
      </section>

      <form className="box" onSubmit={addRule}>
        <h2>Nova regra</h2>
        <div className="form-grid">
          <select
            value={form.marketplace}
            onChange={(event) => update("marketplace", event.target.value)}
          >
            {marketplaceOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
          <input
            placeholder="Estoque minimo"
            value={form.minimumStock}
            onChange={(event) => update("minimumStock", event.target.value)}
          />
          <input
            placeholder="Estoque alvo"
            value={form.targetStock}
            onChange={(event) => update("targetStock", event.target.value)}
          />
          <input
            placeholder="Lead time em dias"
            value={form.leadTime}
            onChange={(event) => update("leadTime", event.target.value)}
          />
          <input
            placeholder="Fornecedor preferencial"
            value={form.supplier}
            onChange={(event) => update("supplier", event.target.value)}
          />
          <button type="submit" disabled={isSaving}>
            Criar regra
          </button>
        </div>
        {message && <strong className="bulk-message">{message}</strong>}
      </form>

      <section className="box">
        <h2>Regras cadastradas</h2>
        <table>
          <thead>
            <tr>
              <th>Marketplace</th>
              <th>Estoque minimo</th>
              <th>Estoque alvo</th>
              <th>Lead time</th>
              <th>Fornecedor</th>
              <th>Acoes</th>
            </tr>
          </thead>
          <tbody>
            {rules.map((rule) => (
              <tr key={rule.id}>
                <td>{rule.marketplace}</td>
                <td>{rule.minimumStock}</td>
                <td>{rule.targetStock}</td>
                <td>{rule.leadTime} dias</td>
                <td>{rule.supplier || "-"}</td>
                <td>
                  <button type="button" onClick={() => removeRule(rule.id)}>
                    Remover
                  </button>
                </td>
              </tr>
            ))}

            {rules.length === 0 && (
              <tr>
                <td colSpan="6">Nenhuma regra cadastrada.</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
