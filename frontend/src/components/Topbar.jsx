import { useState } from "react";

export default function Topbar() {
  const [openMenu, setOpenMenu] = useState(null);

  function toggle(menu) {
    setOpenMenu(openMenu === menu ? null : menu);
  }

  return (
    <header className="topbar-premium">
      <div className="topbar-left">
        <button type="button" onClick={() => toggle("apps")}>▦ Apps</button>
        <button type="button" onClick={() => toggle("help")}>❓ Ajuda</button>
      </div>

      <div className="topbar-right">
        <button type="button" onClick={() => toggle("notifications")}>🔔</button>
        <button type="button" onClick={() => toggle("settings")}>⚙️</button>
        <button type="button" className="user-button" onClick={() => toggle("user")}>
          🛡 Gustavo ▼
        </button>
      </div>

      {openMenu === "apps" && (
        <div className="top-dropdown apps-dropdown">
          <h3>Apps Catedral</h3>
          <div className="apps-grid">
            <div>🚀 <span>IA Catedral</span></div>
            <div>📦 <span>Marketplace</span></div>
            <div>🏷 <span>Etiquetas</span></div>
            <div>📱 <span>App Mobile</span></div>
            <div>📊 <span>Analytics</span></div>
            <div>☁️ <span>Backup</span></div>
            <div>🖨 <span>Impressora</span></div>
            <div>🔗 <span>API</span></div>
            <div>💾 <span>Banco de Dados</span></div>
          </div>
        </div>
      )}

      {openMenu === "help" && (
        <div className="top-dropdown help-dropdown">
          <h3>Central de Ajuda</h3>
          <input placeholder="Digite sua dúvida..." />
          <button type="button" className="primary-action">Fale conosco</button>
          <div className="menu-item">🟢 WhatsApp</div>
          <div className="menu-item">📧 suporte@catedralerp.com</div>
          <div className="menu-item">💬 Enviar feedback</div>
          <div className="menu-item">🎥 Vídeos tutoriais</div>
          <div className="menu-item">🐞 Reportar erro</div>
        </div>
      )}

      {openMenu === "notifications" && (
        <div className="top-dropdown notification-dropdown">
          <h3>Notificações</h3>
          <div className="alert-item green">🟢 Precificação salva com sucesso</div>
          <div className="alert-item blue">🔵 Dashboard atualizado</div>
          <div className="alert-item yellow">🟡 Próximo passo: estoque inteligente</div>
          <div className="alert-item red">🔴 Nenhuma integração conectada</div>
        </div>
      )}

      {openMenu === "settings" && (
        <div className="top-dropdown settings-dropdown">
          <h3>Configurações</h3>
          <div className="menu-item">🔗 Integrações de Loja</div>
          <div className="menu-item">🛠 Integração de Serviços</div>
          <div className="menu-item">📦 Configurações do Pedido</div>
          <div className="menu-item">🚚 Configurações de Envio</div>
          <div className="menu-item">📄 Nota Fiscal</div>
          <div className="menu-item">📊 Estoque</div>
          <div className="menu-item">💰 Financeiro</div>
          <div className="menu-item">🔐 Permissões</div>
          <div className="menu-item">🎨 Aparência</div>
        </div>
      )}

      {openMenu === "user" && (
        <div className="top-dropdown user-dropdown">
          <div className="plan-box">
            <strong>🛡 Plano PRO</strong>
            <span>Vencimento: 12/07/2026</span>
            <button type="button">Renovar Plano</button>
          </div>

          <div className="menu-item">👤 Perfil</div>
          <div className="menu-item">🏢 Empresa</div>
          <div className="menu-item">🌎 Idioma</div>
          <div className="menu-item">🔐 Segurança</div>
          <hr />
          <div className="menu-item">🧾 Faturas</div>
          <div className="menu-item">💳 Planos</div>
          <div className="menu-item">📋 Registros de Atividades</div>
          <div className="menu-item">❓ Central de Ajuda</div>
          <hr />
          <div className="menu-item logout">🚪 Sair</div>
        </div>
      )}
    </header>
  );
}
