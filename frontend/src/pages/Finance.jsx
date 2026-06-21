export default function Finance() {
  return (
    <div className="page">
      <h1>Financeiro</h1>

      <div className="box">
        <h2>Resumo Financeiro</h2>

        <p>Faturamento do mês: R$ 0,00</p>
        <p>Lucro do mês: R$ 0,00</p>
        <p>Despesas fixas: R$ 0,00</p>
        <p>Margem média: 0%</p>
      </div>

      <div className="box">
        <h2>Indicadores</h2>

        <p>✔ Produtos vendidos</p>
        <p>✔ Custos operacionais</p>
        <p>✔ Lucro líquido</p>
        <p>✔ Desempenho mensal</p>
      </div>
    </div>
  );
}
