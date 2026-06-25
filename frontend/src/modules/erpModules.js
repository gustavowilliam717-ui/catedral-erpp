export const erpModules = [
  {
    key: "dashboard",
    label: "Home",
    page: "dashboard",
  },
  {
    key: "products",
    label: "Produtos",
    page: "products",
    menuVariant: "product-menu",
    columns: [
      {
        title: "Gerenciamento de Produtos",
        items: [
          { page: "products", label: "Produtos do Armazem", active: true },
          { page: "product-mapping", label: "Gerenciar Mapeamento" },
          { page: "product-categories", label: "Categorias" },
        ],
      },
      {
        title: "Gestao de Anuncios",
        marketplaces: [
          {
            key: "shopee",
            label: "Shopee",
            actions: [
              { page: "shopee-ad-drafts", label: "Rascunhos" },
              { page: "shopee-active-ads", label: "Ativo" },
              { page: "shopee-create-ad", label: "Criar Anuncio" },
              { page: "shopee-ad-marketing", label: "Marketing" },
            ],
          },
          {
            key: "shein",
            label: "SHEIN",
            actions: [
              { page: "shein-ad-drafts", label: "Rascunhos" },
              { page: "shein-active-ads", label: "Ativo" },
              { page: "shein-create-ad", label: "Criar Anuncio" },
            ],
          },
          {
            key: "tiktok",
            label: "TikTok Shop",
            actions: [
              { page: "tiktok-ad-drafts", label: "Rascunhos" },
              { page: "tiktok-active-ads", label: "Ativo" },
              { page: "tiktok-create-ad", label: "Criar Anuncio" },
              { page: "tiktok-ad-marketing", label: "Marketing" },
            ],
          },
        ],
        unauthorized: [
          "Amazon",
          "Shopify",
          "Nuvemshop",
          "Temu",
          "Walmart",
          "Falabella",
          "Magalu",
          "AliExpress",
          "Kwai Shop",
        ],
      },
      {
        title: "Ferramentas",
        items: [
          { page: "product-importer", label: "Importacao de Produto" },
          { page: "ad-migration", label: "Migracao de Anuncios", badge: "Hot" },
          { page: "code-control", label: "Controle de Codigo" },
          { page: "price-models", label: "Modelo de Precificacao", badge: "Novo" },
          { page: "product-data-detective", label: "Detectar Palavras Proibidas" },
          { page: "ai-product-image", label: "Gerar Imagem por IA", badge: "Novo" },
          { page: "ai-product-create", label: "Criar Produto por IA", badge: "Novo" },
          { page: "data-space", label: "Espaco de Dados" },
        ],
      },
    ],
  },
  {
    key: "orders",
    label: "Pedidos",
    columns: [
      {
        title: "Gerenciamento de Pedidos",
        items: [
          { page: "orders", label: "Pedidos Recentes" },
          { page: "orders-history", label: "Pedidos Historicos" },
        ],
      },
      {
        title: "Processando Pedidos",
        items: [
          { page: "orders-to-invoice", label: "Para Emitir" },
          { page: "orders-to-ship", label: "Para Enviar" },
          { page: "orders-to-print", label: "Para Imprimir" },
          { page: "orders-pickup", label: "Para Retirada" },
          { page: "orders-shipped", label: "Enviado" },
        ],
      },
      {
        title: "Pos-venda",
        items: [
          { page: "orders-canceled", label: "Anulado" },
          { page: "returns", label: "Devolucoes" },
          { page: "refunds", label: "Reembolsos" },
          { page: "claims", label: "Reclamacoes" },
        ],
      },
    ],
  },
  {
    key: "purchases",
    label: "Compras",
    page: "purchase-suggestions",
    columns: [
      {
        title: "Controle de Compras",
        items: [
          { page: "purchase-suggestions", label: "Sugestao de Compras", badge: "Novo" },
          { page: "purchase-orders", label: "Pedidos de Compras" },
        ],
      },
      {
        title: "NF-e de Compra",
        items: [
          { page: "purchase-nfe-brasil", label: "Brasil NF-e" },
        ],
      },
      {
        title: "Gestao de Fornecedores",
        items: [
          { page: "suppliers", label: "Fornecedores" },
          { page: "supplier-relations", label: "Gerenciamento de Fornecedores" },
        ],
      },
    ],
  },
  {
    key: "stock",
    label: "Estoque",
    page: "stock",
    columns: [
      {
        title: "Gerenciamento de Estoque",
        items: [
          { page: "stock", label: "Lista de Estoque", active: true },
          { page: "marketplace-stock", label: "Saldo por Marketplace" },
          { page: "stock-low", label: "Estoque Baixo" },
          { page: "stock-report", label: "Relatorio de Estoque" },
          { page: "stock-sync", label: "Sincronizacao de Estoque", badge: "Hot" },
        ],
      },
      {
        title: "Marketplaces",
        items: [
          { page: "stock-shopee", label: "Shopee" },
          { page: "stock-mercado-livre", label: "Mercado Livre" },
          { page: "stock-shein", label: "Shein" },
          { page: "stock-tiktok", label: "TikTok Shop" },
          { page: "stock-amazon", label: "Amazon" },
        ],
      },
      {
        title: "Armazem de Plataforma",
        items: [
          { page: "mercado-envios-full", label: "Mercado Envios Full" },
          { page: "shopee-fbs", label: "Shopee FBS" },
          { page: "amazon-fba", label: "Amazon FBA" },
          { page: "fulfillment-magalu", label: "Fulfillment Magalu" },
        ],
      },
      {
        title: "Controle Marketplace",
        items: [
          { page: "stock-reservations", label: "Reservas por Pedido" },
          { page: "stock-in-transit", label: "Estoque em Transito" },
          { page: "stock-divergences", label: "Divergencias" },
          { page: "stock-reposition-rules", label: "Regras de Reposicao" },
        ],
      },
    ],
  },
  {
    key: "pricing",
    label: "Precificacao",
    page: "pricing",
    columns: [
      {
        title: "Margem e Preco",
        items: [
          { page: "pricing", label: "Calculadora de Preco", active: true },
          { page: "pricing-history-view", label: "Historico de Precificacao" },
          { page: "marketplace-fees", label: "Taxas por Marketplace" },
          { page: "pricing-rules", label: "Regras Automaticas" },
        ],
      },
    ],
  },
  {
    key: "sac",
    label: "SAC",
    columns: [
      {
        title: "Avaliacoes",
        items: [
          { page: "sac-reviews", label: "Lista por Grau", active: true },
          { page: "sac-review-auto", label: "Resposta Automatica por IA" },
          { page: "sac-review-template", label: "Modelo de Resposta" },
          { page: "sac-returns", label: "Devolucao/Reembolso" },
        ],
      },
      {
        title: "Atendimento",
        items: [
          { page: "customer-questions", label: "Perguntas" },
          { page: "customer-messages", label: "Mensagens" },
          { page: "claims", label: "Reclamacoes" },
          { page: "customer-block-list", label: "Lista de Bloqueio" },
        ],
      },
      {
        title: "Gestao de Cliente",
        items: [
          { page: "request-review", label: "Solicitar Avaliacao" },
          { page: "buyers-list", label: "Lista de Compradores" },
          { page: "blocked-buyers", label: "Minha Lista de Bloqueio" },
          { page: "chat", label: "Chatbot de IA", badge: "Hot" },
        ],
      },
    ],
  },
  {
    key: "analytics",
    label: "Analises",
    columns: [
      {
        title: "Indicadores",
        items: [
          { page: "sales-analysis", label: "Analise de Vendas" },
          { page: "profit-analysis", label: "Analise de Lucro" },
          { page: "dre", label: "DRE" },
          { page: "marketplace-comparison", label: "Comparar Marketplaces" },
        ],
      },
    ],
  },
  {
    key: "finance",
    label: "Financeiro",
    page: "finance",
    columns: [
      {
        title: "Gestao Financeira",
        items: [
          { page: "finance", label: "Painel Financeiro", active: true },
          { page: "cash-flow", label: "Caixa e Bancos" },
          { page: "accounts-payable", label: "Contas a Pagar" },
          { page: "accounts-receivable", label: "Contas a Receber" },
        ],
      },
      {
        title: "Relatorios",
        items: [
          { page: "profit-report", label: "Relatorio de Lucros" },
          { page: "invoice-report", label: "Relatorio de NF-e" },
          { page: "ncm-sales-report", label: "NCM Vendas" },
          { page: "ncm-purchase-report", label: "NCM Compras" },
          { page: "ncm-stock-report", label: "NCM Estoque" },
          { page: "taxes", label: "Impostos" },
        ],
      },
    ],
  },
  {
    key: "integrations",
    label: "Integracoes",
    columns: [
      {
        title: "Marketplaces",
        items: [
          { page: "store-integrations", label: "Integracoes de Loja", active: true },
          { page: "shopee-api", label: "Shopee API e Pedidos" },
          { page: "importShopee", label: "Importar Shopee", active: true },
          { page: "mercado-livre-integration", label: "Mercado Livre" },
          { page: "amazon-integration", label: "Amazon" },
          { page: "magalu-integration", label: "Magalu" },
          { page: "tiktok-integration", label: "TikTok Shop" },
        ],
      },
    ],
  },
  {
    key: "settings",
    label: "Configuracoes",
    columns: [
      {
        title: "Pedidos",
        items: [
          { page: "settings-orders", label: "Configuracoes padroes", active: true },
          { page: "settings-nfe", label: "NF-e Automatica" },
          { page: "settings-auto-program", label: "Auto-Programar" },
          { page: "settings-allocation", label: "Regras de Alocacao" },
        ],
      },
      {
        title: "Logisticas e Etiquetas",
        items: [
          { page: "settings-shopee-labels", label: "Shopee" },
          { page: "settings-shein-labels", label: "Shein" },
          { page: "settings-tiktok-labels", label: "TikTok Shop" },
          { page: "settings-3pl", label: "Logistica suportada por 3PL" },
          { page: "settings-print-model", label: "Modelo de Impressao" },
          { page: "settings-sku-label", label: "Etiqueta do SKU" },
          { page: "settings-shelf-label", label: "Etiqueta de Estante" },
        ],
      },
      {
        title: "Sistema",
        items: [
          { page: "settings-stock", label: "Estoque" },
          { page: "settings-finance", label: "Financeiro" },
        ],
      },
      {
        title: "Permissoes",
        items: [
          { page: "settings-permissions", label: "Subconta" },
          { page: "settings-accountant", label: "Configuracoes do Contador" },
          { page: "settings-activity-log", label: "Registros de Atividades" },
        ],
      },
      {
        title: "Notas Fiscais",
        items: [
          { page: "settings-dce", label: "DC-e Brasil" },
        ],
      },
    ],
  },
];

export const flatModulePages = erpModules.flatMap((module) =>
  (module.columns || []).flatMap((column) => {
    const itemPages = column.items || [];
    const marketplacePages = (column.marketplaces || []).flatMap((marketplace) =>
      marketplace.actions.map((action) => ({
        ...action,
        marketplace: marketplace.label,
      }))
    );

    return [...itemPages, ...marketplacePages].map((item) => ({
      ...item,
      module: module.label,
      group: column.title,
    }));
  })
);

export function findModulePage(page) {
  return flatModulePages.find((item) => item.page === page);
}
