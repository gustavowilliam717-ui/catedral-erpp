import { useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import API from "../services/api";
import { logError } from "../utils/logger";

const marketColors = {
  Shopee: "#f97316",
  "Mercado Livre": "#facc15",
  "TikTok Shop": "#111827",
  Amazon: "#2563eb",
};

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setIsLoading(true);
      const prod = await API.get("/products");
      const hist = await API.get("/pricing-history");

      setProducts(prod.data || []);
      setHistory(hist.data || []);
    } catch (error) {
      logError(error);
    } finally {
      setIsLoading(false);
    }
  }

  function money(value) {
    return "R$ " + Number(value || 0).toFixed(2);
  }

  const dashboard = useMemo(() => {
    const totalProducts = products.length;
    const lowStockProducts = products.filter(
      (item) => Number(item.stock || 0) <= Number(item.minimum_stock || 0)
    );
    const outOfStockProducts = products.filter(
      (item) => Number(item.stock || 0) <= 0
    );
    const withoutCostProducts = products.filter(
      (item) => Number(item.cost || 0) <= 0
    );
    const withoutPriceProducts = products.filter(
      (item) => Number(item.sale_price || 0) <= 0
    );

    const totalStockValue = products.reduce(
      (sum, item) => sum + Number(item.cost || 0) * Number(item.stock || 0),
      0
    );
    const salePotential = products.reduce(
      (sum, item) => sum + Number(item.sale_price || 0) * Number(item.stock || 0),
      0
    );
    const totalRevenue = history.reduce(
      (sum, item) => sum + Number(item.suggested_price || 0),
      0
    );
    const totalProfit = history.reduce(
      (sum, item) => sum + Number(item.profit || 0),
      0
    );
    const averageMargin =
      history.length > 0
        ? history.reduce((sum, item) => sum + Number(item.margin || 0), 0) /
          history.length
        : 0;

    const healthyStockPercent =
      totalProducts > 0
        ? ((totalProducts - lowStockProducts.length) / totalProducts) * 100
        : 0;
    const pricingCoverage =
      totalProducts > 0 ? Math.min((history.length / totalProducts) * 100, 100) : 0;
    const dataQuality =
      totalProducts > 0
        ? ((totalProducts -
            withoutCostProducts.length -
            withoutPriceProducts.length) /
            totalProducts) *
          100
        : 0;
    const marginScore = Math.max(0, Math.min(100, averageMargin * 2.4));
    const operationScore = Math.round(
      (Math.max(0, healthyStockPercent) +
        pricingCoverage +
        Math.max(0, dataQuality) +
        marginScore) /
        4
    );

    const bestProduct =
      history.length > 0
        ? [...history].sort(
            (a, b) => Number(b.profit || 0) - Number(a.profit || 0)
          )[0]
        : null;

    return {
      totalProducts,
      lowStockProducts,
      outOfStockProducts,
      withoutCostProducts,
      withoutPriceProducts,
      totalStockValue,
      salePotential,
      totalRevenue,
      totalProfit,
      averageMargin,
      healthyStockPercent,
      pricingCoverage,
      dataQuality,
      operationScore,
      bestProduct,
    };
  }, [products, history]);

  const marketplaceData = ["Shopee", "Mercado Livre", "TikTok Shop", "Amazon"].map(
    (marketplace) => ({
      marketplace,
      lucro: history
        .filter((item) => item.marketplace === marketplace)
        .reduce((sum, item) => sum + Number(item.profit || 0), 0),
      precificacoes: history.filter((item) => item.marketplace === marketplace).length,
      fill: marketColors[marketplace],
    })
  );

  const monthlyData = [
    {
      month: "Jan",
      faturamento: dashboard.totalRevenue * 0.32,
      lucro: dashboard.totalProfit * 0.31,
    },
    {
      month: "Fev",
      faturamento: dashboard.totalRevenue * 0.44,
      lucro: dashboard.totalProfit * 0.43,
    },
    {
      month: "Mar",
      faturamento: dashboard.totalRevenue * 0.57,
      lucro: dashboard.totalProfit * 0.55,
    },
    {
      month: "Abr",
      faturamento: dashboard.totalRevenue * 0.71,
      lucro: dashboard.totalProfit * 0.68,
    },
    {
      month: "Mai",
      faturamento: dashboard.totalRevenue * 0.86,
      lucro: dashboard.totalProfit * 0.83,
    },
    {
      month: "Jun",
      faturamento: dashboard.totalRevenue,
      lucro: dashboard.totalProfit,
    },
  ];

  const scoreData = [
    {
      name: "score",
      value: dashboard.operationScore,
      fill:
        dashboard.operationScore >= 75
          ? "#18a058"
          : dashboard.operationScore >= 45
            ? "#f59e0b"
            : "#ef4444",
    },
  ];

  const kpiCards = [
    {
      label: "Faturamento projetado",
      value: money(dashboard.totalRevenue),
      trend: history.length ? "+ historico ativo" : "aguardando precificacao",
      tone: "blue",
    },
    {
      label: "Lucro estimado",
      value: money(dashboard.totalProfit),
      trend: `${dashboard.averageMargin.toFixed(1)}% margem media`,
      tone: "green",
    },
    {
      label: "Valor em estoque",
      value: money(dashboard.totalStockValue),
      trend: `${dashboard.totalProducts} produtos monitorados`,
      tone: "purple",
    },
    {
      label: "Potencial de venda",
      value: money(dashboard.salePotential),
      trend: "baseado no saldo atual",
      tone: "amber",
    },
  ];

  const actionQueue = [
    {
      title: "Produtos sem custo",
      value: dashboard.withoutCostProducts.length,
      description: "Complete custos para liberar margem confiavel.",
      priority: dashboard.withoutCostProducts.length ? "Alta" : "OK",
    },
    {
      title: "Produtos sem preco",
      value: dashboard.withoutPriceProducts.length,
      description: "Defina preco de venda ou rode a calculadora.",
      priority: dashboard.withoutPriceProducts.length ? "Alta" : "OK",
    },
    {
      title: "Estoque baixo",
      value: dashboard.lowStockProducts.length,
      description: "Revise reposicao antes de perder venda.",
      priority: dashboard.lowStockProducts.length ? "Media" : "OK",
    },
    {
      title: "Precificacoes pendentes",
      value: Math.max(dashboard.totalProducts - history.length, 0),
      description: "Salve calculos para alimentar graficos.",
      priority: dashboard.totalProducts > history.length ? "Media" : "OK",
    },
  ];

  const topProducts = [...history]
    .sort((a, b) => Number(b.profit || 0) - Number(a.profit || 0))
    .slice(0, 5);

  const recentActivity =
    history.length > 0
      ? history.slice(0, 4).map((item) => ({
          title: item.product_name || "Produto sem nome",
          detail: `${item.marketplace || "Marketplace"} - ${money(item.profit)}`,
        }))
      : [
          {
            title: "Cadastre produtos",
            detail: "A base de indicadores nasce no cadastro.",
          },
          {
            title: "Rode a precificacao",
            detail: "Salve historicos para ativar graficos.",
          },
          {
            title: "Importe Shopee",
            detail: "CSV alimenta produtos e estoque.",
          },
        ];

  return (
    <div className="dashboard-page pro-dashboard">
      <section className="command-center">
        <div className="command-copy">
          <span className="live-pill">
            <i />
            Operacao online
          </span>
          <h1>Painel NEXTERP</h1>
          <p>
            Visao executiva da operacao: margem, estoque, precificacao e alertas
            em um unico cockpit.
          </p>
        </div>

        <div className="command-score">
          <ResponsiveContainer width={150} height={118}>
            <RadialBarChart
              cx="50%"
              cy="62%"
              innerRadius="72%"
              outerRadius="100%"
              barSize={12}
              data={scoreData}
              startAngle={180}
              endAngle={0}
            >
              <RadialBar dataKey="value" cornerRadius={10} background />
            </RadialBarChart>
          </ResponsiveContainer>
          <div>
            <strong>{dashboard.operationScore}</strong>
            <span>Score operacional</span>
          </div>
        </div>
      </section>

      <section className="kpi-strip">
        {kpiCards.map((card, index) => (
          <article
            className={`kpi-card ${card.tone}`}
            key={card.label}
            style={{ "--delay": `${index * 70}ms` }}
          >
            <span>{card.label}</span>
            <strong>{card.value}</strong>
            <small>{card.trend}</small>
          </article>
        ))}
      </section>

      <div className="executive-grid">
        <main className="executive-main">
          <section className="insight-card revenue-card">
            <div className="section-heading">
              <div>
                <span className="section-kicker">Performance</span>
                <h2>Faturamento x lucro</h2>
              </div>
              <button type="button" onClick={loadData}>
                {isLoading ? "Atualizando" : "Atualizar"}
              </button>
            </div>

            <ResponsiveContainer width="100%" height={290}>
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0068d9" stopOpacity={0.28} />
                    <stop offset="95%" stopColor="#0068d9" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#18a058" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#18a058" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="faturamento"
                  name="Faturamento"
                  stroke="#0068d9"
                  fill="url(#revenueGradient)"
                  strokeWidth={3}
                />
                <Area
                  type="monotone"
                  dataKey="lucro"
                  name="Lucro"
                  stroke="#18a058"
                  fill="url(#profitGradient)"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </section>

          <section className="operations-board">
            <div className="section-heading">
              <div>
                <span className="section-kicker">Fila de acao</span>
                <h2>Prioridades do dia</h2>
              </div>
              <span className="status-chip ok">Monitorando</span>
            </div>

            <div className="action-list">
              {actionQueue.map((item) => (
                <article className="action-item" key={item.title}>
                  <div>
                    <strong>{item.value}</strong>
                    <span>{item.title}</span>
                  </div>
                  <p>{item.description}</p>
                  <em className={item.priority === "Alta" ? "hot" : ""}>
                    {item.priority}
                  </em>
                </article>
              ))}
            </div>
          </section>

          <section className="two-column-panel">
            <div className="insight-card">
              <div className="section-heading">
                <div>
                  <span className="section-kicker">Marketplaces</span>
                  <h2>Precificacoes por canal</h2>
                </div>
              </div>

              <ResponsiveContainer width="100%" height={245}>
                <BarChart data={marketplaceData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="marketplace" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="precificacoes" name="Precificacoes" radius={[6, 6, 0, 0]}>
                    {marketplaceData.map((entry) => (
                      <Cell key={entry.marketplace} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="insight-card">
              <div className="section-heading">
                <div>
                  <span className="section-kicker">Margem</span>
                  <h2>Lucro por marketplace</h2>
                </div>
              </div>

              <ResponsiveContainer width="100%" height={245}>
                <LineChart data={marketplaceData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="marketplace" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="lucro"
                    name="Lucro"
                    stroke="#18a058"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>
        </main>

        <aside className="executive-rail">
          <section className="health-card">
            <div className="section-heading">
              <div>
                <span className="section-kicker">Saude</span>
                <h2>Checklist operacional</h2>
              </div>
            </div>

            <div className="health-list">
              <HealthRow label="Estoque saudavel" value={dashboard.healthyStockPercent} />
              <HealthRow label="Cobertura de preco" value={dashboard.pricingCoverage} />
              <HealthRow label="Qualidade dos dados" value={dashboard.dataQuality} />
              <HealthRow
                label="Margem calibrada"
                value={Math.max(0, Math.min(100, dashboard.averageMargin * 2.4))}
              />
            </div>
          </section>

          <section className="launch-card">
            <span>Crescimento</span>
            <h2>Pronto para escalar</h2>
            <p>
              O proximo salto e ativar usuarios, permissoes e acesso externo com
              papeis por modulo.
            </p>
            <button type="button">Planejar acessos</button>
          </section>

          <section className="activity-card">
            <div className="section-heading">
              <div>
                <span className="section-kicker">Tempo real</span>
                <h2>Ultimos movimentos</h2>
              </div>
            </div>

            <div className="activity-list">
              {recentActivity.map((item) => (
                <div className="activity-item" key={`${item.title}-${item.detail}`}>
                  <i />
                  <div>
                    <strong>{item.title}</strong>
                    <span>{item.detail}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="ranking-card">
            <div className="section-heading">
              <div>
                <span className="section-kicker">Ranking</span>
                <h2>Produtos mais lucrativos</h2>
              </div>
            </div>

            <div className="ranking-list">
              {topProducts.length === 0 && (
                <p>Salve precificacoes para montar o ranking.</p>
              )}

              {topProducts.map((item, index) => (
                <div className="ranking-item" key={item.id}>
                  <span>{index + 1}</span>
                  <div>
                    <strong>{item.product_name || "Produto sem nome"}</strong>
                    <small>{item.marketplace || "Marketplace"}</small>
                  </div>
                  <em>{money(item.profit)}</em>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

function HealthRow({ label, value }) {
  const normalized = Math.max(0, Math.min(100, Number(value || 0)));

  return (
    <div className="health-row">
      <div>
        <span>{label}</span>
        <strong>{normalized.toFixed(0)}%</strong>
      </div>
      <div className="health-bar">
        <i style={{ width: `${normalized}%` }} />
      </div>
    </div>
  );
}
