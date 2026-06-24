import { useState } from "react";
import API from "../services/api";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function sendMessage(event) {
    event.preventDefault();
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", text: input }];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await API.post("/chat", { message: input });
      const answer = response.data.answer || "Sem resposta.";
      setMessages([...newMessages, { role: "assistant", text: answer }]);
    } catch (error) {
      const errorText =
        error?.response?.data?.detail || "Erro ao conectar com o ChatGPT.";
      setMessages([
        ...newMessages,
        { role: "assistant", text: `Erro: ${errorText}` },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="page">
      <h1>Chat GPT</h1>

      <div className="box chat-box">
        <div className="chat-messages">
          {messages.length > 0 ? (
            messages.map((message, index) => (
              <div
                key={index}
                className={`chat-message ${message.role}`}
              >
                <span>{message.role === "user" ? "Você" : "Assistente"}</span>
                <p>{message.text}</p>
              </div>
            ))
          ) : (
            <div className="chat-empty">
              <p>Envie uma mensagem para iniciar o assistente.</p>
            </div>
          )}
        </div>

        <form className="chat-form" onSubmit={sendMessage}>
          <textarea
            placeholder="Pergunte algo sobre estoque, marketplace, precificação ou vendas..."
            value={input}
            onChange={(event) => setInput(event.target.value)}
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Enviando..." : "Enviar"}
          </button>
        </form>
      </div>
    </div>
  );
}
