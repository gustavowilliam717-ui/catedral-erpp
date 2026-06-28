import { useEffect, useState } from "react";
import API from "../services/api";
import { logError } from "../utils/logger";
import { useT } from "../i18n/LanguageContext";
import { helpContent } from "../help/helpContent";

function useNotificationPrefs() {
  const [prefs, setPrefs] = useState({ notifications: {}, security: {} });
  const [catalog, setCatalog] = useState([]);
  const [securityCatalog, setSecurityCatalog] = useState([]);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    API.get("/account/notifications")
      .then((response) => {
        if (!active) return;
        const data = response.data || {};
        setCatalog(data.catalog || []);
        setSecurityCatalog(data.security_catalog || []);
        setEmail(data.email || "");
        setPrefs({
          notifications: data.notifications || {},
          security: data.security || {},
        });
      })
      .catch((error) => logError(error));
    return () => {
      active = false;
    };
  }, []);

  async function persist(next) {
    setSaving(true);
    try {
      const response = await API.put("/account/notifications", next);
      const data = response.data || {};
      setPrefs({
        notifications: data.notifications || {},
        security: data.security || {},
      });

      if (data.activated && data.activated.length) {
        if (data.emails_sent > 0) {
          setMessage(`Aviso ativado e enviado para ${data.email}.`);
        } else if (data.email_error) {
          setMessage(`Ativado, mas o e-mail falhou: ${data.email_error}`);
        } else {
          setMessage("Aviso ativado.");
        }
      } else {
        setMessage("Preferencias salvas.");
      }
    } catch (error) {
      logError(error);
      setMessage("Nao foi possivel salvar as preferencias.");
    } finally {
      setSaving(false);
    }
  }

  function toggleNotification(key) {
    const next = {
      notifications: { ...prefs.notifications, [key]: !prefs.notifications[key] },
      security: prefs.security,
    };
    setPrefs(next);
    persist(next);
  }

  function toggleSecurity(key) {
    const current = prefs.security[key] || {};
    const next = {
      notifications: prefs.notifications,
      security: { ...prefs.security, [key]: { ...current, enabled: !current.enabled } },
    };
    setPrefs(next);
    persist(next);
  }

  function setSecurityValue(key, value) {
    setPrefs((current) => ({
      ...current,
      security: {
        ...current.security,
        [key]: { ...(current.security[key] || {}), value },
      },
    }));
  }

  function saveSecurityValue() {
    persist({ notifications: prefs.notifications, security: prefs.security });
  }

  return {
    prefs,
    catalog,
    securityCatalog,
    email,
    message,
    saving,
    toggleNotification,
    toggleSecurity,
    setSecurityValue,
    saveSecurityValue,
  };
}

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
  ["NEXT ERP Pro X 1", "Comprar", "12/06/2026 ~ 12/07/2026", "31", "12/06/2026 12:54", "Ativo"],
];

const transactionRows = [
  ["UP2606121554380961049", "12/06/2026 12:54", "12/06/2026 12:55", "R$ 389,00", "NEXT ERP Pro X 1", "PIX", "Sucesso"],
  ["UP2605112219526821049", "11/05/2026 19:19", "11/05/2026 19:20", "R$ 389,00", "NEXT ERP Pro X 1", "PIX", "Sucesso"],
  ["UP2602271336558781049", "27/02/2026 10:36", "27/02/2026 10:37", "R$ 270,00", "10000 Pacote Adicional de Pedidos X 1", "PIX", "Sucesso"],
  ["UP2601281441304341049", "28/01/2026 11:41", "28/01/2026 11:42", "R$ 45,00", "1000 Pacote Adicional de Pedidos X 1", "PIX", "Sucesso"],
];

function useAiSettings() {
  const [data, setData] = useState({
    enabled: false,
    provider: "gemini",
    chat_model: "",
    key_configured: false,
    key_hint: "",
    providers: ["openai", "gemini", "groq"],
  });
  const [apiKey, setApiKey] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    API.get("/account/ai")
      .then((response) => setData((current) => ({ ...current, ...(response.data || {}) })))
      .catch((error) => logError(error));
  }, []);

  async function save(next) {
    setSaving(true);
    setMessage("");
    try {
      const body = {
        enabled: next.enabled,
        provider: next.provider,
        chat_model: next.chat_model,
      };
      if (apiKey.trim()) body.api_key = apiKey.trim();
      const response = await API.put("/account/ai", body);
      setData((current) => ({ ...current, ...(response.data || {}) }));
      setApiKey("");
      setMessage(
        next.enabled
          ? "IA avancada ativada com sua chave."
          : "Voltou para a IA gratis da plataforma."
      );
    } catch (error) {
      logError(error);
      setMessage("Nao foi possivel salvar as configuracoes de IA.");
    } finally {
      setSaving(false);
    }
  }

  return { data, setData, apiKey, setApiKey, message, saving, save };
}

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
  const { t } = useT();
  return (
    <aside className="settings-sidebar">
      <h2>{t("Configuracoes da Conta")}</h2>

      {sidebarGroups.map((group) => (
        <div key={group.title}>
          <strong>{t(group.title)}</strong>
          {group.items.map((item) => (
            <button
              type="button"
              key={item.key}
              className={activePage === item.key ? "active" : ""}
              onClick={() => setPage?.(item.key)}
            >
              {t(item.label)}
            </button>
          ))}
        </div>
      ))}
    </aside>
  );
}

function ProfileSettings({ user }) {
  const { prefs, catalog, email, message, toggleNotification } = useNotificationPrefs();
  const ai = useAiSettings();
  const rows = catalog.length
    ? catalog
    : notificationRows.map(([title, description], index) => ({
        key: `row-${index}`,
        title,
        description,
      }));

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
        <p className="account-notification-hint">
          Ao ativar um aviso, a NEXT envia as atividades para o seu e-mail
          cadastrado{email ? ` (${email})` : ""}.
        </p>
        {message && <strong className="bulk-message">{message}</strong>}
        <table className="account-notification-table">
          <thead>
            <tr>
              <th>Tipo de Notificacao</th>
              <th>E-mail</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.key}>
                <td>
                  <strong>{row.title}</strong>
                  <span>{row.description}</span>
                </td>
                <td>
                  <MiniToggle
                    checked={Boolean(prefs.notifications[row.key])}
                    onClick={() => toggleNotification(row.key)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="settings-tool-card account-card">
        <h2>Inteligencia Artificial</h2>
        <p className="account-notification-hint">
          O chat e o leitor de boleto usam a IA gratis da plataforma por padrao.
          Para um modelo mais avancado, ative e use sua propria chave de API —
          voce paga apenas o seu uso, direto no provedor.
        </p>
        {ai.message && <strong className="bulk-message">{ai.message}</strong>}

        <div className="account-info-row">
          <span>Usar IA avancada (minha propria chave)</span>
          <MiniToggle
            checked={ai.data.enabled}
            onClick={() => ai.setData({ ...ai.data, enabled: !ai.data.enabled })}
          />
        </div>

        {ai.data.enabled && (
          <div className="account-form-grid">
            <label>
              Provedor
              <select
                value={ai.data.provider}
                onChange={(event) => ai.setData({ ...ai.data, provider: event.target.value })}
              >
                <option value="openai">OpenAI (GPT)</option>
                <option value="gemini">Google Gemini</option>
                <option value="groq">Groq (Llama)</option>
              </select>
            </label>
            <label>
              Chave de API
              <input
                type="password"
                placeholder={
                  ai.data.key_configured ? `Chave salva (${ai.data.key_hint})` : "Cole sua chave de API"
                }
                value={ai.apiKey}
                onChange={(event) => ai.setApiKey(event.target.value)}
              />
            </label>
            <label>
              Modelo (opcional)
              <input
                placeholder="padrao do provedor"
                value={ai.data.chat_model || ""}
                onChange={(event) => ai.setData({ ...ai.data, chat_model: event.target.value })}
              />
            </label>
          </div>
        )}

        <div className="integration-actions">
          <button type="button" onClick={() => ai.save(ai.data)} disabled={ai.saving}>
            {ai.saving ? "Salvando..." : "Salvar IA"}
          </button>
        </div>
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
  const { t, lang, setLang, languages } = useT();
  const [message, setMessage] = useState("");

  return (
    <section className="settings-tool-card account-card">
      <h2>{t("Idioma")}</h2>
      <p className="account-notification-hint">
        {t("Idioma de exibicao")}: ao trocar, todo o sistema muda na hora.
      </p>
      <div className="account-form-grid">
        <label>
          {t("Idioma de exibicao")}
          <select
            value={lang}
            onChange={(event) => {
              setLang(event.target.value);
              setMessage("OK");
            }}
          >
            {languages.map((item) => (
              <option key={item.code} value={item.code}>
                {item.flag} {item.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          {t("Moeda padrao")}
          <select defaultValue="brl">
            <option value="brl">BRL</option>
            <option value="usd">USD</option>
            <option value="eur">EUR</option>
          </select>
        </label>
        <label>
          {t("Fuso horario")}
          <select defaultValue="brasilia">
            <option value="brasilia">(GMT-03:00) Brasilia</option>
            <option value="manaus">(GMT-04:00) Manaus</option>
            <option value="lisbon">(GMT+00:00) Lisboa</option>
          </select>
        </label>
        <button type="button" onClick={() => setMessage("OK")}>
          {t("Salvar alteracoes")}
        </button>
      </div>
      {message && <strong className="bulk-message">{t("Idioma")} OK</strong>}
    </section>
  );
}

function SecuritySettings() {
  const [uniqueLogin, setUniqueLogin] = useState(false);
  const {
    prefs,
    securityCatalog,
    email,
    message,
    toggleSecurity,
    setSecurityValue,
    saveSecurityValue,
  } = useNotificationPrefs();

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
            Quando o sistema detectar os comportamentos abaixo, ele enviara o
            aviso para o seu e-mail cadastrado{email ? ` (${email})` : ""} antes
            de liberar a operacao.
          </p>
          {message && <strong className="bulk-message">{message}</strong>}
          {securityCatalog.map((item) => (
            <SecurityRule
              key={item.key}
              text={item.title}
              suffix={item.suffix}
              checked={Boolean((prefs.security[item.key] || {}).enabled)}
              value={(prefs.security[item.key] || {}).value || ""}
              onToggle={() => toggleSecurity(item.key)}
              onChange={(value) => setSecurityValue(item.key, value)}
              onCommit={saveSecurityValue}
            />
          ))}
        </div>
      </section>
    </>
  );
}

function SecurityRule({ text, suffix, checked, value, onToggle, onChange, onCommit }) {
  return (
    <div className="security-rule-row">
      <MiniToggle checked={checked} onClick={onToggle} />
      <span>{text}</span>
      <input
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        onBlur={() => onCommit?.()}
      />
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
          <span>NEXT ERP Pro</span>
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
  const [moduleKey, setModuleKey] = useState(helpContent[0]?.moduleKey || "");
  const [search, setSearch] = useState("");
  const [openId, setOpenId] = useState("");

  const term = search.trim().toLowerCase();
  const searching = term.length > 1;
  const activeModule =
    helpContent.find((module) => module.moduleKey === moduleKey) || helpContent[0];

  const searchResults = searching
    ? helpContent.flatMap((module) =>
        module.topics
          .filter((topic) =>
            `${topic.title} ${topic.summary} ${topic.path} ${(topic.steps || []).join(" ")}`
              .toLowerCase()
              .includes(term)
          )
          .map((topic) => ({ ...topic, moduleLabel: module.moduleLabel }))
      )
    : [];

  const topics = searching ? searchResults : activeModule?.topics || [];

  return (
    <section className="settings-tool-card account-card help-center">
      <div className="help-header">
        <div>
          <h2>Central de Ajuda</h2>
          <p>
            Passo a passo de cada funcao do NEXT ERP. Busque sua duvida ou
            escolha uma area abaixo.
          </p>
        </div>
        <input
          className="help-search"
          placeholder="Buscar ajuda (ex: conectar Shopee, precificar, estoque)"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      <div className="help-body">
        {!searching && (
          <aside className="help-categories">
            {helpContent.map((module) => (
              <button
                type="button"
                key={module.moduleKey}
                className={module.moduleKey === moduleKey ? "active" : ""}
                onClick={() => {
                  setModuleKey(module.moduleKey);
                  setOpenId("");
                }}
              >
                <span>{module.icon}</span>
                <strong>{module.moduleLabel}</strong>
                <em>{module.topics.length}</em>
              </button>
            ))}
          </aside>
        )}

        <div className="help-topics">
          {!searching && activeModule?.intro && (
            <p className="help-intro">{activeModule.intro}</p>
          )}
          {searching && (
            <p className="help-intro">
              {topics.length} resultado(s) para "{search}".
            </p>
          )}

          {topics.map((topic) => {
            const id = `${topic.moduleLabel || moduleKey}:${topic.id}`;
            const open = openId === id;

            return (
              <article key={id} className={`help-topic ${open ? "open" : ""}`}>
                <button
                  type="button"
                  className="help-topic-head"
                  onClick={() => setOpenId(open ? "" : id)}
                >
                  <div>
                    <strong>{topic.title}</strong>
                    <span>{topic.path}</span>
                  </div>
                  <i>{open ? "−" : "+"}</i>
                </button>

                {open && (
                  <div className="help-topic-body">
                    <p>{topic.summary}</p>

                    {topic.steps?.length > 0 && (
                      <ol className="help-steps">
                        {topic.steps.map((step, index) => (
                          <li key={index}>{step.replace(/^\s*\d+\.\s*/, "")}</li>
                        ))}
                      </ol>
                    )}

                    {topic.tips?.length > 0 && (
                      <div className="help-tips">
                        <strong>Dicas</strong>
                        <ul>
                          {topic.tips.map((tip, index) => (
                            <li key={index}>{tip}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {topic.faq?.length > 0 && (
                      <div className="help-faq">
                        <strong>Perguntas frequentes</strong>
                        {topic.faq.map((item, index) => (
                          <div key={index} className="help-faq-item">
                            <b>{item.q}</b>
                            <span>{item.a}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </div>
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
