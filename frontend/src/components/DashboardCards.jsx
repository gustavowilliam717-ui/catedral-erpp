export default function DashboardCards({ dashboard }) {
  return (
    <div className="cards">

      <div className="card">
  <span>💰</span>
  <strong>Faturamento estimado</strong>
  <p>R$ {dashboard.total_revenue || 0}</p>
</div>

<div className="card">
  <span>📈</span>
  <strong>Lucro estimado</strong>
  <p>R$ {dashboard.total_profit || 0}</p>
</div>

<div className="card">
  <span>📊</span>
  <strong>Margem média</strong>
  <p>{dashboard.margin || 0}%</p>
</div>

<div className="card">
  <span>📦</span>
  <strong>Produtos cadastrados</strong>
  <p>{dashboard.total_products || 0}</p>
</div>

<div className="card">
  <span>🧮</span>
  <strong>Precificações</strong>
  <p>{dashboard.total_pricings || 0}</p>
</div>

<div className="card">
  <span>🏆</span>
  <strong>Produto mais lucrativo</strong>
  <p>{dashboard.best_product || "Sem dados"}</p>
</div>

    </div>
  );
}
