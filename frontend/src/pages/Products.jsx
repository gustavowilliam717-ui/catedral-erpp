import { useEffect, useState } from "react";
import API from "../services/api";

export default function Products() {
  const [products, setProducts] = useState([]);

  const [form, setForm] = useState({
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
  });

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    const response = await API.get("/products");
    setProducts(response.data);
  }

  async function createProduct(e) {
    e.preventDefault();

    await API.post("/products", {
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
    });

    setForm({
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
    });

    loadProducts();
  }

  async function deleteProduct(id) {
    if (!window.confirm("Deseja excluir este produto?")) return;

    await API.delete("/products/" + id);
    loadProducts();
  }

  return (
    <div className="page">
      <h1>Produtos</h1>

      <div className="box">
        <h2>Cadastrar produto</h2>

        <form onSubmit={createProduct} className="form-grid">
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

          <button type="submit">Cadastrar produto</button>
        </form>
      </div>

      <div className="box">
        <h2>Produtos cadastrados</h2>

        <table>
          <thead>
            <tr>
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
            {products.map((product) => {
              const lowStock = Number(product.stock) <= Number(product.minimum_stock);

              return (
                <tr key={product.id} className={lowStock ? "low-stock-row" : ""}>
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
                    <button className="danger" onClick={() => deleteProduct(product.id)}>
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
