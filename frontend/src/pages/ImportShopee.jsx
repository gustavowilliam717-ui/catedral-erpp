import { useState } from "react";
import API from "../services/api";

export default function ImportShopee() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  async function importProducts() {
    if (!file) {
      alert("Selecione uma planilha CSV da Shopee.");
      return;
    }

    try {
      setLoading(true);
      setResult("");

      const formData = new FormData();
      formData.append("file", file);

      const response = await API.post("/import-shopee-products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setResult(`${response.data.imported} produtos importados com sucesso!`);
    } catch (error) {
      console.log(error);
      setResult("Erro ao importar. Verifique se o backend está no ar e se a rota existe.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <h1>📥 Importar Produtos Shopee</h1>

      <div className="box">
        <h2>Upload da planilha</h2>

        <p>Envie a planilha CSV de Informações de Vendas exportada pela Shopee.</p>

        <input
          type="file"
          accept=".csv"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <br />
        <br />

        <button type="button" onClick={importProducts} disabled={loading}>
          {loading ? "Importando..." : "📥 Importar Produtos"}
        </button>

        {result && <h3>{result}</h3>}
      </div>
    </div>
  );
}
