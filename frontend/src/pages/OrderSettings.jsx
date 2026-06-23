import { useEffect, useMemo, useState } from "react";
import API from "../services/api";

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
      { key: "settings-permissions", label: "Configuracoes de Permissao" },
    ],
  },
];

const defaultSettings = {
  auto_mark_printed: "false",
  auto_mark_picklist_printed: "false",
  shipping_deadline_rule: "manual",
  separation_list_enabled: "false",
  deduct_stock_on_order: "true",
  nfe_auto: "false",
  nfe_emission_range: "manual",
  sample_bonus_tax_class: "",
  order_separator: "default",
  buffering_order: "false",
};

export default function OrderSettings({ activePage = "settings-orders", setPage }) {
  const [settings, setSettings] = useState(defaultSettings);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    const response = await API.get("/settings?group=orders");
    const loaded = { ...defaultSettings };

    response.data.forEach((item) => {
      loaded[item.key] = item.value;
    });

    setSettings(loaded);
  }

  async function saveSetting(key, value) {
    setSettings((current) => ({ ...current, [key]: value }));
    await API.post("/settings", {
      key,
      value,
      group: "orders",
    });
    setMessage("Configuracao salva.");
  }

  function boolValue(key) {
    return settings[key] === "true";
  }

  const activeLabel = useMemo(() => {
    return (
      sidebarGroups
        .flatMap((group) => group.items)
        .find((item) => item.key === activePage)?.label || "Configuracoes padroes"
    );
  }, [activePage]);

  return (
    <div className="settings-page">
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

      <main className="settings-content">
        <section className="settings-title-card">
          <div>
            <span className="section-kicker">Pedidos</span>
            <h1>{activeLabel}</h1>
            <p>
              Defina regras padrao para marcacao, separacao, envio, notas fiscais
              e comportamento dos pedidos quando as integracoes forem ativadas.
            </p>
          </div>

          {message && <strong className="bulk-message">{message}</strong>}
        </section>

        <section className="settings-card">
          <h2>Configuracoes padroes</h2>

          <SettingRow
            title="Etiqueta marcar como impresso automaticamente"
            description="Ao imprimir etiquetas, o pedido sera marcado como impresso."
            action={
              <Toggle
                checked={boolValue("auto_mark_printed")}
                onChange={(value) =>
                  saveSetting("auto_mark_printed", String(value))
                }
              />
            }
          />
          <SettingRow
            title="Lista de separacao marcar como impresso automaticamente"
            description="Quando a lista de separacao for gerada, marque como impressa."
            action={
              <Toggle
                checked={boolValue("auto_mark_picklist_printed")}
                onChange={(value) =>
                  saveSetting("auto_mark_picklist_printed", String(value))
                }
              />
            }
          />
          <SettingRow
            title="Prazo de envio"
            description="Regra usada para alertas e priorizacao de pedidos."
            action={
              <select
                value={settings.shipping_deadline_rule}
                onChange={(event) =>
                  saveSetting("shipping_deadline_rule", event.target.value)
                }
              >
                <option value="manual">Manual</option>
                <option value="marketplace">Usar prazo do marketplace</option>
                <option value="same_day">Priorizar mesmo dia</option>
              </select>
            }
          />
          <SettingRow
            title="Lista de separacao"
            description="Habilita separacao por lote antes de imprimir etiquetas."
            action={
              <Toggle
                checked={boolValue("separation_list_enabled")}
                onChange={(value) =>
                  saveSetting("separation_list_enabled", String(value))
                }
              />
            }
          />
          <SettingRow
            title="Deducao de estoque"
            description="Baixa estoque quando o pedido entra no ERP."
            action={
              <Toggle
                checked={boolValue("deduct_stock_on_order")}
                onChange={(value) =>
                  saveSetting("deduct_stock_on_order", String(value))
                }
              />
            }
          />
        </section>

        <section className="settings-card">
          <h2>Configuracoes NF-e</h2>

          <SettingRow
            title="NF-e automatica"
            description="Emitir nota fiscal automaticamente quando o pedido chegar."
            action={
              <Toggle
                checked={boolValue("nfe_auto")}
                onChange={(value) => saveSetting("nfe_auto", String(value))}
              />
            }
          />
          <SettingRow
            title="Faixa de emissao"
            description="Escolha se a emissao sera para todos os pedidos ou por marketplace."
            action={
              <select
                value={settings.nfe_emission_range}
                onChange={(event) =>
                  saveSetting("nfe_emission_range", event.target.value)
                }
              >
                <option value="manual">Manual</option>
                <option value="all">Todos os pedidos</option>
                <option value="marketplaces">Por marketplace</option>
              </select>
            }
          />
          <SettingRow
            title="Amostra gratis / bonificacao"
            description="Classe fiscal especial para amostras e sorteios."
            action={
              <input
                placeholder="Classe fiscal"
                value={settings.sample_bonus_tax_class}
                onChange={(event) =>
                  saveSetting("sample_bonus_tax_class", event.target.value)
                }
              />
            }
          />
        </section>

        <section className="settings-card">
          <h2>Configuracoes do Pedido</h2>

          <SettingRow
            title="Separacao por ondas"
            description="Agrupe pedidos por lote, canal ou horario."
            action={
              <select
                value={settings.order_separator}
                onChange={(event) =>
                  saveSetting("order_separator", event.target.value)
                }
              >
                <option value="default">Separador padrao</option>
                <option value="marketplace">Por marketplace</option>
                <option value="shipping">Por envio</option>
                <option value="priority">Por prioridade</option>
              </select>
            }
          />
          <SettingRow
            title="Pedido buffering"
            description="Pedidos buffering ficam fora de revisao ate a sincronizacao finalizar."
            action={
              <Toggle
                checked={boolValue("buffering_order")}
                onChange={(value) =>
                  saveSetting("buffering_order", String(value))
                }
              />
            }
          />
        </section>
      </main>
    </div>
  );
}

function SettingRow({ title, description, action }) {
  return (
    <div className="setting-row">
      <div>
        <strong>{title}</strong>
        <span>{description}</span>
      </div>
      <div className="setting-action">{action}</div>
    </div>
  );
}

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      className={`toggle-switch ${checked ? "on" : ""}`}
      onClick={() => onChange(!checked)}
      aria-pressed={checked}
    >
      <span />
    </button>
  );
}
