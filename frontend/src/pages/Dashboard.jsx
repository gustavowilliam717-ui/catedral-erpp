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
  const [dashboard, setDashboard] = useState({});
  const [products, setProducts] = useState([]);
  const [revenues, setRevenues] = useState([]);
  const [expenses, setExpenses] = useState([]);
  useEffect(() => {
    loadData();
  }, []);
  async function loadData() {
    const dash = await API.get("/dashboard");
    const prod = await API.get("/products");
    const rev = await API.get("/revenues");
    const exp = await API.get("/expenses");
    setDashboard(dash.data);
    setProducts(prod.data);
    setRevenues(rev.data);
    setExpenses(exp.data);
  }
  const totalRevenue = revenues.reduce((sum, item) => sum + Number(item.value), 0);
  const totalExpense = expenses.reduce((sum, item) => sum + Number(item.value), 0);
  const profit = totalRevenue - totalExpense;
  const averageTicket = revenues.length > 0 ? totalRevenue / revenues.length : 0;
  const lowStockProducts = products.filter(
    (item) => Number(item.stock) <= Number(item.minimum_stock)
  );
  const marketplaceData = ["Shopee", "Mercado Livre", "TikTok Shop", "Amazon", "Magalu"].map(
    (marketplace) => ({
      marketplace,
      total: products.filter((product) => product.marketplace === marketplace).length
    })
  );
  const stockValueData = products.slice(0, 8).map((product) => ({
    name: product.name,
    value: Number(product.cost) * Number(product.stock)
  }));
  const financeData = [
    { name: "Receitas", value: totalRevenue },
    { name: "Despesas", value: totalExpense },
    { name: "Lucro", value: profit }
  ];
  const monthlyData = [
    { month: "Jan", revenue: totalRevenue * 0.55, profit: profit * 0.55 },
    { month: "Fev", revenue: totalRevenue * 0.65, profit: profit * 0.65 },
    { month: "Mar", revenue: totalRevenue * 0.7, profit: profit * 0.7 },
    { month: "Abr", revenue: totalRevenue * 0.8, profit: profit * 0.8 },
    { month: "Mai", revenue: totalRevenue * 0.9, profit: profit * 0.9 },
    { month: "Jun", revenue: totalRevenue, profit }
  ];
  return (
    <div className="page">
      <h1>Dashboard</h1>
      <div className="dashboard-hero">
        <div>
          <h2>Catedral ERP</h2>
          <p>Visão geral da operação, produtos, estoque, financeiro e marketplaces.</p>
        </div>
        <div className="hero-number">
          R$ {profit.toFixed(2)}
          <span>Lucro líquido estimado</span>
        </div>
      </div>
      <div className="cards dashboard-cards">
        <div className="card">
          <h3>Faturamento</h3>
          <p>R$ {totalRevenue.toFixed(2)}</p>
        </div>
        <div className="card">
          <h3>Lucro líquido</h3>
          <p>R$ {profit.toFixed(2)}</p>
        </div>
        <div className="card">
          <h3>Produtos</h3>
          <p>{dashboard.total_products || 0}</p>
        </div>
        <div className="card">
          <h3>Ticket médio</h3>
          <p>R$ {averageTicket.toFixed(2)}</p>
        </div>
      </div>
      <div className="dashboard-grid">
        <div className="box chart-box">
          <h2>Faturamento e lucro</h2>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" name="Faturamento" strokeWidth={3} />
              <Line type="monotone" dataKey="profit" name="Lucro" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="box chart-box">
          <h2>Produtos por marketplace</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={marketplaceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="marketplace" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" name="Produtos" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="dashboard-grid">
        <div className="box chart-box">
          <h2>Resumo financeiro</h2>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={financeData}
                dataKey="value"
                nameKey="name"
                outerRadius={95}
                label
              >
                {financeData.map((entry, index) => (
                  <Cell key={index} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="box chart-box">
          <h2>Valor em estoque por produto</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={stockValueData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={120} />
              <Tooltip />
              <Bar dataKey="value" name="Valor em estoque" radius={[0, 10, 10, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="dashboard-grid">
        <div className="box">
          <h2>Produtos com estoque baixo</h2>
          {lowStockProducts.length === 0 ? (
            <p>Nenhum produto com estoque baixo.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Produto</th>
                  <th>Estoque</th>
                  <th>Mínimo</th>
                </tr>
              </thead>
              <tbody>
                {lowStockProducts.map((product) => (
                  <tr key={product.id} className="low-stock-row">
                    <td>{product.name}</td>
                    <td>{product.stock}</td>
                    <td>{product.minimum_stock}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className="box">
          <h2>Ações rápidas</h2>
          <div className="quick-actions">
            <button>Novo produto</button>
            <button>Precificar produto</button>
            <button>Cadastrar receita</button>
            <button>Cadastrar despesa</button>
          </div>
        </div>
      </div>
    </div>
  );
}

Depois faça Commit changes.
