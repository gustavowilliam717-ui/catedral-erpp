import { useMemo, useState } from "react";

const feeRules = [
  {
    marketplace: "Shopee",
    percent: 14,
    fixedDescription: "R$ 4 a R$ 26 por faixa de preco",
    notes: "Regra local usada pela calculadora atual.",
  },
  {
    marketplace: "Mercado Livre",
    percent: 12,
    fixedDescription: "R$ 6,75 abaixo de R$ 79 no classico",
    notes: "Premium usa percentual maior.",
  },
  {
    marketplace: "TikTok Shop",
    percent: 6,
    fixedDescription: "R$ 2 abaixo de R$ 79",
    notes: "Taxa base local para comparacao.",
  },
  {
    marketplace: "Amazon",
    percent: 16,
    fixedDescription: "Sem taxa fixa cadastrada",
    notes: "Percentual padrao local.",
  },
];

function formatCurrency(value) {
  return Number(value || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function getShopeeFixedFee(price) {
  if (price >= 200) return 26;
  if (price >= 100) return 20;
  if (price >= 80) return 16;
  if (price >= 50) return 12;
  if (price >= 30) return 8;
  return 4;
}

function getMarketplaceRule(marketplace, price, adType, sellerType) {
  if (marketplace === "Shopee") {
    return {
      percent: 14,
      fixed: sellerType === "CPF" ? 7 : getShopeeFixedFee(price),
    };
  }

  if (marketplace === "Mercado Livre") {
    return {
      percent: adType === "Premium" ? 17 : 12,
      fixed: price < 79 ? 6.75 : 0,
    };
  }

  if (marketplace === "TikTok Shop") {
    return {
      percent: 6,
      fixed: price < 79 ? 2 : 0,
    };
  }

  if (marketplace === "Amazon") {
    return { percent: 16, fixed: 0 };
  }

  return { percent: 16, fixed: 0 };
}

export default function MarketplaceFees() {
  const [marketplace, setMarketplace] = useState("Shopee");
  const [price, setPrice] = useState("100");
  const [adType, setAdType] = useState("Classico");
  const [sellerType, setSellerType] = useState("CNPJ");

  const result = useMemo(() => {
    const salePrice = Number(price || 0);
    const rule = getMarketplaceRule(marketplace, salePrice, adType, sellerType);
    const percentFee = salePrice * (rule.percent / 100);
    const totalFee = percentFee + rule.fixed;

    return {
      salePrice,
      ...rule,
      percentFee,
      totalFee,
      netValue: salePrice - totalFee,
    };
  }, [marketplace, price, adType, sellerType]);

  return (
    <div className="page">
      <section className="settings-title-card">
        <div>
          <span className="section-kicker">Precificacao</span>
          <h1>Taxas por marketplace</h1>
          <p>
            Consulte as regras locais usadas pela calculadora e simule quanto
            cada marketplace desconta do preco de venda.
          </p>
        </div>
      </section>

      <section className="box">
        <h2>Simulador de taxas</h2>
        <div className="form-grid">
          <select
            value={marketplace}
            onChange={(event) => setMarketplace(event.target.value)}
          >
            {feeRules.map((rule) => (
              <option key={rule.marketplace}>{rule.marketplace}</option>
            ))}
          </select>
          <input
            placeholder="Preco de venda"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
          />
          <select
            value={sellerType}
            onChange={(event) => setSellerType(event.target.value)}
          >
            <option>CNPJ</option>
            <option>CPF</option>
          </select>
          <select value={adType} onChange={(event) => setAdType(event.target.value)}>
            <option>Classico</option>
            <option>Premium</option>
          </select>
        </div>

        <div className="finance-summary-strip">
          <article className="negative">
            <span>Taxa percentual</span>
            <strong>{formatCurrency(result.percentFee)}</strong>
            <small>{result.percent}% sobre o preco</small>
          </article>
          <article className="negative">
            <span>Taxa fixa</span>
            <strong>{formatCurrency(result.fixed)}</strong>
            <small>Faixa aplicada</small>
          </article>
          <article className="negative">
            <span>Total descontado</span>
            <strong>{formatCurrency(result.totalFee)}</strong>
            <small>Percentual + fixo</small>
          </article>
          <article className="positive">
            <span>Valor liquido</span>
            <strong>{formatCurrency(result.netValue)}</strong>
            <small>Antes de custo, frete e imposto</small>
          </article>
        </div>
      </section>

      <section className="box">
        <h2>Tabela de referencia</h2>
        <table>
          <thead>
            <tr>
              <th>Marketplace</th>
              <th>Taxa base</th>
              <th>Taxa fixa</th>
              <th>Observacao</th>
            </tr>
          </thead>
          <tbody>
            {feeRules.map((rule) => (
              <tr key={rule.marketplace}>
                <td>{rule.marketplace}</td>
                <td>{rule.percent}%</td>
                <td>{rule.fixedDescription}</td>
                <td>{rule.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
