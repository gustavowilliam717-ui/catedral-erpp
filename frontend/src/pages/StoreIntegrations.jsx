import { useEffect, useMemo, useState } from "react";
import API from "../services/api";

const marketplaces = [
  "Mercado Livre",
  "Shopee",
  "Amazon",
  "Shein",
  "TikTok Shop",
  "Shopify",
  "Nuvemshop",
  "Temu",
  "Walmart",
  "AliExpress",
  "Magalu",
  "Kwai",
  "Americanas",
  "Loja Fisica",
];

const emptyForm = {
  marketplace: "Shopee",
  store_name: "",
  country: "BR",
  shop_id: "",
  status: "Pendente",
  auth_date: "",
  notes: "",
};

export default function StoreIntegrations() {
  const [integrations, setIntegrations] = useState([]);
  const [selectedMarketplace, setSelectedMarketplace] = useState("Shopee");
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadIntegrations();
  }, []);

  async function loadIntegrations() {
    const response = await API.get("/store-integrations");
    setIntegrations(response.data || []);
  }

  function update(field, value) {
    setForm({ ...form, [field]: value });
  }

  async function saveIntegration(event) {
    event.preventDefault();

    if (!form.store_name.trim()) {
      setMessage("Informe o nome da loja.");
      return;
    }

    if (editingId) {
      await API.put(`/store-integrations/${editingId}`, form);
      setMessage("Loja atualizada.");
    } else {
      await API.post("/store-integrations", form);
      setMessage("Loja adicionada.");
    }

    setForm({ ...emptyForm, marketplace: selectedMarketplace });
    setEditingId(null);
    setShowForm(false);
    loadIntegrations();
  }

  function editIntegration(integration) {
    setEditingId(integration.id);
    setForm({
      marketplace: integration.marketplace || "Shopee",
      store_name: integration.store_name || "",
      country: integration.country || "BR",
      shop_id: integration.shop_id || "",
      status: integration.status || "Pendente",
      auth_date: integration.auth_date || "",
      notes: integration.notes || "",
    });
    setShowForm(true);
  }

  async function deleteIntegration(id) {
    if (!window.confirm("Deseja remover esta loja integrada?")) return;

    await API.delete(`/store-integrations/${id}`);
    setMessage("Loja removida.");
    loadIntegrations();
  }

  function startNewIntegration() {
    setEditingId(null);
    setForm({ ...emptyForm, marketplace: selectedMarketplace });
    setShowForm(true);
    setMessage("");
  }

  const marketplaceCounts = useMemo(() => {
    return marketplaces.reduce((acc, marketplace) => {
      acc[marketplace] = integrations.filter(
        (item) => item.marketplace === marketplace
      ).length;
      return acc;
    }, {});
  }, [integrations]);

  const filteredIntegrations = integrations.filter((item) => {
    const term = search.toLowerCase();
    const marketplaceMatch =
      selectedMarketplace === "Todas" || item.marketplace === selectedMarketplace;
    const searchMatch =
      item.store_name?.toLowerCase().includes(term) ||
      item.shop_id?.toLowerCase().includes(term) ||
      item.status?.toLowerCase().includes(term);

    return marketplaceMatch && searchMatch;
  });

  return (
    <div className="integrations-page">
      <aside className="integration-sidebar">
        <h2>Integracoes</h2>
        <button
          type="button"
          className={selectedMarketplace === "Todas" ? "active" : ""}
          onClick={() => setSelectedMarketplace("Todas")}
        >
          <span>Todas</span>
          <strong>{integrations.length}</strong>
        </button>

        {marketplaces.map((marketplace) => (
          <button
            type="button"
            key={marketplace}
            className={selectedMarketplace === marketplace ? "active" : ""}
            onClick={() => setSelectedMarketplace(marketplace)}
          >
            <span>{marketplace}</span>
            <strong>{marketplaceCounts[marketplace] || 0}</strong>
          </button>
        ))}
      </aside>

      <main className="integration-content">
        <section className="integration-header-card">
          <div>
            <span className="section-kicker">{selectedMarketplace}</span>
            <h1>Lojas conectadas</h1>
            <p>
              Cadastre as lojas que serao conectadas ao ERP. Quando a API estiver
              autorizada, cada loja podera sincronizar produtos, pedidos, estoque
              e financeiro.
            </p>
          </div>

          <button type="button" onClick={startNewIntegration}>
            + Conectar loja
          </button>
        </section>

        <section className="integration-toolbar">
          <select
            value={selectedMarketplace}
            onChange={(event) => setSelectedMarketplace(event.target.value)}
          >
            <option>Todas</option>
            {marketplaces.map((marketplace) => (
              <option key={marketplace}>{marketplace}</option>
            ))}
          </select>

          <input
            placeholder="Nome da sua loja, Shop ID ou status"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </section>

        {showForm && (
          <section className="box integration-form-card">
            <div className="section-heading">
              <div>
                <span className="section-kicker">
                  {editingId ? "Editar loja" : "Nova loja"}
                </span>
                <h2>{editingId ? "Atualizar integracao" : "Conectar loja"}</h2>
              </div>
              <button type="button" onClick={() => setShowForm(false)}>
                Fechar
              </button>
            </div>

            <form className="integration-form-grid" onSubmit={saveIntegration}>
              <select
                value={form.marketplace}
                onChange={(event) => update("marketplace", event.target.value)}
              >
                {marketplaces.map((marketplace) => (
                  <option key={marketplace}>{marketplace}</option>
                ))}
              </select>
              <input
                placeholder="Nome da loja"
                value={form.store_name}
                onChange={(event) => update("store_name", event.target.value)}
              />
              <input
                placeholder="Pais"
                value={form.country}
                onChange={(event) => update("country", event.target.value)}
              />
              <input
                placeholder="ID da loja / Shop ID"
                value={form.shop_id}
                onChange={(event) => update("shop_id", event.target.value)}
              />
              <select
                value={form.status}
                onChange={(event) => update("status", event.target.value)}
              >
                <option>Ativo</option>
                <option>Pendente</option>
                <option>Expirado</option>
                <option>Erro</option>
              </select>
              <input
                placeholder="Data de autenticacao"
                value={form.auth_date}
                onChange={(event) => update("auth_date", event.target.value)}
              />
              <input
                placeholder="Observacoes"
                value={form.notes}
                onChange={(event) => update("notes", event.target.value)}
              />
              <button type="submit">
                {editingId ? "Salvar alteracoes" : "Adicionar loja"}
              </button>
            </form>
          </section>
        )}

        <section className="box integration-table-card">
          <div className="section-heading">
            <h2>{selectedMarketplace} - Integracoes de loja</h2>
            {message && <strong className="bulk-message">{message}</strong>}
          </div>

          <table>
            <thead>
              <tr>
                <th>Nome da sua loja</th>
                <th>Marketplace</th>
                <th>Site</th>
                <th>ID da loja</th>
                <th>Status</th>
                <th>Autenticacao</th>
                <th>Acoes</th>
              </tr>
            </thead>

            <tbody>
              {filteredIntegrations.map((integration) => (
                <tr key={integration.id}>
                  <td>{integration.store_name}</td>
                  <td>{integration.marketplace}</td>
                  <td>{integration.country || "BR"}</td>
                  <td>{integration.shop_id || "-"}</td>
                  <td>
                    <span
                      className={`integration-status ${String(
                        integration.status || ""
                      ).toLowerCase()}`}
                    >
                      {integration.status}
                    </span>
                  </td>
                  <td>{integration.auth_date || "-"}</td>
                  <td>
                    <button type="button" onClick={() => editIntegration(integration)}>
                      Editar
                    </button>
                    <button
                      type="button"
                      className="danger"
                      onClick={() => deleteIntegration(integration.id)}
                    >
                      Remover
                    </button>
                  </td>
                </tr>
              ))}

              {filteredIntegrations.length === 0 && (
                <tr>
                  <td colSpan="7">Nenhuma loja cadastrada para este filtro.</td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}
