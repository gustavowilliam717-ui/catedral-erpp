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

  function getMarketplaceRule(marketplace, price) {
    if (marketplace === "Shopee") {
      let fixed = 4;

      if (price >= 200) fixed = 26;
      else if (price >= 100) fixed = 20;
      else if (price >= 80) fixed = 16;
      else if (price >= 50) fixed = 12;
      else if (price >= 30) fixed = 8;

      return {
        percent: 14,
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
    if (data.calculationMode === "salePrice") {
      return num(data.salePrice);
    }

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
        estimatedPrice =
          (productCost + fixedCosts) /
          (1 - totalPercent / 100);
      }

      if (discountPercent > 0) {
        estimatedPrice = estimatedPrice / (1 - discountPercent / 100);
      }

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
          <button onClick={() => update("calculationMode", "margin")}>
            Margem de Lucro %
          </button>

          <button onClick={() => update("calculationMode", "salePrice")}>
            Preço de Venda
          </button>

          <button onClick={() => update("calculationMode", "profitValue")}>
            Lucro Desejado R$
          </button>
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

      <div className="cards">
        <div className="card">
          <h3>Preço sugerido</h3>
          <p>R$ {result.finalPrice.toFixed(2)}</p>
        </div>

        <div className="card">
          <h3>Lucro real</h3>
          <p>R$ {result.profit.toFixed(2)}</p>
        </div>

        <div className="card">
          <h3>Margem real</h3>
          <p>{result.margin.toFixed(2)}%</p>
        </div>
      </div>

      <div className="box">
        <h2>Detalhamento de Custos e Taxas</h2>

        <table>
          <tbody>
            <tr>
              <td>Custo do Produto</td>
              <td>R$ {cost.toFixed(2)}</td>
            </tr>

            <tr>
              <td>Custo da Embalagem</td>
              <td>R$ {packaging.toFixed(2)}</td>
            </tr>

            <tr>
              <td>Comissão {data.marketplace} ({result.rule.percent}%)</td>
              <td>R$ {result.marketplaceFee.toFixed(2)}</td>
            </tr>

            <tr>
              <td>Taxa Fixa</td>
              <td>R$ {result.rule.fixed.toFixed(2)}</td>
            </tr>

            <tr>
              <td>Impostos</td>
              <td>R$ {result.taxValue.toFixed(2)}</td>
            </tr>

            <tr>
              <td>Marketing / Campanhas</td>
              <td>R$ {(result.highlightValue + result.aceleraValue).toFixed(2)}</td>
            </tr>

            <tr>
              <td>Devolução Fácil</td>
              <td>R$ {easyReturnValue.toFixed(2)}</td>
            </tr>

            <tr>
              <th>Total de Custos + Taxas</th>
              <th>R$ {result.totalCostAndFees.toFixed(2)}</th>
            </tr>

            <tr>
              <th>Lucro Líquido</th>
              <th>R$ {result.profit.toFixed(2)}</th>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
