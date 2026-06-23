import { useState } from "react";

const sourceMarketplaces = [
  "Shopee",
  "Mercado Livre",
  "Shein",
  "TikTok Shop",
  "Amazon",
  "Magalu",
  "AliExpress",
  "Temu",
];

const destinationMarketplaces = [
  "Shopee",
  "Mercado Livre",
  "Shein",
  "TikTok Shop",
  "Amazon",
  "Magalu",
];

export default function ProductImporter() {
  const [targets, setTargets] = useState(["Shopee"]);
  const [message, setMessage] = useState("");

  function toggleTarget(target) {
    setTargets((current) =>
      current.includes(target)
        ? current.filter((item) => item !== target)
        : [...current, target]
    );
  }

  function prepareImport(event) {
    event.preventDefault();
    setMessage(
      `Importacao preparada para ${targets.length || 0} marketplace(s). A captura automatica entra quando conectarmos a extensao/API.`
    );
  }

  return (
    <div className="page product-importer-page">
      <section className="settings-title-card">
        <div>
          <span className="section-kicker">Ferramenta</span>
          <h1>Importacao de Produto</h1>
          <p>
            Copie dados de um produto em qualquer plataforma e prepare o anuncio
            para publicar nas suas lojas conectadas.
          </p>
        </div>
        {message && <strong className="bulk-message">{message}</strong>}
      </section>

      <section className="importer-layout">
        <form className="box importer-form-card" onSubmit={prepareImport}>
          <h2>Copiar produto de uma plataforma</h2>
          <div className="form-grid">
            <select>
              {sourceMarketplaces.map((marketplace) => (
                <option key={marketplace}>{marketplace}</option>
              ))}
            </select>
            <input placeholder="URL do produto origem" />
            <input placeholder="SKU interno opcional" />
            <select>
              <option>Manter imagens originais</option>
              <option>Enviar imagens para Espaco de Dados</option>
              <option>Revisar imagens antes de publicar</option>
            </select>
          </div>

          <div className="target-marketplace-grid">
            {destinationMarketplaces.map((marketplace) => (
              <button
                type="button"
                key={marketplace}
                className={targets.includes(marketplace) ? "selected" : ""}
                onClick={() => toggleTarget(marketplace)}
              >
                <strong>{marketplace}</strong>
                <span>
                  {targets.includes(marketplace)
                    ? "Selecionado"
                    : "Adicionar destino"}
                </span>
              </button>
            ))}
          </div>

          <div className="importer-actions">
            <button type="submit">Preparar Importacao</button>
            <button type="button" className="secondary">
              Salvar como rascunho
            </button>
          </div>
        </form>

        <aside className="box importer-flow-card">
          <span className="section-kicker">Fluxo</span>
          <h2>Como vai funcionar</h2>
          <ol>
            <li>Capturar titulo, descricao, imagens, variacoes e atributos.</li>
            <li>Salvar as imagens no Espaco de Dados do anuncio.</li>
            <li>Adaptar campos obrigatorios por marketplace de destino.</li>
            <li>Enviar para rascunho ou publicar quando a API permitir.</li>
          </ol>
        </aside>
      </section>
    </div>
  );
}
