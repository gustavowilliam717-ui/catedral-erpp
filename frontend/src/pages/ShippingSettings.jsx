import { useEffect, useMemo, useState } from "react";
import API from "../services/api";
import { logError } from "../utils/logger";

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

const shopeeMethods = [
  {
    id: "shopee_xpress",
    name: "[Shopee BR] Shopee Xpress",
    labelType: "Etiqueta de Envio Personalizada",
    size: "10 x 15",
    ddc: true,
    deliveryOption: "pickup",
    schedule: "-",
    enabled: true,
  },
  {
    id: "correios",
    name: "[Shopee BR] Correios",
    labelType: "Etiqueta de Envio Personalizada",
    size: "10 x 15",
    ddc: false,
    deliveryOption: "pickup",
    schedule: "-",
    enabled: true,
  },
  {
    id: "dropoff_agency",
    name: "[Shopee BR] Retirada na Agencia",
    labelType: "Etiqueta de Envio Personalizada",
    size: "10 x 15",
    ddc: false,
    deliveryOption: "dropoff",
    schedule: "-",
    enabled: true,
  },
  {
    id: "near_you",
    name: "[Shopee BR] Retire perto de voce",
    labelType: "Etiqueta de Envio Personalizada",
    size: "10 x 15",
    ddc: false,
    deliveryOption: "pickup",
    schedule: "-",
    enabled: true,
  },
  {
    id: "buyer_pickup",
    name: "[Shopee BR] Retirada do Comprador",
    labelType: "Etiqueta de Envio Personalizada",
    size: "10 x 15",
    ddc: false,
    deliveryOption: "pickup",
    schedule: "-",
    enabled: true,
  },
];

const marketplacePages = {
  "settings-shopee-labels": {
    country: "Brasil",
    group: "shipping_shopee",
    kicker: "Shopee Brasil",
    title: "Metodos de envio e etiquetas",
    description:
      "Configure etiqueta, retirada, entrega na agencia, coleta e filtro de envio para pedidos da Shopee.",
    methods: shopeeMethods,
  },
  "settings-shein-labels": {
    country: "Brasil",
    group: "shipping_shein",
    kicker: "Shein Brasil",
    title: "Metodos de envio Shein",
    description:
      "Configure etiquetas e filtros para os metodos de envio usados pela Shein.",
    methods: [
      {
        id: "shein_logistics",
        name: "[Shein BR] Shein logistics",
        labelType: "Etiqueta de Envio Personalizada",
        size: "10 x 15",
        ddc: true,
        fixedDelivery: true,
        fixedSchedule: true,
        schedule: "-",
        enabled: true,
      },
      {
        id: "shein_imb",
        name: "[Shein BR] IMB",
        labelType: "Etiqueta de Envio Personalizada",
        size: "10 x 15",
        nfe: true,
        fixedDelivery: true,
        fixedSchedule: true,
        schedule: "-",
        enabled: true,
      },
      {
        id: "shein_pgk",
        name: "[Shein BR] PGK",
        labelType: "Etiqueta de Envio Padrao",
        size: "-",
        fixedSize: true,
        fixedDelivery: true,
        fixedSchedule: true,
        schedule: "-",
        enabled: true,
      },
    ],
  },
  "settings-tiktok-labels": {
    country: "Brasil",
    group: "shipping_tiktok",
    kicker: "TikTok Shop Brasil",
    title: "Metodos de envio TikTok Shop",
    description:
      "Controle filtros, etiqueta padrao e etiqueta personalizada para o TikTok Shop.",
    methods: [
      {
        id: "tiktok_shop_logistics",
        name: "[TikTok Shop BR] TikTok Shop logistics",
        labelType: "Etiqueta de Envio Padrao",
        size: "-",
        fixedSize: true,
        fixedDelivery: true,
        fixedSchedule: true,
        schedule: "-",
        enabled: true,
      },
      {
        id: "tiktok_imile",
        name: "[TikTok Shop BR] iMile BR",
        labelType: "Etiqueta de Envio Personalizada",
        size: "10 x 15",
        ddc: true,
        fixedDelivery: true,
        fixedSchedule: true,
        schedule: "-",
        enabled: true,
      },
      {
        id: "tiktok_jt_express",
        name: "[TikTok Shop BR] J&T Express Brazil",
        labelType: "Etiqueta de Envio Personalizada",
        size: "10 x 15",
        ddc: true,
        fixedDelivery: true,
        fixedSchedule: true,
        schedule: "-",
        enabled: true,
      },
    ],
  },
  "settings-3pl": {
    country: "Brasil",
    group: "shipping_3pl",
    kicker: "Logistica 3PL",
    title: "Metodos de envio 3PL",
    description:
      "Defina transportadoras, etiqueta e filtro para operadores logisticos externos.",
    methods: [
      {
        id: "third_party_logistics",
        name: "[3PL] Operador logistico",
        labelType: "Etiqueta de Envio Personalizada",
        size: "10 x 15",
        ddc: false,
        deliveryOption: "dropoff",
        schedule: "-",
        enabled: false,
      },
    ],
  },
};

function mergeStoredMethods(defaultMethods, storedMethods) {
  if (!Array.isArray(storedMethods)) {
    return defaultMethods;
  }

  const storedById = new Map(storedMethods.map((method) => [method.id, method]));
  return defaultMethods.map((method) => ({
    ...method,
    ...storedById.get(method.id),
    id: method.id,
    name: method.name,
  }));
}

function getBadges(method) {
  return [
    method.ddc ? { label: "DDC", className: "ddc" } : null,
    method.nfe ? { label: "NFe", className: "nfe" } : null,
  ].filter(Boolean);
}

export default function ShippingSettings({
  activePage = "settings-shopee-labels",
  setPage,
}) {
  const pageConfig =
    marketplacePages[activePage] || marketplacePages["settings-shopee-labels"];
  const storageKey = `shipping_methods_${pageConfig.group}`;
  const [country, setCountry] = useState("Brasil");
  const [search, setSearch] = useState("");
  const [methods, setMethods] = useState(pageConfig.methods);
  const [message, setMessage] = useState("");
  const [editingLabelId, setEditingLabelId] = useState("");

  useEffect(() => {
    setCountry(pageConfig.country);
    setMethods(pageConfig.methods);
    setMessage("");
    setEditingLabelId("");
    loadSettings();
  }, [activePage]);

  async function loadSettings() {
    try {
      const response = await API.get(`/settings?group=${pageConfig.group}`);
      let stored =
        response.data.find((item) => item.key === storageKey) ||
        response.data.find((item) => item.key === "shipping_methods");

      if (!stored) {
        const allSettings = await API.get("/settings");
        stored = allSettings.data.find((item) => item.key === "shipping_methods");
      }

      if (stored?.value) {
        try {
          setMethods(mergeStoredMethods(pageConfig.methods, JSON.parse(stored.value)));
        } catch (error) {
          logError(error);
        }
      }
    } catch (error) {
      logError(error);
    }
  }

  async function saveMethods(nextMethods) {
    const previousMethods = methods;

    try {
      setMethods(nextMethods);
      await API.post("/settings", {
        key: storageKey,
        value: JSON.stringify(nextMethods),
        group: pageConfig.group,
      });
      setMessage("Configuracao de envio salva.");
    } catch (error) {
      logError(error);
      setMethods(previousMethods);
      setMessage("Nao foi possivel salvar a configuracao de envio.");
    }
  }

  function updateMethod(id, field, value) {
    const nextMethods = methods.map((method) =>
      method.id === id ? { ...method, [field]: value } : method
    );
    saveMethods(nextMethods);
  }

  const filteredMethods = useMemo(() => {
    const term = search.toLowerCase();
    return methods.filter(
      (method) =>
        method.name.toLowerCase().includes(term) ||
        method.labelType.toLowerCase().includes(term)
    );
  }, [methods, search]);

  return (
    <div className="settings-page shipping-settings-page">
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
        <section className="shipping-toolbar">
          <select value={country} onChange={(event) => setCountry(event.target.value)}>
            <option>Brasil</option>
          </select>
          <input
            placeholder="Pesquisar Metodos de Envio"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </section>

        <section className="box shipping-method-card">
          <div className="section-heading">
            <div>
              <span className="section-kicker">{pageConfig.kicker}</span>
              <h2>{pageConfig.title}</h2>
              <p>{pageConfig.description}</p>
            </div>
            {message && <strong className="bulk-message">{message}</strong>}
          </div>

          <div className="country-tab">{country}</div>

          <div className="shipping-table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Metodos de Envio</th>
                  <th>Tipo de Etiqueta</th>
                  <th>Tamanho</th>
                  <th>Opcao de Entrega</th>
                  <th>Horarios de Coleta</th>
                  <th>Filtro de Envio</th>
                  <th>Acoes</th>
                </tr>
              </thead>
              <tbody>
                {filteredMethods.map((method) => (
                  <tr key={method.id}>
                    <td>
                      <div className="shipping-method-cell">
                        <strong>{method.name}</strong>
                        <span>{method.enabled ? "Ativo para pedidos" : "Pausado"}</span>
                      </div>
                    </td>
                    <td>
                      <select
                        value={method.labelType}
                        onChange={(event) =>
                          updateMethod(method.id, "labelType", event.target.value)
                        }
                      >
                        <option>Etiqueta de Envio Padrao</option>
                        <option>Etiqueta de Envio Personalizada</option>
                        <option>Etiqueta Padrao Marketplace</option>
                        <option>Etiqueta Padrao Shopee</option>
                        <option>A4 com declaracao</option>
                      </select>
                    </td>
                    <td>
                      <div className="label-size-cell">
                        {method.fixedSize ? (
                          <span className="shipping-empty-cell">-</span>
                        ) : (
                          <select
                            value={method.size}
                            onChange={(event) =>
                              updateMethod(method.id, "size", event.target.value)
                            }
                          >
                            <option>-</option>
                            <option>10 x 15</option>
                            <option>A4</option>
                            <option>10 x 10</option>
                          </select>
                        )}
                        {getBadges(method).map((badge) => (
                          <span key={badge.label} className={badge.className}>
                            {badge.label}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td>
                      {method.fixedDelivery ? (
                        <span className="shipping-empty-cell">-</span>
                      ) : (
                        <>
                          <label className="radio-line">
                            <input
                              type="radio"
                              checked={method.deliveryOption === "dropoff"}
                              onChange={() =>
                                updateMethod(method.id, "deliveryOption", "dropoff")
                              }
                            />
                            Entregar na Agencia
                          </label>
                          <label className="radio-line">
                            <input
                              type="radio"
                              checked={method.deliveryOption === "pickup"}
                              onChange={() =>
                                updateMethod(method.id, "deliveryOption", "pickup")
                              }
                            />
                            Retirada
                          </label>
                        </>
                      )}
                    </td>
                    <td>
                      {method.fixedSchedule ? (
                        <span className="shipping-empty-cell">-</span>
                      ) : (
                        <select
                          value={method.schedule}
                          onChange={(event) =>
                            updateMethod(method.id, "schedule", event.target.value)
                          }
                        >
                          <option>-</option>
                          <option>Manha</option>
                          <option>Tarde</option>
                          <option>Integral</option>
                        </select>
                      )}
                    </td>
                    <td>
                      <button
                        type="button"
                        className={`toggle-switch ${method.enabled ? "on" : ""}`}
                        onClick={() =>
                          updateMethod(method.id, "enabled", !method.enabled)
                        }
                        aria-pressed={method.enabled}
                      >
                        <span />
                      </button>
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() =>
                          setEditingLabelId(
                            editingLabelId === method.id ? "" : method.id
                          )
                        }
                      >
                        Configuracao de Etiqueta
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {editingLabelId && (
            <div className="label-config-panel">
              <div>
                <span className="section-kicker">Modelo de impressao</span>
                <strong>
                  {methods.find((method) => method.id === editingLabelId)?.name}
                </strong>
                <p>
                  Area pronta para salvar margens, formato, agrupamento e regras
                  de impressao quando ativarmos a API de etiquetas.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setMessage("Modelo de etiqueta preparado para configuracao.");
                  setEditingLabelId("");
                }}
              >
                Salvar modelo
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
