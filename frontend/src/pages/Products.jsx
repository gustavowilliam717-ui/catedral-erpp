import { useEffect, useState } from "react";
import API from "../services/api";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    sku: "",
    name: "",
    cost: "",
    sale_price: "",
    stock: "",
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
      cost: Number(form.cost),
      sale_price: Number(form.sale_price),
      stock: Number(form.stock),
      marketplace: form.marketplace
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
          <input placeholder="Custo" value={form.cost} onChange={(e) => setForm({ ...form, cost: e.target.value })} />
          <input placeholder="Preço de venda" value={form.sale_price} onChange={(e) => setForm({ ...form, sale_price: e.target.value })} />
          <input placeholder="Estoque" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />

          <select value={form.marketplace} onChange={(e) => setForm({ ...form, marketplace: e.target.value })}>
            <option>Shopee</option>
            <option>Mercado Livre</option>
            <option>Amazon</option>
            <option>Magalu</option>
          </select>

          <button type="submit">Cadastrar</button>
        </form>
      </div>

      <div className="box">
        <h2>Produtos cadastrados</h2>

        <table>
          <thead>
            <tr>
              <th>SKU</th>
              <th>Produto</th>
              <th>Custo</th>
              <th>Venda</th>
              <th>Estoque</th>
              <th>Marketplace</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.sku}</td>
                <td>{product.name}</td>
                <td>R$ {product.cost}</td>
                <td>R$ {product.sale_price}</td>
                <td>{product.stock}</td>
                <td>{product.marketplace}</td>
                <td>
                  <button className="danger" onClick={() => deleteProduct(product.id)}>
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
