import { useEffect, useMemo, useState } from "react";
import API from "../services/api";
import { logError } from "../utils/logger";

const copyPlatforms = [
  {
    key: "mercado_livre",
    label: "Mercado Livre",
    shortLabel: "ML",
    placeholder: "https://produto.mercadolivre.com.br/MLB-...",
    integrationPage: "mercado-livre-integration",
    copyStatus: "active",
  },
  {
    key: "shopee",
    label: "Shopee",
    shortLabel: "SP",
    placeholder: "https://shopee.com.br/...",
    integrationPage: "store-integrations",
    copyStatus: "planned",
  },
  {
    key: "amazon",
    label: "Amazon",
    shortLabel: "AZ",
    placeholder: "https://www.amazon.com.br/dp/...",
    integrationPage: "amazon-integration",
    copyStatus: "planned",
  },
  {
    key: "shein",
    label: "Shein",
    shortLabel: "SH",
    placeholder: "https://br.shein.com/...",
    integrationPage: "shein-integration",
    copyStatus: "planned",
  },
  {
    key: "temu",
    label: "Temu",
    shortLabel: "TM",
    placeholder: "https://www.temu.com/...",
    integrationPage: "temu-integration",
    copyStatus: "planned",
  },
  {
    key: "tiktok",
    label: "TikTok Shop",
    shortLabel: "TT",
    placeholder: "https://shop.tiktok.com/...",
    integrationPage: "tiktok-integration",
    copyStatus: "planned",
  },
];

function money(value) {
  if (value === null || value === undefined || value === "") return "-";
  return "R$ " + Number(value).toFixed(2);
}

function getPlatform(key) {
  return copyPlatforms.find((platform) => platform.key === key) || copyPlatforms[0];
}

export default function ProductImporter({ setPage }) {
  const [sourcePlatform, setSourcePlatform] = useState("mercado_livre");
  const [targetPlatform, setTargetPlatform] = useState("mercado_livre");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [connectedPlatforms, setConnectedPlatforms] = useState([]);
  const [publishing, setPublishing] = useState(false);
  const [publishResult, setPublishResult] = useState(null);

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");

  const selectedSource = getPlatform(sourcePlatform);
  const selectedTarget = getPlatform(targetPlatform);

  useEffect(() => {
    let active = true;

    API.get("/integrations/marketplaces")
      .then((response) => {
        if (!active) return;
        setConnectedPlatforms(response.data?.connected || []);
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, []);

  const connectedKeys = useMemo(
    () => connectedPlatforms.map((item) => item.key),
    [connectedPlatforms]
  );

  function isConnected(platformKey) {
    return connectedKeys.includes(platformKey);
  }

  function platformStatus(platform) {
    if (platform.copyStatus !== "active") return "Conector pendente";
    return isConnected(platform.key) ? "Conectado" : "Conectar conta";
  }

  function selectSource(platformKey) {
    setSourcePlatform(platformKey);
    setPreview(null);
    setPublishResult(null);
    setError("");
  }

  function selectTarget(platformKey) {
    setTargetPlatform(platformKey);
    setPublishResult(null);
    setError("");
  }

  async function buscarDados(event) {
    event.preventDefault();
    setError("");
    setPublishResult(null);

    if (!url.trim()) {
      setError(`Cole o link de um anuncio da ${selectedSource.label}.`);
      return;
    }

    try {
      setLoading(true);
      const response = await API.post("/integrations/listings/copy/preview", {
        source_platform: sourcePlatform,
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
      const response = await API.post("/integrations/listings/copy/publish", {
        source_platform: sourcePlatform,
        target_platform: targetPlatform,
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
          `Nao foi possivel publicar o anuncio na ${selectedTarget.label}.`
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
            Copie anuncios entre marketplaces: escolha a plataforma de origem,
            cole o link do anuncio e selecione em qual loja conectada deseja
            publicar a copia.
          </p>
        </div>
      </section>

      <section className="box importer-channel-card">
        <div className="section-heading">
          <div>
            <span className="section-kicker">1. Origem</span>
            <h2>De onde vamos copiar</h2>
          </div>
          <strong>{selectedSource.label}</strong>
        </div>

        <div className="copy-platform-grid">
          {copyPlatforms.map((platform) => (
            <button
              type="button"
              key={platform.key}
              className={sourcePlatform === platform.key ? "selected" : ""}
              onClick={() => selectSource(platform.key)}
            >
              <span>{platform.shortLabel}</span>
              <strong>{platform.label}</strong>
              <small>{platformStatus(platform)}</small>
            </button>
          ))}
        </div>
      </section>

      <section className="box importer-channel-card">
        <div className="section-heading">
          <div>
            <span className="section-kicker">2. Destino</span>
            <h2>Onde vamos publicar</h2>
          </div>
          <strong>{selectedTarget.label}</strong>
        </div>

        <div className="copy-platform-grid target">
          {copyPlatforms.map((platform) => (
            <button
              type="button"
              key={platform.key}
              className={targetPlatform === platform.key ? "selected" : ""}
              onClick={() => selectTarget(platform.key)}
            >
              <span>{platform.shortLabel}</span>
              <strong>{platform.label}</strong>
              <small>{platformStatus(platform)}</small>
            </button>
          ))}
        </div>
      </section>

      {(selectedSource.copyStatus !== "active" ||
        selectedTarget.copyStatus !== "active") && (
        <section className="box importer-warning">
          <strong>
            {selectedSource.copyStatus !== "active"
              ? `A captura de anuncios da ${selectedSource.label} ainda precisa da API oficial. `
              : ""}
            {selectedTarget.copyStatus !== "active"
              ? `A publicacao na ${selectedTarget.label} ainda precisa da API oficial.`
              : ""}
          </strong>
        </section>
      )}

      {selectedTarget.copyStatus === "active" && !isConnected(selectedTarget.key) && (
        <section className="box importer-warning">
          <strong>
            Conecte sua conta da {selectedTarget.label} em Integracoes antes de
            publicar a copia.
          </strong>
          <button
            type="button"
            onClick={() => setPage?.(selectedTarget.integrationPage)}
          >
            Conectar {selectedTarget.label}
          </button>
        </section>
      )}

      <section className="importer-layout">
        <form className="box importer-form-card" onSubmit={buscarDados}>
          <h2>3. Link do anuncio de origem</h2>
          <div className="form-grid">
            <input
              placeholder={selectedSource.placeholder}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>

          <div className="importer-actions">
            <button type="submit" disabled={loading}>
              {loading ? "Buscando..." : `Buscar dados da ${selectedSource.label}`}
            </button>
          </div>

          {error && <strong className="import-result">{error}</strong>}
        </form>

        <aside className="box importer-flow-card">
          <span className="section-kicker">Fluxo</span>
          <h2>Como funciona</h2>
          <ol>
            <li>Escolha a plataforma onde o anuncio ja existe.</li>
            <li>Cole o link publico do anuncio ou produto.</li>
            <li>Confira titulo, preco, descricao e imagens capturados.</li>
            <li>Escolha a loja de destino e publique a copia.</li>
          </ol>
        </aside>
      </section>

      {preview && (
        <section className="box importer-preview-card">
          <h2>4. Dados capturados</h2>

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
                <span>Canal: {preview.source_platform_label || selectedSource.label}</span>
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
              {publishing ? "Publicando..." : `Publicar na ${selectedTarget.label}`}
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
              Abrir anuncio publicado
            </a>
          )}
        </section>
      )}
    </div>
  );
}
