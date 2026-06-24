import { useEffect, useMemo, useState } from "react";
import API from "../services/api";
import { logError } from "../utils/logger";

const EMPTY_CATEGORY = "__empty__";

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

function categoryKey(category) {
  return category?.trim() || EMPTY_CATEGORY;
}

function categoryLabel(key) {
  return key === EMPTY_CATEGORY ? "Sem categoria" : key;
}

export default function ProductCategories({ setPage }) {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [renameValue, setRenameValue] = useState("");
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      const response = await API.get("/products");
      setProducts(response.data || []);
    } catch (error) {
      logError(error);
      setMessage("Nao foi possivel carregar os produtos.");
    }
  }

  const categories = useMemo(() => {
    const grouped = products.reduce((map, product) => {
      const key = categoryKey(product.category);
      const current = map.get(key) || {
        key,
        label: categoryLabel(key),
        products: [],
        stock: 0,
        stockValue: 0,
        salePotential: 0,
      };

      current.products.push(product);
      current.stock += Number(product.stock || 0);
      current.stockValue += Number(product.cost || 0) * Number(product.stock || 0);
      current.salePotential +=
        Number(product.sale_price || 0) * Number(product.stock || 0);
      map.set(key, current);
      return map;
    }, new Map());

    return Array.from(grouped.values()).sort((a, b) =>
      a.label.localeCompare(b.label)
    );
  }, [products]);

  const filteredCategories = categories.filter((item) =>
    item.label.toLowerCase().includes(search.toLowerCase())
  );

  const activeCategory = categories.find((item) => item.key === selectedCategory);

  function selectCategory(key) {
    setSelectedCategory(key);
    setRenameValue(key === EMPTY_CATEGORY ? "" : key);
    setMessage("");
  }

  async function updateCategory(nextCategory) {
    if (!activeCategory) {
      setMessage("Selecione uma categoria primeiro.");
      return;
    }

    const ids = activeCategory.products.map((product) => product.id);

    if (ids.length === 0) {
      setMessage("Nenhum produto encontrado nesta categoria.");
      return;
    }

    try {
      setIsSaving(true);
      await API.patch("/products/bulk", {
        ids,
        category: nextCategory,
      });
      setMessage("Categoria atualizada nos produtos selecionados.");
      setSelectedCategory("");
      setRenameValue("");
      await loadProducts();
    } catch (error) {
      logError(error);
      setMessage("Nao foi possivel atualizar a categoria.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="page">
      <section className="settings-title-card">
        <div>
          <span className="section-kicker">Produtos</span>
          <h1>Categorias</h1>
          <p>
            Organize as categorias usadas no cadastro de produtos e aplique
            ajustes em massa quando precisar padronizar nomes.
          </p>
        </div>
        <button type="button" onClick={() => setPage?.("products")}>
          Ir para produtos
        </button>
      </section>

      <section className="box">
        <div className="finance-filter-row">
          <input
            placeholder="Buscar categoria"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <button type="button" onClick={loadProducts}>
            Atualizar
          </button>
          <button
            type="button"
            disabled={filteredCategories.length === 0}
            onClick={() =>
              exportCsv(
                "categorias-produtos.csv",
                filteredCategories.map((item) => ({
                  categoria: item.label,
                  produtos: item.products.length,
                  estoque: item.stock,
                  valor_estoque: item.stockValue,
                  potencial_venda: item.salePotential,
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
              <th>Categoria</th>
              <th>Produtos</th>
              <th>Estoque</th>
              <th>Valor em estoque</th>
              <th>Venda potencial</th>
              <th>Acoes</th>
            </tr>
          </thead>
          <tbody>
            {filteredCategories.map((item) => (
              <tr key={item.key}>
                <td>{item.label}</td>
                <td>{item.products.length}</td>
                <td>{item.stock}</td>
                <td>{formatCurrency(item.stockValue)}</td>
                <td>{formatCurrency(item.salePotential)}</td>
                <td>
                  <button type="button" onClick={() => selectCategory(item.key)}>
                    Editar
                  </button>
                </td>
              </tr>
            ))}

            {filteredCategories.length === 0 && (
              <tr>
                <td colSpan="6">Nenhuma categoria encontrada.</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      <section className="box">
        <h2>Editar categoria em massa</h2>
        {activeCategory ? (
          <>
            <p>
              Categoria selecionada: <strong>{activeCategory.label}</strong> (
              {activeCategory.products.length} produtos)
            </p>
            <div className="form-grid">
              <input
                placeholder="Novo nome da categoria"
                value={renameValue}
                onChange={(event) => setRenameValue(event.target.value)}
              />
              <button
                type="button"
                disabled={isSaving || !renameValue.trim()}
                onClick={() => updateCategory(renameValue.trim())}
              >
                Renomear categoria
              </button>
              <button
                type="button"
                className="secondary"
                disabled={isSaving}
                onClick={() => updateCategory("")}
              >
                Remover categoria
              </button>
            </div>
          </>
        ) : (
          <p>Selecione uma categoria na tabela para renomear ou remover.</p>
        )}
      </section>
    </div>
  );
}
