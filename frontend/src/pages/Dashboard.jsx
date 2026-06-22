import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";
import API from "../services/api";

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const prod = await API.get("/products");
      const hist = await API.get("/pricing-history");

      setProducts(prod.data || []);
      setHistory(hist.data || []);
    } catch (error) {
      console.log(error);
    }
  }

  function money(value) {
    return "R$ " + Number(value || 0).toFixed(2);
  }

  const totalProducts = products.length;
  const totalPricings = history.length;

  const totalRevenue = history.reduce(
    (sum, item) => sum + Number(item.suggested_price || 0),
    0
  );

  const totalProfit = history.reduce(
    (sum, item) => sum + Number(item.profit || 0),
    0
  );

  const averageMargin =
    history.length > 0
      ? history.reduce((sum, item) => sum + Number(item.margin || 0), 0) /
        history.length
      : 0;

  const bestProduct =
    history.length > 0
      ? [...history].sort((a, b) => Number(b.profit) - Number(a.profit))[0]
      : null;

  const marketplaceData = ["Shopee", "Mercado Livre", "TikTok Shop", "Amazon"].map(
    (marketplace) => ({
      marketplace,
      lucro: history
        .filter((item) => item.marketplace === marketplace)
        .reduce((sum, item) => sum + Number(item.profit || 0), 0),
      quantidade: history.filter((item) => item.marketplace === marketplace).length
    })
  );

  const monthlyData = [
    { month: "Jan", faturamento: totalRevenue * 0.35, lucro: totalProfit * 0.35 },
    { month: "Fev", faturamento: totalRevenue * 0.48, lucro: totalProfit * 0.48 },
    { month: "Mar", faturamento: totalRevenue * 0.62, lucro: totalProfit * 0.62 },
    { month: "Abr", faturamento: totalRevenue * 0.76, lucro: totalProfit * 0.76 },
    { month: "Mai", faturamento: totalRevenue * 0.9, lucro: totalProfit * 0.9 },
    { month: "Jun", faturamento: totalRevenue, lucro: totalProfit }
  ];

  const topProducts = [...history]
    .sort((a, b) => Number(b.profit) - Number(a.profit))
    .slice(0, 6);

  const goal = 100000;
  const goalPercent = totalRevenue > 0 ? (totalRevenue / goal) * 100 : 0;

  return (
    <div className="dashboard-page">
      <section className="dashboard-hero-premium">
        <div>
          <div className="dashboard-badge">🚀 Marketplace Intelligence</div>
          <h1>CATEDRAL ERP</h1>
          <p>Visão premium da operação, precificação, lucro e marketplaces.</p>
        </div>

        <div className="dashboard-hero-money">
          <span>Lucro estimado</span>
          <strong>{money(totalProfit)}</strong>
        </div>
      </section>

      <section className="dashboard-cards-premium">
        <div className="dashboard-card-premium">
          <span>💰</span>
          <h3>Faturamento estimado</h3>
          <p>{money(totalRevenue)}</p>
        </div>

        <div className="dashboard-card-premium">
          <span>📈</span>
          <h3>Lucro estimado</h3>
          <p>{money(totalProfit)}</p>
        </div>

        <div className="dashboard-card-premium">
          <span>📊</span>
          <h3>Margem média</h3>
          <p>{averageMargin.toFixed(1)}%</p>
        </div>

        <div className="dashboard-card-premium">
          <span>📦</span>
          <h3>Produtos cadastrados</h3>
          <p>{totalProducts}</p>
        </div>

        <div className="dashboard-card-premium">
          <span>🧮</span>
          <h3>Precificações</h3>
          <p>{totalPricings}</p>
        </div>

        <div className="dashboard-card-premium">
          <span>🏆</span>
          <h3>Produto mais lucrativo</h3>
          <p>{bestProduct ? bestProduct.product_name : "Sem dados"}</p>
        </div>
      </section>

      <section className="dashboard-goal">
        <div>
          <h2>Meta do mês</h2>
          <p>{money(totalRevenue)} de {money(goal)}</p>
        </div>

        <div className="dashboard-goal-bar">
          <div style={{ width: `${Math.min(goalPercent, 100)}%` }} />
        </div>

        <strong>{goalPercent.toFixed(1)}%</strong>
      </section>

      <section className="dashboard-grid-premium">
        <div className="dashboard-box-premium">
          <h2>Faturamento x Lucro</h2>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="faturamento" name="Faturamento" strokeWidth={4} />
              <Line type="monotone" dataKey="lucro" name="Lucro" strokeWidth={4} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="dashboard-box-premium">
          <h2>Lucro por marketplace</h2>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={marketplaceData} dataKey="lucro" nameKey="marketplace" outerRadius={100} label>
                {marketplaceData.map((item, index) => (
                  <Cell key={index} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="dashboard-grid-premium">
        <div className="dashboard-box-premium">
          <h2>Precificações por marketplace</h2>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={marketplaceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="marketplace" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="quantidade" name="Precificações" radius={[12, 12, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="dashboard-box-premium">
          <h2>Top produtos mais lucrativos</h2>

          <table>
            <thead>
              <tr>
                <th>Produto</th>
                <th>Marketplace</th>
                <th>Lucro</th>
                <th>Margem</th>
              </tr>
            </thead>

            <tbody>
              {topProducts.length === 0 && (
                <tr>
                  <td colSpan="4">Nenhuma precificação salva ainda.</td>
                </tr>
              )}

              {topProducts.map((item) => (
                <tr key={item.id}>
                  <td>{item.product_name}</td>
                  <td>{item.marketplace}</td>
                  <td>{money(item.profit)}</td>
                  <td>{Number(item.margin || 0).toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="dashboard-alerts">
        <h2>Alertas inteligentes</h2>

        <div>
          <span>🟢 Precificação integrada aos produtos</span>
          <span>🔵 Histórico alimentando gráficos</span>
          <span>🟡 Próximo passo: estoque inteligente</span>
          <span>🚀 Catedral ERP em evolução premium</span>
        </div>
      </section>
    </div>
  );
}
