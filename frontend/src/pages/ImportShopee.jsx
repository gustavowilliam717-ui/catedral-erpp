import { useState } from "react";
import API from "../services/api";
import { logError } from "../utils/logger";

export default function ImportShopee() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  async function importProducts() {
    if (!file) {
      alert("Selecione uma planilha XLSX ou CSV da Shopee.");
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

      const skipped = response.data.skipped || 0;
      setResult(
        `${response.data.imported || 0} produtos importados/atualizados. ${skipped} linhas ignoradas.`
      );
    } catch (error) {
      logError(error);
      setResult(
        error?.response?.data?.detail ||
          "Erro ao importar. Verifique se a planilha e de Informacoes de Vendas da Shopee."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <h1>📥 Importar Produtos Shopee</h1>

      <div className="box">
        <h2>Upload da planilha</h2>

        <p>Envie a planilha XLSX ou CSV de Informacoes de Vendas exportada pela Shopee.</p>

        <input
          type="file"
          accept=".csv,.xlsx"
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
