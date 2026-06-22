import { useEffect, useState } from "react";
import API from "../services/api";

export default function Stock() {
  const [products, setProducts] = useState([]);

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

  function daysLeft(stock) {
    const monthlySales = 100;
    const stockValue = Number(stock || 0);

    if (stockValue <= 0) return 0;

    return Math.floor(stockValue / (monthlySales / 30));
  }

  function suggestion(stock, minimumStock) {
    const stockValue = Number(stock || 0);
    const minimum = Number(minimumStock || 0);

    if (stockValue < minimum) {
      return minimum + 100 - stockValue;
    }

    return 0;
  }

  const criticalStock = products.filter(
    (item) => Number(item.stock || 0) < Number(item.minimum_stock || 0)
  ).length;

  const totalSuggestion = products.reduce(
    (sum, item) => sum + suggestion(item.stock, item.minimum_stock),
    0
  );

  return (
    <div className="page">
      <h1>Estoque Inteligente</h1>

      <div className="dashboard-cards-premium">
        <div className="dashboard-card-premium">
          <span>📦</span>
          <h3>Produtos monitorados</h3>
          <p>{products.length}</p>
        </div>

        <div className="dashboard-card-premium">
          <span>🔴</span>
          <h3>Estoque crítico</h3>
          <p>{criticalStock}</p>
        </div>

        <div className="dashboard-card-premium">
          <span>🛒</span>
          <h3>Sugestão de reposição</h3>
          <p>{totalSuggestion}</p>
        </div>
      </div>

      <div className="box">
        <h2>Produtos com necessidade de reposição</h2>

        <table>
          <thead>
            <tr>
              <th>SKU</th>
              <th>Produto</th>
              <th>Estoque</th>
              <th>Mínimo</th>
              <th>Dias restantes</th>
              <th>Sugestão</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {products.map((item) => {
              const stock = Number(item.stock || 0);
              const minimum = Number(item.minimum_stock || 0);

              return (
                <tr key={item.id}>
                  <td>{item.sku || "-"}</td>
                  <td>{item.name || "Produto sem nome"}</td>
                  <td>{stock}</td>
                  <td>{minimum}</td>
                  <td>{daysLeft(stock)} dias</td>
                  <td>{suggestion(stock, minimum)} unidades</td>
                  <td>{stock < minimum ? "🔴 Repor agora" : "🟢 OK"}</td>
                </tr>
              );
            })}

            {products.length === 0 && (
              <tr>
                <td colSpan="7">Nenhum produto cadastrado ainda.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="dashboard-alerts">
        <h2>🤖 IA Catedral</h2>

        <div>
          <span>🔴 {criticalStock} produtos estão abaixo do mínimo.</span>
          <span>🛒 Reposição automática calculada.</span>
          <span>📦 Estoque monitorado em tempo real.</span>
          <span>🚀 Próximo passo: previsão por IA.</span>
        </div>
      </div>
    </div>
  );
}
