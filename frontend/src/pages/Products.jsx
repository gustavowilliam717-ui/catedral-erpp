import { useEffect, useState } from "react";
import API from "../services/api";
import { logError } from "../utils/logger";

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
    marketplace: "Shopee"
  };

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [shopeeFile, setShopeeFile] = useState(null);
  const [importLoading, setImportLoading] = useState(false);
  const [importResult, setImportResult] = useState("");
  const [goToPricingAfterSave, setGoToPricingAfterSave] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
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

  useEffect(() => {
    loadProducts();
  }, []);

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
      marketplace: form.marketplace
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
      marketplace: product.marketplace || "Shopee"
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
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
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  }

  function toggleAllFilteredProducts() {
    setBulkMessage("");
    const filteredIds = filteredProducts.map((product) => product.id);
    const allSelected =
      filteredIds.length > 0 &&
      filteredIds.every((id) => selectedIds.includes(id));

    setSelectedIds((current) =>
      allSelected
        ? current.filter((id) => !filteredIds.includes(id))
        : Array.from(new Set([...current, ...filteredIds]))
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

      if (["cost", "sale_price"].includes(key)) {
        payload[key] = Number(value);
        return;
      }

      if (["stock", "minimum_stock"].includes(key)) {
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
      setBulkForm({
        cost: "",
        sale_price: "",
        stock: "",
        minimum_stock: "",
        marketplace: "",
        category: "",
        supplier: "",
      });
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

    if (
      !window.confirm(
        `Deseja excluir ${selectedIds.length} produtos selecionados?`
      )
    ) {
      return;
    }

    try {
      setBulkLoading(true);
      const response = await API.post("/products/bulk-delete", {
        ids: selectedIds,
      });
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
        headers: {
          "Content-Type": "multipart/form-data",
        },
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

  const filteredProducts = products.filter((product) => {
    const term = search.toLowerCase();

    return (
      product.sku?.toLowerCase().includes(term) ||
      product.name?.toLowerCase().includes(term) ||
      product.category?.toLowerCase().includes(term) ||
      product.supplier?.toLowerCase().includes(term) ||
      product.marketplace?.toLowerCase().includes(term)
    );
  });
  const filteredIds = filteredProducts.map((product) => product.id);
  const selectedCount = selectedIds.length;
  const allFilteredSelected =
    filteredIds.length > 0 && filteredIds.every((id) => selectedIds.includes(id));

  return (
    <div className="page products-page">
      <h1>Produtos</h1>

      <div className="box import-panel">
        <div>
          <span className="section-kicker">Shopee</span>
          <h2>Importar Planilha de Informacoes de Vendas</h2>
          <p>
            Na Shopee, baixe a planilha chamada Informacoes de Vendas e envie o
            arquivo XLSX ou CSV aqui. Este caminho cadastra ou atualiza produtos
            manualmente, sem precisar conectar a API agora.
          </p>
        </div>

        <div className="import-actions">
          <input
            type="file"
            accept=".xlsx,.csv"
            onChange={(e) => setShopeeFile(e.target.files?.[0] || null)}
          />

          <button
            type="button"
            onClick={importShopeeProducts}
            disabled={importLoading}
          >
            {importLoading ? "Importando..." : "Importar Shopee"}
          </button>
        </div>

        {importResult && <strong className="import-result">{importResult}</strong>}
      </div>

      <div className="box shopee-sync-guide">
        <div className="sync-guide-header">
          <span className="section-kicker">Pedidos automaticos Shopee</span>
          <h2>O que o cliente precisa fazer?</h2>
          <p>
            A planilha de Informacoes de Vendas ajuda na importacao manual. Para
            trazer pedidos automaticamente para o ERP, a loja precisa ser
            conectada pela Shopee Open Platform.
          </p>
        </div>

        <div className="sync-guide-grid">
          <article>
            <strong>1. Agora: importacao por planilha</strong>
            <span>Baixar na Shopee a planilha Informacoes de Vendas.</span>
            <span>Enviar o XLSX ou CSV no painel acima.</span>
            <span>Conferir produtos, estoque e preco no ERP.</span>
          </article>

          <article>
            <strong>2. Depois: pedidos automaticos</strong>
            <span>Criar app na Shopee Open Platform.</span>
            <span>Informar Partner ID, Partner Key e Redirect URL.</span>
            <span>Autorizar a loja para o ERP buscar pedidos pela API.</span>
          </article>

          <article className="sync-guide-warning">
            <strong>Importante</strong>
            <span>
              Planilha nao sincroniza pedidos sozinha. Pedidos automaticos
              dependem da API de pedidos da Shopee.
            </span>
          </article>
        </div>

        <button
          type="button"
          className="sync-guide-button"
          onClick={() => setPage("shopee-api")}
        >
          Configurar API Shopee e pedidos automaticos
        </button>
      </div>

      <div className="box">
        <h2>{editingId ? "Editar produto" : "Cadastrar produto"}</h2>

        <form onSubmit={saveProduct} className="form-grid">
          <input placeholder="SKU" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} />
          <input placeholder="Nome do produto" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input placeholder="Descrição" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <input placeholder="Categoria" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          <input placeholder="Fornecedor" value={form.supplier} onChange={(e) => setForm({ ...form, supplier: e.target.value })} />
          <input placeholder="Código de barras" value={form.barcode} onChange={(e) => setForm({ ...form, barcode: e.target.value })} />
          <input placeholder="URL da imagem" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} />
          <input placeholder="Custo" value={form.cost} onChange={(e) => setForm({ ...form, cost: e.target.value })} />
          <input placeholder="Preço de venda" value={form.sale_price} onChange={(e) => setForm({ ...form, sale_price: e.target.value })} />
          <input placeholder="Estoque" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
          <input placeholder="Estoque mínimo" value={form.minimum_stock} onChange={(e) => setForm({ ...form, minimum_stock: e.target.value })} />

          <select value={form.marketplace} onChange={(e) => setForm({ ...form, marketplace: e.target.value })}>
            <option>Shopee</option>
            <option>Mercado Livre</option>
            <option>Amazon</option>
            <option>Magalu</option>
            <option>TikTok Shop</option>
          </select>

          <label className="check-line pricing-flow-option">
            <input
              type="checkbox"
              checked={goToPricingAfterSave}
              onChange={(e) => setGoToPricingAfterSave(e.target.checked)}
            />
            Seguir para precificacao apos salvar
          </label>

          <button type="submit">
            {editingId ? "Salvar alteração" : "Cadastrar produto"}
          </button>

          {editingId && (
            <button type="button" className="secondary" onClick={cancelEdit}>
              Cancelar edição
            </button>
          )}
        </form>
      </div>

      <div className="box">
        <div className="table-header">
          <h2>Produtos cadastrados</h2>

          <input
            className="search-input"
            placeholder="Buscar por SKU, nome, categoria ou fornecedor"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="bulk-action-panel">
          <div className="bulk-action-top">
            <strong>{selectedCount} selecionados</strong>

            <div>
              <button type="button" onClick={toggleAllFilteredProducts}>
                {allFilteredSelected ? "Limpar filtrados" : "Selecionar filtrados"}
              </button>
              <button type="button" className="secondary" onClick={resetSelection}>
                Limpar selecao
              </button>
              <button
                type="button"
                className="danger"
                onClick={bulkDeleteProducts}
                disabled={bulkLoading || selectedCount === 0}
              >
                Excluir selecionados
              </button>
            </div>
          </div>

          <div className="bulk-edit-grid">
            <input
              placeholder="Novo custo"
              value={bulkForm.cost}
              onChange={(e) => setBulkForm({ ...bulkForm, cost: e.target.value })}
            />
            <input
              placeholder="Novo preco de venda"
              value={bulkForm.sale_price}
              onChange={(e) =>
                setBulkForm({ ...bulkForm, sale_price: e.target.value })
              }
            />
            <input
              placeholder="Novo estoque"
              value={bulkForm.stock}
              onChange={(e) => setBulkForm({ ...bulkForm, stock: e.target.value })}
            />
            <input
              placeholder="Novo estoque minimo"
              value={bulkForm.minimum_stock}
              onChange={(e) =>
                setBulkForm({ ...bulkForm, minimum_stock: e.target.value })
              }
            />
            <input
              placeholder="Categoria"
              value={bulkForm.category}
              onChange={(e) =>
                setBulkForm({ ...bulkForm, category: e.target.value })
              }
            />
            <input
              placeholder="Fornecedor"
              value={bulkForm.supplier}
              onChange={(e) =>
                setBulkForm({ ...bulkForm, supplier: e.target.value })
              }
            />
            <select
              value={bulkForm.marketplace}
              onChange={(e) =>
                setBulkForm({ ...bulkForm, marketplace: e.target.value })
              }
            >
              <option value="">Marketplace</option>
              <option>Shopee</option>
              <option>Mercado Livre</option>
              <option>Amazon</option>
              <option>Magalu</option>
              <option>TikTok Shop</option>
            </select>
            <button
              type="button"
              onClick={bulkUpdateProducts}
              disabled={bulkLoading || selectedCount === 0}
            >
              {bulkLoading ? "Aplicando..." : "Editar em massa"}
            </button>
          </div>

          {bulkMessage && <span className="bulk-message">{bulkMessage}</span>}
        </div>

        <table>
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={allFilteredSelected}
                  onChange={toggleAllFilteredProducts}
                />
              </th>
              <th>Imagem</th>
              <th>SKU</th>
              <th>Produto</th>
              <th>Categoria</th>
              <th>Fornecedor</th>
              <th>Custo</th>
              <th>Venda</th>
              <th>Estoque</th>
              <th>Marketplace</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {filteredProducts.map((product) => {
              const lowStock = Number(product.stock) <= Number(product.minimum_stock);
              const selected = selectedIds.includes(product.id);

              return (
                <tr
                  key={product.id}
                  className={`${lowStock ? "low-stock-row" : ""} ${selected ? "selected-row" : ""}`}
                >
                  <td>
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => toggleProductSelection(product.id)}
                    />
                  </td>
                  <td>
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name} className="product-img" />
                    ) : (
                      "Sem imagem"
                    )}
                  </td>
                  <td>{product.sku}</td>
                  <td>{product.name}</td>
                  <td>{product.category || "-"}</td>
                  <td>{product.supplier || "-"}</td>
                  <td>R$ {product.cost}</td>
                  <td>R$ {product.sale_price}</td>
                  <td>
                    {product.stock}
                    {lowStock && <span className="stock-alert"> Estoque baixo</span>}
                  </td>
                  <td>{product.marketplace}</td>
                  <td>
                    <button type="button" onClick={() => editProduct(product)}>
                      Editar
                    </button>

                    <button type="button" className="danger" onClick={() => deleteProduct(product.id)}>
                      Excluir
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
