import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import axios from 'axios';
import './style.css';

const API = import.meta.env.VITE_API_URL;

function App() {
  const [dashboard, setDashboard] = useState({});
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    sku: '',
    name: '',
    cost: '',
    sale_price: '',
    stock: '',
    marketplace: 'Shopee'
  });

  const [pricing, setPricing] = useState({
    cost: '',
    desired_profit_percent: 15,
    marketplace_fee_percent: 18,
    freight_percent: 4,
    anticipation_percent: 3.5,
    fixed_cost_percent: 0
  });

  const [priceResult, setPriceResult] = useState(null);

  async function loadData() {
    const dash = await axios.get(${API}/dashboard);
    const prods = await axios.get(${API}/products);
    setDashboard(dash.data);
    setProducts(prods.data);
  }

  useEffect(() => {
    loadData();
  }, []);

  async function createProduct(e) {
    e.preventDefault();

    await axios.post(${API}/products, {
      ...form,
      cost: Number(form.cost),
      sale_price: Number(form.sale_price),
      stock: Number(form.stock)
    });

    setForm({ sku: '', name: '', cost: '', sale_price: '', stock: '', marketplace: 'Shopee' });
    loadData();
  }

  async function deleteProduct(id) {
    if (!confirm('Deseja excluir este produto?')) return;

    await axios.delete(${API}/products/${id});
    loadData();
  }

  async function simulatePrice(e) {
    e.preventDefault();

    const response = await axios.post(${API}/pricing/simulate, {
      ...pricing,
      cost: Number(pricing.cost)
    });

    setPriceResult(response.data);
  }

  return (
    <div className="container">
      <h1>Catedral ERP</h1>
      <p className="subtitle">Controle de produtos, estoque, custos e precificação para marketplaces.</p>

      <div className="cards">
        <div className="card"><strong>Produtos</strong><span>{dashboard.total_products || 0}</span></div>
        <div className="card"><strong>Valor em estoque</strong><span>R$ {dashboard.total_stock_value || 0}</span></div>
        <div className="card"><strong>Despesas mensais</strong><span>R$ {dashboard.monthly_expenses || 0}</span></div>
      </div>

      <section>
        <h2>Calculadora de preço</h2>
        <form onSubmit={simulatePrice} className="grid">
          <input placeholder="Custo do produto" value={pricing.cost} onChange={e => setPricing({...pricing, cost: e.target.value})} />
          <input placeholder="Lucro desejado %" value={pricing.desired_profit_percent} onChange={e => setPricing({...pricing, desired_profit_percent: Number(e.target.value)})} />
          <input placeholder="Taxa marketplace %" value={pricing.marketplace_fee_percent} onChange={e => setPricing({...pricing, marketplace_fee_percent: Number(e.target.value)})} />
          <input placeholder="Frete %" value={pricing.freight_percent} onChange={e => setPricing({...pricing, freight_percent: Number(e.target.value)})} />
          <button>Simular preço</button>
        </form>

        {priceResult && (
          <div className="result">
            Preço sugerido: <strong>R$ {priceResult.suggested_price}</strong>
          </div>
        )}
      </section>

      <section>
        <h2>Cadastrar produto</h2>
        <form onSubmit={createProduct} className="grid">
          <input placeholder="SKU" value={form.sku} onChange={e => setForm({...form, sku: e.target.value})} />
          <input placeholder="Nome do produto" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
          <input placeholder="Custo" value={form.cost} onChange={e => setForm({...form, cost: e.target.value})} />
          <input placeholder="Preço venda" value={form.sale_price} onChange={e => setForm({...form, sale_price: e.target.value})} />
          <input placeholder="Estoque" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} />
          <button>Cadastrar</button>
        </form>
      </section>

      <section>
        <h2>Produtos cadastrados</h2>
        <table>
          <thead>
            <tr>
              <th>SKU</th>
              <th>Produto</th>
              <th>Custo</th>
              <th>Venda</th>
              <th>Estoque</th>
              <th>Marketplace</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {products.map(p => (
              <tr key={p.id}>
                <td>{p.sku}</td>
                <td>{p.name}</td>
                <td>R$ {p.cost}</td>
                <td>R$ {p.sale_price}</td>
                <td>{p.stock}</td>
                <td>{p.marketplace}</td>
                <td>
                  <button onClick={() => deleteProduct(p.id)}>Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
