export default function Sidebar({ setPage }) {
  return (
    <aside className="sidebar">

      <div className="logo-area">
        🚀
        <div>
          <h2>Catedral ERP</h2>
          <span>Marketplace Intelligence</span>
        </div>
      </div>

      <small>OPERAÇÃO</small>

      <button onClick={() => setPage("dashboard")}>
        🏠 Dashboard
      </button>

      <button onClick={() => setPage("products")}>
        📦 Produtos
      </button>

      <button onClick={() => setPage("pricing")}>
        🧮 Precificação
      </button>

      <button>
        📋 Pedidos
      </button>

      <button>
        📦 Estoque
      </button>

      <small>FINANCEIRO</small>

      <button>
        💰 Receitas
      </button>

      <button>
        💸 Despesas
      </button>

      <button>
        📊 DRE
      </button>

      <div className="sidebar-footer">
        <div className="pro-box">
          <strong>🛡 PRO</strong>
          <span>Catedral ERP v1.0</span>
        </div>
      </div>

    </aside>
  );
}
