import { useEffect, useMemo, useState } from "react";

const storageKey = "catedral_marketplace_orders";

const statusPages = {
  orders: "all",
  "orders-to-invoice": "to_invoice",
  "orders-to-ship": "to_ship",
  "orders-to-print": "to_print",
  "orders-pickup": "pickup",
  "orders-shipped": "shipped",
  "orders-history": "history",
  "orders-canceled": "canceled",
};

const statusLabels = {
  to_invoice: "Para Emitir",
  to_ship: "Para Enviar",
  to_print: "Para Imprimir",
  pickup: "Para Retirada",
  shipped: "Enviado",
  canceled: "Anulado",
};

const statusTabs = [
  { page: "orders", label: "Todos", status: "all" },
  { page: "orders-to-invoice", label: "Para Emitir", status: "to_invoice" },
  { page: "orders-to-ship", label: "Para Enviar", status: "to_ship" },
  { page: "orders-to-print", label: "Para Imprimir", status: "to_print" },
  { page: "orders-pickup", label: "Para Retirada", status: "pickup" },
  { page: "orders-shipped", label: "Enviado", status: "shipped" },
];

const workflow = [
  {
    page: "orders-to-invoice",
    status: "to_invoice",
    label: "Emitir NF",
    detail: "Nota fiscal",
  },
  {
    page: "orders-to-ship",
    status: "to_ship",
    label: "Programar envio",
    detail: "Logistica",
  },
  {
    page: "orders-to-print",
    status: "to_print",
    label: "Imprimir etiqueta",
    detail: "Etiqueta",
  },
  {
    page: "orders-pickup",
    status: "pickup",
    label: "Retirada",
    detail: "Aguardando coleta",
  },
  {
    page: "orders-shipped",
    status: "shipped",
    label: "Despachado",
    detail: "Vendedor local",
  },
];

const sidebarGroups = [
  {
    title: "Total Pedidos",
    items: [
      { page: "orders", label: "Pedidos Recentes", status: "all" },
      { page: "orders-history", label: "Pedidos Historicos", status: "history" },
    ],
  },
  {
    title: "Processando Pedidos",
    items: [
      { page: "orders-to-invoice", label: "Para Emitir", status: "to_invoice" },
      { page: "orders-to-ship", label: "Para Enviar", status: "to_ship" },
      { page: "orders-to-print", label: "Para Imprimir", status: "to_print" },
      { page: "orders-pickup", label: "Para Retirada", status: "pickup" },
      { page: "orders-shipped", label: "Enviado", status: "shipped" },
    ],
  },
  {
    title: "Outras",
    items: [{ page: "orders-canceled", label: "Anulado", status: "canceled" }],
  },
];

const seedOrders = [
  {
    id: "UP13YL185874",
    platformOrderId: "26062636BNAGXG",
    packageId: "119872465553",
    productName: "Lousa + Banquinho",
    sku: "LOUSA-BANQ-01",
    quantity: 1,
    value: 94.38,
    buyer: "Debora Gomes Parreira",
    destination: "Belo Horizonte, Minas Gerais",
    marketplace: "Shopee",
    store: "CATEDRAL MDF",
    warehouse: "CATEDRAL MDF",
    shippingMethod: "Shopee Xpress",
    trackingCode: "BR2617072535306",
    deliveryType: "Entregar na Agencia",
    paidAt: "25/06/2026 15:05",
    arrangedAt: "25/06/2026 15:20",
    deadline: "Expira em 1d 7h",
    fiscalStatus: "pending",
    labelStatus: "not_printed",
    status: "to_invoice",
  },
  {
    id: "UP13YL185873",
    platformOrderId: "2606252P2UU16T",
    packageId: "BIOMBO-TREL-02",
    productName: "Biombo Trelica",
    sku: "BIOMBO-TREL-02",
    quantity: 2,
    value: 256.14,
    buyer: "Roberta Braga Pereira",
    destination: "Sao Pedro da Aldeia, Rio de Janeiro",
    marketplace: "Shopee",
    store: "PINK",
    warehouse: "PINK",
    shippingMethod: "Shopee Xpress",
    trackingCode: "BR261926155032N",
    deliveryType: "Entregar na Agencia",
    paidAt: "25/06/2026 10:16",
    arrangedAt: "25/06/2026 15:24",
    deadline: "Expira em 0d 7h",
    fiscalStatus: "issued",
    invoiceNumber: "NF-000382",
    labelStatus: "not_printed",
    status: "to_print",
  },
  {
    id: "MLB4221917420",
    platformOrderId: "2000012769405526",
    packageId: "MLB-PACK-8841",
    productName: "Kit Nicho Decorativo",
    sku: "NICHO-KIT-03",
    quantity: 1,
    value: 149.9,
    buyer: "Carlos Eduardo Silva",
    destination: "Sao Paulo, Sao Paulo",
    marketplace: "Mercado Livre",
    store: "CATEDRAL MDF",
    warehouse: "CATEDRAL MDF",
    shippingMethod: "Mercado Envios",
    trackingCode: "ME563901882BR",
    deliveryType: "Coleta local",
    paidAt: "25/06/2026 09:42",
    arrangedAt: "-",
    deadline: "Postar hoje",
    fiscalStatus: "issued",
    invoiceNumber: "NF-000381",
    labelStatus: "generated",
    status: "to_ship",
  },
  {
    id: "SHE2603183988",
    platformOrderId: "GSH1XC47000M7C6",
    packageId: "SHEIN-7771",
    productName: "Porta Condimentos",
    sku: "PORTA-COND-04",
    quantity: 2,
    value: 16.12,
    buyer: "Luciana Pinto Silva",
    destination: "Redencao, Para",
    marketplace: "Shein",
    store: "CATEDRAL MDF",
    warehouse: "CATEDRAL MDF",
    shippingMethod: "IMB M03",
    trackingCode: "888001761774153",
    deliveryType: "Agencia",
    paidAt: "24/06/2026 14:43",
    arrangedAt: "27/06/2026 07:58",
    deadline: "Despacho programado",
    fiscalStatus: "issued",
    invoiceNumber: "NF-000379",
    labelStatus: "printed",
    status: "pickup",
  },
  {
    id: "UP13YL185254",
    platformOrderId: "2603277K7DCSSP",
    packageId: "PAINEL-ROM-01",
    productName: "Painel Romano",
    sku: "PAINEL-ROM-01",
    quantity: 1,
    value: 35.18,
    buyer: "Cliente Marketplace",
    destination: "-",
    marketplace: "Shopee",
    store: "CATEDRAL MDF",
    warehouse: "CATEDRAL MDF",
    shippingMethod: "Shopee Xpress",
    trackingCode: "BR2603277K7DCSSP",
    deliveryType: "Completo",
    paidAt: "26/03/2026 19:01",
    arrangedAt: "27/03/2026 07:58",
    deadline: "Enviado",
    fiscalStatus: "issued",
    invoiceNumber: "NF-000214",
    labelStatus: "printed",
    shippedAt: "27/03/2026 07:58",
    status: "shipped",
  },
];

function formatCurrency(value) {
  return Number(value || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function exportCsv(filename, rows) {
  if (!rows.length) return;

  const headers = Object.keys(rows[0]);
  const escape = (value) => {
    const text = String(value ?? "");
    return `"${text.replaceAll('"', '""')}"`;
  };
  const csv = [
    headers.join(";"),
    ...rows.map((row) => headers.map((header) => escape(row[header])).join(";")),
  ].join("\n");
  const blob = new Blob([`\ufeff${csv}`], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function loadInitialOrders() {
  try {
    const stored = localStorage.getItem(storageKey);
    return stored ? JSON.parse(stored) : seedOrders;
  } catch {
    return seedOrders;
  }
}

function getInitials(text) {
  return String(text || "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function makeInvoiceNumber(order) {
  const numeric = String(order.platformOrderId || order.id).replace(/\D/g, "").slice(-6);
  return `NF-${numeric.padStart(6, "0")}`;
}

function makeTrackingCode(order) {
  const numeric = String(order.platformOrderId || order.id).replace(/\D/g, "").slice(-9);
  return `BR${numeric.padStart(9, "0")}`;
}

function getNextActionLabel(status) {
  if (status === "to_invoice") return "Emitir Nota Fiscal";
  if (status === "to_ship") return "Programar Envio";
  if (status === "to_print") return "Imprimir Etiqueta";
  if (status === "pickup") return "Marcar Despachado";
  return "Detalhes";
}

function advanceOrder(order) {
  if (order.status === "to_invoice") {
    return {
      ...order,
      status: "to_ship",
      fiscalStatus: "issued",
      invoiceNumber: order.invoiceNumber || makeInvoiceNumber(order),
    };
  }

  if (order.status === "to_ship") {
    return {
      ...order,
      status: "to_print",
      trackingCode: order.trackingCode || makeTrackingCode(order),
      labelStatus: order.labelStatus === "printed" ? "printed" : "generated",
      arrangedAt: order.arrangedAt === "-" ? "Programado agora" : order.arrangedAt,
    };
  }

  if (order.status === "to_print") {
    return {
      ...order,
      status: "pickup",
      labelStatus: "printed",
      deadline: "Aguardando retirada",
    };
  }

  if (order.status === "pickup") {
    return {
      ...order,
      status: "shipped",
      shippedAt: new Date().toLocaleString("pt-BR"),
      deadline: "Despachado localmente",
    };
  }

  return order;
}

function getFiscalLabel(status) {
  if (status === "issued") return "NF-e emitida";
  if (status === "failed") return "Falha NF-e";
  return "NF-e pendente";
}

function getLabelStatusText(status) {
  if (status === "printed") return "Etiqueta impressa";
  if (status === "generated") return "Etiqueta gerada";
  return "Etiqueta pendente";
}

function isHistoryOrder(order) {
  return order.status === "shipped" || order.status === "canceled";
}

export default function Orders({ activePage = "orders", setPage }) {
  const [orders, setOrders] = useState(loadInitialOrders);
  const [search, setSearch] = useState("");
  const [platform, setPlatform] = useState("Todas");
  const [shippingMethod, setShippingMethod] = useState("Todos");
  const [fiscalFilter, setFiscalFilter] = useState("Todas");
  const [labelFilter, setLabelFilter] = useState("Todas");
  const [selectedOrders, setSelectedOrders] = useState([]);
  const pageStatus = statusPages[activePage] || "all";

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(orders));
  }, [orders]);

  const counts = useMemo(() => {
    return {
      all: orders.length,
      history: orders.filter(isHistoryOrder).length,
      to_invoice: orders.filter((order) => order.status === "to_invoice").length,
      to_ship: orders.filter((order) => order.status === "to_ship").length,
      to_print: orders.filter((order) => order.status === "to_print").length,
      pickup: orders.filter((order) => order.status === "pickup").length,
      shipped: orders.filter((order) => order.status === "shipped").length,
      canceled: orders.filter((order) => order.status === "canceled").length,
    };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    const term = search.trim().toLowerCase();

    return orders.filter((order) => {
      const pageMatches =
        pageStatus === "all" ||
        (pageStatus === "history" && isHistoryOrder(order)) ||
        order.status === pageStatus;
      const searchMatches =
        !term ||
        [
          order.id,
          order.platformOrderId,
          order.packageId,
          order.productName,
          order.sku,
          order.buyer,
          order.trackingCode,
        ]
          .join(" ")
          .toLowerCase()
          .includes(term);
      const platformMatches = platform === "Todas" || order.marketplace === platform;
      const shippingMatches =
        shippingMethod === "Todos" || order.shippingMethod === shippingMethod;
      const fiscalMatches =
        fiscalFilter === "Todas" || order.fiscalStatus === fiscalFilter;
      const labelMatches = labelFilter === "Todas" || order.labelStatus === labelFilter;

      return (
        pageMatches &&
        searchMatches &&
        platformMatches &&
        shippingMatches &&
        fiscalMatches &&
        labelMatches
      );
    });
  }, [orders, pageStatus, search, platform, shippingMethod, fiscalFilter, labelFilter]);

  const selectedRows = filteredOrders.filter((order) =>
    selectedOrders.includes(order.id)
  );
  const allSelected =
    filteredOrders.length > 0 &&
    filteredOrders.every((order) => selectedOrders.includes(order.id));
  const platforms = Array.from(new Set(orders.map((order) => order.marketplace))).sort();
  const shippingMethods = Array.from(
    new Set(orders.map((order) => order.shippingMethod))
  ).sort();

  function toggleOrder(orderId) {
    setSelectedOrders((current) =>
      current.includes(orderId)
        ? current.filter((id) => id !== orderId)
        : [...current, orderId]
    );
  }

  function toggleAllOrders() {
    const ids = filteredOrders.map((order) => order.id);

    setSelectedOrders((current) =>
      allSelected
        ? current.filter((id) => !ids.includes(id))
        : Array.from(new Set([...current, ...ids]))
    );
  }

  function advance(orderId) {
    setOrders((current) =>
      current.map((order) => (order.id === orderId ? advanceOrder(order) : order))
    );
  }

  function advanceSelected() {
    setOrders((current) =>
      current.map((order) =>
        selectedOrders.includes(order.id) ? advanceOrder(order) : order
      )
    );
    setSelectedOrders([]);
  }

  function cancelSelected() {
    setOrders((current) =>
      current.map((order) =>
        selectedOrders.includes(order.id)
          ? { ...order, status: "canceled", deadline: "Pedido anulado" }
          : order
      )
    );
    setSelectedOrders([]);
    setPage?.("orders-canceled");
  }

  return (
    <div className="orders-layout">
      <OrdersSidebar activePage={activePage} setPage={setPage} counts={counts} />

      <main className="orders-content">
        <section className="orders-flow-strip" aria-label="Fluxo operacional">
          {workflow.map((stage, index) => (
            <button
              type="button"
              key={stage.status}
              className={
                activePage === stage.page || pageStatus === stage.status ? "active" : ""
              }
              onClick={() => setPage?.(stage.page)}
            >
              <span>{index + 1}</span>
              <strong>{stage.label}</strong>
              <small>
                {counts[stage.status] || 0} {stage.detail}
              </small>
            </button>
          ))}
        </section>

        <section className="orders-panel">
          <div className="orders-toolbar">
            <div className="orders-filter-grid">
              <select>
                <option>N de Pedido / N da Plataforma</option>
                <option>N de Rastreio</option>
                <option>Nome do Destinatario</option>
                <option>Anuncio/SKU</option>
              </select>
              <input
                placeholder="Pesquisar pedidos, SKU, cliente ou rastreio"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
              <select
                value={platform}
                onChange={(event) => setPlatform(event.target.value)}
              >
                <option>Todas</option>
                {platforms.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
              <select
                value={shippingMethod}
                onChange={(event) => setShippingMethod(event.target.value)}
              >
                <option>Todos</option>
                {shippingMethods.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
              <select
                value={fiscalFilter}
                onChange={(event) => setFiscalFilter(event.target.value)}
              >
                <option value="Todas">Todas as Notas</option>
                <option value="pending">Nao Emitidos</option>
                <option value="issued">Emitidos</option>
                <option value="failed">Falha na Emissao</option>
              </select>
              <select
                value={labelFilter}
                onChange={(event) => setLabelFilter(event.target.value)}
              >
                <option value="Todas">Todas as Etiquetas</option>
                <option value="not_printed">Nao Impressa</option>
                <option value="generated">Gerada</option>
                <option value="printed">Impressa</option>
              </select>
            </div>

            <div className="orders-toolbar-actions">
              <button
                type="button"
                onClick={() =>
                  exportCsv(
                    "pedidos-marketplace.csv",
                    filteredOrders.map((order) => ({
                      pedido: order.id,
                      pedido_plataforma: order.platformOrderId,
                      marketplace: order.marketplace,
                      produto: order.productName,
                      sku: order.sku,
                      quantidade: order.quantity,
                      valor: order.value,
                      cliente: order.buyer,
                      envio: order.shippingMethod,
                      rastreio: order.trackingCode,
                      nota: getFiscalLabel(order.fiscalStatus),
                      etiqueta: getLabelStatusText(order.labelStatus),
                      status: statusLabels[order.status],
                    }))
                  )
                }
              >
                Exportar
              </button>
            </div>
          </div>

          <div className="orders-status-tabs">
            {statusTabs.map((item) => (
              <button
                type="button"
                key={item.page}
                className={activePage === item.page ? "active" : ""}
                onClick={() => setPage?.(item.page)}
              >
                {item.label} <span>{counts[item.status] || 0}</span>
              </button>
            ))}
          </div>

          <div className="orders-bulk-row">
            <strong>Selecionado {selectedRows.length}</strong>
            <button
              type="button"
              disabled={selectedRows.length === 0}
              onClick={advanceSelected}
            >
              Avancar Etapa
            </button>
            <button
              type="button"
              disabled={selectedRows.length === 0}
              onClick={cancelSelected}
            >
              Mais Acoes
            </button>
            <span>Ordem</span>
            <small>Total {filteredOrders.length}</small>
          </div>

          <table className="orders-table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAllOrders}
                  />
                </th>
                <th>Produtos</th>
                <th>Valor do Pedido</th>
                <th>Destinatario</th>
                <th>N do Pedido da Plataforma</th>
                <th>Tempo</th>
                <th>Metodos de Envio</th>
                <th>Estado</th>
                <th>Acoes</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedOrders.includes(order.id)}
                      onChange={() => toggleOrder(order.id)}
                    />
                  </td>
                  <td>
                    <div className="order-product-cell">
                      <span className="order-product-thumb">
                        {getInitials(order.productName)}
                      </span>
                      <div>
                        <strong>{order.id}</strong>
                        <a href="#top" onClick={(event) => event.preventDefault()}>
                          {order.packageId}
                        </a>
                        <small>
                          {order.productName} x {order.quantity}
                        </small>
                        <em>{order.sku}</em>
                      </div>
                    </div>
                  </td>
                  <td>
                    <strong>{formatCurrency(order.value)}</strong>
                    <span>{order.marketplace}</span>
                  </td>
                  <td>
                    <strong>{order.buyer}</strong>
                    <span>{order.destination}</span>
                    <small>{order.warehouse}</small>
                  </td>
                  <td>
                    <strong>{order.platformOrderId}</strong>
                    <span>{order.store}</span>
                  </td>
                  <td>
                    <span>Pago {order.paidAt}</span>
                    <span>Arranjada {order.arrangedAt}</span>
                    <strong>{order.deadline}</strong>
                  </td>
                  <td>
                    <strong>{order.shippingMethod}</strong>
                    <span>{order.trackingCode || "Sem rastreio"}</span>
                    <small>{order.deliveryType}</small>
                  </td>
                  <td>
                    <span className={`order-state ${order.status}`}>
                      {statusLabels[order.status]}
                    </span>
                    <span className={`order-doc-state ${order.fiscalStatus}`}>
                      {getFiscalLabel(order.fiscalStatus)}
                    </span>
                    <span className={`order-label-state ${order.labelStatus}`}>
                      {getLabelStatusText(order.labelStatus)}
                    </span>
                  </td>
                  <td>
                    <div className="orders-actions-cell">
                      {order.status !== "shipped" && order.status !== "canceled" && (
                        <button type="button" onClick={() => advance(order.id)}>
                          {getNextActionLabel(order.status)}
                        </button>
                      )}
                      <button type="button">Detalhes</button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan="9">
                    <div className="orders-empty-state">
                      <span />
                      <strong>Nenhum Dado Disponivel</strong>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}

function OrdersSidebar({ activePage, setPage, counts }) {
  return (
    <aside className="orders-sidebar">
      <h2>Pedidos</h2>

      {sidebarGroups.map((group) => (
        <div key={group.title}>
          <strong>{group.title}</strong>
          {group.items.map((item) => (
            <button
              type="button"
              key={item.page}
              className={activePage === item.page ? "active" : ""}
              onClick={() => setPage?.(item.page)}
            >
              {item.label}
              <span>{counts[item.status] || 0}</span>
            </button>
          ))}
        </div>
      ))}
    </aside>
  );
}
