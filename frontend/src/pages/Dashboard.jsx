import { useEffect, useState } from "react";
import API from "../services/api";

export default function Dashboard() {
  const [dashboard, setDashboard] = useState({});

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    const response = await API.get("/dashboard");
    setDashboard(response.data);
  }

  const marketplaces = dashboard.marketplaces || {};
  const lowStockProducts = dashboard.low_stock_products || [];

  return (
    <div className="page">
      <h1>Dashboard</h1>

      <div className="cards">
        <div className="card">
          <h3>Produtos cadastrados</h3>
          <p>{dashboard.total_products || 0}</p>
        </div>

        <div className="card">
          <h3>Valor em estoque</h3>
          <p>R$ {dashboard.total_stock_value || 0}</p>
        </div>

        <div className="card">
          <h3>Valor potencial de venda</h3>
          <p>R$ {dashboard.total_sales_value || 0}</p>
        </div>

        <div className="card">
          <h3>Lucro estimado</h3>
          <p>R$ {dashboard.estimated_profit || 0}</p>
        </div>

        <div className="card">
          <h3>Despesas mensais</h3>
          <p>R$ {dashboard.monthly_expenses || 0}</p>
        </div>
      </div>

      <div className="box">
        <h2>Produtos por Marketplace</h2>

        {Object.entries(marketplaces).map(([name, value]) => (
          <div className="market-row" key={name}>
            <span>{name}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>

      <div className="box">
        <h2>Produtos com estoque baixo</h2>

        {lowStockProducts.length === 0 ? (
          <p>Nenhum produto com estoque baixo.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Produto</th>
                <th>Estoque atual</th>
                <th>Estoque mínimo</th>
              </tr>
            </thead>

            <tbody>
              {lowStockProducts.map((product, index) => (
                <tr key={index} className="low-stock-row">
                  <td>{product.name}</td>
                  <td>{product.stock}</td>
                  <td>{product.minimum_stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
