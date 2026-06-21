export default function DashboardCards({ dashboard }) {
  return (
    <div className="cards">
      <div className="card">
        <strong>Produtos</strong>
        <span>{dashboard.total_products || 0}</span>
      </div>

      <div className="card">
        <strong>Estoque</strong>
        <span>R$ {dashboard.total_stock_value || 0}</span>
      </div>

      <div className="card">
        <strong>Despesas</strong>
        <span>R$ {dashboard.monthly_expenses || 0}</span>
      </div>
    </div>
  );
}
