import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import axios from 'axios';
import './style.css';

const API = import.meta.env.VITE_API_URL;

function App() {
  const [dashboard, setDashboard] = useState({});
  const [products, setProducts] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [search, setSearch] = useState('');

  const [productForm, setProductForm] = useState({
    sku: '',
    name: '',
    cost: '',
    sale_price: '',
    stock: '',
    marketplace: 'Shopee'
  });

  const [expenseForm, setExpenseForm] = useState({
    name: '',
    value: '',
    category: 'Geral'
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
    const dash = await axios.get(API + '/dashboard');
    const prods = await axios.get(API + '/products');
    const exps = await axios.get(API + '/expenses');

    setDashboard(dash.data);
    setProducts(prods.data);
    setExpenses(exps.data);
  }

  useEffect(() => {
    loadData();
  }, []);

  async function createProduct(e) {
    e.preventDefault();

    await axios.post(API + '/products', {
      sku: productForm.sku,
      name: productForm.name,
      cost: Number(productForm.cost),
      sale_price: Number(productForm.sale_price),
      stock: Number(productForm.stock),
      marketplace: productForm.marketplace
    });

    setProductForm({
      sku: '',
      name: '',
      cost: '',
      sale_price: '',
      stock: '',
      marketplace: 'Shopee'
    });

    loadData();
  }

  async function deleteProduct(id) {
    if (!window.confirm('Deseja excluir este produto?')) return;

    await axios.delete(API + '/products/' + id);
    loadData();
  }

  async function createExpense(e) {
    e.preventDefault();

    await axios.post(API + '/expenses', {
      name: expenseForm.name,
      value: Number(expenseForm.value),
      category: expenseForm.category
    });

    setExpenseForm({
      name: '',
      value: '',
      category: 'Geral'
    });

    loadData();
  }

  async function deleteExpense(id) {
    if (!window.confirm('Deseja excluir esta despesa?')) return;

    await axios.delete(API + '/expenses/' + id);
    loadData();
  }

  async function simulatePrice(e) {
    e.preventDefault();

    const response = await axios.post(API + '/pricing/simulate', {
      cost: Number(pricing.cost),
      desired_profit_percent: Number(pricing.desired_profit_percent),
      marketplace_fee_percent: Number(pricing.marketplace_fee_percent),
      freight_percent: Number(pricing.freight_percent),
      anticipation_percent: Number(pricing.anticipation_percent),
      fixed_cost_percent: Number(pricing.fixed_cost_percent)
    });

    setPriceResult(response.data);
  }

  const filteredProducts = products.filter((product) => {
    const term = search.toLowerCase();

    return (
      product.name.toLowerCase().includes(term) ||
      product.sku.toLowerCase().includes(term) ||
      product.marketplace.toLowerCase().includes(term)
    );
  });

  return (
    <div className="app">
      <aside className="sidebar">
        <h2>Catedral ERP</h2>
        <a href="#dashboard">Dashboard</a>
        <a href="#produtos">Produtos</a>
        <a href="#precificacao">Precificação</a>
        <a href="#despesas">Despesas</a>
      </aside>

      <main className="main">
        <section id="dashboard" className="hero">
          <div>
            <h1>Catedral ERP</h1>
            <p>Gestão de produtos, estoque, custos e precificação para marketplaces.</p>
          </div>
        </section>

        <section className="cards">
          <div className="card">
            <span>Produtos</span>
            <strong>{dashboard.total_products || 0}</strong>
          </div>

          <div className="card">
            <span>Valor em estoque</span>
            <strong>R$ {dashboard.total_stock_value || 0}</strong>
          </div>

          <div className="card">
            <span>Lucro estimado</span>
            <strong>R$ {dashboard.estimated_profit || 0}</strong>
          </div>

          <div className="card">
            <span>Despesas mensais</span>
            <strong>R$ {dashboard.monthly_expenses || 0}</strong>
          </div>
        </section>

        <section id="produtos" className="panel">
          <div className="panel-header">
            <h2>Produtos</h2>
            <input
              className="search"
              placeholder="Buscar por SKU, nome ou marketplace"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <form onSubmit={createProduct} className="grid-form">
            <input
              placeholder="SKU"
              value={productForm.sku}
              onChange={(e) =>
                setProductForm({ ...productForm, sku: e.target.value })
              }
            />

            <input
              placeholder="Nome do produto"
              value={productForm.name}
              onChange={(e) =>
                setProductForm({ ...productForm, name: e.target.value })
              }
            />

            <input
              placeholder="Custo"
              value={productForm.cost}
              onChange={(e) =>
                setProductForm({ ...productForm, cost: e.target.value })
              }
            />

            <input
              placeholder="Preço venda"
              value={productForm.sale_price}
              onChange={(e) =>
                setProductForm({ ...productForm, sale_price: e.target.value })
              }
            />

            <input
              placeholder="Estoque"
              value={productForm.stock}
              onChange={(e) =>
                setProductForm({ ...productForm, stock: e.target.value })
              }
            />

            <select
              value={productForm.marketplace}
              onChange={(e) =>
                setProductForm({ ...productForm, marketplace: e.target.value })
              }
            >
              <option>Shopee</option>
              <option>Mercado Livre</option>
              <option>Amazon</option>
              <option>TikTok Shop</option>
              <option>Magalu</option>
            </select>

            <button type="submit">Cadastrar produto</button>
          </form>

          <div className="table-wrap">
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
                {filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td>{product.sku}</td>
                    <td>{product.name}</td>
                    <td>R$ {product.cost}</td>
                    <td>R$ {product.sale_price}</td>
                    <td>{product.stock}</td>
                    <td>{product.marketplace}</td>
                    <td>
                      <button
                        type="button"
                        className="danger"
                        onClick={() => deleteProduct(product.id)}
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="precificacao" className="panel">
          <h2>Calculadora de preço</h2>

          <form onSubmit={simulatePrice} className="grid-form">
            <input
              placeholder="Custo do produto"
              value={pricing.cost}
              onChange={(e) =>
                setPricing({ ...pricing, cost: e.target.value })
              }
            />

            <input
              placeholder="Lucro desejado %"
              value={pricing.desired_profit_percent}
              onChange={(e) =>
                setPricing({
                  ...pricing,
                  desired_profit_percent: e.target.value
                })
              }
            />

            <input
              placeholder="Taxa marketplace %"
              value={pricing.marketplace_fee_percent}
              onChange={(e) =>
                setPricing({
                  ...pricing,
                  marketplace_fee_percent: e.target.value
                })
              }
            />

            <input
              placeholder="Frete %"
              value={pricing.freight_percent}
              onChange={(e) =>
                setPricing({ ...pricing, freight_percent: e.target.value })
              }
            />

            <input
              placeholder="Antecipação %"
              value={pricing.anticipation_percent}
              onChange={(e) =>
                setPricing({
                  ...pricing,
                  anticipation_percent: e.target.value
                })
              }
            />

            <input
              placeholder="Custo fixo %"
              value={pricing.fixed_cost_percent}
              onChange={(e) =>
                setPricing({
                  ...pricing,
                  fixed_cost_percent: e.target.value
                })
              }
            />

            <button type="submit">Simular preço</button>
          </form>

          {priceResult && (
            <div className="result">
              <p>Preço sugerido</p>
              <strong>R$ {priceResult.suggested_price}</strong>
              <span>Lucro desejado: R$ {priceResult.desired_profit_value}</span>
            </div>
          )}
        </section>

        <section id="despesas" className="panel">
          <h2>Despesas fixas</h2>

          <form onSubmit={createExpense} className="grid-form">
            <input
              placeholder="Nome da despesa"
              value={expenseForm.name}
              onChange={(e) =>
                setExpenseForm({ ...expenseForm, name: e.target.value })
              }
            />

            <input
              placeholder="Valor"
              value={expenseForm.value}
              onChange={(e) =>
                setExpenseForm({ ...expenseForm, value: e.target.value })
              }
            />

            <input
              placeholder="Categoria"
              value={expenseForm.category}
              onChange={(e) =>
                setExpenseForm({ ...expenseForm, category: e.target.value })
              }
            />

            <button type="submit">Cadastrar despesa</button>
          </form>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Despesa</th>
                  <th>Categoria</th>
                  <th>Valor</th>
                  <th>Ações</th>
                </tr>
              </thead>

              <tbody>
                {expenses.map((expense) => (
                  <tr key={expense.id}>
                    <td>{expense.name}</td>
                    <td>{expense.category}</td>
                    <td>R$ {expense.value}</td>
                    <td>
                      <button
                        type="button"
                        className="danger"
                        onClick={() => deleteExpense(expense.id)}
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
