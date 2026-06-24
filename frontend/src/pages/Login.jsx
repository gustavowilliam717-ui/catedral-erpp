import { useEffect, useState } from "react";
import API from "../services/api";
import { logError } from "../utils/logger";

function createCaptchaCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 5 }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join("");
}

export default function Login({ onAuthenticated }) {
  const [needsSetup, setNeedsSetup] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [verification, setVerification] = useState(null);
  const [legalOpen, setLegalOpen] = useState(null);
  const [mode, setMode] = useState("login");
  const [registerCodeInfo, setRegisterCodeInfo] = useState(null);
  const [captchaCode, setCaptchaCode] = useState(() => createCaptchaCode());
  const [form, setForm] = useState({
    name: "Administrador",
    email: "",
    password: "",
    phone: "",
    verificationChannel: "email",
    code: "",
    emailCode: "",
    smsCode: "",
    captcha: "",
    remember: true,
    acceptedTerms: false,
  });

  useEffect(() => {
    checkSetup();
  }, []);

  async function checkSetup() {
    try {
      const response = await API.get("/auth/bootstrap-status");
      setNeedsSetup(Boolean(response.data.needs_setup));
    } catch (error) {
      logError(error);
      setMessage("Nao consegui verificar o status do acesso.");
    } finally {
      setIsChecking(false);
    }
  }

  function update(field, value) {
    setForm({ ...form, [field]: value });
  }

  function refreshCaptcha() {
    setCaptchaCode(createCaptchaCode());
    setForm((current) => ({ ...current, captcha: "" }));
  }

  function completeLogin(data) {
    localStorage.setItem("catedral_token", data.token);
    localStorage.setItem("catedral_user", JSON.stringify(data.user));
    onAuthenticated(data.user);
  }

  function switchMode(nextMode) {
    setMode(nextMode);
    setMessage("");
    setVerification(null);
    setRegisterCodeInfo(null);
    refreshCaptcha();
  }

  async function sendRegisterCode() {
    setMessage("");

    if (!form.email || !form.phone) {
      setMessage("Informe email e celular para enviar os codigos.");
      return;
    }

    try {
      setIsLoading(true);
      const response = await API.post("/auth/register-code", {
        email: form.email,
        phone: form.phone,
      });
      setRegisterCodeInfo(response.data);
      setForm((current) => ({ ...current, emailCode: "", smsCode: "" }));
    } catch (error) {
      logError(error);
      setMessage(error?.response?.data?.detail || "Nao foi possivel enviar os codigos.");
    } finally {
      setIsLoading(false);
    }
  }

  async function submit(event) {
    event.preventDefault();
    setMessage("");

    if (mode === "register") {
      if (!form.email || !form.password || !form.phone) {
        setMessage("Informe email, senha e telefone.");
        return;
      }

      if (!form.emailCode || !form.smsCode) {
        setMessage("Informe os codigos recebidos por email e SMS.");
        return;
      }

      if (!form.acceptedTerms) {
        setMessage("Aceite os termos para criar sua conta.");
        return;
      }

      try {
        setIsLoading(true);
        const response = await API.post("/auth/register", {
          name: form.name,
          email: form.email,
          password: form.password,
          phone: form.phone,
          email_code: form.emailCode,
          sms_code: form.smsCode,
          accepted_terms: form.acceptedTerms,
        });

        completeLogin(response.data);
      } catch (error) {
        logError(error);
        setMessage(error?.response?.data?.detail || "Nao foi possivel cadastrar.");
      } finally {
        setIsLoading(false);
      }

      return;
    }

    if (verification) {
      if (!form.code) {
        setMessage("Informe o codigo de verificacao.");
        return;
      }

      try {
        setIsLoading(true);
        const response = await API.post("/auth/verify-login", {
          challenge_id: verification.challenge_id,
          code: form.code,
        });

        completeLogin(response.data);
      } catch (error) {
        logError(error);
        setMessage(error?.response?.data?.detail || "Codigo invalido.");
      } finally {
        setIsLoading(false);
      }

      return;
    }

    if (!form.email || !form.password) {
      setMessage("Informe email e senha.");
      return;
    }

    if (form.captcha.trim().toUpperCase() !== captchaCode) {
      setMessage("Confira o CAPTCHA para continuar.");
      refreshCaptcha();
      return;
    }

    if (form.verificationChannel === "phone" && !form.phone) {
      setMessage("Informe o celular cadastrado para receber o codigo.");
      return;
    }

    try {
      setIsLoading(true);
      const endpoint = needsSetup ? "/auth/setup" : "/auth/login";
      const payload = needsSetup
        ? {
            name: form.name,
            email: form.email,
            password: form.password,
            verification_channel: form.verificationChannel,
            phone: form.phone,
          }
        : {
            email: form.email,
            password: form.password,
            verification_channel: form.verificationChannel,
            phone: form.phone,
          };
      const response = await API.post(endpoint, payload);

      if (response.data.requires_verification) {
        setVerification(response.data);
        setForm((current) => ({ ...current, code: "" }));
        setMessage("");
        return;
      }

      completeLogin(response.data);
    } catch (error) {
      logError(error);
      setMessage(error?.response?.data?.detail || "Nao foi possivel entrar.");
    } finally {
      setIsLoading(false);
    }
  }

  if (isChecking) {
    return (
      <div className="auth-page cathedral-login">
        <div className="auth-loading-card">
          <span className="rocket-logo auth-rocket" aria-hidden="true">
            <span className="rocket-trail" />
            <span className="rocket-flame" />
            <span className="rocket-ship">
              <span className="rocket-window" />
            </span>
          </span>
          <strong>Carregando acesso...</strong>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page cathedral-login">
      <header className="login-topbar">
        <button type="button" className="login-brand">
          <span className="rocket-logo auth-rocket" aria-hidden="true">
            <span className="rocket-trail" />
            <span className="rocket-flame" />
            <span className="rocket-ship">
              <span className="rocket-window" />
            </span>
          </span>
          <strong>Catedral ERP</strong>
        </button>

        <select defaultValue="pt-br" aria-label="Idioma">
          <option value="pt-br">PT</option>
          <option value="en">EN</option>
          <option value="es">ES</option>
        </select>
      </header>

      <main className={`login-stage ${mode === "register" ? "register-stage" : ""}`}>
        {mode === "register" ? (
          <section className="register-proof-panel">
            <div>
              <span>Escolha inteligente para marketplace</span>
              <h1>
                Venda com uma plataforma feita para operacoes profissionais.
              </h1>
            </div>

            <div className="trust-badge-grid">
              <article>
                <strong>Shopee</strong>
                <span>Importacao e pedidos</span>
              </article>
              <article>
                <strong>Mercado Livre</strong>
                <span>Estoque e anuncios</span>
              </article>
              <article>
                <strong>Amazon</strong>
                <span>Gestao multicanal</span>
              </article>
              <article>
                <strong>TikTok Shop</strong>
                <span>Operacao conectada</span>
              </article>
              <article>
                <strong>Seguranca</strong>
                <span>Email, celular e sessao</span>
              </article>
              <article>
                <strong>ERP Pro</strong>
                <span>Plano unico R$ 389,00</span>
              </article>
            </div>
          </section>
        ) : (
          <section className="login-intro">
            <span>Marketplace ERP</span>
            <div className="login-headline-wrap">
              <span className="rocket-logo login-headline-rocket" aria-hidden="true">
                <span className="rocket-trail" />
                <span className="rocket-flame" />
                <span className="rocket-ship">
                  <span className="rocket-window" />
                </span>
              </span>
              <h1>Operacao centralizada para vender com controle.</h1>
            </div>
            <p>
              Produtos, pedidos, estoque, precificacao, SAC e financeiro em uma
              plataforma segura para equipes de marketplace.
            </p>
          </section>
        )}

        <form className="auth-card cathedral-auth-card" onSubmit={submit}>
          <div className="login-card-heading">
            {mode === "register" && (
              <button
                type="button"
                className="inline-login-link"
                onClick={() => switchMode("login")}
              >
                Ja tem uma conta? Login
              </button>
            )}
            <span>
              {mode === "register"
                ? "Cadastro"
                : verification
                ? "Verificacao"
                : needsSetup
                  ? "Primeiro acesso"
                  : "Login"}
            </span>
            <h2>
              {mode === "register"
                ? "Criar conta Catedral ERP"
                : verification
                ? "Confirme seu acesso"
                : needsSetup
                  ? "Criar administrador"
                  : "Entrar na Catedral ERP"}
            </h2>
          </div>

          {!verification && mode === "login" && (
            <>
              {needsSetup && (
                <input
                  placeholder="Nome"
                  value={form.name}
                  onChange={(event) => update("name", event.target.value)}
                />
              )}

              <input
                placeholder="Endereco de Email"
                type="email"
                value={form.email}
                onChange={(event) => update("email", event.target.value)}
              />

              <input
                placeholder="Senha"
                type="password"
                value={form.password}
                onChange={(event) => update("password", event.target.value)}
              />

              <div className="captcha-row">
                <input
                  placeholder="CAPTCHA"
                  value={form.captcha}
                  onChange={(event) => update("captcha", event.target.value)}
                />
                <button
                  type="button"
                  className="captcha-code"
                  onClick={refreshCaptcha}
                  title="Gerar outro CAPTCHA"
                >
                  {captchaCode}
                </button>
              </div>

              <div className="auth-methods">
                <button
                  type="button"
                  className={form.verificationChannel === "email" ? "active" : ""}
                  onClick={() => update("verificationChannel", "email")}
                >
                  Verificar por email
                </button>
                <button
                  type="button"
                  className={form.verificationChannel === "phone" ? "active" : ""}
                  onClick={() => update("verificationChannel", "phone")}
                >
                  Verificar por celular
                </button>
              </div>

              {form.verificationChannel === "phone" && (
                <input
                  placeholder="Celular cadastrado com DDD"
                  value={form.phone}
                  onChange={(event) => update("phone", event.target.value)}
                />
              )}
            </>
          )}

          {mode === "register" && (
            <>
              <input
                placeholder="Nome completo"
                value={form.name}
                onChange={(event) => update("name", event.target.value)}
              />

              <input
                placeholder="Endereco de Email"
                type="email"
                value={form.email}
                onChange={(event) => update("email", event.target.value)}
              />

              <div className="phone-input-row">
                <select defaultValue="+55" aria-label="Codigo do pais">
                  <option value="+55">+55</option>
                  <option value="+1">+1</option>
                  <option value="+351">+351</option>
                </select>
                <input
                  placeholder="Telefone"
                  value={form.phone}
                  onChange={(event) => update("phone", event.target.value)}
                />
              </div>

              <div className="register-code-row">
                <input
                  placeholder="Codigo recebido por email"
                  inputMode="numeric"
                  maxLength="6"
                  value={form.emailCode}
                  onChange={(event) => update("emailCode", event.target.value)}
                />
                <button type="button" onClick={sendRegisterCode} disabled={isLoading}>
                  Enviar codigos
                </button>
              </div>

              <input
                placeholder="Codigo recebido por SMS"
                inputMode="numeric"
                maxLength="6"
                value={form.smsCode}
                onChange={(event) => update("smsCode", event.target.value)}
              />

              {registerCodeInfo && (
                <div className="register-code-status">
                  <strong>Codigos enviados</strong>
                  <span>Email: {registerCodeInfo.email}</span>
                  <span>SMS: {registerCodeInfo.phone}</span>
                </div>
              )}

              <input
                placeholder="Senha"
                type="password"
                value={form.password}
                onChange={(event) => update("password", event.target.value)}
              />

              <label className="terms-check-row">
                <input
                  type="checkbox"
                  checked={form.acceptedTerms}
                  onChange={(event) => update("acceptedTerms", event.target.checked)}
                />
                <span>Eu concordo e aceito</span>
                <button type="button" onClick={() => setLegalOpen("terms")}>
                  Termos de Servico
                </button>
                <span>e</span>
                <button type="button" onClick={() => setLegalOpen("privacy")}>
                  Politica de Privacidade
                </button>
              </label>
            </>
          )}

          {verification && (
            <div className="auth-verification-box">
              <p>
                Enviamos um codigo para{" "}
                <strong>
                  {verification.channel === "phone" ? "o celular" : "o email"}{" "}
                  {verification.target}
                </strong>
                . Ele expira em {verification.expires_in_minutes} minutos.
              </p>

              <input
                placeholder="Codigo de 6 digitos"
                inputMode="numeric"
                maxLength="6"
                value={form.code}
                onChange={(event) => update("code", event.target.value)}
              />
            </div>
          )}

          {message && <strong className="auth-message">{message}</strong>}

          <button type="submit" disabled={isLoading}>
            {isLoading
              ? "Aguarde..."
              : mode === "register"
                ? "Cadastre-se gratis"
                : verification
                ? "Verificar e entrar"
                : "Login"}
          </button>

          {verification ? (
            <button
              type="button"
              className="auth-back-button"
              onClick={() => {
                setVerification(null);
                setMessage("");
              }}
            >
              Voltar
            </button>
          ) : mode === "login" ? (
            <div className="login-options">
              <label>
                <input
                  type="checkbox"
                  checked={form.remember}
                  onChange={(event) => update("remember", event.target.checked)}
                />
                Mantenha-me conectado por 14 dias
              </label>
              <button
                type="button"
                onClick={() =>
                  setMessage("A recuperacao de senha sera ativada na proxima etapa.")
                }
              >
                Esqueci minha senha
              </button>
            </div>
          ) : (
            <div className="register-helper-links">
              <button type="button">Baixar APP</button>
              <button type="button">Fale conosco</button>
            </div>
          )}

          <p>
            {mode === "register"
              ? "Depois do cadastro, voce acessa a plataforma com verificacao de seguranca."
              : verification
              ? "Essa etapa confirma que existe uma pessoa real tentando entrar."
              : "Ao continuar o login, voce concorda com os documentos legais da plataforma."}
          </p>

          {!verification && mode === "login" && (
            <div className="legal-links">
              <button type="button" onClick={() => setLegalOpen("terms")}>
                Termos de Servico
              </button>
              <span>e</span>
              <button type="button" onClick={() => setLegalOpen("privacy")}>
                Politica de Privacidade
              </button>
            </div>
          )}

          {!verification && mode === "login" && (
            <button
              type="button"
              className="free-signup-button"
              onClick={() => switchMode("register")}
            >
              Cadastre-se gratis
            </button>
          )}
        </form>
      </main>

      <footer className="login-footer">
        <span>Precisa de ajuda?</span>
        <button type="button">WhatsApp</button>
      </footer>

      {legalOpen && (
        <LegalModal type={legalOpen} onClose={() => setLegalOpen(null)} />
      )}
    </div>
  );
}

function LegalModal({ type, onClose }) {
  const isTerms = type === "terms";
  const title = isTerms ? "Termos de Servico" : "Politica de Privacidade";
  const updated = isTerms ? "Atualizado em 23 de junho de 2026" : "Vigente em 23 de junho de 2026";
  const sections = isTerms ? termsSections : privacySections;

  return (
    <div className="legal-modal-backdrop" role="dialog" aria-modal="true">
      <section className="legal-modal">
        <header>
          <div>
            <span>Catedral ERP</span>
            <h2>{title}</h2>
            <p>{updated}</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Fechar">
            x
          </button>
        </header>

        <div className="legal-content">
          {sections.map((section) => (
            <article key={section.title}>
              <h3>{section.title}</h3>
              <p>{section.text}</p>
            </article>
          ))}
        </div>

        <footer>
          <span>Contato: suporte@catedralerp.com.br</span>
          <button type="button" onClick={onClose}>
            Entendi
          </button>
        </footer>
      </section>
    </div>
  );
}

const termsSections = [
  {
    title: "1. Visao geral",
    text:
      "A Catedral ERP fornece uma plataforma para gestao de operacoes de marketplace, incluindo produtos, pedidos, estoque, precificacao, financeiro, SAC, integracoes e automacoes. Ao acessar a plataforma, voce declara que leu e concorda com estes termos.",
  },
  {
    title: "2. Conta e acesso",
    text:
      "O acesso deve ser feito com email, senha e verificacao por email ou celular. Voce e responsavel por manter suas credenciais em sigilo, configurar usuarios autorizados e revisar permissoes de equipe quando necessario.",
  },
  {
    title: "3. Plano e pagamento",
    text:
      "A Catedral ERP trabalha com um plano unico de R$ 389,00 por mes. Recursos, limites, valores e condicoes comerciais podem ser atualizados mediante aviso ao cliente dentro da plataforma ou por canais oficiais.",
  },
  {
    title: "4. Uso comercial",
    text:
      "A plataforma e destinada a operacoes comerciais de ecommerce e marketplaces. O usuario declara ter autorizacao para operar as lojas, dados, integracoes, contas fiscais e informacoes comerciais inseridas no sistema.",
  },
  {
    title: "5. Integracoes e marketplaces",
    text:
      "Conexoes com Shopee, Mercado Livre, Amazon, Shein, TikTok Shop e outras plataformas dependem das regras e APIs de cada marketplace. Alteracoes, instabilidades ou bloqueios externos podem afetar recursos do ERP.",
  },
  {
    title: "6. Usos proibidos",
    text:
      "E proibido usar o sistema para fraude, spam, invasao, tentativa de burlar seguranca, violacao de leis, coleta indevida de dados, publicacao de conteudo ilegal ou qualquer atividade que prejudique terceiros ou a plataforma.",
  },
  {
    title: "7. Disponibilidade e limites",
    text:
      "Buscamos manter o servico estavel e seguro, mas manutencoes, falhas externas, indisponibilidades de internet, APIs de terceiros ou eventos fora do nosso controle podem interromper temporariamente recursos.",
  },
  {
    title: "8. Cancelamento",
    text:
      "O cliente pode solicitar cancelamento conforme as condicoes comerciais vigentes. Dados e historicos poderao ser mantidos pelo periodo necessario para cumprimento legal, seguranca, auditoria e suporte.",
  },
  {
    title: "9. Atualizacoes",
    text:
      "Estes termos podem ser atualizados para refletir novas funcionalidades, exigencias legais, ajustes comerciais ou mudancas operacionais. O uso continuo da plataforma apos a atualizacao indica concordancia.",
  },
];

const privacySections = [
  {
    title: "1. Visao geral",
    text:
      "Esta Politica explica como a Catedral ERP coleta, utiliza, armazena, protege e compartilha dados pessoais durante o uso da plataforma de gestao para ecommerce e marketplaces.",
  },
  {
    title: "2. Conta e autenticacao",
    text:
      "Para criar e acessar uma conta, podemos tratar nome, email, telefone, senha protegida por criptografia, codigo de verificacao, registros de sessao, perfil de usuario, permissoes e data do ultimo acesso.",
  },
  {
    title: "3. Perfil e preferencias",
    text:
      "O usuario pode informar voluntariamente dados de perfil, como nome, idioma, pais, moeda, fuso horario, telefone e preferencias de notificacao. Esses dados sao usados para personalizar a experiencia e facilitar suporte.",
  },
  {
    title: "4. Dados operacionais do ERP",
    text:
      "Durante o uso da plataforma, podem ser tratados dados de produtos, pedidos, compradores, destinatarios, estoque, precificacao, financeiro, SAC, avaliacoes, mensagens, imagens, arquivos, integracoes e historicos de operacao.",
  },
  {
    title: "5. Finalidades de uso",
    text:
      "Usamos dados para autenticar usuarios, proteger a conta, operar funcionalidades contratadas, sincronizar marketplaces, importar planilhas, gerar relatorios, prestar suporte, auditar atividades, melhorar recursos e cumprir obrigacoes legais.",
  },
  {
    title: "6. Assinaturas e pagamentos",
    text:
      "Quando houver contratacao ou renovacao do plano, podemos tratar dados de transacao, valor, data, metodo de pagamento, status, comprovantes, notas, limites do plano e historico de assinatura.",
  },
  {
    title: "7. Suporte e atendimento",
    text:
      "Ao entrar em contato com suporte, podemos registrar identificacao da conta, mensagens, anexos, prints, dados tecnicos, historico de atendimento e solucoes aplicadas para resolver solicitacoes e melhorar a plataforma.",
  },
  {
    title: "8. Subcontas e usuarios autorizados",
    text:
      "Administradores podem criar subcontas e conceder permissoes a membros da equipe. O administrador declara possuir autorizacao para informar email, nome, telefone, funcao e permissoes desses usuarios.",
  },
  {
    title: "9. Consumidores finais e contatos comerciais",
    text:
      "Ao sincronizar pedidos e marketplaces, a loja pode trazer dados de compradores, destinatarios, fornecedores, logistica e contatos comerciais. A loja e responsavel por garantir base legal e autorizacao para tratar esses dados.",
  },
  {
    title: "10. Compartilhamento com terceiros",
    text:
      "Podemos compartilhar dados com provedores de hospedagem, banco de dados, email, SMS, pagamentos, suporte, analise, seguranca e marketplaces conectados, sempre quando necessario para entregar o servico ou cumprir obrigacoes legais.",
  },
  {
    title: "11. Armazenamento e retencao",
    text:
      "Mantemos dados pelo tempo necessario para operacao, suporte, auditoria, seguranca, cumprimento contratual, obrigacoes fiscais e legais. Quando nao forem mais necessarios, dados podem ser excluidos ou anonimizados.",
  },
  {
    title: "12. Seguranca da informacao",
    text:
      "Aplicamos controles de acesso, autenticacao, verificacao por codigo, protecao de senha, registro de sessoes e boas praticas de seguranca. Nenhuma plataforma online, porem, consegue garantir risco zero.",
  },
  {
    title: "13. Direitos do titular",
    text:
      "Voce pode solicitar acesso, correcao, revisao, portabilidade, exportacao ou exclusao de dados pessoais, respeitando limites legais, fiscais, contratuais, comerciais e de seguranca aplicaveis ao ERP.",
  },
  {
    title: "14. Criancas e adolescentes",
    text:
      "A Catedral ERP e destinada a uso empresarial e profissional. A plataforma nao e direcionada a menores de idade, e nao deve ser utilizada por criancas ou adolescentes sem base legal adequada.",
  },
  {
    title: "15. Cookies, tokens e armazenamento local",
    text:
      "Podemos usar cookies, tokens, armazenamento local e tecnologias semelhantes para manter login, lembrar preferencias, proteger sessoes, medir estabilidade e permitir funcionalidades essenciais da plataforma.",
  },
  {
    title: "16. Atualizacoes e contato",
    text:
      "Esta politica pode ser atualizada para refletir novas funcionalidades, exigencias legais ou mudancas operacionais. Duvidas, solicitacoes e pedidos de privacidade podem ser enviados ao suporte oficial da Catedral ERP.",
  },
];
