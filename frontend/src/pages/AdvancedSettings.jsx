import { useState } from "react";

const sidebarGroups = [
  {
    title: "Pedidos",
    items: [
      { key: "settings-orders", label: "Configuracoes padroes" },
      { key: "settings-nfe", label: "NF-e Automatica" },
      { key: "settings-auto-program", label: "Auto-Programar" },
      { key: "settings-allocation", label: "Regras de Alocacao" },
    ],
  },
  {
    title: "Logisticas/Etiquetas",
    items: [
      { key: "settings-shopee-labels", label: "Shopee" },
      { key: "settings-shein-labels", label: "Shein" },
      { key: "settings-tiktok-labels", label: "TikTok Shop" },
      { key: "settings-3pl", label: "Logistica suportada por 3PL" },
    ],
  },
  {
    title: "Modelo de Impressao",
    items: [
      { key: "settings-print-model", label: "Configuracoes de Modelo" },
      { key: "settings-sku-label", label: "Etiqueta do SKU" },
      { key: "settings-shelf-label", label: "Etiqueta de Estante" },
    ],
  },
  {
    title: "Notas Fiscais",
    items: [
      { key: "settings-nfe", label: "Brasil NF-e" },
      { key: "settings-dce", label: "DC-e Brasil" },
    ],
  },
  {
    title: "Sistema",
    items: [
      { key: "settings-stock", label: "Estoque" },
      { key: "settings-finance", label: "Financeiro" },
    ],
  },
  {
    title: "Configuracoes de Permissao",
    items: [
      { key: "settings-permissions", label: "Subconta" },
      { key: "settings-accountant", label: "Configuracoes do Contador" },
    ],
  },
  {
    title: "Registros de Atividades",
    items: [
      { key: "settings-activity-log", label: "Registros de Atividades" },
    ],
  },
];

export default function AdvancedSettings({
  activePage = "settings-allocation",
  setPage,
}) {
  return (
    <div className="settings-page">
      <SettingsSidebar activePage={activePage} setPage={setPage} />
      <main className="settings-content">
        {activePage === "settings-allocation" && <AllocationRules />}
        {activePage === "settings-print-model" && <PrintModelSettings />}
        {(activePage === "settings-sku-label" ||
          activePage === "settings-shelf-label") && (
          <SkuLabelSettings activePage={activePage} />
        )}
        {activePage === "settings-dce" && <DceBrasilSettings />}
        {activePage === "settings-stock" && <InventorySettings />}
        {activePage === "settings-finance" && <FinanceSettings />}
        {activePage === "settings-permissions" && <PermissionSettings />}
        {activePage === "settings-accountant" && <AccountantSettings />}
        {activePage === "settings-activity-log" && <ActivityLogSettings />}
      </main>
    </div>
  );
}

function SettingsSidebar({ activePage, setPage }) {
  return (
    <aside className="settings-sidebar">
      <h2>Configuracoes</h2>

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

function AllocationRules() {
  return (
    <section className="settings-tool-card allocation-page-card">
      <div className="allocation-notice">
        <span>i</span>
        <p>
          Os pedidos sao atribuidos automaticamente aos armazens de acordo com a
          prioridade das regras definidas. Se o pedido nao corresponder a
          nenhuma regra, ele sera atribuido ao armazem padrao.
        </p>
      </div>

      <div className="settings-table-toolbar">
        <select>
          <option>Nome da Regra</option>
          <option>Marketplace</option>
          <option>Armazem</option>
        </select>
        <input placeholder="Pesquisar regras" />
        <select>
          <option>Todos Status</option>
          <option>Ativo</option>
          <option>Inativo</option>
        </select>
        <button type="button">+ Criar Regras</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Status</th>
            <th>Prioridade</th>
            <th>Nome da Regra</th>
            <th>Condicoes</th>
            <th>Especificar Armazem</th>
            <th>Criado/Atualizado</th>
            <th>Acoes</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan="7">
              <div className="empty-state-box">
                <span />
                <strong>Nenhum Dado Disponivel</strong>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  );
}

function PrintModelSettings() {
  const [modelType, setModelType] = useState("predefined");

  return (
    <>
      <section className="settings-tool-card print-config-card">
        <h2>Configuracoes de Lista de Separacao</h2>
        <div className="print-config-layout">
          <div className="print-config-form">
            <div className="print-setting-row">
              <span>Lista de Separacao</span>
              <label>
                <input
                  type="radio"
                  checked={modelType === "predefined"}
                  onChange={() => setModelType("predefined")}
                />
                Predefinir
              </label>
              <label>
                <input
                  type="radio"
                  checked={modelType === "custom"}
                  onChange={() => setModelType("custom")}
                />
                Personalizado
              </label>
            </div>

            <div className="print-setting-row">
              <span>Formato</span>
              <select>
                <option>Padrao</option>
                <option>Compacto</option>
                <option>Com conferente</option>
              </select>
            </div>

            <div className="print-checkbox-list">
              <span>Configuracao</span>
              <label>
                <input type="checkbox" /> Adicionar Numero de Rastreio
              </label>
              <label>
                <input type="checkbox" /> Adicionar Notas do Cliente
              </label>
              <label>
                <input type="checkbox" /> Adicionar SKU do Armazem
              </label>
              <label>
                <input type="checkbox" /> Adicionar Observacoes
              </label>
            </div>
          </div>

          <div className="print-preview-box">
            <div className="paper-preview">
              <strong>Lista de Separacao</strong>
              <i />
              <i />
              <i />
              <i />
            </div>
          </div>
        </div>
      </section>

      <section className="settings-tool-card packing-list-card">
        <h2>Configuracoes de Romaneio</h2>
        <table>
          <thead>
            <tr>
              <th>Modelos de Romaneio</th>
              <th>Nome do Modelo</th>
              <th>Acoes</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td />
              <td>Standard Template</td>
              <td>
                <button type="button">Editar</button>
                <button type="button">Mais</button>
              </td>
            </tr>
            <tr>
              <td />
              <td>
                <button type="button" className="text-action">
                  + Adicionar Modelo
                </button>
              </td>
              <td />
            </tr>
          </tbody>
        </table>
      </section>
    </>
  );
}

function SkuLabelSettings({ activePage }) {
  const isShelf = activePage === "settings-shelf-label";

  return (
    <section className="settings-tool-card sku-label-card">
      <div className="sku-label-tabs">
        <button type="button" className={!isShelf ? "active" : ""}>
          Etiqueta do SKU <span>1</span>
        </button>
        <button type="button" className={isShelf ? "active" : ""}>
          Etiqueta do SKU(Mercado Full) <span>1</span>
        </button>
        <button type="button" className="create-model-button">
          + Criar Modelo
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Nome do Modelo</th>
            <th>Tamanho da Etiqueta(Largura x Altura)</th>
            <th>Modelo Padrao</th>
            <th>Data de Criacao</th>
            <th>Acoes</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Standard Template</td>
            <td>50mm x 30mm</td>
            <td>
              <span className="default-label">Predefinido</span>
            </td>
            <td>14/11/2025 13:25</td>
            <td>
              <button type="button">Duplicar</button>
              <button type="button">Mais</button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  );
}

function DceBrasilSettings() {
  return (
    <section className="settings-tool-card dce-account-card">
      <div className="dce-toolbar">
        <div className="dce-search-controls">
          <select>
            <option>Contas NF-e</option>
            <option>Razao Social</option>
            <option>CNPJ</option>
          </select>
          <input placeholder="Pesquisar contas fiscais" />
        </div>

        <div className="dce-toolbar-actions">
          <button type="button">Adicionar uma Conta</button>
          <span>Quantidade de Empresas: 0/3</span>
        </div>
      </div>

      <div className="dce-empty-state">
        <span />
        <strong>Sem dados</strong>
        <button type="button">Adicionar uma Conta</button>
      </div>
    </section>
  );
}

function InventorySettings() {
  const [settings, setSettings] = useState({
    deductPaidOrders: false,
    deductPendingOrders: false,
    onlyMapSku: false,
    autoMapSku: false,
    autoSyncStock: false,
  });

  function update(key) {
    setSettings((current) => ({ ...current, [key]: !current[key] }));
  }

  return (
    <>
      <section className="settings-tool-card inventory-settings-card">
        <h2>Configuracoes padroes</h2>

        <div className="inventory-setting-block">
          <div className="inventory-setting-label">Deducao de Estoque</div>
          <div className="inventory-setting-list">
            <InventoryToggleRow
              checked={settings.deductPaidOrders}
              onChange={() => update("deductPaidOrders")}
            >
              O pedido ocupara e deduzira automaticamente o estoque. Novos
              pedidos comecarao a ocupar o estoque a partir do status:
              <strong> Para Emitir / Para Enviar</strong>
            </InventoryToggleRow>

            <InventoryToggleRow
              checked={settings.deductPendingOrders}
              onChange={() => update("deductPendingOrders")}
            >
              O pedido ocupara e deduzira automaticamente o estoque. Novos
              pedidos comecarao a ocupar o estoque a partir do status:
              <strong> Nao Pago / Pendente</strong>
            </InventoryToggleRow>

            <InventoryToggleRow
              checked={settings.onlyMapSku}
              onChange={() => update("onlyMapSku")}
            >
              Somente para mapear o SKU do armazem; ao enviar o produto para o
              marketplace, nao descontar o estoque automaticamente.
            </InventoryToggleRow>
          </div>
        </div>

        <div className="inventory-setting-block">
          <div className="inventory-setting-label">
            Regras de mapeamento de SKU
          </div>
          <div className="inventory-setting-list">
            <div className="inventory-option-row">
              <SettingsToggle
                checked={settings.autoMapSku}
                onChange={() => update("autoMapSku")}
              />
              <div>
                <strong>Auto Mapear o SKU do Armazem</strong>
                <button type="button" className="inline-link-button">
                  Configuracoes
                </button>
                <p>
                  Uma vez ativado, para os novos pedidos nao mapeados, os SKUs
                  serao automaticamente mapeados com base nas regras configuradas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="settings-tool-card inventory-sync-card">
        <div className="inventory-card-heading">
          <h2>Configuracoes de Sincronizacao de Estoque</h2>
          <div>
            <button type="button">Ajuda de Sincronizacao de Estoque</button>
            <button type="button">Registros de Sincronizacao de Estoque</button>
          </div>
        </div>

        <div className="inventory-setting-block">
          <div className="inventory-setting-label">
            Sincronizacao de Estoque
          </div>
          <div className="inventory-setting-list">
            <InventoryToggleRow
              checked={settings.autoSyncStock}
              onChange={() => update("autoSyncStock")}
            >
              Atualizar automaticamente o estoque do Catedral ERP para o
              marketplace conectado.
            </InventoryToggleRow>
          </div>
        </div>
      </section>
    </>
  );
}

function InventoryToggleRow({ checked, onChange, children }) {
  return (
    <div className="inventory-option-row">
      <SettingsToggle checked={checked} onChange={onChange} />
      <p>{children}</p>
    </div>
  );
}

function SettingsToggle({ checked, onChange }) {
  return (
    <button
      type="button"
      className={`toggle-switch ${checked ? "on" : ""}`}
      onClick={onChange}
      aria-pressed={checked}
    >
      <span />
    </button>
  );
}

function FinanceSettings() {
  const [costMode, setCostMode] = useState("average");

  return (
    <>
      <section className="settings-tool-card finance-profit-card">
        <h2>Configuracao de Lucro</h2>

        <div className="finance-notice">
          <span>i</span>
          <p>
            A modificacao da selecao do valor de custo do produto so sera
            aplicada aos novos pedidos. Se precisar aplica-la aos pedidos
            anteriores, por favor, <button type="button">Recalcule</button>
          </p>
        </div>

        <div className="finance-setting-block">
          <div className="finance-setting-label">
            Selecao do valor de custo do produto
          </div>
          <div className="finance-option-list">
            <label>
              <input
                type="radio"
                checked={costMode === "average"}
                onChange={() => setCostMode("average")}
              />
              E dada prioridade ao custo medio do inventario correspondente.
              Quando o custo medio e 0, e considerado o preco de compra do
              produto.
            </label>
            <label>
              <input
                type="radio"
                checked={costMode === "purchase"}
                onChange={() => setCostMode("purchase")}
              />
              O custo do produto e baseado no preco de compra do produto
            </label>
          </div>
        </div>

        <div className="finance-setting-block compact">
          <div className="finance-setting-label">Conta de Taxas</div>
          <div>
            <button type="button" className="inline-link-button">
              Configuracoes
            </button>
          </div>
        </div>
      </section>

      <section className="settings-tool-card finance-config-card">
        <h2>
          Configuracao de Financeiro <span>VIP</span>
        </h2>

        <div className="finance-setting-block">
          <div className="finance-setting-label">Conta financeira</div>
          <div>
            <button type="button" className="inline-link-button">
              Gerenciamento de contas
            </button>
          </div>
        </div>

        <div className="finance-setting-block">
          <div className="finance-setting-label">
            Tipo de receita/despesa financeira
          </div>
          <div>
            <button type="button" className="inline-link-button">
              Configuracoes
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

function PermissionSettings() {
  return (
    <section className="settings-tool-card permission-card">
      <div className="permission-toolbar">
        <div className="permission-search-controls">
          <select>
            <option>Nome Completo</option>
            <option>Email</option>
            <option>Telefone</option>
          </select>
          <input placeholder="Pesquisar subcontas" />
        </div>

        <div className="permission-toolbar-actions">
          <span>Subconta: 0/5</span>
          <button type="button">+ Adicionar Subconta</button>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Email</th>
            <th>Nome Completo</th>
            <th>Telefone</th>
            <th>Permissoes de loja</th>
            <th>Estado</th>
            <th>Data de Criacao</th>
            <th>Ultimo Horario do Login</th>
            <th>Acoes</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan="8">
              <div className="empty-state-box permission-empty">
                <span />
                <strong>Nenhum Dado Disponivel</strong>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  );
}

function AccountantSettings() {
  return (
    <section className="settings-tool-card permission-card">
      <div className="permission-toolbar">
        <div className="permission-search-controls">
          <select>
            <option>Nome do Contador</option>
            <option>Email</option>
          </select>
          <input placeholder="Pesquisar contador" />
        </div>
        <div className="permission-toolbar-actions">
          <button type="button">+ Adicionar Contador</button>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Email</th>
            <th>Nome do Contador</th>
            <th>Empresas Vinculadas</th>
            <th>Permissoes</th>
            <th>Estado</th>
            <th>Acoes</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan="6">
              <div className="empty-state-box permission-empty">
                <span />
                <strong>Nenhum Dado Disponivel</strong>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  );
}

function ActivityLogSettings() {
  return (
    <section className="settings-tool-card permission-card">
      <div className="permission-toolbar">
        <div className="permission-search-controls">
          <select>
            <option>Usuario</option>
            <option>Modulo</option>
            <option>Acao</option>
          </select>
          <input placeholder="Pesquisar registros de atividades" />
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Usuario</th>
            <th>Modulo</th>
            <th>Acao</th>
            <th>IP</th>
            <th>Data</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan="5">
              <div className="empty-state-box permission-empty">
                <span />
                <strong>Nenhum Dado Disponivel</strong>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  );
}
