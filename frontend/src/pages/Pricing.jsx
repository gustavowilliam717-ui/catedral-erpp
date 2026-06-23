import { useEffect, useState } from "react";
import API from "../services/api";

export default function Pricing({ initialProductId, clearInitialProductId }) {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedAdMarketplaces, setSelectedAdMarketplaces] = useState(["Shopee"]);
  const [publishMessage, setPublishMessage] = useState("");

  const [data, setData] = useState({
    sellerType: "CNPJ",
    marketplace: "Shopee",
    mlAdType: "Clássico",
    taxPercent: "",

    cost: "",
    packaging: "",

    consumable1Name: "Bolha",
    consumable1Value: "",
    consumable2Name: "Caixa",
    consumable2Value: "",
    consumable3Name: "Parafusos",
    consumable3Value: "",
    consumable4Name: "Tinta",
    consumable4Value: "",

    calculationMode: "margin",
    desiredMargin: 30,
    salePrice: "",
    desiredProfitValue: "",

    estimatedSales: "",
    discountPercent: "",
    couponType: "percent",
    couponValue: "",

    freeShippingProgram: false,
    shopeeVideo: false,
    affiliateCommission: false,
    affiliatePercent: 5,
    adsPercent: "",
    highlightCampaign: false,
    shopeeAcelera: "0",
    easyReturn: false,
  });

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    if (!initialProductId || products.length === 0) return;

    selectProduct(initialProductId, products);
    clearInitialProductId?.();
  }, [initialProductId, products]);

  async function loadProducts() {
    const response = await API.get("/products");
    setProducts(response.data);
  }

  function selectProduct(id, productList = products) {
    setSelectedProduct(id);

    const product = productList.find((item) => String(item.id) === String(id));
    if (!product) return;

    setData({
      ...data,
      cost: product.cost || "",
      marketplace: product.marketplace || "Shopee",
    });
    setSelectedAdMarketplaces([product.marketplace || "Shopee"]);
    setPublishMessage("");
  }

  function update(field, value) {
    setData({ ...data, [field]: value });
  }

  function num(value) {
    return Number(value) || 0;
  }

  function money(value) {
    return "R$ " + Number(value || 0).toFixed(2);
  }

  function getShopeeFixedFee(price) {
    if (price >= 200) return 26;
    if (price >= 100) return 20;
    if (price >= 80) return 16;
    if (price >= 50) return 12;
    if (price >= 30) return 8;
    return 4;
  }

  function getMarketplaceRule(marketplace, price) {
    if (marketplace === "Shopee") {
      return {
        percent: 14,
        fixed: data.sellerType === "CPF" ? 7 : getShopeeFixedFee(price),
      };
    }

    if (marketplace === "Mercado Livre") {
      return {
        percent: data.mlAdType === "Premium" ? 17 : 12,
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
      return {
        percent: 16,
        fixed: 0,
      };
    }

    return {
      percent: 16,
      fixed: 0,
    };
  }

  const cost = num(data.cost);
  const packaging = num(data.packaging);

  const consumables =
    num(data.consumable1Value) +
    num(data.consumable2Value) +
    num(data.consumable3Value) +
    num(data.consumable4Value);

  const productCost = cost + packaging + consumables;

  const taxPercent = num(data.taxPercent);
  const discountPercent = num(data.discountPercent);
  const couponValue = num(data.couponValue);

  const freeShippingPercent =
    data.marketplace === "Shopee" && data.freeShippingProgram ? 6 : 0;

  const shopeeVideoPercent =
    data.marketplace === "Shopee" && data.shopeeVideo ? 2 : 0;

  const affiliatePercent =
    data.marketplace === "Shopee" && data.affiliateCommission
      ? num(data.affiliatePercent)
      : 0;

  const adsPercent = num(data.adsPercent);
  const highlightPercent = data.highlightCampaign ? 3.5 : 0;
  const aceleraPercent = num(data.shopeeAcelera);
  const easyReturnValue = data.easyReturn ? 0.49 : 0;

  function calculateByPrice(finalPrice, marketplace = data.marketplace) {
    const afterDiscount = finalPrice - finalPrice * (discountPercent / 100);

    const afterCoupon =
      data.couponType === "percent"
        ? afterDiscount - afterDiscount * (couponValue / 100)
        : afterDiscount - couponValue;

    const rule = getMarketplaceRule(marketplace, finalPrice);

    const marketplaceFee = afterCoupon * (rule.percent / 100);
    const taxValue = afterCoupon * (taxPercent / 100);
    const freeShippingValue = afterCoupon * (freeShippingPercent / 100);
    const shopeeVideoValue = afterCoupon * (shopeeVideoPercent / 100);
    const affiliateValue = afterCoupon * (affiliatePercent / 100);
    const adsValue = afterCoupon * (adsPercent / 100);
    const highlightValue = afterCoupon * (highlightPercent / 100);
    const aceleraValue = afterCoupon * (aceleraPercent / 100);

    const marketingValue =
      freeShippingValue +
      shopeeVideoValue +
      affiliateValue +
      adsValue +
      highlightValue +
      aceleraValue;

    const totalFees =
      marketplaceFee +
      rule.fixed +
      taxValue +
      marketingValue +
      easyReturnValue;

    const totalCostAndFees = productCost + totalFees;
    const profit = afterCoupon - totalCostAndFees;
    const margin = afterCoupon > 0 ? (profit / afterCoupon) * 100 : 0;

    const totalPercentual =
      rule.percent +
      taxPercent +
      freeShippingPercent +
      shopeeVideoPercent +
      affiliatePercent +
      adsPercent +
      highlightPercent +
      aceleraPercent;

    const totalFixed = rule.fixed + easyReturnValue;

    return {
      finalPrice,
      afterCoupon,
      rule,
      marketplaceFee,
      taxValue,
      freeShippingValue,
      shopeeVideoValue,
      affiliateValue,
      adsValue,
      highlightValue,
      aceleraValue,
      marketingValue,
      totalFees,
      totalCostAndFees,
      profit,
      margin,
      totalPercentual,
      totalFixed,
    };
  }

  function calculateSuggestedPrice(marketplace = data.marketplace) {
    if (data.calculationMode === "salePrice") {
      return num(data.salePrice);
    }

    let estimatedPrice = productCost * 2 || 1;

    for (let i = 0; i < 30; i++) {
      const rule = getMarketplaceRule(marketplace, estimatedPrice);

      const percentWithoutProfit =
        rule.percent +
        taxPercent +
        freeShippingPercent +
        shopeeVideoPercent +
        affiliatePercent +
        adsPercent +
        highlightPercent +
        aceleraPercent;

      const fixedCosts = rule.fixed + easyReturnValue;

      if (data.calculationMode === "profitValue") {
        estimatedPrice =
          (productCost + fixedCosts + num(data.desiredProfitValue)) /
          (1 - percentWithoutProfit / 100);
      } else {
        estimatedPrice =
          (productCost + fixedCosts) /
          (1 - (percentWithoutProfit + num(data.desiredMargin)) / 100);
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

  const estimatedSales = num(data.estimatedSales);
  const monthlyRevenue = result.finalPrice * estimatedSales;
  const monthlyCosts = result.totalCostAndFees * estimatedSales;
  const monthlyProfit = result.profit * estimatedSales;
  const monthlyMargin =
    monthlyRevenue > 0 ? (monthlyProfit / monthlyRevenue) * 100 : 0;

  const yearlyRevenue = monthlyRevenue * 12;
  const yearlyCosts = monthlyCosts * 12;
  const yearlyProfit = monthlyProfit * 12;

  function compareMarketplace(marketplace) {
    const price = calculateSuggestedPrice(marketplace);
    const calc = calculateByPrice(price, marketplace);

    return {
      marketplace,
      price,
      profit: calc.profit,
      margin: calc.margin,
    };
  }

  const comparisons = [
    compareMarketplace("Shopee"),
    compareMarketplace("Mercado Livre"),
    compareMarketplace("TikTok Shop"),
    compareMarketplace("Amazon"),
  ];

  function toggleAdMarketplace(marketplace) {
    setPublishMessage("");

    setSelectedAdMarketplaces((current) =>
      current.includes(marketplace)
        ? current.filter((item) => item !== marketplace)
        : [...current, marketplace]
    );
  }

  function selectAllMarketplaces() {
    setPublishMessage("");
    setSelectedAdMarketplaces(comparisons.map((item) => item.marketplace));
  }

  function clearMarketplaces() {
    setPublishMessage("");
    setSelectedAdMarketplaces([]);
  }

  function publishSelectedMarketplaces() {
    const product = products.find(
      (item) => String(item.id) === String(selectedProduct)
    );

    if (!product) {
      setPublishMessage("Selecione um produto antes de montar os anuncios.");
      return;
    }

    if (selectedAdMarketplaces.length === 0) {
      setPublishMessage("Escolha pelo menos um marketplace para anunciar.");
      return;
    }

    setPublishMessage(
      `Plano de anuncio criado para ${product.name} em ${selectedAdMarketplaces.join(", ")}. A publicacao real sera ligada quando conectarmos as APIs dos marketplaces.`
    );
  }

  function copySummary() {
    const text = `
📊 RESUMO DE PRECIFICAÇÃO

Marketplace: ${data.marketplace}
Vendedor: ${data.sellerType}

💰 Preço sugerido: ${money(result.finalPrice)}
✅ Lucro líquido: ${money(result.profit)}
📈 Margem real: ${result.margin.toFixed(1)}%

🔵 Custo efetivo:
${result.totalPercentual.toFixed(1)}% + ${money(result.totalFixed)}

📦 Custos:
Produto: ${money(cost)}
Embalagem: ${money(packaging)}
Consumíveis: ${money(consumables)}

🏪 Taxas:
Comissão: ${money(result.marketplaceFee)}
Taxa fixa: ${money(result.rule.fixed)}
Imposto: ${money(result.taxValue)}
Marketing: ${money(result.marketingValue)}
Devolução Fácil: ${money(easyReturnValue)}
    `.trim();

    navigator.clipboard.writeText(text);
    alert("Resumo copiado!");
  }

  async function savePricingHistory() {
    const product = products.find(
      (item) => String(item.id) === String(selectedProduct)
    );

    await API.post("/pricing-history", {
      product_id: selectedProduct ? Number(selectedProduct) : 0,
      sku: product?.sku || "",
      product_name: product?.name || "Produto sem nome",
      marketplace: data.marketplace,
      suggested_price: Number(result.finalPrice),
      profit: Number(result.profit),
      margin: Number(result.margin),
    });

    alert("Precificação salva no histórico!");
  }

  return (
    <div className="page">
      <h1>Precificação</h1>

      <div className="box">
        <h2>Selecionar produto cadastrado</h2>

        <select
          value={selectedProduct}
          onChange={(e) => selectProduct(e.target.value)}
        >
          <option value="">Escolha um produto cadastrado</option>

          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.sku} - {product.name}
            </option>
          ))}
        </select>
      </div>

      <div className="box">
        <h2>Dados do Produto</h2>

        <div className="form-grid">
          <select
            value={data.sellerType}
            onChange={(e) => update("sellerType", e.target.value)}
          >
            <option>CNPJ</option>
            <option>CPF</option>
          </select>

          <select
            value={data.marketplace}
            onChange={(e) => update("marketplace", e.target.value)}
          >
            <option>Shopee</option>
            <option>Mercado Livre</option>
            <option>TikTok Shop</option>
            <option>Amazon</option>
          </select>

          {data.marketplace === "Mercado Livre" && (
            <select
              value={data.mlAdType}
              onChange={(e) => update("mlAdType", e.target.value)}
            >
              <option>Clássico</option>
              <option>Premium</option>
            </select>
          )}

          <input
            placeholder="Imposto (%)"
            value={data.taxPercent}
            onChange={(e) => update("taxPercent", e.target.value)}
          />
          <input
            placeholder="Custo do produto"
            value={data.cost}
            onChange={(e) => update("cost", e.target.value)}
          />
          <input
            placeholder="Custo da embalagem"
            value={data.packaging}
            onChange={(e) => update("packaging", e.target.value)}
          />
        </div>
      </div>

      <div className="box">
        <h2>Consumíveis</h2>

        <div className="form-grid">
          <input
            value={data.consumable1Name}
            onChange={(e) => update("consumable1Name", e.target.value)}
          />
          <input
            placeholder="Valor"
            value={data.consumable1Value}
            onChange={(e) => update("consumable1Value", e.target.value)}
          />

          <input
            value={data.consumable2Name}
            onChange={(e) => update("consumable2Name", e.target.value)}
          />
          <input
            placeholder="Valor"
            value={data.consumable2Value}
            onChange={(e) => update("consumable2Value", e.target.value)}
          />

          <input
            value={data.consumable3Name}
            onChange={(e) => update("consumable3Name", e.target.value)}
          />
          <input
            placeholder="Valor"
            value={data.consumable3Value}
            onChange={(e) => update("consumable3Value", e.target.value)}
          />

          <input
            value={data.consumable4Name}
            onChange={(e) => update("consumable4Name", e.target.value)}
          />
          <input
            placeholder="Valor"
            value={data.consumable4Value}
            onChange={(e) => update("consumable4Value", e.target.value)}
          />
        </div>
      </div>

      <div className="box">
        <h2>Como calcular o preço?</h2>

        <div className="pricing-options">
          <button type="button" onClick={() => update("calculationMode", "margin")}>
            Margem de Lucro %
          </button>
          <button type="button" onClick={() => update("calculationMode", "salePrice")}>
            Preço de Venda
          </button>
          <button type="button" onClick={() => update("calculationMode", "profitValue")}>
            Lucro Desejado R$
          </button>
        </div>

        <div className="form-grid">
          {data.calculationMode === "margin" && (
            <input
              placeholder="Margem desejada %"
              value={data.desiredMargin}
              onChange={(e) => update("desiredMargin", e.target.value)}
            />
          )}

          {data.calculationMode === "salePrice" && (
            <input
              placeholder="Preço de venda R$"
              value={data.salePrice}
              onChange={(e) => update("salePrice", e.target.value)}
            />
          )}

          {data.calculationMode === "profitValue" && (
            <input
              placeholder="Lucro desejado R$"
              value={data.desiredProfitValue}
              onChange={(e) => update("desiredProfitValue", e.target.value)}
            />
          )}
        </div>
      </div>

      <div className="box">
        <h2>Marketing e Simulações</h2>

        <div className="form-grid">
          <input
            placeholder="Vendas estimadas por mês"
            value={data.estimatedSales}
            onChange={(e) => update("estimatedSales", e.target.value)}
          />
          <input
            placeholder="Desconto %"
            value={data.discountPercent}
            onChange={(e) => update("discountPercent", e.target.value)}
          />

          <select
            value={data.couponType}
            onChange={(e) => update("couponType", e.target.value)}
          >
            <option value="percent">Cupom em %</option>
            <option value="real">Cupom em R$</option>
          </select>

          <input
            placeholder="Valor do cupom"
            value={data.couponValue}
            onChange={(e) => update("couponValue", e.target.value)}
          />
          <input
            placeholder="Shopee Ads %"
            value={data.adsPercent}
            onChange={(e) => update("adsPercent", e.target.value)}
          />
        </div>

        {data.marketplace === "Shopee" && (
          <>
            <label className="check-line">
              <input
                type="checkbox"
                checked={data.freeShippingProgram}
                onChange={(e) => update("freeShippingProgram", e.target.checked)}
              />
              Programa Frete Grátis Shopee (+6%)
            </label>

            <label className="check-line">
              <input
                type="checkbox"
                checked={data.shopeeVideo}
                onChange={(e) => update("shopeeVideo", e.target.checked)}
              />
              Shopee Vídeo (+2%)
            </label>

            <label className="check-line">
              <input
                type="checkbox"
                checked={data.affiliateCommission}
                onChange={(e) => update("affiliateCommission", e.target.checked)}
              />
              Comissão de Afiliados
            </label>

            {data.affiliateCommission && (
              <input
                placeholder="Percentual afiliado %"
                value={data.affiliatePercent}
                onChange={(e) => update("affiliatePercent", e.target.value)}
              />
            )}

            <select
              value={data.shopeeAcelera}
              onChange={(e) => update("shopeeAcelera", e.target.value)}
            >
              <option value="0">Não uso Shopee Acelera</option>
              <option value="3">Shopee Acelera 3%</option>
              <option value="5">Shopee Acelera 5%</option>
              <option value="10">Shopee Acelera 10%</option>
            </select>
          </>
        )}

        <label className="check-line">
          <input
            type="checkbox"
            checked={data.highlightCampaign}
            onChange={(e) => update("highlightCampaign", e.target.checked)}
          />
          Campanhas de Destaque (+3,5%)
        </label>

        <label className="check-line">
          <input
            type="checkbox"
            checked={data.easyReturn}
            onChange={(e) => update("easyReturn", e.target.checked)}
          />
          Devolução Fácil (+R$ 0,49)
        </label>
      </div>

      <div className="result-highlight">
        <h2>Preço Sugerido</h2>
        <strong>{money(result.finalPrice)}</strong>
        <span>
          Lucro Real: {money(result.profit)} ({result.margin.toFixed(1)}%)
        </span>
      </div>

      <div className="cards">
        <div className="card">
          <h3>Custo Efetivo da Venda</h3>
          <p>{result.totalPercentual.toFixed(1)}%</p>
          <small>+ {money(result.totalFixed)}</small>
        </div>

        <div className="card">
          <h3>Custo Total + Taxas</h3>
          <p>{money(result.totalCostAndFees)}</p>
        </div>

        <div className="card">
          <h3>Taxas Marketplace</h3>
          <p>{money(result.marketplaceFee + result.rule.fixed)}</p>
        </div>

        <div className="card">
          <h3>Marketing</h3>
          <p>{money(result.marketingValue)}</p>
        </div>
      </div>

      <div className="box">
        <h2>🔒 Taxas Oficiais Aplicadas</h2>

        <table>
          <tbody>
            <tr><td>Marketplace</td><td>{data.marketplace}</td></tr>
            <tr><td>Tipo de vendedor</td><td>{data.sellerType}</td></tr>
            <tr><td>Comissão base</td><td>{result.rule.percent}%</td></tr>
            <tr><td>Imposto informado</td><td>{taxPercent}%</td></tr>
            <tr><td>Taxa fixa automática</td><td>{money(result.rule.fixed)}</td></tr>
            <tr><td>Devolução Fácil</td><td>{money(easyReturnValue)}</td></tr>
          </tbody>
        </table>
      </div>

      <div className="box">
        <h2>Detalhamento de Custos e Taxas</h2>

        <table>
          <tbody>
            <tr><td>Custo Produto</td><td>{money(cost)}</td></tr>
            <tr><td>Embalagem</td><td>{money(packaging)}</td></tr>
            <tr><td>Consumíveis</td><td>{money(consumables)}</td></tr>
            <tr><td>Comissão {data.marketplace}</td><td>{money(result.marketplaceFee)}</td></tr>
            <tr><td>Taxa fixa</td><td>{money(result.rule.fixed)}</td></tr>
            <tr><td>Imposto informado</td><td>{money(result.taxValue)}</td></tr>
            <tr><td>Marketing</td><td>{money(result.marketingValue)}</td></tr>
            <tr><td>Devolução Fácil</td><td>{money(easyReturnValue)}</td></tr>
            <tr><th>Total custos + taxas</th><th>{money(result.totalCostAndFees)}</th></tr>
            <tr><th>Lucro líquido</th><th>{money(result.profit)}</th></tr>
          </tbody>
        </table>
      </div>

      <div className="box">
        <h2>Comparar Marketplaces</h2>

        <table>
          <thead>
            <tr>
              <th>Marketplace</th>
              <th>Preço Ideal</th>
              <th>Lucro</th>
              <th>Margem</th>
            </tr>
          </thead>

          <tbody>
            {comparisons.map((item) => (
              <tr key={item.marketplace}>
                <td>{item.marketplace}</td>
                <td>{money(item.price)}</td>
                <td>{money(item.profit)}</td>
                <td>{item.margin.toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="box marketplace-publish-panel">
        <div className="publish-header">
          <div>
            <span className="section-kicker">Anuncios</span>
            <h2>Anunciar nos marketplaces</h2>
            <p>
              Escolha onde este produto sera anunciado. Por enquanto o ERP monta
              o plano de anuncio; a publicacao real entra quando conectarmos as
              APIs de cada marketplace.
            </p>
          </div>

          <div className="publish-actions">
            <button type="button" onClick={selectAllMarketplaces}>
              Anunciar em todos
            </button>
            <button type="button" className="secondary" onClick={clearMarketplaces}>
              Limpar
            </button>
          </div>
        </div>

        <div className="marketplace-options">
          {comparisons.map((item) => {
            const selected = selectedAdMarketplaces.includes(item.marketplace);

            return (
              <button
                type="button"
                key={item.marketplace}
                className={selected ? "selected" : ""}
                onClick={() => toggleAdMarketplace(item.marketplace)}
              >
                <strong>{item.marketplace}</strong>
                <span>Preco sugerido: {money(item.price)}</span>
                <span>Lucro: {money(item.profit)}</span>
                <em>{item.margin.toFixed(1)}% margem</em>
              </button>
            );
          })}
        </div>

        <div className="publish-footer">
          <button type="button" onClick={publishSelectedMarketplaces}>
            Criar plano de anuncio
          </button>

          {publishMessage && <strong>{publishMessage}</strong>}
        </div>
      </div>

      {estimatedSales > 0 && (
        <div className="box">
          <h2>Projeção Mensal</h2>

          <div className="cards">
            <div className="card"><h3>Receita</h3><p>{money(monthlyRevenue)}</p></div>
            <div className="card"><h3>Custos</h3><p>{money(monthlyCosts)}</p></div>
            <div className="card"><h3>Lucro</h3><p>{money(monthlyProfit)}</p></div>
            <div className="card"><h3>Margem</h3><p>{monthlyMargin.toFixed(1)}%</p></div>
          </div>
        </div>
      )}

      {estimatedSales > 0 && (
        <div className="box">
          <h2>Projeção Anual</h2>

          <div className="cards">
            <div className="card"><h3>Receita anual</h3><p>{money(yearlyRevenue)}</p></div>
            <div className="card"><h3>Custos anuais</h3><p>{money(yearlyCosts)}</p></div>
            <div className="card"><h3>Lucro anual</h3><p>{money(yearlyProfit)}</p></div>
          </div>
        </div>
      )}

      <div className="box">
        <h2>Salvar Precificação</h2>
        <p>Guarde este cálculo para consultar depois no histórico.</p>
        <button type="button" onClick={savePricingHistory}>
          Salvar precificação
        </button>
      </div>

      <div className="box">
        <h2>Compartilhar Resultado</h2>
        <button type="button" onClick={copySummary}>
          Copiar resumo completo
        </button>
      </div>
    </div>
  );
}
