import { useEffect, useState } from "react";
import API from "../services/api";
import DashboardCards from "../components/DashboardCards";

export default function Dashboard() {
  const [dashboard, setDashboard] = useState({});

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const response = await API.get("/dashboard");
      setDashboard(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="page">
      <h1>Dashboard</h1>

      <DashboardCards dashboard={dashboard} />

      <div className="box">
        <h2>Resumo</h2>

        <p>Total de produtos: {dashboard.total_products || 0}</p>

        <p>
          Valor em estoque: R$
          {dashboard.total_stock_value || 0}
        </p>

        <p>
          Despesas mensais: R$
          {dashboard.monthly_expenses || 0}
        </p>
      </div>
    </div>
  );
}
