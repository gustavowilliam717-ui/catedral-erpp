import { useState } from "react";

export default function Topbar() {
  const [appsOpen, setAppsOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button onClick={() => setAppsOpen(!appsOpen)}>▦</button>

        {appsOpen && (
          <div className="top-menu apps-menu">
            <div>🚀 IA Catedral</div>
            <div>📱 App Mobile</div>
            <div>🖨 Impressora</div>
            <div>🏷 Etiquetas</div>
            <div>📊 Analytics</div>
            <div>📦 Marketplace</div>
            <div>☁ Backup</div>
            <div>🔗 API</div>
          </div>
        )}
      </div>

      <div className="topbar-right">
        <button onClick={() => setHelpOpen(!helpOpen)}>❓ Ajuda</button>
        <button>🔔</button>
        <button onClick={() => setSettingsOpen(!settingsOpen)}>⚙️</button>

        <button className="user-button" onClick={() => setUserOpen(!userOpen)}>
          🛡️ Gustavo ▾
        </button>

        {helpOpen && (
          <div className="top-menu help-menu">
            <input placeholder="Digite sua pergunta..." />
            <button>Fale conosco</button>
            <div>🟢 WhatsApp</div>
            <div>📧 suporte@catedralerp.com</div>
            <div>💬 Feedback</div>
            <div>🎥 Vídeos tutoriais</div>
          </div>
        )}

        {settingsOpen && (
          <div className="top-menu settings-menu">
            <h3>Configurações</h3>
            <div>🔗 Integrações de Loja</div>
            <div>🛠 Integração de Serviços</div>
            <div>📦 Configurações do Pedido</div>
            <div>🚚 Configurações de Envio</div>
            <div>📄 Nota Fiscal</div>
            <div>📊 Estoque</div>
            <div>💰 Financeiro</div>
            <div>🔐 Permissões</div>
          </div>
        )}

        {userOpen && (
          <div className="top-menu user-menu">
            <div className="plan-box">
              <strong>🛡️ PRO</strong>
              <span>Vencimento: 12/07/2026</span>
              <button>Renovar Plano</button>
            </div>

            <div>👤 Perfil</div>
            <div>🏢 Empresa</div>
            <div>🌎 Idioma</div>
            <div>🔐 Segurança</div>
            <div>🧾 Faturas</div>
            <div>💳 Planos</div>
            <div>📋 Registros de Atividades</div>
            <div>❓ Central de Ajuda</div>
            <div>🚪 Sair</div>
          </div>
        )}
      </div>
    </header>
  );
}
