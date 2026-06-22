import { useEffect, useState } from "react";
import API from "../services/api";

export default function Finance() {
  const [revenues, setRevenues] = useState([]);
  const [expenses, setExpenses] = useState([]);

  const [revenueForm, setRevenueForm] = useState({
    description: "",
    value: ""
  });

  const [expenseForm, setExpenseForm] = useState({
    name: "",
    value: ""
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
      value: Number(revenueForm.value)
    });

    setRevenueForm({
      description: "",
      value: ""
    });

    loadData();
  }

  async function createExpense(e) {
    e.preventDefault();

    await API.post("/expenses", {
      name: expenseForm.name,
      value: Number(expenseForm.value)
    });

    setExpenseForm({
      name: "",
      value: ""
    });

    loadData();
  }

  const totalRevenue = revenues.reduce((a, b) => a + b.value, 0);
  const totalExpense = expenses.reduce((a, b) => a + b.value, 0);
  const profit = totalRevenue - totalExpense;

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
          <h3>Lucro Líquido</h3>
          <p>R$ {profit.toFixed(2)}</p>
        </div>
      </div>

      <div className="box">
        <h2>Nova Receita</h2>

        <form onSubmit={createRevenue}>
          <input
            placeholder="Descrição"
            value={revenueForm.description}
            onChange={(e) =>
              setRevenueForm({
                ...revenueForm,
                description: e.target.value
              })
            }
          />

          <input
            placeholder="Valor"
            value={revenueForm.value}
            onChange={(e) =>
              setRevenueForm({
                ...revenueForm,
                value: e.target.value
              })
            }
          />

          <button>Cadastrar Receita</button>
        </form>
      </div>

      <div className="box">
        <h2>Nova Despesa</h2>

        <form onSubmit={createExpense}>
          <input
            placeholder="Descrição"
            value={expenseForm.name}
            onChange={(e) =>
              setExpenseForm({
                ...expenseForm,
                name: e.target.value
              })
            }
          />

          <input
            placeholder="Valor"
            value={expenseForm.value}
            onChange={(e) =>
              setExpenseForm({
                ...expenseForm,
                value: e.target.value
              })
            }
          />

          <button>Cadastrar Despesa</button>
        </form>
      </div>
    </div>
  );
}
