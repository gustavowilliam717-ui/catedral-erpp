import { useEffect, useState } from "react";
import API from "../services/api";

export default function Finance() {
  const [revenues, setRevenues] = useState([]);
  const [expenses, setExpenses] = useState([]);

  const [revenueForm, setRevenueForm] = useState({
    description: "",
    value: "",
    category: "Venda Shopee"
  });

  const [expenseForm, setExpenseForm] = useState({
    name: "",
    value: "",
    category: "Fixa"
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const rev = await API.get("/revenues");
    const exp = await API.get("/expenses");

    setRevenues(rev.data);
    setExpenses(exp.data);
  }

  async function createRevenue(e) {
    e.preventDefault();

    await API.post("/revenues", {
      description: revenueForm.description,
      value: Number(revenueForm.value),
      category: revenueForm.category
    });

    setRevenueForm({
      description: "",
      value: "",
      category: "Venda Shopee"
    });

    loadData();
  }

  async function createExpense(e) {
    e.preventDefault();

    await API.post("/expenses", {
      name: expenseForm.name,
      value: Number(expenseForm.value),
      category: expenseForm.category
    });

    setExpenseForm({
      name: "",
      value: "",
      category: "Fixa"
    });

    loadData();
  }

  async function deleteRevenue(id) {
    if (!window.confirm("Deseja excluir esta receita?")) return;

    await API.delete("/revenues/" + id);
    loadData();
  }

  async function deleteExpense(id) {
    if (!window.confirm("Deseja excluir esta despesa?")) return;

    await API.delete("/expenses/" + id);
    loadData();
  }

  const totalRevenue = revenues.reduce((sum, item) => sum + Number(item.value), 0);
  const totalExpense = expenses.reduce((sum, item) => sum + Number(item.value), 0);
  const profit = totalRevenue - totalExpense;
  const margin = totalRevenue > 0 ? (profit / totalRevenue) * 100 : 0;

  return (
    <div className="page">
      <h1>Financeiro</h1>

      <div className="cards">
        <div className="card">
          <h3>Receitas</h3>
          <p>R$ {totalRevenue.toFixed(2)}</p>
        </div>

        <div className="card">
          <h3>Despesas</h3>
          <p>R$ {totalExpense.toFixed(2)}</p>
        </div>

        <div className="card">
          <h3>Lucro líquido</h3>
          <p>R$ {profit.toFixed(2)}</p>
        </div>

        <div className="card">
          <h3>Margem</h3>
          <p>{margin.toFixed(2)}%</p>
        </div>
      </div>

      <div className="box">
        <h2>Nova Receita</h2>

        <form onSubmit={createRevenue} className="form-grid">
          <input
            placeholder="Descrição da receita"
            value={revenueForm.description}
            onChange={(e) =>
              setRevenueForm({ ...revenueForm, description: e.target.value })
            }
          />

          <input
            placeholder="Valor"
            value={revenueForm.value}
            onChange={(e) =>
              setRevenueForm({ ...revenueForm, value: e.target.value })
            }
          />

          <select
            value={revenueForm.category}
            onChange={(e) =>
              setRevenueForm({ ...revenueForm, category: e.target.value })
            }
          >
            <option>Venda Shopee</option>
            <option>Venda Mercado Livre</option>
            <option>Venda Amazon</option>
            <option>Venda TikTok Shop</option>
            <option>Venda Direta</option>
            <option>Outras receitas</option>
          </select>

          <button type="submit">Cadastrar receita</button>
        </form>
      </div>

      <div className="box">
        <h2>Nova Despesa</h2>

        <form onSubmit={createExpense} className="form-grid">
          <input
            placeholder="Descrição da despesa"
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

          <select
            value={expenseForm.category}
            onChange={(e) =>
              setExpenseForm({ ...expenseForm, category: e.target.value })
            }
          >
            <option>Fixa</option>
            <option>Aluguel</option>
            <option>Energia</option>
            <option>Funcionários</option>
            <option>Pró-labore</option>
            <option>MDF</option>
            <option>Parafusos</option>
            <option>Plástico bolha</option>
            <option>INSS</option>
            <option>Impostos</option>
            <option>Marketing</option>
            <option>Outras despesas</option>
          </select>

          <button type="submit">Cadastrar despesa</button>
        </form>
      </div>

      <div className="box">
        <h2>Receitas cadastradas</h2>

        <table>
          <thead>
            <tr>
              <th>Descrição</th>
              <th>Categoria</th>
              <th>Valor</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {revenues.map((item) => (
              <tr key={item.id}>
                <td>{item.description}</td>
                <td>{item.category}</td>
                <td>R$ {Number(item.value).toFixed(2)}</td>
                <td>
                  <button
                    type="button"
                    className="danger"
                    onClick={() => deleteRevenue(item.id)}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="box">
        <h2>Despesas cadastradas</h2>

        <table>
          <thead>
            <tr>
              <th>Descrição</th>
              <th>Categoria</th>
              <th>Valor</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {expenses.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.category}</td>
                <td>R$ {Number(item.value).toFixed(2)}</td>
                <td>
                  <button
                    type="button"
                    className="danger"
                    onClick={() => deleteExpense(item.id)}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
