const plan = {
  name: "Catedral ERP Pro",
  price: "R$ 389,00",
  period: "BRL / Mensal",
  note: "Plano unico para vender em marketplaces com operacao profissional.",
  items: [
    "Produtos, pedidos, estoque e precificacao",
    "Importacao de produtos e planilhas da Shopee",
    "SAC com avaliacoes, IA e modelos de resposta",
    "Integracoes de marketplace e controle financeiro",
    "Usuarios e permissoes para equipe",
  ],
};

export default function Plans() {
  return (
    <div className="page plans-page single-plan-page">
      <section className="settings-title-card">
        <div>
          <span className="section-kicker">Conta</span>
          <h1>Planos</h1>
          <p>
            O Catedral ERP trabalha com um plano unico para simplificar a
            cobranca e liberar as principais ferramentas do sistema.
          </p>
        </div>
      </section>

      <section className="single-plan-wrap">
        <article className="single-plan-card">
          <span className="plan-badge">Plano unico</span>
          <div className="plan-shield">C</div>
          <h2>{plan.name}</h2>
          <p>{plan.note}</p>
          <strong>{plan.price}</strong>
          <small>{plan.period}</small>
          <button type="button">Assinar plano</button>

          <ul>
            {plan.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </section>
    </div>
  );
}
