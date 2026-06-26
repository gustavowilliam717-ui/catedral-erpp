import { useEffect, useState } from "react";
import API from "../services/api";
import { logError } from "../utils/logger";

function money(value) {
  if (value === null || value === undefined || value === "") return "-";
  return "R$ " + Number(value).toFixed(2);
}

export default function ProductImporter() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");

  const [mlConnected, setMlConnected] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [publishResult, setPublishResult] = useState(null);

  // Campos editaveis antes de publicar
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");

  useEffect(() => {
    let active = true;

    API.get("/integrations/marketplaces")
      .then((response) => {
        if (!active) return;
        const connected = response.data?.connected || [];
        setMlConnected(connected.some((item) => item.key === "mercado_livre"));
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, []);

  async function buscarDados(event) {
    event.preventDefault();
    setError("");
    setPublishResult(null);

    if (!url.trim()) {
      setError("Cole o link de um anuncio do Mercado Livre.");
      return;
    }

    try {
      setLoading(true);
      const response = await API.post("/integrations/mercadolivre/copy/preview", {
        url: url.trim(),
      });
      const data = response.data || {};
      setPreview(data);
      setTitle(data.title || "");
      setPrice(data.price ?? "");
      setQuantity(data.available_quantity ?? 1);
    } catch (err) {
      logError(err);
      setPreview(null);
      setError(
        err?.response?.data?.detail ||
          "Nao foi possivel buscar os dados deste anuncio."
      );
    } finally {
      setLoading(false);
    }
  }

  async function publicar() {
    if (!preview) return;

    setError("");
    setPublishResult(null);

    try {
      setPublishing(true);
      const response = await API.post("/integrations/mercadolivre/copy/publish", {
        url: url.trim(),
        source_id: preview.source_id,
        title: title.trim(),
        price: price === "" ? null : Number(price),
        available_quantity: quantity === "" ? null : Number(quantity),
      });
      setPublishResult(response.data || {});
    } catch (err) {
      logError(err);
      setError(
        err?.response?.data?.detail ||
          "Nao foi possivel publicar o anuncio no Mercado Livre."
      );
    } finally {
      setPublishing(false);
    }
  }

  return (
    <div className="page product-importer-page">
      <section className="settings-title-card">
        <div>
          <span className="section-kicker">Ferramenta</span>
          <h1>Copiador de Anuncios</h1>
          <p>
            Cole o link de um anuncio do Mercado Livre. O sistema captura titulo,
            preco, descricao e imagens reais pela API oficial e permite publicar
            uma copia na sua conta conectada.
          </p>
        </div>
      </section>

      {!mlConnected && (
        <section className="box importer-warning">
          <strong>
            Conecte sua conta do Mercado Livre em Integracoes para usar o
            Copiador de Anuncios.
          </strong>
        </section>
      )}

      <section className="importer-layout">
        <form className="box importer-form-card" onSubmit={buscarDados}>
          <h2>1. Link do anuncio (Mercado Livre)</h2>
          <div className="form-grid">
            <input
              placeholder="https://produto.mercadolivre.com.br/MLB-..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>

          <div className="importer-actions">
            <button type="submit" disabled={loading || !mlConnected}>
              {loading ? "Buscando..." : "Buscar dados"}
            </button>
          </div>

          {error && <strong className="import-result">{error}</strong>}
        </form>

        <aside className="box importer-flow-card">
          <span className="section-kicker">Fluxo</span>
          <h2>Como funciona</h2>
          <ol>
            <li>Cole o link de um anuncio do Mercado Livre.</li>
            <li>Confira titulo, preco, descricao e imagens capturados.</li>
            <li>Ajuste o que quiser (titulo, preco, quantidade).</li>
            <li>Publique a copia na sua conta do Mercado Livre.</li>
          </ol>
        </aside>
      </section>

      {preview && (
        <section className="box importer-preview-card">
          <h2>2. Dados capturados</h2>

          <div className="importer-preview-grid">
            <div className="importer-preview-gallery">
              {(preview.pictures || []).slice(0, 6).map((picture, index) => (
                <img key={index} src={picture} alt={`Imagem ${index + 1}`} />
              ))}
              {(!preview.pictures || preview.pictures.length === 0) && (
                <span>Sem imagens</span>
              )}
            </div>

            <div className="importer-preview-fields">
              <label>
                <span>Titulo</span>
                <input value={title} onChange={(e) => setTitle(e.target.value)} />
              </label>

              <div className="importer-preview-inline">
                <label>
                  <span>Preco (R$)</span>
                  <input
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </label>
                <label>
                  <span>Quantidade</span>
                  <input
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                </label>
              </div>

              <div className="importer-preview-meta">
                <span>Origem: {preview.source_id || "-"}</span>
                <span>Preco original: {money(preview.price)}</span>
                {preview.permalink && (
                  <a href={preview.permalink} target="_blank" rel="noreferrer">
                    Ver anuncio original
                  </a>
                )}
              </div>
            </div>
          </div>

          {preview.description && (
            <div className="importer-preview-description">
              <strong>Descricao</strong>
              <p>{preview.description}</p>
            </div>
          )}

          <div className="importer-actions">
            <button type="button" onClick={publicar} disabled={publishing}>
              {publishing ? "Publicando..." : "Publicar no Mercado Livre"}
            </button>
          </div>
        </section>
      )}

      {publishResult && (
        <section className="box importer-success-card">
          <h2>Anuncio publicado!</h2>
          <p>
            Status: <strong>{publishResult.status || "-"}</strong>
            {publishResult.id ? ` - ID ${publishResult.id}` : ""}
          </p>
          {publishResult.permalink && (
            <a href={publishResult.permalink} target="_blank" rel="noreferrer">
              Abrir anuncio no Mercado Livre
            </a>
          )}
        </section>
      )}
    </div>
  );
}
