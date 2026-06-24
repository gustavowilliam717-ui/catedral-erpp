import { useEffect, useState } from "react";
import API from "../services/api";
import { logError } from "../utils/logger";

const defaultRules = {
  default_margin: "30",
  default_tax: "",
  default_ads: "",
  affiliate_percent: "5",
  free_shipping_program: "false",
  min_margin_alert: "15",
};

const ruleLabels = {
  default_margin: "Margem desejada padrao (%)",
  default_tax: "Imposto padrao (%)",
  default_ads: "Shopee Ads padrao (%)",
  affiliate_percent: "Percentual de afiliado padrao (%)",
  min_margin_alert: "Alerta de margem minima (%)",
};

export default function PricingRules({ setPage }) {
  const [rules, setRules] = useState(defaultRules);
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadRules();
  }, []);

  async function loadRules() {
    try {
      const response = await API.get("/settings?group=pricing");
      const loaded = { ...defaultRules };

      response.data.forEach((item) => {
        if (item.key in loaded) {
          loaded[item.key] = item.value;
        }
      });

      setRules(loaded);
    } catch (error) {
      logError(error);
      setMessage("Nao foi possivel carregar as regras de precificacao.");
    }
  }

  function update(key, value) {
    setRules((current) => ({ ...current, [key]: value }));
  }

  async function saveRules(event) {
    event.preventDefault();

    try {
      setIsSaving(true);
      setMessage("");

      await Promise.all(
        Object.entries(rules).map(([key, value]) =>
          API.post("/settings", {
            key,
            value: String(value),
            group: "pricing",
          })
        )
      );

      setMessage("Regras salvas. A calculadora usara estes padroes ao abrir.");
    } catch (error) {
      logError(error);
      setMessage("Nao foi possivel salvar as regras.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="page">
      <section className="settings-title-card">
        <div>
          <span className="section-kicker">Precificacao</span>
          <h1>Regras automaticas</h1>
          <p>
            Defina os padroes usados pela calculadora para margem, imposto,
            marketing e programas opcionais.
          </p>
        </div>
        <button type="button" onClick={() => setPage?.("pricing")}>
          Abrir calculadora
        </button>
      </section>

      <form className="box" onSubmit={saveRules}>
        <h2>Padroes da calculadora</h2>

        <div className="form-grid">
          {Object.entries(ruleLabels).map(([key, label]) => (
            <label key={key}>
              {label}
              <input
                value={rules[key]}
                onChange={(event) => update(key, event.target.value)}
              />
            </label>
          ))}
          <label>
            Programa de frete gratis Shopee
            <select
              value={rules.free_shipping_program}
              onChange={(event) =>
                update("free_shipping_program", event.target.value)
              }
            >
              <option value="false">Desativado por padrao</option>
              <option value="true">Ativado por padrao</option>
            </select>
          </label>
        </div>

        <div className="importer-actions">
          <button type="submit" disabled={isSaving}>
            {isSaving ? "Salvando..." : "Salvar regras"}
          </button>
          <button type="button" className="secondary" onClick={loadRules}>
            Recarregar
          </button>
        </div>

        {message && <strong className="bulk-message">{message}</strong>}
      </form>
    </div>
  );
}
