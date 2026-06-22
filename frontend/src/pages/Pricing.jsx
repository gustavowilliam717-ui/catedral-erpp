import { useState } from "react";

export default function Pricing() {
  const [data, setData] = useState({
    sellerType: "CNPJ",
    marketplace: "Shopee",
    cost: "",
    packaging: "",
    calculationMode: "margin",
    desiredMargin: 30,
    salePrice: "",
    desiredProfitValue: "",
    taxPercent: 1.5,
    marketAveragePrice: "",
    estimatedSales: "",
    discountPercent: "",
    couponType: "percent",
    couponValue: "",
    highlightCampaign: false,
    shopeeAcelera: "0",
    easyReturn: false
  });

  function update(field, value) {
    setData({ ...data, [field]: value });
  }

  function num(value) {
    return Number(value) || 0;
  }

  function money(value) {
    return `R$ ${Number(value || 0).toFixed(2)}`;
  }

  function getMarketplaceRule(marketplace, price) {
  const sellerType = data.sellerType;

  if (marketplace === "Shopee") {
    const percent = 14;
    let fixed = 4;

    if (sellerType === "CPF") {
      fixed = 7;
    }

    return {
      percent,
      fixed
    };
  }

  if (marketplace === "Mercado Livre") {
    return {
      percent: 17,
      fixed: price < 79 ? 6.75 : 0
    };
  }

  if (marketplace === "TikTok Shop") {
    return {
      percent: 6,
      fixed: price < 79 ? 2 : 0
    };
  }

  if (marketplace === "Amazon") {
    return {
      percent: 16,
      fixed: 0
    };
  }

  return {
    percent: 16,
    fixed: 0
  };
}

  const cost = num(data.cost);
  const packaging = num(data.packaging);
  const productCost = cost + packaging;

  const discountPercent = num(data.discountPercent);
  const couponValue = num(data.couponValue);
  const taxPercent = num(data.taxPercent);
  const highlightPercent = data.highlightCampaign ? 3.5 : 0;
  const aceleraPercent = num(data.shopeeAcelera);
  const easyReturnValue = data.easyReturn ? 0.49 : 0;

  function calculateByPrice(finalPrice) {
    const afterDiscount = finalPrice - finalPrice * (discountPercent / 100);

    const afterCoupon =
      data.couponType === "percent"
        ? afterDiscount - afterDiscount * (couponValue / 100)
        : afterDiscount - couponValue;

    const rule = getMarketplaceRule(data.marketplace, finalPrice);
    const marketplaceFee = afterCoupon * (rule.percent / 100);
    const taxValue = afterCoupon * (taxPercent / 100);
    const highlightValue = afterCoupon * (highlightPercent / 100);
    const aceleraValue = afterCoupon * (aceleraPercent / 100);

    const totalFees =
      marketplaceFee +
      rule.fixed +
      taxValue +
      highlightValue +
      aceleraValue +
      easyReturnValue;

    const totalCostAndFees = productCost + totalFees;
    const profit = afterCoupon - totalCostAndFees;
    const margin = afterCoupon > 0 ? (profit / afterCoupon) * 100 : 0;

    return {
      finalPrice,
      afterCoupon,
      rule,
      marketplaceFee,
      taxValue,
      highlightValue,
      aceleraValue,
      totalFees,
      totalCostAndFees,
      profit,
      margin
    };
  }

  function calculateSuggestedPrice() {
    if (data.calculationMode === "salePrice") return num(data.salePrice);

    let estimatedPrice = productCost * 2 || 1;

    for (let i = 0; i < 20; i++) {
      const rule = getMarketplaceRule(data.marketplace, estimatedPrice);

      const totalPercent =
        rule.percent +
        taxPercent +
        highlightPercent +
        aceleraPercent +
        num(data.desiredMargin);

      const fixedCosts = rule.fixed + easyReturnValue;

      if (data.calculationMode === "profitValue") {
        estimatedPrice =
          (productCost + fixedCosts + num(data.desiredProfitValue)) /
          (1 - (rule.percent + taxPercent + highlightPercent + aceleraPercent) / 100);
      } else {
        estimatedPrice = (productCost + fixedCosts) / (1 - totalPercent / 100);
      }

      if (discountPercent > 0) estimatedPrice = estimatedPrice / (1 - discountPercent / 100);

      if (couponValue > 0) {
        estimatedPrice =
          data.couponType === "percent"
            ? estimatedPrice / (1 - couponValue / 100)
            : estimatedPrice + couponValue;
      }
    }

    return estimatedPrice;
  }

  const suggestedPrice = calculateSuggestedPrice();
  const result = calculateByPrice(suggestedPrice);

  const estimatedSales = num(data.estimatedSales);
  const monthlyRevenue = result.finalPrice * estimatedSales;
  const monthlyCosts = result.totalCostAndFees * estimatedSales;
  const monthlyProfit = result.profit * estimatedSales;
  const monthlyMargin = monthlyRevenue > 0 ? (monthlyProfit / monthlyRevenue) * 100 : 0;

  const yearlyRevenue = monthlyRevenue * 12;
  const yearlyCosts = monthlyCosts * 12;
  const yearlyProfit = monthlyProfit * 12;

  const distributionTotal =
    cost +
    packaging +
    result.marketplaceFee +
    result.rule.fixed +
    result.taxValue +
    Math.max(result.profit, 0);

  function percentPart(value) {
    if (distributionTotal <= 0) return 0;
    return (value / distributionTotal) * 100;
  }

  function copySummary() {
    const text = `
📊 RESUMO DE PRECIFICAÇÃO

Marketplace: ${data.marketplace}
Tipo de vendedor: ${data.sellerType}

💰 Preço sugerido: ${money(result.finalPrice)}
✅ Lucro líquido: ${money(result.profit)}
📈 Margem real: ${result.margin.toFixed(1)}%

📦 Custos:
Produto: ${money(cost)}
Embalagem: ${money(packaging)}

🏪 Taxas:
Comissão ${data.marketplace}: ${money(result.marketplaceFee)}
Taxa fixa: ${money(result.rule.fixed)}
Impostos: ${money(result.taxValue)}
Marketing: ${money(result.highlightValue + result.aceleraValue)}
Devolução Fácil: ${money(easyReturnValue)}

📌 Total custos + taxas: ${money(result.totalCostAndFees)}

${estimatedSales > 0 ? `📈 PROJEÇÃO MENSAL
Vendas/mês: ${estimatedSales}
Receita bruta: ${money(monthlyRevenue)}
Custos totais: ${money(monthlyCosts)}
Lucro líquido: ${money(monthlyProfit)}
Margem mensal: ${monthlyMargin.toFixed(1)}%

📅 PROJEÇÃO ANUAL
Receita anual: ${money(yearlyRevenue)}
Custos anuais: ${money(yearlyCosts)}
Lucro anual: ${money(yearlyProfit)}` : ""}
    `.trim();

    navigator.clipboard.writeText(text);
    alert("Resumo copiado para compartilhar!");
  }

  return (
    <div className="page">
      <h1>Precificação</h1>

      <div className="box">
        <h2>Dados do Produto</h2>

        <div className="form-grid">
          <select value={data.sellerType} onChange={(e) => update("sellerType", e.target.value)}>
            <option>CNPJ</option>
            <option>CPF</option>
          </select>

          <select value={data.marketplace} onChange={(e) => update("marketplace", e.target.value)}>
            <option>Shopee</option>
            <option>Mercado Livre</option>
            <option>TikTok Shop</option>
            <option>Amazon</option>
          </select>

          <input placeholder="Custo do produto" value={data.cost} onChange={(e) => update("cost", e.target.value)} />
          <input placeholder="Custo da embalagem" value={data.packaging} onChange={(e) => update("packaging", e.target.value)} />
        </div>
      </div>

      <div className="box">
        <h2>Como calcular o preço?</h2>

        <div className="pricing-options">
          <button type="button" onClick={() => update("calculationMode", "margin")}>Margem de Lucro %</button>
          <button type="button" onClick={() => update("calculationMode", "salePrice")}>Preço de Venda</button>
          <button type="button" onClick={() => update("calculationMode", "profitValue")}>Lucro Desejado R$</button>
        </div>

        <div className="form-grid">
          {data.calculationMode === "margin" && (
            <input placeholder="Margem desejada %" value={data.desiredMargin} onChange={(e) => update("desiredMargin", e.target.value)} />
          )}

          {data.calculationMode === "salePrice" && (
            <input placeholder="Preço de venda R$" value={data.salePrice} onChange={(e) => update("salePrice", e.target.value)} />
          )}

          {data.calculationMode === "profitValue" && (
            <input placeholder="Lucro desejado R$" value={data.desiredProfitValue} onChange={(e) => update("desiredProfitValue", e.target.value)} />
          )}
        </div>
      </div>

      <div className="box">
        <h2>Outras Configurações</h2>

        <div className="form-grid">
          <input placeholder="Imposto %" value={data.taxPercent} onChange={(e) => update("taxPercent", e.target.value)} />
          <input placeholder="Preço médio do mercado" value={data.marketAveragePrice} onChange={(e) => update("marketAveragePrice", e.target.value)} />
          <input placeholder="Vendas estimadas por mês" value={data.estimatedSales} onChange={(e) => update("estimatedSales", e.target.value)} />
        </div>
      </div>

      <div className="box">
        <h2>Central de Marketing</h2>

        <div className="form-grid">
          <input placeholder="Desconto %" value={data.discountPercent} onChange={(e) => update("discountPercent", e.target.value)} />

          <select value={data.couponType} onChange={(e) => update("couponType", e.target.value)}>
            <option value="percent">Cupom em %</option>
            <option value="real">Cupom em R$</option>
          </select>

          <input placeholder="Valor do cupom" value={data.couponValue} onChange={(e) => update("couponValue", e.target.value)} />

          <select value={data.shopeeAcelera} onChange={(e) => update("shopeeAcelera", e.target.value)}>
            <option value="0">Não uso Shopee Acelera</option>
            <option value="3">Shopee Acelera 3%</option>
            <option value="5">Shopee Acelera 5%</option>
            <option value="10">Shopee Acelera 10%</option>
          </select>
        </div>

        <label className="check-line">
          <input type="checkbox" checked={data.highlightCampaign} onChange={(e) => update("highlightCampaign", e.target.checked)} />
          Campanhas de Destaque (+3,5%)
        </label>

        <label className="check-line">
          <input type="checkbox" checked={data.easyReturn} onChange={(e) => update("easyReturn", e.target.checked)} />
          Devolução Fácil (+R$ 0,49)
        </label>
      </div>

      <div className="result-highlight">
        <h2>Preço Sugerido</h2>
        <strong>{money(result.finalPrice)}</strong>
        <span>Lucro Real: {money(result.profit)} ({result.margin.toFixed(1)}%)</span>
      </div>

      <div className="cards">
        <div className="card">
          <h3>Custo Total + Taxas</h3>
          <p>{money(result.totalCostAndFees)}</p>
        </div>

        <div className="card">
          <h3>Taxas Marketplace</h3>
          <p>{money(result.marketplaceFee + result.rule.fixed)}</p>
        </div>

        <div className="card">
          <h3>Impostos + Marketing</h3>
          <p>{money(result.taxValue + result.highlightValue + result.aceleraValue)}</p>
        </div>
      </div>

      <div className="box">
        <h2>Detalhamento de Custos e Taxas</h2>

        <table>
          <tbody>
            <tr><td>Custo do Produto</td><td>{money(cost)}</td></tr>
            <tr><td>Custo da Embalagem</td><td>{money(packaging)}</td></tr>
            <tr><td>Comissão {data.marketplace} ({result.rule.percent}%)</td><td>{money(result.marketplaceFee)}</td></tr>
            <tr><td>Taxa Fixa</td><td>{money(result.rule.fixed)}</td></tr>
            <tr><td>Impostos</td><td>{money(result.taxValue)}</td></tr>
            <tr><td>Marketing / Campanhas</td><td>{money(result.highlightValue + result.aceleraValue)}</td></tr>
            <tr><td>Devolução Fácil</td><td>{money(easyReturnValue)}</td></tr>
            <tr><th>Total de Custos + Taxas</th><th>{money(result.totalCostAndFees)}</th></tr>
            <tr><th>Lucro Líquido</th><th>{money(result.profit)}</th></tr>
          </tbody>
        </table>
      </div>

      <div className="box">
        <h2>Distribuição de Custos</h2>

        <div className="distribution-list">
          <p>Custo Produto: {percentPart(cost).toFixed(1)}%</p>
          <p>Embalagem: {percentPart(packaging).toFixed(1)}%</p>
          <p>Comissão: {percentPart(result.marketplaceFee).toFixed(1)}%</p>
          <p>Taxa Fixa: {percentPart(result.rule.fixed).toFixed(1)}%</p>
          <p>Impostos: {percentPart(result.taxValue).toFixed(1)}%</p>
          <p>Lucro Líquido: {percentPart(Math.max(result.profit, 0)).toFixed(1)}%</p>
        </div>
      </div>

      {estimatedSales > 0 && (
        <div className="box">
          <h2>Projeção Mensal</h2>

          <div className="cards">
            <div className="card">
              <h3>Receita Bruta</h3>
              <p>{money(monthlyRevenue)}</p>
            </div>

            <div className="card">
              <h3>Custos Totais</h3>
              <p>{money(monthlyCosts)}</p>
            </div>

            <div className="card">
              <h3>Lucro Líquido</h3>
              <p>{money(monthlyProfit)}</p>
            </div>

            <div className="card">
              <h3>Margem Mensal</h3>
              <p>{monthlyMargin.toFixed(1)}%</p>
            </div>
          </div>
        </div>
      )}

      {estimatedSales > 0 && (
        <div className="box">
          <h2>Projeção Anual</h2>

          <div className="cards">
            <div className="card">
              <h3>Receita Anual</h3>
              <p>{money(yearlyRevenue)}</p>
            </div>

            <div className="card">
              <h3>Custos Anuais</h3>
              <p>{money(yearlyCosts)}</p>
            </div>

            <div className="card">
              <h3>Lucro Anual</h3>
              <p>{money(yearlyProfit)}</p>
            </div>
          </div>
        </div>
      )}

      <div className="box">
        <h2>Compartilhar Resultado</h2>
        <p>Copie o resumo completo para enviar no WhatsApp ou salvar em outro lugar.</p>
        <button type="button" onClick={copySummary}>Copiar resumo completo</button>
      </div>
    </div>
  );
}
