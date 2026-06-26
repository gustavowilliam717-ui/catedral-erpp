import { useMemo, useState } from "react";

const sidebarGroups = [
  {
    title: "Avaliacoes",
    items: [
      { key: "sac-reviews", label: "Lista de Avaliacoes" },
      { key: "sac-review-auto", label: "Resposta Automatica por IA" },
      { key: "sac-review-template", label: "Modelo de Resposta" },
      { key: "sac-returns", label: "Devolucao/Reembolso" },
    ],
  },
  {
    title: "Atendimento",
    items: [
      { key: "customer-questions", label: "Perguntas" },
      { key: "customer-messages", label: "Mensagens" },
      { key: "claims", label: "Reclamacoes" },
      { key: "customer-block-list", label: "Lista de Bloqueio" },
      { key: "chat", label: "Chatbot de IA" },
    ],
  },
];

const gradeGroups = [
  {
    key: "all",
    label: "Todas",
    helper: "1 a 5 estrelas",
    range: "Visao geral",
  },
  {
    key: "good",
    label: "Boas",
    helper: "4 e 5 estrelas",
    range: "Promotores",
  },
  {
    key: "medium",
    label: "Medias",
    helper: "3 estrelas",
    range: "Neutras",
  },
  {
    key: "bad",
    label: "Ruins",
    helper: "1 e 2 estrelas",
    range: "Criticas",
  },
];

const reviews = [
  {
    id: 1,
    product: "Painel Arco MDF 6mm 1,80m",
    order: "260611R0HWGWDY",
    buyer: "G9zqp22mr2",
    store: "PINK",
    marketplace: "Shopee",
    stars: 5,
    status: "pending",
    date: "21/06/2026 18:46",
    comment:
      "Montagem facil. Acabamento bom e veio tudo certo, firme e bem embalado.",
  },
  {
    id: 2,
    product: "Arco Organico com Degrau",
    order: "260610Q949R0UE",
    buyer: "Cliente Shopee",
    store: "CATEDRAL MDF",
    marketplace: "Shopee",
    stars: 3,
    status: "pending",
    date: "21/06/2026 18:46",
    comment:
      "Produto chegou, mas a embalagem veio amassada em uma lateral.",
  },
  {
    id: 3,
    product: "Mesa Redonda Compacta",
    order: "260609SHP2218",
    buyer: "MesaCasa25",
    store: "CATEDRAL MDF",
    marketplace: "Shopee",
    stars: 2,
    status: "pending",
    date: "20/06/2026 14:12",
    comment:
      "Demorou para atualizar o envio e uma parte veio marcada. Preciso de suporte.",
  },
  {
    id: 4,
    product: "Kit 2 Banquetas MDF",
    order: "MLB-77341209",
    buyer: "DecorOnline",
    store: "Loja NEXT ERP",
    marketplace: "Mercado Livre",
    stars: 4,
    status: "answered",
    date: "19/06/2026 09:27",
    comment: "Produto bonito e igual ao anuncio. Recomendo.",
  },
];

const replyModels = [
  {
    name: "Padrao Geral",
    grade: "Todas",
    content:
      "Obrigado pela sua avaliacao. Sua opiniao ajuda a NEXT ERP a melhorar o atendimento da loja.",
    default: true,
  },
  {
    name: "Acolhimento Critico",
    grade: "Ruins",
    content:
      "Sentimos muito pela experiencia. Nosso time vai chamar voce para resolver o caso com prioridade.",
    default: false,
  },
];

function classifyStars(stars) {
  if (stars >= 4) return "good";
  if (stars === 3) return "medium";
  return "bad";
}

function getGradeLabel(key) {
  return gradeGroups.find((grade) => grade.key === key)?.label || "Todas";
}

function Stars({ value }) {
  return (
    <span className="star-rating" aria-label={`${value} estrelas`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={star <= value ? "filled" : ""}>
          {star <= value ? "★" : "☆"}
        </span>
      ))}
    </span>
  );
}

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      className={`toggle-switch ${checked ? "on" : ""}`}
      onClick={onChange}
      aria-pressed={checked}
    >
      <span />
    </button>
  );
}

export default function SacReviews({ activePage = "sac-reviews", setPage }) {
  return (
    <div className="settings-page sac-page">
      <SacSidebar activePage={activePage} setPage={setPage} />

      <main className="settings-content">
        {activePage === "sac-reviews" && <ReviewList />}
        {activePage === "sac-review-auto" && <AutoReply />}
        {activePage === "sac-review-template" && <ReplyTemplates />}
        {activePage === "sac-returns" && <ReturnsPanel />}
      </main>
    </div>
  );
}

function SacSidebar({ activePage, setPage }) {
  return (
    <aside className="settings-sidebar">
      <h2>SAC</h2>

      {sidebarGroups.map((group) => (
        <div key={group.title}>
          <strong>{group.title}</strong>
          {group.items.map((item) => (
            <button
              type="button"
              key={item.key}
              className={activePage === item.key ? "active" : ""}
              onClick={() => setPage?.(item.key)}
            >
              {item.label}
            </button>
          ))}
        </div>
      ))}
    </aside>
  );
}

function ReviewList() {
  const [gradeFilter, setGradeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("pending");
  const [search, setSearch] = useState("");

  const counts = useMemo(() => {
    return gradeGroups.reduce((total, grade) => {
      total[grade.key] =
        grade.key === "all"
          ? reviews.length
          : reviews.filter((review) => classifyStars(review.stars) === grade.key)
              .length;
      return total;
    }, {});
  }, []);

  const filteredReviews = useMemo(() => {
    const term = search.toLowerCase();

    return reviews.filter((review) => {
      const reviewGrade = classifyStars(review.stars);
      const matchesGrade = gradeFilter === "all" || reviewGrade === gradeFilter;
      const matchesStatus =
        statusFilter === "all" || review.status === statusFilter;
      const matchesSearch = [review.product, review.order, review.buyer]
        .join(" ")
        .toLowerCase()
        .includes(term);

      return matchesGrade && matchesStatus && matchesSearch;
    });
  }, [gradeFilter, statusFilter, search]);

  return (
    <>
      <section className="sac-command-card">
        <div>
          <span className="section-kicker">SAC Marketplace</span>
          <h2>Avaliacoes classificadas por estrelas</h2>
          <p>
            As avaliacoes entram separadas por grau: boas com 4 e 5 estrelas,
            medias com 3 estrelas e ruins com 1 ou 2 estrelas.
          </p>
        </div>

        <button type="button">Sincronizar Avaliacoes</button>
      </section>

      <section className="sac-filter-bar">
        <select>
          <option>Todas Lojas</option>
          <option>CATEDRAL MDF</option>
          <option>PINK</option>
        </select>
        <select
          value={gradeFilter}
          onChange={(event) => setGradeFilter(event.target.value)}
        >
          {gradeGroups.map((grade) => (
            <option value={grade.key} key={grade.key}>
              {grade.label} - {grade.helper}
            </option>
          ))}
        </select>
        <input
          placeholder="N do pedido, produto ou comprador"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <input type="date" />
      </section>

      <section className="sac-grade-grid">
        {gradeGroups.map((grade) => (
          <button
            type="button"
            key={grade.key}
            className={`sac-grade-card ${grade.key} ${
              gradeFilter === grade.key ? "active" : ""
            }`}
            onClick={() => setGradeFilter(grade.key)}
          >
            <span>{grade.range}</span>
            <strong>{grade.label}</strong>
            <small>{grade.helper}</small>
            <b>{counts[grade.key] || 0}</b>
          </button>
        ))}
      </section>

      <section className="sac-status-tabs">
        {[
          { key: "pending", label: "Pendente" },
          { key: "answered", label: "Respondido" },
          { key: "ignored", label: "Ignorado" },
          { key: "all", label: "Todos" },
        ].map((status) => (
          <button
            type="button"
            key={status.key}
            className={statusFilter === status.key ? "active" : ""}
            onClick={() => setStatusFilter(status.key)}
          >
            {status.label}
          </button>
        ))}
      </section>

      <div className="sac-review-workspace">
        <section className="sac-review-list">
          {filteredReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}

          {filteredReviews.length === 0 && (
            <div className="empty-state-box sac-empty">
              <span />
              <strong>Nenhuma avaliacao nesse filtro</strong>
            </div>
          )}
        </section>

        <aside className="sac-quick-reply">
          <div className="sac-quick-heading">
            <strong>Resposta Rapida</strong>
            <button type="button">+ Adicionar</button>
          </div>
          <div className="sac-reply-hint">
            <span>i</span>
            <p>Arraste ou aplique um modelo pronto ao conteudo da resposta.</p>
          </div>
          <input placeholder="Procurar conteudo" />
          <div className="empty-state-box compact">
            <span />
            <strong>Sem modelo selecionado</strong>
          </div>
        </aside>
      </div>
    </>
  );
}

function ReviewCard({ review }) {
  const grade = classifyStars(review.stars);

  return (
    <article className={`review-card ${grade}`}>
      <div className="review-product-line">
        <div className="review-thumb" />
        <div>
          <strong>{review.product}</strong>
          <a>{review.order}</a>
        </div>
        <span>{review.store}</span>
      </div>

      <div className="review-body-grid">
        <div>
          <div className="review-rating-line">
            <span>Qualificacao</span>
            <Stars value={review.stars} />
            <b>{getGradeLabel(grade)}</b>
          </div>

          <p className="review-meta">
            Comprador: <strong>{review.buyer}</strong> | {review.date} |{" "}
            {review.marketplace}
          </p>
          <p className="review-comment">{review.comment}</p>

          <textarea placeholder="Insira conteudo para responder ao comentario" />
          <div className="review-actions">
            <span>0 / 500</span>
            <button type="button">Enviar</button>
            <button type="button" className="secondary">
              Usar IA
            </button>
          </div>
        </div>

        <div className="review-sync-actions">
          <button type="button">Sincronizar</button>
          <button type="button" className="secondary">
            Ignorar
          </button>
        </div>
      </div>
    </article>
  );
}

function AutoReply() {
  const [enabled, setEnabled] = useState({
    good: true,
    medium: true,
    bad: false,
  });
  const [selectedGrade, setSelectedGrade] = useState("good");

  function toggle(key) {
    setEnabled((current) => ({ ...current, [key]: !current[key] }));
  }

  return (
    <>
      <section className="sac-command-card">
        <div>
          <span className="section-kicker">Automacao</span>
          <h2>Resposta automatica por IA</h2>
          <p>
            Configure se o ERP deve responder avaliacoes sozinho e qual tom de
            mensagem usar para cada faixa de estrelas.
          </p>
        </div>
        <span className="status-chip ok">IA pronta para configurar</span>
      </section>

      <section className="settings-tool-card sac-auto-table">
        <table>
          <thead>
            <tr>
              <th>Estado</th>
              <th>Grau</th>
              <th>Regra por estrelas</th>
              <th>Mensagem IA</th>
              <th>Enviada hoje</th>
              <th>Acoes</th>
            </tr>
          </thead>
          <tbody>
            {gradeGroups
              .filter((grade) => grade.key !== "all")
              .map((grade) => (
                <tr key={grade.key}>
                  <td>
                    <Toggle
                      checked={enabled[grade.key]}
                      onChange={() => toggle(grade.key)}
                    />
                  </td>
                  <td>
                    <span className={`review-grade-pill ${grade.key}`}>
                      {grade.label}
                    </span>
                  </td>
                  <td>{grade.helper}</td>
                  <td>
                    {grade.key === "good"
                      ? "Agradecer e reforcar recompra"
                      : grade.key === "medium"
                        ? "Acolher ponto de melhoria"
                        : "Pedir desculpas e abrir suporte"}
                  </td>
                  <td>0</td>
                  <td>
                    <button type="button" onClick={() => setSelectedGrade(grade.key)}>
                      Configuracoes
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </section>

      <section className="settings-tool-card sac-ai-config">
        <h2>Campo de mensagens automaticas por IA</h2>
        <div className="sac-ai-form">
          <label>
            Grau da avaliacao
            <select
              value={selectedGrade}
              onChange={(event) => setSelectedGrade(event.target.value)}
            >
              <option value="good">Boas - 4 e 5 estrelas</option>
              <option value="medium">Medias - 3 estrelas</option>
              <option value="bad">Ruins - 1 e 2 estrelas</option>
            </select>
          </label>

          <label>
            Instrucao para a IA
            <textarea
              key={selectedGrade}
              defaultValue={
                selectedGrade === "good"
                  ? "Responda agradecendo, cite que a loja fica feliz com a experiencia e convide para comprar novamente."
                  : selectedGrade === "medium"
                    ? "Responda com empatia, agradeca o feedback e diga que a loja vai melhorar o ponto citado."
                    : "Responda pedindo desculpas, informe que o suporte vai acompanhar o caso e evite prometer algo sem verificacao."
              }
            />
          </label>

          <div className="sac-ai-options">
            <label>
              <input type="checkbox" defaultChecked />
              Apenas responder avaliacoes com comentario
            </label>
            <label>
              <input type="checkbox" />
              Enviar para aprovacao antes de publicar
            </label>
          </div>

          <button type="button">Salvar configuracao</button>
        </div>
      </section>
    </>
  );
}

function ReplyTemplates() {
  return (
    <>
      <section className="sac-command-card">
        <div>
          <span className="section-kicker">Modelos</span>
          <h2>Mensagem padrao para todas as avaliacoes</h2>
          <p>
            Crie respostas reutilizaveis e deixe um modelo padrao para aplicar
            em boas, medias e ruins quando quiser responder em massa.
          </p>
        </div>
        <button type="button">+ Criar Modelo</button>
      </section>

      <section className="settings-tool-card sac-template-form">
        <h2>Criar mensagem padrao</h2>
        <div className="sac-template-grid">
          <label>
            Nome do modelo
            <input defaultValue="Mensagem padrao da loja" />
          </label>
          <label>
            Aplicar em
            <select>
              <option>Todas as avaliacoes</option>
              <option>Boas</option>
              <option>Medias</option>
              <option>Ruins</option>
            </select>
          </label>
          <label className="full">
            Conteudo da resposta
            <textarea defaultValue="Obrigado pela sua avaliacao. Ela e muito importante para nossa loja e ajuda a melhorar sua experiencia nas proximas compras." />
          </label>
          <label className="sac-checkbox-inline">
            <input type="checkbox" defaultChecked />
            Definir como modelo padrao para todas as avaliacoes
          </label>
          <button type="button">Salvar modelo</button>
        </div>
      </section>

      <section className="settings-tool-card sac-model-table">
        <table>
          <thead>
            <tr>
              <th>Nome do Modelo</th>
              <th>Grau aplicado</th>
              <th>Conteudo</th>
              <th>Modelo Padrao</th>
              <th>Acoes</th>
            </tr>
          </thead>
          <tbody>
            {replyModels.map((model) => (
              <tr key={model.name}>
                <td>{model.name}</td>
                <td>{model.grade}</td>
                <td>{model.content}</td>
                <td>
                  {model.default ? (
                    <span className="default-label">Predefinido</span>
                  ) : (
                    "-"
                  )}
                </td>
                <td>
                  <button type="button">Editar</button>
                  <button type="button" className="secondary">
                    Duplicar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}

function ReturnsPanel() {
  return (
    <section className="settings-tool-card sac-returns-card">
      <div className="settings-table-toolbar">
        <select>
          <option>Todas Lojas</option>
          <option>Shopee</option>
          <option>Mercado Livre</option>
        </select>
        <input placeholder="Pedido, comprador ou motivo" />
        <select>
          <option>Todos Status</option>
          <option>Pendente</option>
          <option>Reembolsado</option>
          <option>Em disputa</option>
        </select>
        <button type="button">Sincronizar</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Pedido</th>
            <th>Marketplace</th>
            <th>Motivo</th>
            <th>Status</th>
            <th>Atualizado</th>
            <th>Acoes</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan="6">
              <div className="empty-state-box sac-empty">
                <span />
                <strong>Nenhuma devolucao ou reembolso pendente</strong>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  );
}
