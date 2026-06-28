import { useEffect, useState } from "react";
import API from "../services/api";
import { logError } from "../utils/logger";

const groupLabels = {
  produto: "Produto / Anuncio",
  pedido: "Pedido / Venda",
};

export default function FieldMapping() {
  const [map, setMap] = useState({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const response = await API.get("/marketplace/field-map");
        setMap(response.data || {});
      } catch (error) {
        logError(error);
        setMessage("Nao foi possivel carregar o mapeamento de campos.");
      }
    }
    load();
  }, []);

  return (
    <div className="page">
      <section className="settings-title-card">
        <div>
          <span className="section-kicker">Integracoes</span>
          <h1>Mapeamento de campos do marketplace</h1>
          <p>
            Quando um marketplace conecta, a NEXT le o dado que chega e
            distribui automaticamente para o campo canonico correto. Esta tela
            mostra o de/para que o motor reconhece em qualquer plataforma.
          </p>
        </div>
      </section>

      {message && (
        <section className="box">
          <strong>{message}</strong>
        </section>
      )}

      {Object.entries(map).map(([groupKey, fields]) => (
        <section className="box" key={groupKey}>
          <h2>{groupLabels[groupKey] || groupKey}</h2>
          <table>
            <thead>
              <tr>
                <th>Campo na NEXT</th>
                <th>Nomes reconhecidos na API do marketplace</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(fields).map(([canonical, aliases]) => (
                <tr key={canonical}>
                  <td>
                    <strong>{canonical}</strong>
                  </td>
                  <td>{(aliases || []).join(", ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ))}
    </div>
  );
}
