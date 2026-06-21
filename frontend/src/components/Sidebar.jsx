export default function Sidebar({ setPage }) {
  return (
    <aside className="sidebar">
      <h2>Catedral ERP</h2>

      <button onClick={() => setPage("dashboard")}>Dashboard</button>
      <button onClick={() => setPage("products")}>Produtos</button>
      <button onClick={() => setPage("finance")}>Financeiro</button>

      <div className="menu-disabled">
        <span>Pedidos</span>
        <span>Compras</span>
        <span>Estoque</span>
        <span>Relatórios</span>
        <span>Integrações</span>
      </div>
    </aside>
  );
}
