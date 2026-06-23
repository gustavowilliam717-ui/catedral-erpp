import { findModulePage } from "../modules/erpModules";

const moduleNeeds = {
  orders: ["canais de venda", "status de pedido", "etiquetas e NF", "regras de envio"],
  purchases: ["fornecedores", "prazo medio", "custo por insumo", "pedido minimo"],
  "product-mapping": ["SKU interno", "SKU do marketplace", "canal", "regra de vinculacao"],
  "active-ads": ["marketplace", "produto", "status do anuncio", "preco publicado"],
  "ad-drafts": ["produto base", "titulo", "descricao", "imagens"],
  "create-ad": ["produto", "marketplace", "categoria", "template de anuncio"],
  "copy-ads": ["anuncio origem", "loja destino", "campos para copiar", "regra de variacao"],
  "ad-migration": ["marketplace origem", "marketplace destino", "SKU vinculado", "status de migracao"],
  "code-control": ["SKU", "codigo de barras", "codigo interno", "codigo do marketplace"],
  "price-models": ["modelo de margem", "taxas do canal", "frete", "comissao"],
  "product-data-detective": ["titulo", "descricao", "palavras proibidas", "regras por canal"],
  "ai-product-image": ["imagem base", "formato desejado", "fundo", "canal de destino"],
  "ai-product-create": ["nome do produto", "categoria", "atributos", "imagens"],
  "data-space": ["arquivos do produto", "templates", "historico", "anexos"],
  "stock-sync": ["marketplace", "SKU", "saldo minimo", "regra de reserva"],
  "marketplace-stock": ["marketplace", "SKU", "saldo ERP", "saldo publicado"],
  "stock-low": ["SKU", "estoque minimo", "canal de venda", "prioridade de reposicao"],
  "stock-report": ["periodo", "marketplace", "divergencias", "historico de sincronizacao"],
  "stock-shopee": ["loja Shopee", "SKU Shopee", "estoque publicado", "status da API"],
  "stock-mercado-livre": ["conta Mercado Livre", "SKU", "Mercado Envios Full", "saldo publicado"],
  "stock-shein": ["loja Shein", "SKU Shein", "estoque publicado", "regra de sincronizacao"],
  "stock-tiktok": ["loja TikTok Shop", "SKU", "estoque publicado", "reserva por pedido"],
  "stock-amazon": ["conta Amazon", "SKU/FNSKU", "FBA", "saldo publicado"],
  "mercado-envios-full": ["SKU Full", "saldo no Full", "em transito", "disponivel para venda"],
  "shopee-fbs": ["SKU FBS", "saldo no FBS", "reserva", "divergencia"],
  "amazon-fba": ["FNSKU", "saldo FBA", "estoque reservado", "reposicao"],
  "fulfillment-magalu": ["SKU Magalu", "saldo fulfillment", "status", "ultima sincronizacao"],
  "stock-reservations": ["pedido", "marketplace", "SKU reservado", "prazo de liberacao"],
  "stock-in-transit": ["marketplace", "remessa", "quantidade", "previsao de chegada"],
  "stock-divergences": ["SKU", "saldo ERP", "saldo marketplace", "acao corretiva"],
  "stock-reposition-rules": ["marketplace", "estoque minimo", "lead time", "quantidade sugerida"],
  "cash-flow": ["receitas", "despesas", "datas", "forma de pagamento"],
  dre: ["receita bruta", "custos", "despesas fixas", "impostos"],
};

function resolveNeeds(page) {
  if (moduleNeeds[page]) {
    return moduleNeeds[page];
  }

  if (page.endsWith("-ad-drafts")) {
    return ["marketplace", "produto base", "titulo", "descricao", "imagens"];
  }

  if (page.endsWith("-active-ads")) {
    return ["marketplace", "produto", "status do anuncio", "preco publicado"];
  }

  if (page.endsWith("-create-ad")) {
    return ["produto", "categoria", "atributos obrigatorios", "template do anuncio"];
  }

  if (page.endsWith("-ad-marketing")) {
    return ["campanha", "orcamento", "produto anunciado", "retorno por canal"];
  }

  return [
    "campos principais",
    "fluxo desejado",
    "regras de calculo",
    "integracoes necessarias",
  ];
}

export default function ModulePlaceholder({ page }) {
  const modulePage = findModulePage(page);
  const title = modulePage?.label || "Modulo em construcao";
  const group = modulePage?.group || "ERP";
  const module = modulePage?.module || "Catedral ERP";
  const needs = resolveNeeds(page);

  return (
    <div className="page module-page">
      <section className="module-hero">
        <div>
          <span>{module}</span>
          <h1>{title}</h1>
          <p>
            Esta pasta ja foi adicionada na estrutura do ERP. A funcionalidade
            entra na proxima etapa, quando definirmos os dados e regras.
          </p>
        </div>

        <strong>{group}</strong>
      </section>

      <section className="module-grid">
        <div className="box">
          <h2>Status da pasta</h2>
          <div className="module-status-list">
            <span className="status-chip ok">Menu criado</span>
            <span className="status-chip">Tela reservada</span>
            <span className="status-chip">Funcao pendente</span>
          </div>
        </div>

        <div className="box">
          <h2>Dados que vou precisar</h2>
          <ul className="need-list">
            {needs.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="box">
        <h2>Proximo passo</h2>
        <p>
          Quando voce escolher ativar esta pasta, eu monto primeiro o cadastro,
          depois a listagem, filtros, importacao/exportacao e integracoes que
          fizerem sentido para o modulo.
        </p>
      </section>
    </div>
  );
}
