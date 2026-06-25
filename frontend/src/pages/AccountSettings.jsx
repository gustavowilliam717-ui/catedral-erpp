import { useState } from "react";

const sidebarGroups = [
  {
    title: "Minha Conta",
    items: [
      { key: "account-profile", label: "Perfil" },
      { key: "account-security", label: "Seguranca" },
    ],
  },
  {
    title: "Faturas",
    items: [
      { key: "account-subscription", label: "Minha Assinatura" },
      { key: "account-transactions", label: "Detalhes da Transacao" },
    ],
  },
  {
    title: "Planos",
    items: [{ key: "plans", label: "Planos" }],
  },
];

const notificationRows = [
  ["Novos pedidos da plataforma", "Notificacoes para voce quando tiver novos pedidos"],
  ["Perguntas Mercado", "Push de notificacoes quando as perguntas sao recebidas"],
  ["Mensagens Pos Venda Mercado", "Aviso quando houver novas mensagens de pos-venda"],
  ["Reclamacoes do Mercado", "Notificacoes para novas reclamacoes"],
  ["Opinioes do ML", "Enviar quando houver opinioes negativas de 1 a 3 estrelas"],
  ["Opinioes da Shopee", "Enviar quando houver opinioes negativas de 1 a 3 estrelas"],
];

const serviceRows = [
  ["NEXTERP Pro X 1", "Comprar", "12/06/2026 ~ 12/07/2026", "31", "12/06/2026 12:54", "Ativo"],
];

const transactionRows = [
  ["UP2606121554380961049", "12/06/2026 12:54", "12/06/2026 12:55", "R$ 389,00", "NEXTERP Pro X 1", "PIX", "Sucesso"],
  ["UP2605112219526821049", "11/05/2026 19:19", "11/05/2026 19:20", "R$ 389,00", "NEXTERP Pro X 1", "PIX", "Sucesso"],
  ["UP2602271336558781049", "27/02/2026 10:36", "27/02/2026 10:37", "R$ 270,00", "10000 Pacote Adicional de Pedidos X 1", "PIX", "Sucesso"],
  ["UP2601281441304341049", "28/01/2026 11:41", "28/01/2026 11:42", "R$ 45,00", "1000 Pacote Adicional de Pedidos X 1", "PIX", "Sucesso"],
];

export default function AccountSettings({
  activePage = "account-profile",
  setPage,
  user,
}) {
  return (
    <div className="settings-page account-settings-page">
      <AccountSidebar activePage={activePage} setPage={setPage} />

      <main className="settings-content">
        {activePage === "account-profile" && <ProfileSettings user={user} />}
        {activePage === "account-language" && <LanguageSettings />}
        {activePage === "account-security" && <SecuritySettings />}
        {["account-subscription", "account-services", "account-rewards"].includes(
          activePage
        ) && <SubscriptionSettings activePage={activePage} setPage={setPage} />}
        {activePage === "account-transactions" && <TransactionsSettings />}
        {activePage === "account-help" && <HelpCenter />}
      </main>
    </div>
  );
}

function AccountSidebar({ activePage, setPage }) {
  return (
    <aside className="settings-sidebar">
      <h2>Configuracoes da Conta</h2>

      {sidebarGroups.map((group) => (
        <div key={group.title}>
          <strong>{group.title}</strong>
          {group.items.map((item) => (
            <button
              type="button"
              key={item.key}
              className={activePage === item.key ? "active" : ""}
              onClick={() => setPage?.(item.key)}
            >
              {item.label}
            </button>
          ))}
        </div>
      ))}
    </aside>
  );
}

function ProfileSettings({ user }) {
  return (
    <>
      <section className="settings-tool-card account-card">
        <h2>Perfil</h2>
        <div className="account-info-list">
          <AccountInfo label="Email" value={user?.email || "zamanagustavo@gmail.com"} action="Mudar Email" />
          <AccountInfo label="Nome Completo" value={user?.name || "Adicionar Nome"} action="Editar" />
          <AccountInfo label="Telefone" value="+55 19996116829" action="Mudar de Numero do Celular" />
        </div>
      </section>

      <section className="settings-tool-card account-card">
        <h2>Idioma</h2>
        <div className="account-info-list">
          <AccountInfo label="Idioma de exibicao" value="Portugues (Brasil)" />
          <AccountInfo label="Pais/Regiao" value="Brasil" />
          <AccountInfo label="Moeda Padrao" value="BRL" />
          <AccountInfo label="Fuso horario" value="(GMT-03:00) Brasilia" />
        </div>
      </section>

      <section className="settings-tool-card account-card">
        <h2>Notificacao</h2>
        <table className="account-notification-table">
          <thead>
            <tr>
              <th>Tipo de Notificacao</th>
              <th>Push</th>
            </tr>
          </thead>
          <tbody>
            {notificationRows.map(([title, description]) => (
              <tr key={title}>
                <td>
                  <strong>{title}</strong>
                  <span>{description}</span>
                </td>
                <td>
                  <MiniToggle />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}

function AccountInfo({ label, value, action }) {
  return (
    <div className="account-info-row">
      <span>{label}</span>
      <strong>{value}</strong>
      {action && <button type="button">{action}</button>}
    </div>
  );
}

function LanguageSettings() {
  return (
    <section className="settings-tool-card account-card">
      <h2>Idioma</h2>
      <div className="account-form-grid">
        <label>
          Idioma de exibicao
          <select defaultValue="pt-br">
            <option value="pt-br">Portugues (Brasil)</option>
            <option value="en">English</option>
            <option value="es">Espanol</option>
          </select>
        </label>
        <label>
          Moeda padrao
          <select defaultValue="brl">
            <option value="brl">BRL</option>
            <option value="usd">USD</option>
          </select>
        </label>
        <label>
          Fuso horario
          <select defaultValue="brasilia">
            <option value="brasilia">(GMT-03:00) Brasilia</option>
            <option value="manaus">(GMT-04:00) Manaus</option>
          </select>
        </label>
        <button type="button">Salvar alteracoes</button>
      </div>
    </section>
  );
}

function SecuritySettings() {
  const [uniqueLogin, setUniqueLogin] = useState(false);

  return (
    <>
      <section className="settings-tool-card account-card">
        <h2>Seguranca de Login</h2>
        <div className="account-info-list security-list">
          <div className="account-info-row">
            <span>Login Unico</span>
            <MiniToggle checked={uniqueLogin} onClick={() => setUniqueLogin(!uniqueLogin)} />
          </div>
          <AccountInfo label="Autenticacao de Dois Fatores" value="" action="Adicionar Metodo de Verificacao" />
          <AccountInfo label="Seu Dispositivo" value="3 dispositivos voce fez login" />
          <AccountInfo label="Senha" value="" action="Mudar Senha" />
        </div>
      </section>

      <section className="settings-tool-card account-card">
        <h2>Estrategia de Seguranca</h2>
        <div className="security-rule-list">
          <p>
            Quando o sistema detectar comportamentos perigosos, ele enviara um
            codigo de verificacao para o email principal antes de liberar a
            operacao.
          </p>
          <SecurityRule text="Excluir em massa mais de" suffix="anuncios ativos" />
          <SecurityRule text="Reducao de preco ultrapassar" suffix="% OFF" />
          <SecurityRule text="Percentual de desconto exceder" suffix="% OFF" />
        </div>
      </section>
    </>
  );
}

function SecurityRule({ text, suffix }) {
  return (
    <div className="security-rule-row">
      <MiniToggle />
      <span>{text}</span>
      <input />
      <b>{suffix}</b>
    </div>
  );
}

function SubscriptionSettings({ activePage, setPage }) {
  return (
    <>
      <AccountTabs activePage={activePage} setPage={setPage} />

      {activePage === "account-subscription" && <SubscriptionOverview />}
      {activePage === "account-services" && <ServiceTable />}
      {activePage === "account-rewards" && <RewardRedemption />}
    </>
  );
}

function AccountTabs({ activePage, setPage }) {
  const tabs = [
    ["account-subscription", "Minha Assinatura"],
    ["account-services", "Servico Assinado"],
    ["account-rewards", "Resgate de Recompensa"],
  ];

  return (
    <div className="account-tab-bar">
      {tabs.map(([key, label]) => (
        <button
          type="button"
          key={key}
          className={activePage === key ? "active" : ""}
          onClick={() => setPage?.(key)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function SubscriptionOverview() {
  return (
    <>
      <section className="settings-tool-card account-plan-summary">
        <div>
          <span>NEXTERP Pro</span>
          <strong>Quantidade de Pedidos</strong>
          <b>Ilimitado / Mes</b>
        </div>
        <div>
          <strong>Periodicidade</strong>
          <b>Mensal</b>
        </div>
        <div>
          <strong>Periodo Valido</strong>
          <b>12/06/2026 ~ 12/07/2026</b>
        </div>
        <button type="button" className="secondary">Ver recursos</button>
        <button type="button">R$ 389,00 / mes</button>
      </section>

      <section className="settings-tool-card account-usage-card">
        <h2>Uso Atual</h2>
        <div className="usage-total">
          <span>Pedidos Disponiveis</span>
          <strong>1.780</strong>
          <div><i style={{ width: "1%" }} /></div>
          <small>Total de Pedidos ilimitado | Qtd. Pedidos Usados 20</small>
        </div>

        <div className="account-usage-grid">
          <UsageItem label="Lojas" value="80%" used="4" total="5" />
          <UsageItem label="Subconta" value="0%" used="0" total="5" />
          <UsageItem label="Empresas (CNPJ)" value="67%" used="2" total="3" />
          <UsageItem label="Conta de DC-e" value="0%" used="0" total="3" />
          <UsageItem label="Saldo de Creditos" value="-" used="0" total="0" />
        </div>
      </section>
    </>
  );
}

function UsageItem({ label, value, used, total }) {
  return (
    <article>
      <strong>{label}</strong>
      <div className="usage-ring">{value}</div>
      <span>Usado: {used}</span>
      <span>Total: {total}</span>
    </article>
  );
}

function ServiceTable() {
  return (
    <section className="settings-tool-card account-table-card">
      <div className="account-table-toolbar">
        <span>Total 36</span>
        <button type="button">1 / 2</button>
        <select defaultValue="20">
          <option value="20">20/pagina</option>
          <option value="50">50/pagina</option>
        </select>
      </div>
      <table>
        <thead>
          <tr>
            <th>Nome do Servico</th>
            <th>Tipo</th>
            <th>Periodo Valido</th>
            <th>Dias Totais</th>
            <th>Data de Criacao</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {serviceRows.map((row) => (
            <tr key={`${row[0]}-${row[4]}`}>
              {row.map((cell, index) => (
                <td key={cell}>
                  {index === 5 ? (
                    <span className={`account-status ${cell.toLowerCase()}`}>{cell}</span>
                  ) : (
                    cell
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

function RewardRedemption() {
  return (
    <section className="settings-tool-card reward-card">
      <h2>Resgate de Recompensa</h2>
      <div className="reward-form">
        <input placeholder="Por favor, insira o codigo de resgate" />
        <button type="button">Resgatar</button>
      </div>
      <p>
        Obs.: Os beneficios resgatados terao efeito imediato. Codigos nao
        utilizados expirarao automaticamente apos o prazo.
      </p>
    </section>
  );
}

function TransactionsSettings() {
  return (
    <section className="settings-tool-card account-table-card">
      <div className="account-table-toolbar">
        <button type="button">Configuracoes da Empresa</button>
        <span>Total 56</span>
        <button type="button">1 / 2</button>
        <select defaultValue="50">
          <option value="50">50/pagina</option>
          <option value="20">20/pagina</option>
        </select>
      </div>
      <table>
        <thead>
          <tr>
            <th>ID da Transacao</th>
            <th>Data de Criacao</th>
            <th>Hora do Pago</th>
            <th>Valor Total</th>
            <th>Detalhes</th>
            <th>Metodo de Pagamento</th>
            <th>Estado</th>
            <th>Acao</th>
          </tr>
        </thead>
        <tbody>
          {transactionRows.map((row) => (
            <tr key={row[0]}>
              {row.map((cell, index) => (
                <td key={`${row[0]}-${cell}`}>
                  {index === 6 ? (
                    <span className="account-status sucesso">{cell}</span>
                  ) : (
                    cell
                  )}
                </td>
              ))}
              <td>
                <button type="button">Baixar Recibo</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

function HelpCenter() {
  return (
    <section className="settings-tool-card account-card">
      <h2>Central de Ajuda</h2>
      <div className="help-grid">
        <article>
          <strong>Guias de integracao</strong>
          <span>Shopee, Mercado Livre, anuncios, estoque e pedidos.</span>
        </article>
        <article>
          <strong>Atendimento</strong>
          <span>Abra uma solicitacao para suporte da plataforma.</span>
        </article>
        <article>
          <strong>Base de conhecimento</strong>
          <span>Passo a passo para configurar o ERP com seguranca.</span>
        </article>
      </div>
    </section>
  );
}

function MiniToggle({ checked = false, onClick }) {
  return (
    <button
      type="button"
      className={`toggle-switch mini ${checked ? "on" : ""}`}
      onClick={onClick}
      aria-pressed={checked}
    >
      <span />
    </button>
  );
}
