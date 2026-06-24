import { useEffect, useMemo, useState } from "react";
import API from "../services/api";
import { logError } from "../utils/logger";

const statusPages = {
  "purchase-orders": "all",
  "purchase-orders-to-purchase": "to_purchase",
  "purchase-orders-in-transit": "in_transit",
  "purchase-orders-partial": "partial",
  "purchase-orders-completed": "completed",
  "purchase-orders-canceled": "canceled",
};

const statusLabels = {
  to_purchase: "Para Comprar",
  in_transit: "Em Transito",
  partial: "Parcial",
  completed: "Completado",
  canceled: "Cancelado",
};

const orderStatusTabs = [
  { page: "purchase-orders", label: "Tudo", status: "all" },
  { page: "purchase-orders-to-purchase", label: "Para Comprar", status: "to_purchase" },
  { page: "purchase-orders-in-transit", label: "Em Transito", status: "in_transit" },
  { page: "purchase-orders-partial", label: "Parcial", status: "partial" },
  { page: "purchase-orders-completed", label: "Completado", status: "completed" },
  { page: "purchase-orders-canceled", label: "Cancelado", status: "canceled" },
];

const purchaseSidebarGroups = [
  {
    title: "Controle de Compras",
    items: [
      { page: "purchase-suggestions", label: "Sugestao de Compras" },
      { page: "purchase-orders", label: "Pedidos de Compras" },
    ],
  },
  {
    title: "Pedidos de Compras",
    items: orderStatusTabs,
  },
  {
    title: "Gestao de Fornecedores",
    items: [
      { page: "suppliers", label: "Fornecedores" },
      { page: "supplier-relations", label: "Gerenciamento de Fornecedores" },
    ],
  },
  {
    title: "NF-e de Compra",
    items: [{ page: "purchase-nfe-brasil", label: "Brasil NF-e" }],
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

function todayLabel() {
  return new Date().toLocaleDateString("pt-BR");
}

function getSupplierName(product) {
  return product.supplier?.trim() || "Fornecedor nao definido";
}

function getSuggestedQty(product) {
  const stock = Number(product.stock || 0);
  const minimum = Number(product.minimum_stock || 0);
  const target = Math.max(minimum * 3, 20);
  return Math.max(target - stock, 0);
}

function getSuggestionPriority(product) {
  const stock = Number(product.stock || 0);
  const minimum = Number(product.minimum_stock || 0);

  if (stock <= 0) return "Critico";
  if (stock <= minimum) return "Alto";
  return "Normal";
}

export default function Purchases({ activePage = "purchase-suggestions", setPage }) {
  const [products, setProducts] = useState([]);
  const [selectedSuggestions, setSelectedSuggestions] = useState([]);
  const [dismissedSuggestions, setDismissedSuggestions] = useState([]);
  const [orders, setOrders] = useState([]);
  const [supplierSearch, setSupplierSearch] = useState("");
  const [newSupplier, setNewSupplier] = useState({
    name: "",
    taxId: "",
    contact: "",
    phone: "",
    notes: "",
  });
  const [manualSuppliers, setManualSuppliers] = useState([]);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      const response = await API.get("/products");
      setProducts(response.data || []);
    } catch (error) {
      logError(error);
    }
  }

  const suggestions = useMemo(() => {
    return products
      .map((product) => {
        const suggestedQty = getSuggestedQty(product);
        const avgSales = Math.max(1, Math.round(Number(product.stock || 0) / 8));
        const unitCost = Number(product.cost || 0);

        return {
          ...product,
          suggestedQty,
          priority: getSuggestionPriority(product),
          supplierName: getSupplierName(product),
          avgSales,
          purchaseValue: suggestedQty * unitCost,
        };
      })
      .filter((product) => product.suggestedQty > 0)
      .filter((product) => !dismissedSuggestions.includes(product.id));
  }, [products, dismissedSuggestions]);

  const suppliers = useMemo(() => {
    const productSuppliers = products
      .filter((product) => product.supplier?.trim())
      .reduce((map, product) => {
        const name = product.supplier.trim();
        const current = map.get(name) || {
          name,
          taxId: "-",
          contact: "-",
          phone: "-",
          notes: "Fornecedor vindo do cadastro de produtos",
          skus: 0,
          updatedAt: todayLabel(),
        };

        current.skus += 1;
        map.set(name, current);
        return map;
      }, new Map());

    return [...productSuppliers.values(), ...manualSuppliers];
  }, [products, manualSuppliers]);

  const orderCounts = useMemo(() => {
    return orderStatusTabs.reduce((acc, item) => {
      acc[item.status] =
        item.status === "all"
          ? orders.length
          : orders.filter((order) => order.status === item.status).length;
      return acc;
    }, {});
  }, [orders]);

  function toggleSuggestion(id) {
    setSelectedSuggestions((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  }

  function toggleAllSuggestions(filteredSuggestions) {
    const ids = filteredSuggestions.map((item) => item.id);
    const allSelected = ids.length > 0 && ids.every((id) => selectedSuggestions.includes(id));

    setSelectedSuggestions((current) =>
      allSelected
        ? current.filter((id) => !ids.includes(id))
        : Array.from(new Set([...current, ...ids]))
    );
  }

  function createPurchaseOrders(selectedRows) {
    if (selectedRows.length === 0) return;

    const newOrders = selectedRows.map((product) => ({
      id: `PC-${Date.now()}-${product.id}`,
      sku: product.sku,
      productName: product.name,
      supplier: product.supplierName,
      qty: product.suggestedQty,
      receivedQty: 0,
      unitCost: Number(product.cost || 0),
      total: Number(product.cost || 0) * product.suggestedQty,
      tracking: "-",
      status: "to_purchase",
      notes: "Pedido criado a partir da sugestao de reposicao",
      createdAt: todayLabel(),
    }));

    setOrders((current) => [...newOrders, ...current]);
    setDismissedSuggestions((current) =>
      Array.from(new Set([...current, ...selectedRows.map((item) => item.id)]))
    );
    setSelectedSuggestions([]);
    setPage?.("purchase-orders-to-purchase");
  }

  function changeOrderStatus(orderId, status) {
    setOrders((current) =>
      current.map((order) =>
        order.id === orderId ? { ...order, status } : order
      )
    );
  }

  function addSupplier(event) {
    event.preventDefault();

    if (!newSupplier.name.trim()) return;

    setManualSuppliers((current) => [
      {
        ...newSupplier,
        name: newSupplier.name.trim(),
        skus: 0,
        updatedAt: todayLabel(),
      },
      ...current,
    ]);
    setNewSupplier({ name: "", taxId: "", contact: "", phone: "", notes: "" });
  }

  return (
    <div className="purchase-layout">
      <PurchaseSidebar
        activePage={activePage}
        setPage={setPage}
        orderCounts={orderCounts}
      />

      <main className="purchase-content">
        {activePage === "purchase-suggestions" && (
          <PurchaseSuggestions
            suggestions={suggestions}
            selectedSuggestions={selectedSuggestions}
            toggleSuggestion={toggleSuggestion}
            toggleAllSuggestions={toggleAllSuggestions}
            createPurchaseOrders={createPurchaseOrders}
            setPage={setPage}
            dismissSuggestions={(ids) => {
              setDismissedSuggestions((current) => Array.from(new Set([...current, ...ids])));
              setSelectedSuggestions([]);
            }}
          />
        )}

        {activePage.startsWith("purchase-orders") && (
          <PurchaseOrders
            activePage={activePage}
            orders={orders}
            setPage={setPage}
            changeOrderStatus={changeOrderStatus}
            orderCounts={orderCounts}
          />
        )}

        {activePage === "suppliers" && (
          <Suppliers
            suppliers={suppliers}
            search={supplierSearch}
            setSearch={setSupplierSearch}
            newSupplier={newSupplier}
            setNewSupplier={setNewSupplier}
            addSupplier={addSupplier}
          />
        )}

        {activePage === "supplier-relations" && (
          <SupplierRelations
            products={products}
            suppliers={suppliers}
            setPage={setPage}
          />
        )}

        {activePage === "purchase-nfe-brasil" && <PurchaseNfe />}
      </main>
    </div>
  );
}

function PurchaseSidebar({ activePage, setPage, orderCounts }) {
  return (
    <aside className="purchase-sidebar">
      <h2>Controle de Compras</h2>

      {purchaseSidebarGroups.map((group) => (
        <div key={group.title}>
          <strong>{group.title}</strong>
          {group.items.map((item) => {
            const count =
              item.status && orderCounts[item.status] !== undefined
                ? orderCounts[item.status]
                : "";

            return (
              <button
                type="button"
                key={item.page}
                className={activePage === item.page ? "active" : ""}
                onClick={() => setPage?.(item.page)}
              >
                {item.label}
                {count !== "" && <span>{count}</span>}
              </button>
            );
          })}
        </div>
      ))}
    </aside>
  );
}

function PurchaseSuggestions({
  suggestions,
  selectedSuggestions,
  toggleSuggestion,
  toggleAllSuggestions,
  createPurchaseOrders,
  setPage,
  dismissSuggestions,
}) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todas");
  const [supplier, setSupplier] = useState("Todos");
  const [stockFilter, setStockFilter] = useState("Todos");

  const categories = ["Todas", ...Array.from(new Set(suggestions.map((item) => item.category || "Sem categoria")))];
  const suppliers = ["Todos", ...Array.from(new Set(suggestions.map((item) => item.supplierName)))];

  const filteredSuggestions = suggestions.filter((item) => {
    const term = search.toLowerCase();
    const matchesSearch = [item.sku, item.name, item.supplierName]
      .join(" ")
      .toLowerCase()
      .includes(term);
    const matchesCategory = category === "Todas" || (item.category || "Sem categoria") === category;
    const matchesSupplier = supplier === "Todos" || item.supplierName === supplier;
    const matchesStock =
      stockFilter === "Todos" ||
      (stockFilter === "Sem Estoque" && Number(item.stock || 0) <= Number(item.minimum_stock || 0)) ||
      (stockFilter === "Fornecedor ausente" && item.supplierName === "Fornecedor nao definido");

    return matchesSearch && matchesCategory && matchesSupplier && matchesStock;
  });

  const selectedRows = filteredSuggestions.filter((item) =>
    selectedSuggestions.includes(item.id)
  );
  const allSelected =
    filteredSuggestions.length > 0 &&
    filteredSuggestions.every((item) => selectedSuggestions.includes(item.id));

  return (
    <section className="purchase-panel">
      <div className="purchase-toolbar">
        <div className="purchase-filter-grid">
          <select>
            <option>SKU</option>
            <option>Nome do Produto</option>
            <option>Fornecedor</option>
          </select>
          <input
            placeholder="Clique no botao esquerdo para pesquisar SKU ou produto"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <select value={category} onChange={(event) => setCategory(event.target.value)}>
            {categories.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
          <select value={supplier} onChange={(event) => setSupplier(event.target.value)}>
            {suppliers.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
          <select value={stockFilter} onChange={(event) => setStockFilter(event.target.value)}>
            <option>Todos</option>
            <option>Sem Estoque</option>
            <option>Fornecedor ausente</option>
          </select>
        </div>

        <div className="purchase-toolbar-actions">
          <button
            type="button"
            disabled={filteredSuggestions.length === 0}
            onClick={() =>
              exportCsv(
                "sugestoes-de-compras.csv",
                filteredSuggestions.map((item) => ({
                  sku: item.sku,
                  produto: item.name,
                  fornecedor: item.supplierName,
                  estoque_atual: item.stock,
                  estoque_minimo: item.minimum_stock,
                  quantidade_sugerida: item.suggestedQty,
                  valor_previsto: item.purchaseValue,
                }))
              )
            }
          >
            Exportar
          </button>
          <button type="button" onClick={() => setPage?.("stock-reposition-rules")}>
            Regras de Reposicao
          </button>
        </div>
      </div>

      <div className="purchase-tabs">
        <button type="button" className="active">Tudo</button>
        <button type="button">Sugestoes de Compras <span>{filteredSuggestions.length}</span></button>
        <button type="button">Descartar Sugestoes <span>0</span></button>
      </div>

      <div className="purchase-bulk-row">
        <strong>Selecionado {selectedRows.length}</strong>
        <button
          type="button"
          disabled={selectedRows.length === 0}
          onClick={() => createPurchaseOrders(selectedRows)}
        >
          Criar Pedidos de Compras
        </button>
        <button type="button" onClick={() => setStockFilter("Todos")}>Recalcular</button>
        <button
          type="button"
          disabled={selectedRows.length === 0}
          onClick={() => dismissSuggestions(selectedRows.map((item) => item.id))}
        >
          Mais Acoes
        </button>
        <span>Ordem</span>
        <small>Total {filteredSuggestions.length}</small>
      </div>

      <table className="purchase-table">
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                checked={allSelected}
                onChange={() => toggleAllSuggestions(filteredSuggestions)}
              />
            </th>
            <th>SKU</th>
            <th>Fornecedores/Armazem</th>
            <th>Qtd. Sugerida</th>
            <th>Vendas Totais 17/15/30/90 Dias</th>
            <th>Media de Venda 17/15/30/90 Dias</th>
            <th>Prioridade</th>
            <th>Valor Previsto</th>
          </tr>
        </thead>
        <tbody>
          {filteredSuggestions.map((item) => (
            <tr key={item.id}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedSuggestions.includes(item.id)}
                  onChange={() => toggleSuggestion(item.id)}
                />
              </td>
              <td>
                <div className="purchase-sku-cell">
                  <strong>{item.sku || "-"}</strong>
                  <span>{item.name || "Produto sem nome"}</span>
                  <small>{item.category || "Sem categoria"}</small>
                </div>
              </td>
              <td>
                <strong>{item.supplierName}</strong>
                <span>{item.marketplace || "Marketplace nao definido"}</span>
              </td>
              <td>
                <strong>{item.suggestedQty}</strong>
                <span>Atual: {item.stock || 0} | Min: {item.minimum_stock || 0}</span>
              </td>
              <td>{item.avgSales * 17}/{item.avgSales * 15}/{item.avgSales * 30}/{item.avgSales * 90}</td>
              <td>{item.avgSales}/{item.avgSales}/{item.avgSales}/{item.avgSales}</td>
              <td>
                <span className={`purchase-priority ${item.priority.toLowerCase()}`}>
                  {item.priority}
                </span>
              </td>
              <td>{formatCurrency(item.purchaseValue)}</td>
            </tr>
          ))}

          {filteredSuggestions.length === 0 && (
            <tr>
              <td colSpan="8">
                <EmptyPurchaseState text="Nenhuma sugestao de compra para estes filtros." />
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
}

function PurchaseOrders({ activePage, orders, setPage, changeOrderStatus, orderCounts }) {
  const [search, setSearch] = useState("");
  const [warehouse, setWarehouse] = useState("Todos Armazens");
  const [selectedOrders, setSelectedOrders] = useState([]);
  const status = statusPages[activePage] || "all";
  const filteredOrders = orders.filter((order) => {
    const matchesStatus = status === "all" || order.status === status;
    const matchesSearch = [order.id, order.sku, order.productName, order.supplier]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase());

    return matchesStatus && matchesSearch;
  });
  const selectedRows = filteredOrders.filter((order) => selectedOrders.includes(order.id));
  const allSelected =
    filteredOrders.length > 0 &&
    filteredOrders.every((order) => selectedOrders.includes(order.id));

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

  function bulkChangeStatus(nextStatus) {
    selectedRows.forEach((order) => changeOrderStatus(order.id, nextStatus));
    setSelectedOrders([]);
    const targetPage = orderStatusTabs.find((item) => item.status === nextStatus)?.page;
    if (targetPage) setPage?.(targetPage);
  }

  return (
    <section className="purchase-panel">
      <div className="purchase-toolbar">
        <div className="purchase-filter-grid orders">
          <select>
            <option>N de Compras</option>
            <option>SKU</option>
            <option>Fornecedor</option>
          </select>
          <input
            placeholder="Pesquisar pedido, SKU ou fornecedor"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <select>
            <option>Data de Criacao</option>
            <option>Data de Compra</option>
          </select>
          <input placeholder="Filtrar por data" />
          <select value={warehouse} onChange={(event) => setWarehouse(event.target.value)}>
            <option>Todos Armazens</option>
            <option>Catedral MDF</option>
            <option>PINK</option>
          </select>
        </div>

        <div className="purchase-toolbar-actions">
          <button
            type="button"
            disabled={filteredOrders.length === 0}
            onClick={() =>
              exportCsv(
                "pedidos-de-compras.csv",
                filteredOrders.map((order) => ({
                  pedido: order.id,
                  sku: order.sku,
                  produto: order.productName,
                  fornecedor: order.supplier,
                  quantidade: order.qty,
                  recebido: order.receivedQty,
                  total: order.total,
                  status: statusLabels[order.status],
                }))
              )
            }
          >
            Importar & Exportar
          </button>
        </div>
      </div>

      <div className="purchase-status-tabs">
        {orderStatusTabs.map((item) => (
          <button
            type="button"
            key={item.page}
            className={activePage === item.page ? "active" : ""}
            onClick={() => setPage?.(item.page)}
          >
            {item.label} <span>{orderCounts[item.status] || 0}</span>
          </button>
        ))}
      </div>

      <div className="purchase-bulk-row">
        <strong>Selecionado {selectedRows.length}</strong>
        {status === "partial" && (
          <button
            type="button"
            disabled={selectedRows.length === 0}
            onClick={() => bulkChangeStatus("completed")}
          >
            Marcar como Concluido
          </button>
        )}
        {status === "to_purchase" && (
          <button
            type="button"
            disabled={selectedRows.length === 0}
            onClick={() => bulkChangeStatus("in_transit")}
          >
            Compras
          </button>
        )}
        <button
          type="button"
          disabled={selectedRows.length === 0}
          onClick={() => bulkChangeStatus("canceled")}
        >
          Mais Acoes
        </button>
        <span>Ordem</span>
        <small>Total {filteredOrders.length}</small>
      </div>

      <table className="purchase-table">
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleAllOrders}
              />
            </th>
            <th>Informacao do SKU</th>
            <th>Valor Total</th>
            <th>N de Rastreio</th>
            <th>Qtd. Comprada</th>
            <th>Recebido/Comprado</th>
            <th>Tempo</th>
            <th>Estado</th>
            <th>Notas de Compras</th>
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
                <div className="purchase-sku-cell">
                  <strong>{order.sku || "-"}</strong>
                  <span>{order.productName}</span>
                  <small>{order.supplier}</small>
                </div>
              </td>
              <td>{formatCurrency(order.total)}</td>
              <td>{order.tracking}</td>
              <td>{order.qty}</td>
              <td>{order.receivedQty}/{order.qty}</td>
              <td>{order.createdAt}</td>
              <td>
                <span className={`purchase-order-state ${order.status}`}>
                  {statusLabels[order.status]}
                </span>
              </td>
              <td>{order.notes}</td>
              <td>
                <select
                  value={order.status}
                  onChange={(event) => changeOrderStatus(order.id, event.target.value)}
                >
                  <option value="to_purchase">Para Comprar</option>
                  <option value="in_transit">Em Transito</option>
                  <option value="partial">Parcial</option>
                  <option value="completed">Completado</option>
                  <option value="canceled">Cancelado</option>
                </select>
              </td>
            </tr>
          ))}

          {filteredOrders.length === 0 && (
            <tr>
              <td colSpan="10">
                <EmptyPurchaseState text="Nenhum Dado Disponivel" />
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
}

function Suppliers({
  suppliers,
  search,
  setSearch,
  newSupplier,
  setNewSupplier,
  addSupplier,
}) {
  const filteredSuppliers = suppliers.filter((supplier) =>
    [supplier.name, supplier.taxId, supplier.contact, supplier.phone]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <section className="purchase-panel">
      <div className="purchase-toolbar">
        <div className="purchase-filter-grid supplier-search">
          <select>
            <option>Nome de Empresa</option>
            <option>Tributacao</option>
            <option>Telefone</option>
          </select>
          <input
            placeholder="Pesquisar fornecedores"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div className="purchase-toolbar-actions">
          <button type="submit" form="supplier-form">+ Adicionar Fornecedores</button>
        </div>
      </div>

      <form id="supplier-form" className="supplier-inline-form" onSubmit={addSupplier}>
        <input
          placeholder="Nome da empresa"
          value={newSupplier.name}
          onChange={(event) => setNewSupplier({ ...newSupplier, name: event.target.value })}
        />
        <input
          placeholder="Tributacao / CNPJ"
          value={newSupplier.taxId}
          onChange={(event) => setNewSupplier({ ...newSupplier, taxId: event.target.value })}
        />
        <input
          placeholder="Contato"
          value={newSupplier.contact}
          onChange={(event) => setNewSupplier({ ...newSupplier, contact: event.target.value })}
        />
        <input
          placeholder="Telefone"
          value={newSupplier.phone}
          onChange={(event) => setNewSupplier({ ...newSupplier, phone: event.target.value })}
        />
        <input
          placeholder="Observacoes"
          value={newSupplier.notes}
          onChange={(event) => setNewSupplier({ ...newSupplier, notes: event.target.value })}
        />
      </form>

      <table className="purchase-table">
        <thead>
          <tr>
            <th>Nome de Empresa</th>
            <th>Tributacao</th>
            <th>Contatos</th>
            <th>Telefone</th>
            <th>Observacoes</th>
            <th>Criado/Atualizado</th>
            <th>Acoes</th>
          </tr>
        </thead>
        <tbody>
          {filteredSuppliers.map((supplier) => (
            <tr key={`${supplier.name}-${supplier.phone}`}>
              <td>{supplier.name}</td>
              <td>{supplier.taxId || "-"}</td>
              <td>{supplier.contact || "-"}</td>
              <td>{supplier.phone || "-"}</td>
              <td>{supplier.notes || "-"}</td>
              <td>{supplier.updatedAt}</td>
              <td>
                <button type="button">Editar</button>
                <button type="button">Mais</button>
              </td>
            </tr>
          ))}

          {filteredSuppliers.length === 0 && (
            <tr>
              <td colSpan="7">
                <EmptyPurchaseState text="Nenhum Dado Disponivel" />
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
}

function SupplierRelations({ products, suppliers, setPage }) {
  const [search, setSearch] = useState("");
  const [supplierFilter, setSupplierFilter] = useState("Todos");
  const supplierNames = ["Todos", ...suppliers.map((supplier) => supplier.name)];
  const rows = products.filter((product) => {
    const supplier = getSupplierName(product);
    const matchesSearch = [product.sku, product.name, supplier]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesSupplier = supplierFilter === "Todos" || supplier === supplierFilter;

    return matchesSearch && matchesSupplier;
  });

  return (
    <section className="purchase-panel">
      <div className="supplier-relation-notice">
        <span>i</span>
        <p>
          Mostrar apenas SKUs vinculados a fornecedores. Va para Produtos para
          adicionar fornecedores a outros SKUs.
        </p>
        <button type="button" onClick={() => setPage?.("products")}>
          Gerenciamento de Produtos
        </button>
      </div>

      <div className="purchase-toolbar">
        <div className="purchase-filter-grid supplier-relations">
          <select>
            <option>SKU</option>
            <option>Nome do Produto</option>
          </select>
          <input
            placeholder="Clique no botao esquerdo para pesquisa"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <select value={supplierFilter} onChange={(event) => setSupplierFilter(event.target.value)}>
            {supplierNames.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>

        <div className="purchase-toolbar-actions">
          <button
            type="button"
            disabled={rows.length === 0}
            onClick={() =>
              exportCsv(
                "fornecedores-por-sku.csv",
                rows.map((product) => ({
                  sku: product.sku,
                  produto: product.name,
                  fornecedor: getSupplierName(product),
                  ultimo_preco: product.cost,
                  marketplace: product.marketplace,
                }))
              )
            }
          >
            Exportar
          </button>
          <button type="button" onClick={() => setPage?.("products")}>
            Gerenciamento de Produtos
          </button>
        </div>
      </div>

      <div className="purchase-bulk-row">
        <strong>Selecionado 0</strong>
        <button type="button" onClick={() => setPage?.("suppliers")}>
          Adicionar Fornecedores
        </button>
        <button type="button">Mais Acoes</button>
        <span>Ordem</span>
        <small>Total {rows.length}</small>
      </div>

      <table className="purchase-table">
        <thead>
          <tr>
            <th><input type="checkbox" /></th>
            <th>SKU</th>
            <th>Nome do Produto</th>
            <th>Fornecedores</th>
            <th>Fornecedor Padrao</th>
            <th>Ultimo Preco</th>
            <th>Ultima Data de Compra</th>
            <th>Acoes</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((product) => (
            <tr key={product.id}>
              <td><input type="checkbox" /></td>
              <td>{product.sku || "-"}</td>
              <td>{product.name || "Produto sem nome"}</td>
              <td>{getSupplierName(product)}</td>
              <td>{getSupplierName(product)}</td>
              <td>{formatCurrency(product.cost)}</td>
              <td>-</td>
              <td>
                <button type="button">Editar</button>
                <button type="button">Mais</button>
              </td>
            </tr>
          ))}

          {rows.length === 0 && (
            <tr>
              <td colSpan="8">
                <EmptyPurchaseState text="Nenhum Dado Disponivel" />
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
}

function PurchaseNfe() {
  return (
    <section className="purchase-panel">
      <div className="purchase-toolbar">
        <div className="purchase-filter-grid supplier-search">
          <select>
            <option>Chave</option>
            <option>Fornecedor</option>
            <option>N da NF-e</option>
          </select>
          <input placeholder="Pesquisar notas fiscais de compra" />
          <select>
            <option>Todos Estados</option>
            <option>Processando</option>
            <option>Falhou</option>
            <option>Processada</option>
          </select>
        </div>
      </div>

      <div className="purchase-tabs">
        <button type="button" className="active">Processando <span>0</span></button>
        <button type="button">Falhou <span>0</span></button>
        <button type="button">Processada <span>0</span></button>
      </div>

      <table className="purchase-table">
        <thead>
          <tr>
            <th><input type="checkbox" /></th>
            <th>Chave da Nota Fiscal</th>
            <th>Informacoes</th>
            <th>Fornecedor</th>
            <th>Valor</th>
            <th>Estado</th>
            <th>Acoes</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan="7">
              <EmptyPurchaseState text="Nenhum Dado Disponivel" />
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  );
}

function EmptyPurchaseState({ text }) {
  return (
    <div className="purchase-empty-state">
      <span />
      <strong>{text}</strong>
    </div>
  );
}
