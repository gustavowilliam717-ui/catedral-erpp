import { useEffect, useMemo, useState } from "react";
import API from "../services/api";
import { logError } from "../utils/logger";

const defaultConfig = {
  provider: "focus_nfe",
  environment: "homologacao",
  base_url: "https://homologacao.focusnfe.com.br",
  focus_token: "",
  company_name: "",
  company_document: "",
  state_registration: "",
  municipal_registration: "",
  tax_regime: "",
  series_nfe: "1",
  series_nfce: "1",
  automatic_issue: false,
  focus_issuer_registered: false,
  focus_nfe_enabled: false,
  focus_certificate_uploaded: false,
  focus_homologation_token_ready: false,
  focus_production_token_ready: false,
  focus_nfce_csc_configured: false,
  focus_token_configured: false,
};

const readinessItems = [
  {
    key: "focus_issuer_registered",
    title: "Emitente cadastrado na Focus",
    detail: "Cadastrar a empresa emitente no painel/API da Focus antes de emitir.",
  },
  {
    key: "focus_nfe_enabled",
    title: "NF-e habilitada",
    detail: "Habilitar o documento NF-e em Documentos Fiscais no cadastro do emitente.",
  },
  {
    key: "focus_certificate_uploaded",
    title: "Certificado A1 anexado",
    detail: "Anexar o certificado digital A1 ICP-Brasil e informar a senha no painel da Focus.",
  },
  {
    key: "focus_homologation_token_ready",
    title: "Token de homologacao",
    detail: "Copiar o token de homologacao da secao Tokens e salvar nesta tela.",
  },
  {
    key: "focus_production_token_ready",
    title: "Token de producao",
    detail: "Usar somente depois de validar a emissao em homologacao.",
  },
  {
    key: "focus_nfce_csc_configured",
    title: "NFC-e: CSC e ID Token",
    detail: "Necessario apenas para NFC-e; deve ser solicitado na SEFAZ estadual.",
  },
];

function prettyJson(data) {
  return JSON.stringify(data, null, 2);
}

function onlyDigits(value) {
  return String(value || "").replace(/\D/g, "");
}

function buildSampleNfe(config) {
  return {
    natureza_operacao: "Venda",
    data_emissao: new Date().toISOString(),
    tipo_documento: 1,
    local_destino: 1,
    finalidade_emissao: 1,
    consumidor_final: 1,
    presenca_comprador: 2,
    indicador_intermediario: 0,
    cnpj_emitente: onlyDigits(config.company_document) || "SEU_CNPJ_NUMERICO",
    nome_emitente: config.company_name || "Sua Razao Social Ltda",
    nome_fantasia_emitente: "NEXTERP",
    logradouro_emitente: "Rua Exemplo",
    numero_emitente: "100",
    bairro_emitente: "Centro",
    municipio_emitente: "Sao Paulo",
    uf_emitente: "SP",
    cep_emitente: "01001000",
    inscricao_estadual_emitente: config.state_registration || "ISENTO",
    regime_tributario_emitente: Number(config.tax_regime || 1),
    cpf_destinatario: "00000000000",
    nome_destinatario: "NF-E EMITIDA EM AMBIENTE DE HOMOLOGACAO - SEM VALOR FISCAL",
    logradouro_destinatario: "Rua Cliente",
    numero_destinatario: "200",
    bairro_destinatario: "Centro",
    municipio_destinatario: "Sao Paulo",
    uf_destinatario: "SP",
    cep_destinatario: "01001000",
    indicador_inscricao_estadual_destinatario: 9,
    modalidade_frete: 9,
    valor_produtos: 10,
    valor_total: 10,
    items: [
      {
        numero_item: "1",
        codigo_produto: "SKU-001",
        descricao: "Produto de teste",
        cfop: "5102",
        unidade_comercial: "un",
        quantidade_comercial: 1,
        valor_unitario_comercial: 10,
        valor_unitario_tributavel: 10,
        unidade_tributavel: "un",
        codigo_ncm: "61091000",
        quantidade_tributavel: 1,
        valor_bruto: 10,
        icms_situacao_tributaria: "102",
        icms_origem: "0",
        pis_situacao_tributaria: "07",
        cofins_situacao_tributaria: "07",
      },
    ],
  };
}

function formatDate(value) {
  if (!value) return "-";
  return new Date(value).toLocaleString("pt-BR");
}

function statusLabel(status) {
  return status || "processando";
}

function readinessComplete(config) {
  return (
    config.focus_issuer_registered &&
    config.focus_nfe_enabled &&
    config.focus_certificate_uploaded &&
    config.focus_token_configured
  );
}

export default function FiscalSettings() {
  const [config, setConfig] = useState(defaultConfig);
  const [focusTokenInput, setFocusTokenInput] = useState("");
  const [invoices, setInvoices] = useState([]);
  const [documentType, setDocumentType] = useState("nfe");
  const [ref, setRef] = useState("");
  const [jsonText, setJsonText] = useState(() => prettyJson(buildSampleNfe(defaultConfig)));
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadFiscalData();
  }, []);

  async function loadFiscalData() {
    try {
      const [configResponse, invoiceResponse] = await Promise.all([
        API.get("/fiscal/config"),
        API.get("/fiscal/invoices"),
      ]);
      setConfig({ ...defaultConfig, ...configResponse.data });
      setInvoices(invoiceResponse.data || []);
    } catch (error) {
      logError(error);
      setMessage("Nao foi possivel carregar o modulo fiscal.");
    }
  }

  async function saveConfig(event) {
    event.preventDefault();
    setMessage("");

    try {
      setIsLoading(true);
      const response = await API.put("/fiscal/config", {
        ...config,
        focus_token: focusTokenInput.trim(),
      });
      setConfig({ ...defaultConfig, ...response.data });
      setFocusTokenInput("");
      setMessage("Configuracao fiscal salva.");
    } catch (error) {
      logError(error);
      setMessage(error?.response?.data?.detail || "Nao foi possivel salvar a configuracao.");
    } finally {
      setIsLoading(false);
    }
  }

  async function issueInvoice(event) {
    event.preventDefault();
    setMessage("");

    let payload;

    try {
      payload = JSON.parse(jsonText);
    } catch (error) {
      setMessage("O JSON fiscal esta invalido.");
      return;
    }

    try {
      setIsLoading(true);
      const response = await API.post("/fiscal/invoices", {
        ref,
        document_type: documentType,
        payload,
      });
      setSelectedInvoice(response.data);
      setRef("");
      setMessage("Nota enviada para processamento fiscal.");
      await loadFiscalData();
    } catch (error) {
      logError(error);
      setMessage(error?.response?.data?.detail || "Nao foi possivel emitir a nota.");
    } finally {
      setIsLoading(false);
    }
  }

  async function refreshInvoice(invoiceRef) {
    setMessage("");

    try {
      const response = await API.get(`/fiscal/invoices/${invoiceRef}?refresh=true`);
      setSelectedInvoice(response.data);
      await loadFiscalData();
      setMessage("Status fiscal atualizado.");
    } catch (error) {
      logError(error);
      setMessage(error?.response?.data?.detail || "Nao foi possivel consultar a nota.");
    }
  }

  async function cancelInvoice(event) {
    event.preventDefault();

    if (!selectedInvoice) {
      setMessage("Selecione uma nota para cancelar.");
      return;
    }

    try {
      const response = await API.post(`/fiscal/invoices/${selectedInvoice.ref}/cancel`, {
        justificativa: cancelReason,
      });
      setSelectedInvoice(response.data);
      setCancelReason("");
      await loadFiscalData();
      setMessage("Cancelamento enviado ao provedor fiscal.");
    } catch (error) {
      logError(error);
      setMessage(error?.response?.data?.detail || "Nao foi possivel cancelar a nota.");
    }
  }

  const tokenStatus = config.focus_token_configured ? "Token configurado" : "Token pendente";
  const canIssueNfe = readinessComplete(config);

  const selectedDetails = useMemo(() => {
    if (!selectedInvoice) return [];

    return [
      ["Referencia", selectedInvoice.ref],
      ["Status", statusLabel(selectedInvoice.status)],
      ["Status SEFAZ", selectedInvoice.status_sefaz || "-"],
      ["Mensagem SEFAZ", selectedInvoice.mensagem_sefaz || "-"],
      ["Chave", selectedInvoice.chave || "-"],
      ["Numero", selectedInvoice.numero || "-"],
    ];
  }, [selectedInvoice]);

  return (
    <div className="settings-page fiscal-page">
      <aside className="settings-sidebar">
        <h2>Fiscal</h2>
        <div>
          <strong>SEFAZ</strong>
          <button type="button" className="active">Brasil NF-e</button>
          <button type="button">NFC-e</button>
          <button type="button">Cancelamentos</button>
        </div>
        <div>
          <strong>Ambiente</strong>
          <span className={config.focus_token_configured ? "status-chip ok" : "status-chip"}>
            {tokenStatus}
          </span>
          <span className="status-chip">{config.environment}</span>
        </div>
      </aside>

      <main className="settings-content">
        <section className="settings-title-card">
          <div>
            <span className="section-kicker">SEFAZ</span>
            <h1>Emissao fiscal Brasil</h1>
            <p>
              Configure o provedor fiscal, envie NF-e/NFC-e para homologacao ou
              producao e acompanhe retorno, XML, DANFE e cancelamentos.
            </p>
          </div>

          {message && <strong className="bulk-message">{message}</strong>}
        </section>

        <section className="settings-card fiscal-readiness-card">
          <div className="fiscal-section-heading">
            <div>
              <h2>Checklist Focus NFe</h2>
              <p>
                Segundo o suporte, estes passos precisam estar prontos na Focus
                antes da SEFAZ autorizar uma emissao.
              </p>
            </div>
            <span className={canIssueNfe ? "status-chip ok" : "status-chip"}>
              {canIssueNfe ? "Pronto para testar NF-e" : "Configuracao incompleta"}
            </span>
          </div>

          <div className="fiscal-readiness-grid">
            {readinessItems.map((item) => (
              <label key={item.key} className={config[item.key] ? "done" : ""}>
                <input
                  type="checkbox"
                  checked={Boolean(config[item.key])}
                  onChange={(event) =>
                    setConfig({ ...config, [item.key]: event.target.checked })
                  }
                />
                <span>
                  <strong>{item.title}</strong>
                  <small>{item.detail}</small>
                </span>
              </label>
            ))}
          </div>
        </section>

        <form className="settings-card fiscal-config-grid" onSubmit={saveConfig}>
          <div>
            <h2>Provedor fiscal</h2>
            <p>Token Focus, ambiente, dados da empresa, serie e regra de emissao.</p>
          </div>

          <label>
            Provedor
            <select
              value={config.provider}
              onChange={(event) => setConfig({ ...config, provider: event.target.value })}
            >
              <option value="focus_nfe">Focus NFe</option>
            </select>
          </label>

          <label>
            Ambiente
            <select
              value={config.environment}
              onChange={(event) => {
                const environment = event.target.value;
                setConfig({
                  ...config,
                  environment,
                  base_url:
                    environment === "producao"
                      ? "https://api.focusnfe.com.br"
                      : "https://homologacao.focusnfe.com.br",
                });
              }}
            >
              <option value="homologacao">Homologacao</option>
              <option value="producao">Producao</option>
            </select>
          </label>

          <label>
            URL API
            <input
              value={config.base_url}
              onChange={(event) => setConfig({ ...config, base_url: event.target.value })}
            />
          </label>

          <label>
            Token Focus NFe
            <input
              type="password"
              placeholder={config.focus_token_configured ? "Token ja configurado" : "Cole o token da Focus"}
              value={focusTokenInput}
              onChange={(event) => setFocusTokenInput(event.target.value)}
            />
          </label>

          <label>
            Razao social
            <input
              value={config.company_name}
              onChange={(event) => setConfig({ ...config, company_name: event.target.value })}
            />
          </label>

          <label>
            CNPJ
            <input
              value={config.company_document}
              onChange={(event) => setConfig({ ...config, company_document: event.target.value })}
            />
          </label>

          <label>
            Inscricao estadual
            <input
              value={config.state_registration}
              onChange={(event) =>
                setConfig({ ...config, state_registration: event.target.value })
              }
            />
          </label>

          <label>
            Regime tributario
            <select
              value={config.tax_regime}
              onChange={(event) => setConfig({ ...config, tax_regime: event.target.value })}
            >
              <option value="">Selecionar</option>
              <option value="1">Simples Nacional</option>
              <option value="2">Simples excesso sublimite</option>
              <option value="3">Regime normal</option>
            </select>
          </label>

          <label>
            Serie NF-e
            <input
              value={config.series_nfe}
              onChange={(event) => setConfig({ ...config, series_nfe: event.target.value })}
            />
          </label>

          <label className="toggle-line">
            <input
              type="checkbox"
              checked={Boolean(config.automatic_issue)}
              onChange={(event) =>
                setConfig({ ...config, automatic_issue: event.target.checked })
              }
            />
            Emitir automaticamente quando houver pedido integrado
          </label>

            <button type="submit" disabled={isLoading}>
            Salvar fiscal
          </button>
        </form>

        <section className="settings-card fiscal-issue-card">
          <div>
            <h2>Emitir nota</h2>
            <p>
              Envie o JSON fiscal aceito pelo Focus NFe. Em homologacao, use
              dados de teste e confira o retorno da SEFAZ antes de ir para producao.
            </p>
          </div>

          <form onSubmit={issueInvoice}>
            <div className="fiscal-form-row">
              <label>
                Tipo
                <select value={documentType} onChange={(event) => setDocumentType(event.target.value)}>
                  <option value="nfe">NF-e</option>
                  <option value="nfce">NFC-e</option>
                </select>
              </label>

              <label>
                Referencia
                <input
                  placeholder="Opcional. Ex: pedido-123"
                  value={ref}
                  onChange={(event) => setRef(event.target.value)}
                />
              </label>

              <button type="button" onClick={() => setJsonText(prettyJson(buildSampleNfe(defaultConfig)))}>
                Modelo vazio
              </button>

              <button type="button" onClick={() => setJsonText(prettyJson(buildSampleNfe(config)))}>
                Modelo com empresa
              </button>
            </div>

            <textarea
              className="fiscal-json-editor"
              value={jsonText}
              onChange={(event) => setJsonText(event.target.value)}
              spellCheck="false"
            />

            <button type="submit" disabled={isLoading || !canIssueNfe}>
              Enviar para SEFAZ
            </button>
          </form>
        </section>

        <section className="settings-card fiscal-history-card">
          <div className="fiscal-section-heading">
            <div>
              <h2>Notas fiscais</h2>
              <p>Ultimas 100 emissoes registradas no ERP.</p>
            </div>
            <button type="button" onClick={loadFiscalData}>Atualizar lista</button>
          </div>

          <table className="fiscal-table">
            <thead>
              <tr>
                <th>Referencia</th>
                <th>Tipo</th>
                <th>Status</th>
                <th>SEFAZ</th>
                <th>Chave</th>
                <th>Atualizacao</th>
                <th>Acoes</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.ref}>
                  <td>{invoice.ref}</td>
                  <td>{invoice.document_type?.toUpperCase()}</td>
                  <td>{statusLabel(invoice.status)}</td>
                  <td>{invoice.status_sefaz || "-"}</td>
                  <td>{invoice.chave || "-"}</td>
                  <td>{formatDate(invoice.updated_at)}</td>
                  <td>
                    <button type="button" onClick={() => setSelectedInvoice(invoice)}>
                      Abrir
                    </button>
                    <button type="button" onClick={() => refreshInvoice(invoice.ref)}>
                      Consultar
                    </button>
                  </td>
                </tr>
              ))}
              {!invoices.length && (
                <tr>
                  <td colSpan="7">Nenhuma nota fiscal emitida ainda.</td>
                </tr>
              )}
            </tbody>
          </table>
        </section>

        {selectedInvoice && (
          <section className="settings-card fiscal-detail-card">
            <div className="fiscal-section-heading">
              <div>
                <h2>Detalhes da nota</h2>
                <p>{selectedInvoice.ref}</p>
              </div>
              <button type="button" onClick={() => refreshInvoice(selectedInvoice.ref)}>
                Consultar SEFAZ
              </button>
            </div>

            <div className="fiscal-detail-grid">
              {selectedDetails.map(([label, value]) => (
                <div key={label}>
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>

            <div className="fiscal-link-row">
              {selectedInvoice.pdf_url && (
                <a href={selectedInvoice.pdf_url} target="_blank" rel="noreferrer">
                  Abrir DANFE
                </a>
              )}
              {selectedInvoice.xml_url && (
                <a href={selectedInvoice.xml_url} target="_blank" rel="noreferrer">
                  Baixar XML
                </a>
              )}
            </div>

            <form className="fiscal-cancel-form" onSubmit={cancelInvoice}>
              <label>
                Justificativa de cancelamento
                <input
                  placeholder="Minimo 15 caracteres"
                  value={cancelReason}
                  onChange={(event) => setCancelReason(event.target.value)}
                />
              </label>
              <button type="submit">Cancelar nota</button>
            </form>
          </section>
        )}
      </main>
    </div>
  );
}
