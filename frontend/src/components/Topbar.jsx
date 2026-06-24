import { findModulePage } from "../modules/erpModules";

const pageTitles = {
  dashboard: "Home",
  products: "Produtos",
  finance: "Financeiro",
  "cash-flow": "Caixa e Bancos",
  "accounts-payable": "Contas a Pagar",
  "accounts-receivable": "Contas a Receber",
  "profit-report": "Relatorio de Lucros",
  "invoice-report": "Relatorio de NF-e",
  "ncm-sales-report": "NCM Vendas",
  "ncm-purchase-report": "NCM Compras",
  "ncm-stock-report": "NCM Estoque",
  taxes: "Impostos",
  pricing: "Precificacao",
  "purchase-suggestions": "Sugestao de Compras",
  "purchase-orders": "Pedidos de Compras",
  "purchase-orders-to-purchase": "Para Comprar",
  "purchase-orders-in-transit": "Em Transito",
  "purchase-orders-partial": "Parcial",
  "purchase-orders-completed": "Completado",
  "purchase-orders-canceled": "Cancelado",
  "purchase-nfe-brasil": "Brasil NF-e",
  suppliers: "Fornecedores",
  "supplier-relations": "Gerenciamento de Fornecedores",
  stock: "Estoque",
  chat: "Assistente Catedral",
  plans: "Planos",
  "app-download": "Baixe o App",
  "product-importer": "Importacao de Produto",
  "data-space": "Espaco de Dados",
  importShopee: "Importar Shopee",
  "store-integrations": "Integracoes de Loja",
  "shopee-api": "Shopee API e Pedidos",
  "settings-orders": "Configuracoes de Pedidos",
  "settings-nfe": "Configuracoes de NF-e",
  "settings-dce": "DC-e Brasil",
  "settings-auto-program": "Auto-Programar",
  "settings-allocation": "Regras de Alocacao",
  "settings-shopee-labels": "Etiquetas Shopee",
  "settings-shein-labels": "Etiquetas Shein",
  "settings-tiktok-labels": "Etiquetas TikTok Shop",
  "settings-3pl": "Logistica 3PL",
  "settings-print-model": "Modelo de Impressao",
  "settings-sku-label": "Etiqueta do SKU",
  "settings-shelf-label": "Etiqueta de Estante",
  "settings-stock": "Configuracoes de Estoque",
  "settings-finance": "Configuracoes Financeiras",
  "settings-permissions": "Subconta",
  "settings-accountant": "Configuracoes do Contador",
  "settings-activity-log": "Registros de Atividades",
  "sac-reviews": "Avaliacoes",
  "sac-review-auto": "Resposta Automatica por IA",
  "sac-review-template": "Modelo de Resposta",
  "sac-returns": "Devolucao/Reembolso",
  "account-profile": "Perfil",
  "account-language": "Idioma",
  "account-security": "Seguranca",
  "account-subscription": "Minha Assinatura",
  "account-services": "Servico Assinado",
  "account-rewards": "Resgate de Recompensa",
  "account-transactions": "Detalhes da Transacao",
  "account-help": "Central de Ajuda",
};

export default function Topbar({ page }) {
  const modulePage = findModulePage(page);
  const title = pageTitles[page] || modulePage?.label || "Catedral ERP";
  const subtitle = modulePage
    ? `${modulePage.module} / ${modulePage.group}`
    : "Central de operacao para produtos, estoque e marketplaces.";

  return (
    <div className="page-toolbar">
      <div>
        <h1>{title}</h1>
        <span>{subtitle}</span>
      </div>

      <div className="toolbar-actions">
        <span className="status-chip ok">API ativa</span>
        <span className="status-chip">Loja Catedral</span>
      </div>
    </div>
  );
}
