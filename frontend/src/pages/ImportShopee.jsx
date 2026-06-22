import { useState } from "react";
import API from "../services/api";

export default function ImportShopee() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState("");

  async function importProducts() {
    if (!file) {
      alert("Selecione uma planilha CSV da Shopee.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    const response = await API.post("/import-shopee-products", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    setResult(`${response.data.imported} produtos importados com sucesso!`);
  }

  return (
    <div className="page">
      <h1>Importar Produtos Shopee</h1>

      <div className="box">
        <h2>Upload da planilha</h2>

        <p>
          Envie a planilha CSV de Informações de Vendas exportada pela Shopee.
        </p>

        <input
          type="file"
          accept=".csv"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button type="button" onClick={importProducts}>
          📥 Importar Produtos
        </button>

        {result && <h3>{result}</h3>}
      </div>
    </div>
  );
}
