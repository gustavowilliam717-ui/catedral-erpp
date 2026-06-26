export default function AppDownload() {
  return (
    <div className="page app-download-page">
      <section className="app-download-hero">
        <div>
          <span className="section-kicker">NEXT ERP Mobile</span>
          <h1>Baixe o app para acompanhar sua operacao de marketplace</h1>
          <p>
            Acompanhe pedidos, mensagens, estoque, anuncios e alertas pelo
            celular quando o app mobile estiver publicado.
          </p>
          <div className="app-store-actions">
            <button type="button">App Store</button>
            <button type="button">Google Play</button>
          </div>
        </div>

        <div className="mobile-preview">
          <div className="phone-frame">
            <span>NEXT ERP</span>
            <strong>R$ 12.480</strong>
            <small>Venda potencial em estoque</small>
            <i />
            <i />
            <i />
          </div>
        </div>
      </section>

      <section className="app-feature-grid">
        <article>
          <strong>Pedidos e etiquetas</strong>
          <span>Acompanhe o que precisa imprimir, enviar e revisar.</span>
        </article>
        <article>
          <strong>Estoque por marketplace</strong>
          <span>Veja divergencias entre ERP e plataformas conectadas.</span>
        </article>
        <article>
          <strong>Alertas importantes</strong>
          <span>Receba avisos de estoque baixo, falha de sincronizacao e margem.</span>
        </article>
      </section>
    </div>
  );
}
