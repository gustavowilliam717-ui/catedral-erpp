import { useState } from "react";

export default function Pricing() {
  const [data, setData] = useState({
    sku: "",
    productName: "",
    marketplace: "Shopee",

    rawMaterialName: "Matéria-prima",
    rawMaterialValue: "",

    consumable1Name: "Bolha",
    consumable1Value: "",

    consumable2Name: "Caixa",
    consumable2Value: "",

    consumable3Name: "Parafusos",
    consumable3Value: "",

    consumable4Name: "Tinta",
    consumable4Value: "",

    marketplaceFee: 18,
    freight: 4,
    anticipation: 3.5,
    fixedCost: 5,
    desiredProfit: 15
  });

  function update(field, value) {
    setData({ ...data, [field]: value });
  }

  function number(value) {
    return Number(value) || 0;
  }

  function calculatePrice(marketplaceFee) {
    const totalCost =
      number(data.rawMaterialValue) +
      number(data.consumable1Value) +
      number(data.consumable2Value) +
      number(data.consumable3Value) +
      number(data.consumable4Value);

    const totalPercent =
      number(marketplaceFee) +
      number(data.freight) +
      number(data.anticipation) +
      number(data.fixedCost) +
      number(data.desiredProfit);

    if (totalPercent >= 100) {
      return 0;
    }

    return totalCost / (1 - totalPercent / 100);
  }

  const totalCost =
    number(data.rawMaterialValue) +
    number(data.consumable1Value) +
    number(data.consumable2Value) +
    number(data.consumable3Value) +
    number(data.consumable4Value);

  const totalPercent =
    number(data.marketplaceFee) +
    number(data.freight) +
    number(data.anticipation) +
    number(data.fixedCost) +
    number(data.desiredProfit);

  const idealPrice = calculatePrice(data.marketplaceFee);
  const profitValue = idealPrice * (number(data.desiredProfit) / 100);

  return (
    <div className="page">
      <h1>Precificação</h1>

      <div className="box">
        <h2>Dados do produto</h2>

        <div className="form-grid">
          <input
            placeholder="SKU"
            value={data.sku}
            onChange={(e) => update("sku", e.target.value)}
          />

          <input
            placeholder="Nome do produto"
            value={data.productName}
            onChange={(e) => update("productName", e.target.value)}
          />

          <select
            value={data.marketplace}
            onChange={(e) => update("marketplace", e.target.value)}
          >
            <option>Shopee</option>
            <option>Mercado Livre</option>
            <option>Amazon</option>
            <option>TikTok Shop</option>
            <option>Magalu</option>
          </select>
        </div>
      </div>

      <div className="box">
        <h2>Custos diretos</h2>

        <div className="form-grid">
          <input
            placeholder="Nome da matéria-prima"
            value={data.rawMaterialName}
            onChange={(e) => update("rawMaterialName", e.target.value)}
          />

          <input
            placeholder="Valor da matéria-prima"
            value={data.rawMaterialValue}
            onChange={(e) => update("rawMaterialValue", e.target.value)}
          />

          <input
            placeholder="Consumível 1"
            value={data.consumable1Name}
            onChange={(e) => update("consumable1Name", e.target.value)}
          />

          <input
            placeholder="Valor consumível 1"
            value={data.consumable1Value}
            onChange={(e) => update("consumable1Value", e.target.value)}
          />

          <input
            placeholder="Consumível 2"
            value={data.consumable2Name}
            onChange={(e) => update("consumable2Name", e.target.value)}
          />

          <input
            placeholder="Valor consumível 2"
            value={data.consumable2Value}
            onChange={(e) => update("consumable2Value", e.target.value)}
          />

          <input
            placeholder="Consumível 3"
            value={data.consumable3Name}
            onChange={(e) => update("consumable3Name", e.target.value)}
          />

          <input
            placeholder="Valor consumível 3"
            value={data.consumable3Value}
            onChange={(e) => update("consumable3Value", e.target.value)}
          />

          <input
            placeholder="Consumível 4"
            value={data.consumable4Name}
            onChange={(e) => update("consumable4Name", e.target.value)}
          />

          <input
            placeholder="Valor consumível 4"
            value={data.consumable4Value}
            onChange={(e) => update("consumable4Value", e.target.value)}
          />
        </div>
      </div>

      <div className="box">
        <h2>Percentuais</h2>

        <div className="form-grid">
          <input
            placeholder="Taxa marketplace %"
            value={data.marketplaceFee}
            onChange={(e) => update("marketplaceFee", e.target.value)}
          />

          <input
            placeholder="Frete %"
            value={data.freight}
            onChange={(e) => update("freight", e.target.value)}
          />

          <input
            placeholder="Antecipação %"
            value={data.anticipation}
            onChange={(e) => update("anticipation", e.target.value)}
          />

          <input
            placeholder="Custos fixos %"
            value={data.fixedCost}
            onChange={(e) => update("fixedCost", e.target.value)}
          />

          <input
            placeholder="Lucro desejado %"
            value={data.desiredProfit}
            onChange={(e) => update("desiredProfit", e.target.value)}
          />
        </div>
      </div>

      <div className="cards">
        <div className="card">
          <h3>Custo total</h3>
          <p>R$ {totalCost.toFixed(2)}</p>
        </div>

        <div className="card">
          <h3>Total das taxas</h3>
          <p>{totalPercent.toFixed(2)}%</p>
        </div>

        <div className="card">
          <h3>Preço ideal</h3>
          <p>R$ {idealPrice.toFixed(2)}</p>
        </div>

        <div className="card">
          <h3>Lucro em R$</h3>
          <p>R$ {profitValue.toFixed(2)}</p>
        </div>
      </div>

      <div className="box">
        <h2>Simulação por Marketplace</h2>

        <table>
          <thead>
            <tr>
              <th>Marketplace</th>
              <th>Taxa usada</th>
              <th>Preço ideal</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>Shopee</td>
              <td>18%</td>
              <td>R$ {calculatePrice(18).toFixed(2)}</td>
            </tr>

            <tr>
              <td>Mercado Livre</td>
              <td>17%</td>
              <td>R$ {calculatePrice(17).toFixed(2)}</td>
            </tr>

            <tr>
              <td>Amazon</td>
              <td>16%</td>
              <td>R$ {calculatePrice(16).toFixed(2)}</td>
            </tr>

            <tr>
              <td>TikTok Shop</td>
              <td>15%</td>
              <td>R$ {calculatePrice(15).toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="box">
        <h2>Resumo da precificação</h2>

        <p>Produto: {data.productName || "-"}</p>
        <p>SKU: {data.sku || "-"}</p>
        <p>Marketplace escolhido: {data.marketplace}</p>
        <p>Custo total: R$ {totalCost.toFixed(2)}</p>
        <p>Preço ideal: R$ {idealPrice.toFixed(2)}</p>
        <p>Lucro estimado: R$ {profitValue.toFixed(2)}</p>
      </div>
    </div>
  );
}
