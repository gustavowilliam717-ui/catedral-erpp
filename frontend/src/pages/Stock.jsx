export default function Stock() {
 const [products, setProducts] = useState([]);

useEffect(() => {
  loadProducts();
}, []);

async function loadProducts() {
  try {
    const response = await API.get("/products");
    setProducts(response.data || []);
  } catch (error) {
    console.log(error);
  }
}
  ];

  function daysLeft(stock, monthlySales) {
    if (!monthlySales) return 0;
    return Math.floor(stock / (monthlySales / 30));
  }

  function suggestion(item) {
    const ideal = item.monthlySales + item.minimum;
    const buy = ideal - item.stock;
    return buy > 0 ? buy : 0;
  }

  return (
    <div className="page">
      <h1>Estoque Inteligente</h1>

      <div className="dashboard-cards-premium">
        <div className="dashboard-card-premium">
          <span>📦</span>
          <h3>Produtos monitorados</h3>
          <p>{products.length}</p>
        </div>

        <div className="dashboard-card-premium">
          <span>🔴</span>
          <h3>Estoque crítico</h3>
          <p>{products.filter((p) => p.stock < p.minimum).length}</p>
        </div>

        <div className="dashboard-card-premium">
          <span>🛒</span>
          <h3>Sugestão de compra</h3>
          <p>{products.reduce((s, p) => s + suggestion(p), 0)}</p>
        </div>
      </div>

      <div className="box">
        <h2>Produtos com necessidade de reposição</h2>

        <table>
          <thead>
            <tr>
              <th>SKU</th>
              <th>Produto</th>
              <th>Estoque</th>
              <th>Mínimo</th>
              <th>Venda/mês</th>
              <th>Dias restantes</th>
              <th>Sugestão</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {products.map((item) => {
              const remainingDays = daysLeft(item.stock, item.monthlySales);
              const buySuggestion = suggestion(item);

              return (
                <tr key={item.sku}>
                  <td>{item.sku}</td>
                  <td>{item.name}</td>
                  <td>{item.stock}</td>
                  <td>{item.minimum}</td>
                  <td>{item.monthlySales}</td>
                  <td>{remainingDays} dias</td>
                  <td>{buySuggestion} unidades</td>
                  <td>
                    {item.stock < item.minimum ? "🔴 Repor agora" : "🟢 OK"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="dashboard-alerts">
        <h2>🤖 IA Catedral</h2>
        <div>
          <span>🔴 Existem produtos abaixo do estoque mínimo.</span>
          <span>🛒 Sugestão automática de compra calculada.</span>
          <span>📦 Estoque inteligente em desenvolvimento.</span>
          <span>🚀 Próximo passo: integrar com produtos reais.</span>
        </div>
      </div>
    </div>
  );
}
<div className="dashboard-alerts">
  <h2>🤖 IA Catedral</h2>

  <div>
    <span>
      🔴 Existem produtos abaixo do estoque mínimo.
    </span>

    <span>
      🛒 Sugestão automática de reposição calculada.
    </span>

    <span>
      📦 Estoque médio baseado em vendas mensais.
    </span>

    <span>
      🚀 Próximo passo: integrar com produtos reais.
    </span>
  </div>
</div>
