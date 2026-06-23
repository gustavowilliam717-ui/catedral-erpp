import { useEffect, useMemo, useState } from "react";
import API from "../services/api";

const fallbackImages = [
  "Imagem do anuncio",
  "Foto principal",
  "Foto variacao",
  "Banner do produto",
  "Imagem de detalhe",
  "Imagem secundaria",
];

export default function DataSpace() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState("Imagens de Anuncios");

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      const response = await API.get("/products");
      setProducts(response.data || []);
    } catch (error) {
      console.log(error);
    }
  }

  const images = useMemo(() => {
    const productImages = products
      .filter((product) => product.image_url)
      .map((product) => ({
        id: product.id,
        name: product.name || "Imagem de anuncio",
        url: product.image_url,
        marketplace: product.marketplace || "Marketplace",
      }));

    if (productImages.length > 0) {
      return productImages;
    }

    return fallbackImages.map((name, index) => ({
      id: `fallback-${index}`,
      name,
      marketplace: "Biblioteca",
      url: "",
    }));
  }, [products]);

  const filteredImages = images.filter((image) =>
    [image.name, image.marketplace].join(" ").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="data-space-page">
      <aside className="data-space-sidebar">
        <h2>Espaco de Dados</h2>
        <strong>Produtos</strong>
        {["Imagens de Anuncios", "Imagens de Produtos", "Central de Videos", "Outros Arquivos"].map(
          (item) => (
            <button
              type="button"
              key={item}
              className={selected === item ? "active" : ""}
              onClick={() => setSelected(item)}
            >
              {item}
            </button>
          )
        )}
        <strong>Pedidos</strong>
        <button type="button">Anexos de Pedidos</button>
        <strong>Financeiro</strong>
        <button type="button">Comprovantes</button>
        <div className="storage-meter">
          <span style={{ width: "28%" }} />
        </div>
        <small>Espaco utilizado: 3.93MB</small>
      </aside>

      <main className="data-space-content">
        <section className="notice-banner">
          <span className="banner-icon">i</span>
          <p>
            O Espaco de Dados guarda as imagens dos anuncios para reutilizar em
            publicacoes, rascunhos e importacao de produto.
          </p>
        </section>

        <section className="data-space-toolbar">
          <select>
            <option>Nome da imagem</option>
            <option>Marketplace</option>
            <option>Data de envio</option>
          </select>
          <input
            placeholder="Pesquisar imagens de anuncios"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <button type="button">Adicionar & Enviar</button>
        </section>

        <section className="box data-gallery-card">
          <div className="section-heading">
            <div>
              <span className="section-kicker">Produtos</span>
              <h2>{selected}</h2>
            </div>
            <strong>{filteredImages.length} arquivos</strong>
          </div>

          <div className="ad-image-grid">
            {filteredImages.map((image) => (
              <article key={image.id}>
                {image.url ? (
                  <img src={image.url} alt={image.name} />
                ) : (
                  <div className="image-placeholder" />
                )}
                <strong>{image.name}</strong>
                <span>{image.marketplace}</span>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
