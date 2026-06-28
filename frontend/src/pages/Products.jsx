import { useEffect, useMemo, useState } from "react";
import API from "../services/api";
import { logError } from "../utils/logger";

const MARKETPLACES = ["Shopee", "Mercado Livre", "Amazon", "Shein", "TikTok Shop", "Temu"];
const PAGE_SIZE = 50;

export default function Products({ setPage, setPricingProductId }) {
  const emptyForm = {
    sku: "",
    name: "",
    description: "",
    category: "",
    supplier: "",
    barcode: "",
    image_url: "",
    cost: "",
    sale_price: "",
    stock: "",
    minimum_stock: "",
    marketplace: "Shopee",
  };

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [filterMarketplace, setFilterMarketplace] = useState("Todos");
  const [filterCategory, setFilterCategory] = useState("Todas");
  const [tab, setTab] = useState("tudo");
  const [pageIndex, setPageIndex] = useState(1);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [shopeeFile, setShopeeFile] = useState(null);
  const [importLoading, setImportLoading] = useState(false);
  const [importResult, setImportResult] = useState("");
  const [goToPricingAfterSave, setGoToPricingAfterSave] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [showBulk, setShowBulk] = useState(false);
  const [bulkForm, setBulkForm] = useState({
    cost: "",
    sale_price: "",
    stock: "",
    minimum_stock: "",
    marketplace: "",
    category: "",
    supplier: "",
  });
  const [bulkMessage, setBulkMessage] = useState("");
  const [bulkLoading, setBulkLoading] = useState(false);
  const [mlSyncing, setMlSyncing] = useState(false);
  const [mlSyncMessage, setMlSyncMessage] = useState("");
  const [mlConnected, setMlConnected] = useState(false);

  useEffect(() => {
    loadProducts();
    autoSyncMercadoLivre();
  }, []);

  async function autoSyncMercadoLivre() {
    try {
      const response = await API.get("/integrations/mercadolivre/status");
      if (!response.data?.connected) {
        setMlConnected(false);
        return;
      }
      setMlConnected(true);
      await runMercadoLivreSync(true);
    } catch (error) {
      logError(error);
    }
  }

  async function runMercadoLivreSync(silent = false) {
    try {
      setMlSyncing(true);
      if (!silent) setMlSyncMessage("Sincronizando com o Mercado Livre...");
      const response = await API.post("/integrations/mercadolivre/sync");
      const synced = response.data?.products || {};
      const orders = response.data?.orders || {};
      const productCount = (synced.created || 0) + (synced.updated || 0);
      setMlSyncMessage(
        `Mercado Livre sincronizado: ${productCount} produtos (${synced.created || 0} novos) e ${orders.created || 0} vendas novas.`
      );
      await loadProducts();
    } catch (error) {
      logError(error);
      if (!silent) {
        setMlSyncMessage(error?.response?.data?.detail || "Nao foi possivel sincronizar com o Mercado Livre.");
      }
    } finally {
      setMlSyncing(false);
    }
  }

  async function loadProducts() {
    try {
      const response = await API.get("/products");
      setProducts(response.data || []);
    } catch (error) {
      logError(error);
    }
  }

  function resetSelection() {
    setSelectedIds([]);
    setBulkMessage("");
  }

  async function saveProduct(e) {
    e.preventDefault();
    const data = {
      sku: form.sku,
      name: form.name,
      description: form.description,
      category: form.category,
      supplier: form.supplier,
      barcode: form.barcode,
      image_url: form.image_url,
      cost: Number(form.cost),
      sale_price: Number(form.sale_price),
      stock: Number(form.stock),
      minimum_stock: Number(form.minimum_stock),
      marketplace: form.marketplace,
    };
    try {
      let savedProduct;
      if (editingId) {
        const response = await API.put("/products/" + editingId, data);
        savedProduct = response.data;
      } else {
        const response = await API.post("/products", data);
        savedProduct = response.data;
      }
      setForm(emptyForm);
      setEditingId(null);
      await loadProducts();
      if (goToPricingAfterSave && savedProduct?.id) {
        setPricingProductId(String(savedProduct.id));
        setGoToPricingAfterSave(false);
        setPage("pricing");
      }
    } catch (error) {
      logError(error);
      window.alert("Nao foi possivel salvar o produto. Verifique os dados e tente novamente.");
    }
  }

  function editProduct(product) {
    setEditingId(product.id);
    setForm({
      sku: product.sku || "",
      name: product.name || "",
      description: product.description || "",
      category: product.category || "",
      supplier: product.supplier || "",
      barcode: product.barcode || "",
      image_url: product.image_url || "",
      cost: product.cost || "",
      sale_price: product.sale_price || "",
      stock: product.stock || "",
      minimum_stock: product.minimum_stock || "",
      marketplace: product.marketplace || "Shopee",
    });
    document.getElementById("product-form-card")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function startCreate() {
    setEditingId(null);
    setForm(emptyForm);
    document.getElementById("product-form-card")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function deleteProduct(id) {
    if (!window.confirm("Deseja excluir este produto?")) return;
    try {
      await API.delete("/products/" + id);
      await loadProducts();
    } catch (error) {
      logError(error);
      window.alert("Nao foi possivel excluir o produto.");
    }
  }

  function toggleProductSelection(id) {
    setBulkMessage("");
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  }

  async function bulkUpdateProducts() {
    if (selectedIds.length === 0) {
      setBulkMessage("Selecione pelo menos um produto.");
      return;
    }
    const payload = { ids: selectedIds };
    Object.entries(bulkForm).forEach(([key, value]) => {
      if (value === "") return;
      if (["cost", "sale_price", "stock", "minimum_stock"].includes(key)) {
        payload[key] = Number(value);
        return;
      }
      payload[key] = value;
    });
    if (Object.keys(payload).length === 1) {
      setBulkMessage("Preencha pelo menos um campo para editar em massa.");
      return;
    }
    try {
      setBulkLoading(true);
      const response = await API.patch("/products/bulk", payload);
      setBulkMessage(`${response.data.updated || 0} produtos atualizados.`);
      setBulkForm({ cost: "", sale_price: "", stock: "", minimum_stock: "", marketplace: "", category: "", supplier: "" });
      await loadProducts();
    } catch (error) {
      logError(error);
      setBulkMessage("Nao foi possivel editar em massa.");
    } finally {
      setBulkLoading(false);
    }
  }

  async function bulkDeleteProducts() {
    if (selectedIds.length === 0) {
      setBulkMessage("Selecione pelo menos um produto.");
      return;
    }
    if (!window.confirm(`Deseja excluir ${selectedIds.length} produtos selecionados?`)) return;
    try {
      setBulkLoading(true);
      const response = await API.post("/products/bulk-delete", { ids: selectedIds });
      setBulkMessage(`${response.data.deleted || 0} produtos excluidos.`);
      setSelectedIds([]);
      await loadProducts();
    } catch (error) {
      logError(error);
      setBulkMessage("Nao foi possivel excluir em massa.");
    } finally {
      setBulkLoading(false);
    }
  }

  async function importShopeeProducts() {
    if (!shopeeFile) {
      setImportResult("Selecione um arquivo XLSX ou CSV exportado da Shopee.");
      return;
    }
    try {
      setImportLoading(true);
      setImportResult("");
      const formData = new FormData();
      formData.append("file", shopeeFile);
      const response = await API.post("/import-shopee-products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setImportResult(
        `${response.data.imported || 0} produtos importados/atualizados da Shopee. ${response.data.skipped || 0} linhas ignoradas.`
      );
      setShopeeFile(null);
      loadProducts();
    } catch (error) {
      logError(error);
      setImportResult("Nao foi possivel importar. Confira se a planilha e de Informacoes de Vendas da Shopee.");
    } finally {
      setImportLoading(false);
    }
  }

  const categories = useMemo(
    () => ["Todas", ...Array.from(new Set(products.map((p) => p.category).filter(Boolean)))],
    [products]
  );

  const filteredProducts = useMemo(() => {
    const term = search.toLowerCase();
    return products.filter((product) => {
      const matchSearch =
        product.sku?.toLowerCase().includes(term) ||
        product.name?.toLowerCase().includes(term) ||
        product.category?.toLowerCase().includes(term) ||
        product.supplier?.toLowerCase().includes(term) ||
        product.marketplace?.toLowerCase().includes(term);
      const matchMarket = filterMarketplace === "Todos" || product.marketplace === filterMarketplace;
      const matchCategory = filterCategory === "Todas" || product.category === filterCategory;
      const lowStock = Number(product.stock) <= Number(product.minimum_stock);
      const matchTab =
        tab === "tudo" ||
        (tab === "baixo" && lowStock) ||
        (tab === "ativo" && String(product.marketplace_status).toLowerCase() === "active");
      return matchSearch && matchMarket && matchCategory && matchTab;
    });
  }, [products, search, filterMarketplace, filterCategory, tab]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const currentPage = Math.min(pageIndex, totalPages);
  const pageProducts = filteredProducts.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const filteredIds = filteredProducts.map((product) => product.id);
  const selectedCount = selectedIds.length;
  const allFilteredSelected = filteredIds.length > 0 && filteredIds.every((id) => selectedIds.includes(id));
  const lowStockCount = products.filter((p) => Number(p.stock) <= Number(p.minimum_stock)).length;

  function toggleAllFilteredProducts() {
    setBulkMessage("");
    setSelectedIds((current) =>
      allFilteredSelected
        ? current.filter((id) => !filteredIds.includes(id))
        : Array.from(new Set([...current, ...filteredIds]))
    );
  }

  return (
    <div className="page products-upseller-page">
      <div className="products-upseller">
        <main className="products-main">
          <section className="up-toolbar">
            <div className="up-toolbar-row">
              <input
                className="up-search"
                placeholder="Buscar por SKU, nome, categoria ou fornecedor"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPageIndex(1);
                }}
              />
              <div className="up-toolbar-actions">
                <button type="button" className="secondary" onClick={() => document.getElementById("shopee-import-card")?.scrollIntoView({ behavior: "smooth" })}>
                  Importar &amp; Exportar
                </button>
                <button type="button" onClick={startCreate}>+ Criar Produto</button>
              </div>
            </div>

            <div className="up-filters">
              <select
                value={filterMarketplace}
                onChange={(e) => {
                  setFilterMarketplace(e.target.value);
                  setPageIndex(1);
                }}
              >
                <option>Todos</option>
                {MARKETPLACES.map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>
              <select
                value={filterCategory}
                onChange={(e) => {
                  setFilterCategory(e.target.value);
                  setPageIndex(1);
                }}
              >
                {categories.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="up-tabs">
              <button type="button" className={tab === "tudo" ? "active" : ""} onClick={() => setTab("tudo")}>
                Tudo <span>{products.length}</span>
              </button>
              <button type="button" className={tab === "ativo" ? "active" : ""} onClick={() => setTab("ativo")}>
                Ativos <span>{products.filter((p) => String(p.marketplace_status).toLowerCase() === "active").length}</span>
              </button>
              <button type="button" className={tab === "baixo" ? "active" : ""} onClick={() => setTab("baixo")}>
                Estoque baixo <span>{lowStockCount}</span>
              </button>
            </div>
          </section>

          <section className="up-list-card">
            <div className="up-list-head">
              <div className="up-bulk-summary">
                <strong>Selecionado {selectedCount}</strong>
                <button type="button" onClick={toggleAllFilteredProducts}>
                  {allFilteredSelected ? "Limpar filtrados" : "Selecionar filtrados"}
                </button>
                <button type="button" onClick={() => setShowBulk((v) => !v)}>Editar em Massa</button>
                <button type="button" className="secondary" onClick={resetSelection}>Limpar selecao</button>
                <button type="button" className="danger" onClick={bulkDeleteProducts} disabled={bulkLoading || selectedCount === 0}>
                  Excluir selecionados
                </button>
              </div>
              <div className="up-list-meta">
                <span>Total {filteredProducts.length}</span>
                <div className="up-pagination">
                  <button type="button" disabled={currentPage <= 1} onClick={() => setPageIndex(currentPage - 1)}>‹</button>
                  <span>{currentPage} / {totalPages}</span>
                  <button type="button" disabled={currentPage >= totalPages} onClick={() => setPageIndex(currentPage + 1)}>›</button>
                </div>
              </div>
            </div>

            {showBulk && (
              <div className="up-bulk-edit">
                <input placeholder="Novo custo" value={bulkForm.cost} onChange={(e) => setBulkForm({ ...bulkForm, cost: e.target.value })} />
                <input placeholder="Novo preco" value={bulkForm.sale_price} onChange={(e) => setBulkForm({ ...bulkForm, sale_price: e.target.value })} />
                <input placeholder="Novo estoque" value={bulkForm.stock} onChange={(e) => setBulkForm({ ...bulkForm, stock: e.target.value })} />
                <input placeholder="Estoque minimo" value={bulkForm.minimum_stock} onChange={(e) => setBulkForm({ ...bulkForm, minimum_stock: e.target.value })} />
                <input placeholder="Categoria" value={bulkForm.category} onChange={(e) => setBulkForm({ ...bulkForm, category: e.target.value })} />
                <input placeholder="Fornecedor" value={bulkForm.supplier} onChange={(e) => setBulkForm({ ...bulkForm, supplier: e.target.value })} />
                <select value={bulkForm.marketplace} onChange={(e) => setBulkForm({ ...bulkForm, marketplace: e.target.value })}>
                  <option value="">Marketplace</option>
                  {MARKETPLACES.map((m) => (
                    <option key={m}>{m}</option>
                  ))}
                </select>
                <button type="button" onClick={bulkUpdateProducts} disabled={bulkLoading || selectedCount === 0}>
                  {bulkLoading ? "Aplicando..." : "Aplicar"}
                </button>
              </div>
            )}

            {bulkMessage && <span className="bulk-message up-bulk-message">{bulkMessage}</span>}

            <table className="up-table">
              <thead>
                <tr>
                  <th>
                    <input type="checkbox" checked={allFilteredSelected} onChange={toggleAllFilteredProducts} />
                  </th>
                  <th>SKU</th>
                  <th>Categorias</th>
                  <th>Nome do Produto</th>
                  <th>Marketplace</th>
                  <th>Custo de Compra</th>
                  <th>Preco</th>
                  <th>Estoque</th>
                  <th>Acoes</th>
                </tr>
              </thead>
              <tbody>
                {pageProducts.map((product) => {
                  const lowStock = Number(product.stock) <= Number(product.minimum_stock);
                  const selected = selectedIds.includes(product.id);
                  const status = String(product.marketplace_status || "").toLowerCase();
                  return (
                    <tr key={product.id} className={selected ? "selected-row" : ""}>
                      <td>
                        <input type="checkbox" checked={selected} onChange={() => toggleProductSelection(product.id)} />
                      </td>
                      <td>
                        <div className="up-sku-cell">
                          {product.image_url ? (
                            <img src={product.image_url} alt="" className="up-thumb" />
                          ) : (
                            <div className="up-thumb placeholder">IMG</div>
                          )}
                          <div>
                            <strong>{product.sku || "-"}</strong>
                            <span className={`up-status ${status === "active" ? "ok" : ""}`}>
                              {status === "active" ? "Ativo" : status || "Cadastrado"}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td>{product.category ? product.category : <em className="up-muted">[Sem categoria]</em>}</td>
                      <td className="up-name-cell">
                        <strong>{product.name}</strong>
                        {product.supplier && <span>{product.supplier}</span>}
                      </td>
                      <td>
                        <span className="up-chip">{product.marketplace || "-"}</span>
                      </td>
                      <td>{product.cost ? `R$ ${Number(product.cost).toFixed(2)}` : "-"}</td>
                      <td>{product.sale_price ? `R$ ${Number(product.sale_price).toFixed(2)}` : "-"}</td>
                      <td>
                        {product.stock}
                        {lowStock && <span className="up-low">baixo</span>}
                      </td>
                      <td className="up-actions">
                        <button type="button" onClick={() => editProduct(product)}>Editar</button>
                        <button
                          type="button"
                          onClick={() => {
                            setPricingProductId(String(product.id));
                            setPage("pricing");
                          }}
                        >
                          Precificar
                        </button>
                        <button type="button" className="danger" onClick={() => deleteProduct(product.id)}>Excluir</button>
                      </td>
                    </tr>
                  );
                })}

                {pageProducts.length === 0 && (
                  <tr>
                    <td colSpan="9" className="up-empty">
                      Nenhum produto encontrado. Cadastre, importe a planilha da Shopee ou sincronize um marketplace ao lado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </section>
        </main>

        <aside className="products-side">
          <div id="product-form-card" className="box product-form-card">
            <h2>{editingId ? "Editar produto" : "Criar produto"}</h2>
            <form onSubmit={saveProduct} className="product-side-form">
              <input placeholder="SKU" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} />
              <input placeholder="Nome do produto" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <input placeholder="Categoria" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
              <input placeholder="Fornecedor" value={form.supplier} onChange={(e) => setForm({ ...form, supplier: e.target.value })} />
              <input placeholder="Codigo de barras" value={form.barcode} onChange={(e) => setForm({ ...form, barcode: e.target.value })} />
              <input placeholder="URL da imagem" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} />
              <input placeholder="Custo" value={form.cost} onChange={(e) => setForm({ ...form, cost: e.target.value })} />
              <input placeholder="Preco de venda" value={form.sale_price} onChange={(e) => setForm({ ...form, sale_price: e.target.value })} />
              <input placeholder="Estoque" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
              <input placeholder="Estoque minimo" value={form.minimum_stock} onChange={(e) => setForm({ ...form, minimum_stock: e.target.value })} />
              <select value={form.marketplace} onChange={(e) => setForm({ ...form, marketplace: e.target.value })}>
                {MARKETPLACES.map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>
              <label className="check-line pricing-flow-option">
                <input type="checkbox" checked={goToPricingAfterSave} onChange={(e) => setGoToPricingAfterSave(e.target.checked)} />
                Seguir para precificacao apos salvar
              </label>
              <button type="submit">{editingId ? "Salvar alteracao" : "Cadastrar produto"}</button>
              {editingId && (
                <button type="button" className="secondary" onClick={cancelEdit}>Cancelar edicao</button>
              )}
            </form>
          </div>

          <div className="box import-panel">
            <span className="section-kicker">Mercado Livre</span>
            <h2>Sincronizacao automatica</h2>
            <p>Produtos, precos, estoque e vendas atualizam ao abrir esta tela quando a conta esta conectada.</p>
            <div className="import-actions">
              <button type="button" onClick={() => runMercadoLivreSync(false)} disabled={mlSyncing}>
                {mlSyncing ? "Sincronizando..." : "Sincronizar Mercado Livre"}
              </button>
              {!mlConnected && (
                <button type="button" className="secondary" onClick={() => setPage("mercado-livre-integration")}>Conectar conta</button>
              )}
            </div>
            {mlSyncMessage && <strong className="import-result">{mlSyncMessage}</strong>}
          </div>

          <div id="shopee-import-card" className="box import-panel">
            <span className="section-kicker">Shopee</span>
            <h2>Importar Planilha de Informacoes de Vendas</h2>
            <p>Baixe na Shopee a planilha Informacoes de Vendas e envie o XLSX ou CSV aqui.</p>
            <div className="import-actions">
              <input type="file" accept=".xlsx,.csv" onChange={(e) => setShopeeFile(e.target.files?.[0] || null)} />
              <button type="button" onClick={importShopeeProducts} disabled={importLoading}>
                {importLoading ? "Importando..." : "Importar Shopee"}
              </button>
            </div>
            {importResult && <strong className="import-result">{importResult}</strong>}
          </div>

          <div className="box shopee-sync-guide">
            <span className="section-kicker">Pedidos automaticos Shopee</span>
            <h2>O que o cliente precisa fazer?</h2>
            <div className="sync-guide-grid">
              <article>
                <strong>1. Agora: importacao por planilha</strong>
                <span>Baixar a planilha Informacoes de Vendas e enviar acima.</span>
              </article>
              <article>
                <strong>2. Depois: pedidos automaticos</strong>
                <span>Conectar a loja pela Shopee Open Platform.</span>
              </article>
            </div>
            <button type="button" className="sync-guide-button" onClick={() => setPage("shopee-api")}>
              Configurar API Shopee e pedidos automaticos
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
