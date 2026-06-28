// Conteudo da Central de Ajuda - gerado a partir da documentacao de cada modulo.
// Cada modulo tem topicos com passo a passo (steps), dicas (tips) e FAQ.

export const helpContent = [
  {
    "moduleKey": "inicio",
    "moduleLabel": "Inicio e Navegacao",
    "icon": "🏠",
    "intro": "Entenda o Painel NEXT ERP (Home), leia todos os indicadores da tela inicial e aprenda a navegar por cada area do sistema pelo menu superior.",
    "topics": [
      {
        "id": "dashboard",
        "title": "Pagina inicial (Painel NEXT ERP)",
        "path": "Home",
        "summary": "A Home e o painel executivo do NEXT ERP. Ela reune, em uma unica tela, o resumo da sua operacao: faturamento, lucro, valor de estoque, score operacional e alertas de acao.",
        "steps": [
          "1. Clique em Home no menu superior (ou no logotipo NEXT ERP no canto da barra) para abrir o painel.",
          "2. No topo, observe a faixa Painel NEXT ERP, com o selo verde Operacao online indicando que o sistema esta carregando os dados.",
          "3. A direita do titulo veja o medidor Score operacional, um numero de 0 a 100 que resume a saude geral da operacao (estoque, cobertura de preco, qualidade dos dados e margem).",
          "4. Logo abaixo, leia a faixa de cartoes (KPIs): Vendas reais (marketplaces), Faturamento projetado, Lucro estimado, Valor em estoque e Potencial de venda.",
          "5. Role a pagina para ver o grafico Faturamento x lucro e clique no botao Atualizar (no canto do grafico) sempre que quiser recarregar os numeros.",
          "6. Confira a secao Prioridades do dia (Fila de acao), que lista pendencias como Produtos sem custo, Produtos sem preco, Estoque baixo e Precificacoes pendentes.",
          "7. Mais abaixo, analise os graficos Precificacoes por canal e Lucro por marketplace, e o bloco Produtos e vendas por marketplace com dados reais.",
          "8. Na coluna da direita, acompanhe o Checklist operacional, os Ultimos movimentos e o ranking de Produtos mais lucrativos."
        ],
        "tips": [
          "Se os cartoes mostrarem R$ 0,00 ou textos como conecte um marketplace e aguardando precificacao, e porque ainda faltam dados: cadastre produtos, rode a precificacao e conecte um marketplace.",
          "O botao Atualizar recarrega os indicadores sem precisar recarregar a pagina inteira do navegador. Use-o apos cadastrar produtos ou salvar precificacoes.",
          "O grafico de meses (Jan a Jun) e uma projecao baseada no seu faturamento e lucro atuais; ele serve para visualizar tendencia, nao e o faturamento real de cada mes."
        ],
        "faq": [
          {
            "q": "Por que meu painel esta zerado?",
            "a": "O painel se alimenta dos seus cadastros. Sem produtos, sem precificacao salva e sem marketplace conectado, os indicadores ficam em zero. Cadastre produtos em Produtos > Produtos do Armazem e rode a Calculadora de Preco."
          },
          {
            "q": "O que e o Score operacional?",
            "a": "E uma nota de 0 a 100 que combina quatro fatores: estoque saudavel, cobertura de preco, qualidade dos dados e margem media. Quanto mais completa e organizada a sua base, maior o score."
          },
          {
            "q": "Cliquei em Atualizar e nada mudou. E normal?",
            "a": "Sim, se nao houve nenhuma alteracao nos dados desde o ultimo carregamento. O botao busca os numeros mais recentes; se nada mudou, os indicadores continuam iguais."
          }
        ]
      },
      {
        "id": "dashboard-kpis",
        "title": "Como ler os indicadores (cartoes KPI)",
        "path": "Home > Faixa de cartoes (KPIs)",
        "summary": "Os cinco cartoes coloridos no topo da Home resumem dinheiro e estoque da operacao. Cada cartao mostra um valor principal e uma legenda explicativa abaixo.",
        "steps": [
          "1. Vendas reais (marketplaces): soma o valor das vendas/pedidos ja sincronizados dos marketplaces. A legenda mostra quantos pedidos foram sincronizados ou pede para conectar um marketplace.",
          "2. Faturamento projetado: soma os precos sugeridos do seu historico de precificacao. A legenda indica historico ativo ou aguardando precificacao.",
          "3. Lucro estimado: soma o lucro do historico de precificacao. A legenda mostra a sua margem media em porcentagem.",
          "4. Valor em estoque: multiplica o custo pelo saldo de cada produto e soma tudo. A legenda informa quantos produtos estao monitorados.",
          "5. Potencial de venda: multiplica o preco de venda pelo saldo de cada produto. Representa quanto voce faturaria vendendo todo o estoque atual.",
          "6. Use a cor do cartao apenas como apoio visual (verde, azul, roxo, ambar); o que importa e o valor e a legenda abaixo dele."
        ],
        "tips": [
          "Vendas reais vem dos marketplaces conectados; Faturamento projetado e Lucro estimado vem da sua precificacao. Sao numeros diferentes e nao devem ser comparados como se fossem a mesma coisa.",
          "Se o Valor em estoque parecer baixo, verifique se os produtos tem o campo custo preenchido. Produtos sem custo entram como zero nessa conta.",
          "Lucro estimado depende de voce ter salvo precificacoes. Sem historico de preco, esse cartao fica em R$ 0,00."
        ],
        "faq": [
          {
            "q": "Qual a diferenca entre Vendas reais e Faturamento projetado?",
            "a": "Vendas reais e o que de fato foi vendido nos marketplaces conectados. Faturamento projetado e uma estimativa com base nos precos que voce calculou e salvou na precificacao."
          },
          {
            "q": "Por que o Potencial de venda e maior que o Valor em estoque?",
            "a": "Porque o Valor em estoque usa o custo dos produtos e o Potencial de venda usa o preco de venda. A diferenca entre os dois e, aproximadamente, sua margem bruta total."
          }
        ]
      },
      {
        "id": "dashboard-marketplace-count",
        "title": "Contagem e desempenho por marketplace",
        "path": "Home > Produtos e vendas por marketplace / Precificacoes por canal / Lucro por marketplace",
        "summary": "A Home mostra, em graficos e cartoes, quantos produtos, quantas vendas e quanto de lucro cada marketplace gerou (Shopee, Mercado Livre, TikTok Shop, Amazon e demais canais).",
        "steps": [
          "1. Role ate o bloco Produtos e vendas por marketplace, identificado pelo selo Dados reais.",
          "2. Em cada cartao de canal leia tres informacoes: quantidade de produtos, quantidade de vendas e o valor total vendido (em R$).",
          "3. Produtos sem canal definido aparecem agrupados como Sem marketplace; revise o cadastro desses itens se quiser organiza-los por canal.",
          "4. Suba ate o grafico de barras Precificacoes por canal para comparar quantas precificacoes voce salvou em cada marketplace.",
          "5. Veja o grafico de linha Lucro por marketplace para identificar qual canal traz mais lucro com base no seu historico.",
          "6. Se aparecer a mensagem Conecte um marketplace e sincronize para ver produtos e vendas reais aqui, va em Integracoes para conectar um canal."
        ],
        "tips": [
          "As barras de Precificacoes por canal so consideram Shopee, Mercado Livre, TikTok Shop e Amazon; outros canais aparecem no bloco de cartoes Produtos e vendas por marketplace.",
          "Para alimentar esses graficos, defina o marketplace de cada produto no cadastro e salve precificacoes informando o canal.",
          "A cor de cada canal e fixa (Shopee laranja, Mercado Livre amarelo, TikTok Shop preto, Amazon azul), o que facilita a leitura rapida dos graficos."
        ],
        "faq": [
          {
            "q": "Por que aparece Sem marketplace nos meus dados?",
            "a": "Sao produtos ou vendas que nao tem um canal informado no cadastro. Edite o produto e selecione o marketplace correto para que ele apareca no canal certo."
          },
          {
            "q": "Conectei um marketplace mas nao vejo vendas aqui. Por que?",
            "a": "Apos conectar, e preciso sincronizar os pedidos. Va em Integracoes, abra o canal e faca a sincronizacao; depois clique em Atualizar na Home."
          }
        ]
      },
      {
        "id": "dashboard-action-queue",
        "title": "Prioridades do dia e produtos com estoque baixo",
        "path": "Home > Prioridades do dia (Fila de acao) / Checklist operacional",
        "summary": "A Fila de acao lista as pendencias mais urgentes da operacao, incluindo estoque baixo, produtos sem custo, sem preco e precificacoes pendentes, com um indicador de prioridade (Alta, Media ou OK).",
        "steps": [
          "1. Localize a secao Prioridades do dia, marcada com o selo Monitorando.",
          "2. Leia cada cartao: Produtos sem custo, Produtos sem preco, Estoque baixo e Precificacoes pendentes. O numero grande mostra quantos itens estao naquela situacao.",
          "3. Observe a etiqueta de prioridade no canto de cada cartao: Alta (em destaque), Media ou OK quando nao ha pendencia.",
          "4. Para resolver Estoque baixo, abra Estoque > Estoque Baixo e providencie a reposicao dos itens listados.",
          "5. Para resolver Produtos sem custo ou sem preco, abra Produtos > Produtos do Armazem, edite o item e preencha os campos custo e preco de venda.",
          "6. Para Precificacoes pendentes, va em Precificacao > Calculadora de Preco, calcule e use Salvar precificacao para registrar o calculo.",
          "7. Na coluna direita, acompanhe o Checklist operacional com as barras Estoque saudavel, Cobertura de preco, Qualidade dos dados e Margem calibrada (cada uma de 0% a 100%)."
        ],
        "tips": [
          "Estoque baixo considera produtos cujo saldo esta igual ou abaixo do estoque minimo cadastrado. Mantenha o campo de estoque minimo preenchido para o alerta funcionar.",
          "Cada vez que voce resolve uma pendencia e clica em Atualizar, o numero do cartao diminui e a prioridade tende a virar OK.",
          "O botao de Alertas (icone !) no canto superior direito tambem leva direto para a tela de Estoque Baixo."
        ],
        "faq": [
          {
            "q": "Onde vejo a lista detalhada dos produtos com estoque baixo?",
            "a": "Clique no botao de alerta (icone !) no topo, ou acesse Estoque > Estoque Baixo. La aparece a lista completa dos itens que precisam de reposicao."
          },
          {
            "q": "O que conta como produto sem custo ou sem preco?",
            "a": "Sem custo e todo produto com o campo custo igual a zero; sem preco e todo produto com preco de venda igual a zero. Edite o produto e preencha esses campos."
          }
        ]
      },
      {
        "id": "navigation-menu",
        "title": "Navegacao geral pelo menu superior",
        "path": "Menu superior (Home, Produtos, Pedidos, Compras, Estoque, Precificacao, SAC, Analises, Financeiro, Integracoes, Configuracoes)",
        "summary": "O menu superior fica sempre visivel e organiza todo o sistema em areas. Ao passar o mouse sobre cada area, abre-se um mega menu com as subtelas agrupadas por assunto.",
        "steps": [
          "1. Clique no logotipo NEXT ERP (canto esquerdo) a qualquer momento para voltar a Home.",
          "2. Clique no nome de uma area (por exemplo Estoque) para abrir a sua primeira tela; a area ativa fica destacada no menu.",
          "3. Passe o mouse sobre a area para abrir o mega menu, onde as opcoes aparecem agrupadas por titulo (ex.: em Estoque ha Gerenciamento de Estoque, Marketplaces, Armazem de Plataforma e Controle Marketplace).",
          "4. Clique no item desejado dentro do mega menu (ex.: Sincronizacao de Estoque) para abrir aquela tela.",
          "5. Note os selos ao lado de alguns itens: Hot e Novo indicam recursos em destaque; Ativo indica a tela padrao da area.",
          "6. Em Produtos, na area Gestao de Anuncios, cada marketplace mostra Conectar (se ainda nao integrado) ou o apelido da loja (se ja autorizado), alem de atalhos como Rascunhos, Ativo e Criar Anuncio.",
          "7. Use o titulo no alto da tela aberta para se localizar: ele mostra o nome da pagina e o caminho Area / Grupo logo abaixo."
        ],
        "tips": [
          "A area onde voce esta fica destacada no menu, ajudando a saber sempre em que parte do sistema esta.",
          "Em Estoque > Lista de Estoque, Precificacao > Calculadora de Preco, Financeiro > Painel Financeiro e Integracoes > Integracoes de Loja o item marcado como Ativo e a tela inicial padrao daquela area.",
          "Itens com o selo Hot ou Novo costumam ser recursos recentes; vale explora-los, como Sincronizacao de Estoque e Migracao de Anuncios."
        ],
        "faq": [
          {
            "q": "Como volto rapidamente para a tela inicial?",
            "a": "Clique no logotipo NEXT ERP no canto esquerdo da barra ou no item Home do menu. Ambos levam ao Painel."
          },
          {
            "q": "Clico em uma area e ela abre uma tela so. Onde estao as demais opcoes?",
            "a": "Passe o mouse sobre o nome da area para abrir o mega menu com todas as subtelas agrupadas. O clique abre a tela padrao; o mega menu mostra o resto."
          },
          {
            "q": "O que significam os selos Hot, Novo e Ativo no menu?",
            "a": "Hot e Novo destacam recursos recentes ou importantes. Ativo indica a tela padrao da area, aquela que abre ao clicar direto no nome da area."
          }
        ]
      },
      {
        "id": "topbar-chips",
        "title": "Chips do topo: API ativa e Loja Principal",
        "path": "Barra superior da tela (canto direito do titulo)",
        "summary": "No alto de cada tela, ao lado do titulo, aparecem dois selos de status: API ativa (em verde) e Loja Principal. Eles indicam o estado da conexao e a loja em foco.",
        "steps": [
          "1. Abra qualquer tela do sistema e olhe o canto superior direito, ao lado do titulo da pagina.",
          "2. Verifique o selo verde API ativa, que sinaliza que a integracao do sistema esta operante.",
          "3. Observe o selo Loja Principal, que identifica a loja em destaque no contexto atual.",
          "4. Use o subtitulo abaixo do titulo (formato Area / Grupo) para confirmar exatamente em que parte do sistema voce esta.",
          "5. Caso suspeite de problema de conexao com um marketplace, va em Integracoes para conferir e reconectar o canal."
        ],
        "tips": [
          "Os chips API ativa e Loja Principal sao indicadores de status; eles informam a situacao, mas a conexao dos canais e gerenciada na area Integracoes.",
          "O subtitulo da barra (Area / Grupo) e a forma mais rapida de confirmar em qual modulo e grupo a tela atual pertence."
        ],
        "faq": [
          {
            "q": "O chip API ativa garante que minha loja esta sincronizada?",
            "a": "Ele indica que a integracao do sistema esta operante. Para confirmar a sincronizacao de cada marketplace, acesse Integracoes e verifique o canal especifico."
          },
          {
            "q": "Posso clicar nos chips API ativa e Loja Principal?",
            "a": "Eles funcionam como etiquetas de status informativas. Para gerenciar conexoes e lojas, use a area Integracoes."
          }
        ]
      },
      {
        "id": "account-button",
        "title": "Botao de conta, atalhos de apps, ajuda, alertas e sair",
        "path": "Canto superior direito (botao com o seu nome)",
        "summary": "No canto direito da barra ficam os botoes rapidos: aplicativos (::), Ajuda (?), Alertas (!) e o botao de conta com o seu nome, que abre o menu de perfil, plano e a opcao Sair.",
        "steps": [
          "1. Clique no botao :: (Aplicativos) para abrir atalhos rapidos: Planos, Baixe APP, Importacao de Produto, Chatbot de IA e Espaco de Dados.",
          "2. Clique no botao ? (Ajuda) para abrir a Central de Ajuda do sistema.",
          "3. Clique no botao ! (Alertas) para ir direto a tela de Estoque Baixo e revisar os itens que precisam de reposicao.",
          "4. Clique no botao com o seu nome (ou Perfil) no canto direito para abrir o menu da conta.",
          "5. No topo do menu veja o cartao do plano NEXT ERP Pro, com a data de renovacao e o valor (botao R$ 389,00) que leva para Planos.",
          "6. Use os itens do menu: Perfil, Idioma, Seguranca, Faturas, Planos, Registros de Atividades e Central de Ajuda.",
          "7. Para encerrar a sessao, clique em Sair (linha com o X) no final do menu da conta."
        ],
        "tips": [
          "Se o botao mostrar Perfil em vez do seu nome, e porque o nome do usuario ainda nao foi carregado ou cadastrado; confira em Perfil.",
          "O botao de alertas (!) e um atalho direto para Estoque Baixo, util para checar reposicoes sem navegar pelo menu.",
          "Antes de sair em um computador compartilhado, sempre use a opcao Sair para proteger o acesso a sua conta."
        ],
        "faq": [
          {
            "q": "Como troco o idioma do sistema?",
            "a": "Clique no botao com o seu nome no canto direito e escolha Idioma no menu da conta."
          },
          {
            "q": "Onde vejo minha fatura e a data de renovacao do plano?",
            "a": "Abra o menu da conta (botao com o seu nome). O cartao do plano mostra a data de renovacao e o valor; clique em Faturas ou em Planos para ver os detalhes."
          },
          {
            "q": "Como saio (faco logout) do sistema?",
            "a": "Clique no botao com o seu nome e, no final do menu, clique em Sair (linha com o X)."
          }
        ]
      }
    ]
  },
  {
    "moduleKey": "produtos-gerenciamento",
    "moduleLabel": "Produtos - Gerenciamento e Ferramentas",
    "icon": "📦",
    "intro": "Cadastre, organize e padronize seus produtos, faca o mapeamento entre marketplaces e use as ferramentas de IA, copia de anuncios e cadastros auxiliares do NEXT ERP.",
    "topics": [
      {
        "id": "products",
        "title": "Produtos do Armazem (cadastro, edicao e exclusao)",
        "path": "Produtos > Gerenciamento de Produtos > Produtos do Armazem",
        "summary": "Tela central de produtos: aqui voce cadastra um produto novo com todos os dados (SKU, preco, estoque, marketplace etc.), edita, exclui e tambem importa da Shopee e sincroniza o Mercado Livre.",
        "steps": [
          "1. Abra Produtos > Gerenciamento de Produtos > Produtos do Armazem. A tela mostra os paineis Mercado Livre, Shopee, o formulario de cadastro e a tabela Produtos cadastrados.",
          "2. No bloco 'Cadastrar produto', preencha os campos do formulario: SKU, Nome do produto, Descricao, Categoria, Fornecedor, Codigo de barras e URL da imagem.",
          "3. Ainda no formulario, preencha os valores numericos: Custo, Preco de venda, Estoque e Estoque minimo (use apenas numeros; o sistema converte para R$ e calcula alerta de estoque baixo).",
          "4. No campo Marketplace, escolha a loja: Shopee, Mercado Livre, Amazon, Shein, Temu ou TikTok Shop.",
          "5. Se quiser ir direto para a calculadora de precos depois de salvar, marque a opcao 'Seguir para precificacao apos salvar'.",
          "6. Clique em 'Cadastrar produto'. O produto aparece na tabela 'Produtos cadastrados'.",
          "7. Para alterar um produto, clique em 'Editar' na linha dele: o formulario sobe ao topo no modo 'Editar produto'. Ajuste e clique em 'Salvar alteracao' (ou 'Cancelar edicao' para desistir).",
          "8. Para apagar, clique em 'Excluir' na linha e confirme a pergunta 'Deseja excluir este produto?'.",
          "9. Use o campo 'Buscar por SKU, nome, categoria ou fornecedor' acima da tabela para filtrar rapidamente; a busca tambem considera o marketplace."
        ],
        "tips": [
          "Defina um Estoque minimo realista: quando o estoque fica igual ou abaixo dele, a linha fica destacada e aparece o aviso 'Estoque baixo'.",
          "Custo, Preco de venda, Estoque e Estoque minimo aceitam apenas numeros. Se a gravacao falhar com a mensagem 'Nao foi possivel salvar o produto', confira se nenhum desses campos esta com texto ou virgula incorreta.",
          "A URL da imagem precisa ser um link valido; sem ela a coluna Imagem mostra 'Sem imagem'."
        ],
        "faq": [
          {
            "q": "Para que serve a opcao 'Seguir para precificacao apos salvar'?",
            "a": "Ao marca-la e salvar, o ERP abre automaticamente a Calculadora de Preco ja com o produto recem-cadastrado selecionado, agilizando definir a margem."
          },
          {
            "q": "Posso cadastrar o mesmo produto para varios marketplaces?",
            "a": "O campo Marketplace guarda um canal por cadastro. Para vender em mais de um marketplace, crie um cadastro por canal ou use a edicao em massa para ajustar depois."
          },
          {
            "q": "A exclusao tem como desfazer?",
            "a": "Nao. Ao confirmar 'Deseja excluir este produto?' o registro e removido. Por isso o sistema sempre pede confirmacao antes."
          }
        ]
      },
      {
        "id": "products-bulk",
        "title": "Selecao e acoes em massa de produtos",
        "path": "Produtos > Gerenciamento de Produtos > Produtos do Armazem",
        "summary": "Permite selecionar varios produtos ao mesmo tempo e alterar preco, custo, estoque, categoria, fornecedor ou marketplace de todos de uma vez, ou exclui-los em lote.",
        "steps": [
          "1. Na tabela 'Produtos cadastrados', marque a caixinha (checkbox) na primeira coluna de cada produto que deseja afetar. O contador no topo do painel mostra 'X selecionados'.",
          "2. Para selecionar todos os itens que estao aparecendo apos um filtro, clique em 'Selecionar filtrados' (o botao vira 'Limpar filtrados' quando todos ja estao marcados). A caixinha do cabecalho da tabela faz o mesmo.",
          "3. Para zerar a selecao, clique em 'Limpar selecao'.",
          "4. Para editar em massa, preencha apenas os campos que deseja mudar no painel: Novo custo, Novo preco de venda, Novo estoque, Novo estoque minimo, Categoria, Fornecedor e/ou o seletor Marketplace.",
          "5. Clique em 'Editar em massa'. O sistema aplica somente os campos preenchidos e mostra a mensagem 'X produtos atualizados.'",
          "6. Para excluir varios de uma vez, com os produtos marcados clique em 'Excluir selecionados' e confirme a pergunta 'Deseja excluir N produtos selecionados?'. Aparece 'X produtos excluidos.'"
        ],
        "tips": [
          "Deixe em branco os campos que NAO quer alterar. Se voce nao preencher nenhum campo, o sistema avisa 'Preencha pelo menos um campo para editar em massa.'",
          "Se clicar em editar/excluir sem nenhum produto marcado, aparece 'Selecione pelo menos um produto.'",
          "A edicao em massa e otima para reajustar precos de uma categoria inteira de uma vez, mas confira a selecao antes de aplicar para nao mexer no que nao queria."
        ],
        "faq": [
          {
            "q": "O 'Selecionar filtrados' marca a base inteira?",
            "a": "Nao. Ele marca apenas os produtos que estao visiveis no resultado da busca/filtro atual. Use a busca antes para restringir o alvo."
          },
          {
            "q": "Posso mudar so o marketplace de varios produtos?",
            "a": "Sim. Marque os produtos, escolha o canal no seletor Marketplace do painel de acoes em massa, deixe os demais campos vazios e clique em 'Editar em massa'."
          }
        ]
      },
      {
        "id": "products-import-sync",
        "title": "Importar planilha Shopee e sincronizar Mercado Livre",
        "path": "Produtos > Gerenciamento de Produtos > Produtos do Armazem",
        "summary": "Nesta mesma tela voce traz produtos da Shopee por planilha e sincroniza automaticamente os dados do Mercado Livre quando a conta esta conectada.",
        "steps": [
          "1. No painel 'Mercado Livre - Sincronizacao automatica', ao abrir a tela os produtos, precos, estoque e vendas sao atualizados sozinhos se a conta estiver conectada.",
          "2. Para forcar uma atualizacao agora, clique em 'Sincronizar Mercado Livre'. Ao final aparece um resumo com quantos produtos e vendas foram trazidos.",
          "3. Se a conta nao estiver conectada, clique em 'Conectar conta' para ir a tela de integracao do Mercado Livre.",
          "4. No painel 'Shopee - Importar Planilha de Informacoes de Vendas', baixe na Shopee a planilha 'Informacoes de Vendas'.",
          "5. Clique no campo de arquivo e selecione o XLSX ou CSV exportado (so esses formatos sao aceitos).",
          "6. Clique em 'Importar Shopee'. Ao terminar aparece quantos produtos foram importados/atualizados e quantas linhas foram ignoradas.",
          "7. Para ativar pedidos automaticos da Shopee, use o botao 'Configurar API Shopee e pedidos automaticos' e siga os passos da Shopee Open Platform (Partner ID, Partner Key e Redirect URL)."
        ],
        "tips": [
          "A planilha precisa ser exatamente a 'Informacoes de Vendas' da Shopee. Se der erro, a mensagem orienta conferir se a planilha e a correta.",
          "A importacao por planilha cadastra/atualiza PRODUTOS, mas nao traz pedidos sozinha: pedidos automaticos dependem da API de pedidos da Shopee.",
          "Se a sincronizacao do Mercado Livre nao mostrar nada, verifique primeiro se a conta esta realmente conectada (o botao 'Conectar conta' aparece quando nao esta)."
        ],
        "faq": [
          {
            "q": "Preciso conectar a API da Shopee para usar a planilha?",
            "a": "Nao. A importacao por planilha funciona sem conectar a API. A conexao com a Open Platform serve para os pedidos automaticos."
          },
          {
            "q": "Por que algumas linhas foram 'ignoradas' na importacao?",
            "a": "Linhas sem dados essenciais ou em formato invalido sao puladas. O resumo informa quantas foram ignoradas para voce conferir a planilha."
          }
        ]
      },
      {
        "id": "product-mapping",
        "title": "Gerenciar Mapeamento",
        "path": "Produtos > Gerenciamento de Produtos > Gerenciar Mapeamento",
        "summary": "Mostra quais produtos ja tem SKU interno, marketplace e categoria suficientes (status Mapeado) e quais ainda estao Pendentes, para que fiquem prontos nos fluxos de estoque e precificacao.",
        "steps": [
          "1. Abra Produtos > Gerenciamento de Produtos > Gerenciar Mapeamento. No topo veja os indicadores 'Total de produtos', 'Mapeados' e 'Pendentes'.",
          "2. Use os filtros: o seletor de marketplace (montado a partir dos canais existentes), o seletor de status (Todos, Mapeado, Pendente) e o campo 'Buscar SKU, produto, categoria ou marketplace'.",
          "3. Clique em 'Atualizar' para recarregar a lista com os dados mais recentes dos produtos.",
          "4. Analise a tabela: as colunas SKU interno, Produto, Marketplace, Categoria, Codigo de barras, Status e Pendencias mostram o que falta em cada item.",
          "5. Para qualquer produto marcado como 'Pendente', clique em 'Abrir cadastro' (botao do topo) para ir aos Produtos do Armazem e completar os campos que aparecem na coluna Pendencias.",
          "6. Quando quiser registrar a situacao, clique em 'Exportar CSV' para baixar o arquivo 'mapeamento-produtos.csv' com SKU, produto, marketplace, categoria, codigo de barras, status e pendencias."
        ],
        "tips": [
          "Um produto so fica 'Mapeado' quando tem SKU, marketplace E categoria preenchidos. Faltando o SKU, ele aparece em vermelho (pendencia mais grave).",
          "Esta tela e somente de conferencia: a correcao em si e feita no cadastro de produtos (botao 'Abrir cadastro').",
          "Use o filtro de status 'Pendente' para focar so no que precisa de ajuste antes de fechar o mes."
        ],
        "faq": [
          {
            "q": "Por que meu produto aparece como Pendente se eu ja cadastrei?",
            "a": "Falta pelo menos um dos campos obrigatorios para o mapeamento: SKU, marketplace ou categoria. A coluna Pendencias mostra exatamente o que completar."
          },
          {
            "q": "Consigo corrigir o mapeamento direto nesta tela?",
            "a": "Nao. Clique em 'Abrir cadastro' para ir aos Produtos do Armazem, edite o produto e preencha os campos faltantes."
          }
        ]
      },
      {
        "id": "product-categories",
        "title": "Categorias",
        "path": "Produtos > Gerenciamento de Produtos > Categorias",
        "summary": "Agrupa os produtos por categoria, mostra quantidade, estoque e valores por categoria e permite renomear ou remover uma categoria aplicando a mudanca em massa a todos os produtos dela.",
        "steps": [
          "1. Abra Produtos > Gerenciamento de Produtos > Categorias. A tabela lista cada categoria com Produtos, Estoque, Valor em estoque e Venda potencial.",
          "2. Use o campo 'Buscar categoria' para localizar uma categoria e 'Atualizar' para recarregar os dados.",
          "3. Para exportar o panorama, clique em 'Exportar CSV' e baixe 'categorias-produtos.csv' com categoria, produtos, estoque, valor em estoque e potencial de venda.",
          "4. Para editar uma categoria, clique em 'Editar' na linha dela. O bloco 'Editar categoria em massa' mostra a categoria selecionada e quantos produtos ela tem.",
          "5. Para mudar o nome, digite o novo nome em 'Novo nome da categoria' e clique em 'Renomear categoria'. Aparece 'Categoria atualizada nos produtos selecionados.'",
          "6. Para tirar a categoria dos produtos, clique em 'Remover categoria' (isso esvazia o campo categoria desses produtos)."
        ],
        "tips": [
          "Produtos sem categoria aparecem agrupados como 'Sem categoria'. Renomeie esse grupo para organizar itens soltos de uma vez.",
          "Renomear ou remover afeta TODOS os produtos daquela categoria de uma so vez, pois usa a edicao em massa por baixo.",
          "Os valores 'Valor em estoque' (custo x estoque) e 'Venda potencial' (preco x estoque) ajudam a ver onde esta concentrado seu capital parado."
        ],
        "faq": [
          {
            "q": "O que acontece ao clicar em 'Remover categoria'?",
            "a": "A categoria e apagada do cadastro de todos os produtos que a usavam (o campo categoria deles fica vazio). Os produtos continuam existindo."
          },
          {
            "q": "Por que nao consigo renomear?",
            "a": "O botao 'Renomear categoria' so fica ativo quando voce selecionou uma categoria na tabela e digitou um novo nome valido no campo."
          }
        ]
      },
      {
        "id": "product-importer",
        "title": "Copiador de Anuncios",
        "path": "Produtos > Ferramentas > Copiador de Anuncios",
        "summary": "Copia um anuncio de um marketplace de origem para outro de destino: voce escolhe origem e destino, cola o link do anuncio, confere os dados capturados (titulo, preco, quantidade, imagens) e publica a copia.",
        "steps": [
          "1. Abra Produtos > Ferramentas > Copiador de Anuncios.",
          "2. No passo '1. Origem - De onde vamos copiar', clique no card da plataforma onde o anuncio ja existe (Mercado Livre, Shopee, Amazon, Shein, Temu ou TikTok Shop).",
          "3. No passo '2. Destino - Onde vamos publicar', clique no card do marketplace onde a copia sera criada. Se ele exigir conexao, use o botao 'Conectar [plataforma]' para abrir as Integracoes.",
          "4. No passo '3. Link do anuncio de origem', cole o link publico do anuncio no campo (cada plataforma mostra um exemplo de formato).",
          "5. Clique em 'Buscar dados da [plataforma]'. O sistema captura o anuncio e abre o passo '4. Dados capturados'.",
          "6. Confira e ajuste os campos: Titulo, Preco (R$) e Quantidade, alem das imagens e da descricao exibidas.",
          "7. Clique em 'Publicar na [plataforma de destino]'. Ao concluir aparece o bloco 'Anuncio publicado!' com Status, ID e o link 'Abrir anuncio publicado'."
        ],
        "tips": [
          "Hoje a captura e a publicacao automaticas funcionam plenamente no Mercado Livre. Para os demais canais marcados como 'Conector pendente', a tela avisa que ainda depende da API oficial.",
          "Antes de publicar, conecte a conta do marketplace de destino em Integracoes; sem isso aparece o aviso para conectar e o botao 'Conectar [plataforma]'.",
          "Use o link do anuncio diretamente da pagina publica do produto; um link invalido gera 'Nao foi possivel buscar os dados deste anuncio.'"
        ],
        "faq": [
          {
            "q": "Posso editar o titulo e o preco antes de publicar?",
            "a": "Sim. No passo 'Dados capturados' os campos Titulo, Preco e Quantidade sao editaveis; o que voce ajustar e o que sera publicado."
          },
          {
            "q": "Por que aparece 'Conector pendente' em alguns marketplaces?",
            "a": "Esses canais ainda dependem da API oficial para copiar ou publicar. No momento o fluxo completo esta liberado para o Mercado Livre."
          },
          {
            "q": "Origem e destino podem ser o mesmo marketplace?",
            "a": "Sim, e possivel duplicar um anuncio dentro do mesmo canal, desde que a plataforma esteja com o conector ativo e a conta conectada."
          }
        ]
      },
      {
        "id": "ad-migration",
        "title": "Migracao de Anuncios",
        "path": "Produtos > Ferramentas > Migracao de Anuncios",
        "summary": "Cadastro auxiliar (pasta de registros) para organizar migracoes de anuncios. Funciona como uma lista onde voce adiciona, edita, busca, exporta e remove registros.",
        "steps": [
          "1. Abra Produtos > Ferramentas > Migracao de Anuncios. O cabecalho mostra a pasta ativa e a lista 'Campos do modulo' com os campos disponiveis desta pasta.",
          "2. Clique em '+ Novo registro' para abrir o formulario.",
          "3. Preencha os campos exibidos para esta pasta (cada campo pode ser texto, numero, lista suspensa ou area de texto, conforme definido na pasta).",
          "4. Clique em 'Adicionar' para gravar; aparece 'Registro cadastrado.' Para desistir, clique em 'Cancelar'.",
          "5. Para localizar algo, digite no campo 'Buscar registros'; o filtro procura em qualquer campo do registro.",
          "6. Para alterar, clique em 'Editar' na linha, ajuste e clique em 'Salvar alteracoes'. Para apagar, clique em 'Remover' e confirme 'Remover este registro?'.",
          "7. Para baixar todos os registros listados, clique em 'Exportar CSV'."
        ],
        "tips": [
          "Os campos que aparecem dependem da configuracao da pasta; se a lista 'Campos do modulo' estiver curta, e porque a pasta foi definida assim.",
          "A busca compara o termo com o registro inteiro, entao voce pode pesquisar por qualquer valor preenchido.",
          "Use o Exportar CSV para guardar um backup ou levar os dados a uma planilha externa."
        ],
        "faq": [
          {
            "q": "Os botoes 'Adicionar' e 'Salvar alteracoes' fazem coisas diferentes?",
            "a": "Sim. 'Adicionar' cria um registro novo; 'Salvar alteracoes' aparece quando voce esta editando um registro existente."
          },
          {
            "q": "Como removo um registro errado?",
            "a": "Clique em 'Remover' na linha do registro e confirme a pergunta 'Remover este registro?'."
          }
        ]
      },
      {
        "id": "code-control",
        "title": "Controle de Codigo",
        "path": "Produtos > Ferramentas > Controle de Codigo",
        "summary": "Pasta de registros para controlar codigos (como SKUs, codigos internos e referencias). Permite cadastrar, buscar, editar, remover e exportar registros.",
        "steps": [
          "1. Abra Produtos > Ferramentas > Controle de Codigo. Veja em 'Campos do modulo' quais campos esta pasta usa.",
          "2. Clique em '+ Novo registro' para abrir o formulario.",
          "3. Preencha os campos do formulario desta pasta conforme o tipo de cada um (texto, numero, lista ou area de texto).",
          "4. Clique em 'Adicionar' para gravar (mensagem 'Registro cadastrado.') ou 'Cancelar' para fechar sem salvar.",
          "5. Use 'Buscar registros' para filtrar a tabela por qualquer valor.",
          "6. Para corrigir um registro, clique em 'Editar', altere e clique em 'Salvar alteracoes'.",
          "7. Para excluir, clique em 'Remover' e confirme; para exportar a lista, clique em 'Exportar CSV'."
        ],
        "tips": [
          "Mantenha um padrao de preenchimento dos codigos para facilitar a busca depois.",
          "Antes de remover um registro, confira se ele nao esta em uso em outro lugar, pois a remocao pede confirmacao e e definitiva.",
          "O CSV exportado inclui o id de cada registro, util para conferencias."
        ],
        "faq": [
          {
            "q": "Quais campos preciso preencher?",
            "a": "Os campos sao os listados em 'Campos do modulo' no topo da tela; eles variam conforme a configuracao desta pasta."
          },
          {
            "q": "A busca diferencia maiusculas e minusculas?",
            "a": "Nao. A busca ignora maiusculas/minusculas e procura o termo em qualquer campo do registro."
          }
        ]
      },
      {
        "id": "price-models",
        "title": "Modelo de Precificacao",
        "path": "Produtos > Ferramentas > Modelo de Precificacao",
        "summary": "Pasta de registros para guardar modelos/padroes de precificacao reutilizaveis. Mesmo fluxo de cadastro: novo registro, preencher, salvar, buscar, exportar, editar e remover.",
        "steps": [
          "1. Abra Produtos > Ferramentas > Modelo de Precificacao e confira a lista 'Campos do modulo'.",
          "2. Clique em '+ Novo registro'.",
          "3. Preencha os campos do modelo no formulario (texto, numero, lista ou area de texto, conforme cada campo).",
          "4. Clique em 'Adicionar' para salvar o modelo; aparece 'Registro cadastrado.'",
          "5. Para encontrar um modelo, use o campo 'Buscar registros'.",
          "6. Para ajustar, clique em 'Editar', altere e clique em 'Salvar alteracoes'; para apagar, 'Remover' e confirmar.",
          "7. Clique em 'Exportar CSV' para baixar todos os modelos cadastrados."
        ],
        "tips": [
          "Crie um modelo por estrategia (ex.: margem padrao, promocao, custo alto) para reutilizar nas precificacoes.",
          "Use nomes descritivos nos campos para diferenciar os modelos rapidamente na busca.",
          "Esta pasta guarda os modelos; o calculo de preco em si e feito no modulo Precificacao."
        ],
        "faq": [
          {
            "q": "Este modelo aplica preco automaticamente nos produtos?",
            "a": "Esta pasta serve para registrar e organizar os modelos. A aplicacao do preco acontece no modulo de Precificacao."
          },
          {
            "q": "Posso ter varios modelos?",
            "a": "Sim. Crie quantos registros precisar com '+ Novo registro'; nao ha limite imposto na tela."
          }
        ]
      },
      {
        "id": "product-data-detective",
        "title": "Detectar Palavras Proibidas",
        "path": "Produtos > Ferramentas > Detectar Palavras Proibidas",
        "summary": "Pasta de registros para cadastrar e controlar palavras proibidas/sensiveis que devem ser evitadas em titulos e descricoes de anuncios.",
        "steps": [
          "1. Abra Produtos > Ferramentas > Detectar Palavras Proibidas e veja em 'Campos do modulo' os campos disponiveis.",
          "2. Clique em '+ Novo registro' para abrir o formulario.",
          "3. Preencha os campos (por exemplo, a palavra/termo e demais campos definidos na pasta).",
          "4. Clique em 'Adicionar' para gravar (mensagem 'Registro cadastrado.').",
          "5. Use 'Buscar registros' para localizar um termo ja cadastrado.",
          "6. Para alterar, clique em 'Editar' e depois em 'Salvar alteracoes'; para excluir, clique em 'Remover' e confirme.",
          "7. Clique em 'Exportar CSV' para baixar a lista completa de termos."
        ],
        "tips": [
          "Mantenha a lista atualizada com os termos que cada marketplace costuma reprovar para evitar bloqueios de anuncio.",
          "Cadastre variacoes de escrita (com e sem acento, plural) para cobrir mais casos.",
          "Exporte o CSV para compartilhar a lista de palavras proibidas com a equipe."
        ],
        "faq": [
          {
            "q": "A ferramenta bloqueia o anuncio automaticamente?",
            "a": "Esta pasta serve para cadastrar e manter a lista de palavras. Use-a como referencia ao revisar titulos e descricoes."
          },
          {
            "q": "Como atualizo um termo antigo?",
            "a": "Clique em 'Editar' na linha do termo, ajuste e clique em 'Salvar alteracoes'."
          }
        ]
      },
      {
        "id": "ai-product-image",
        "title": "Gerar Imagem por IA",
        "path": "Produtos > Ferramentas > Gerar Imagem por IA",
        "summary": "Pasta de registros relacionada a geracao de imagens de produto por IA. Voce cadastra os registros/pedidos preenchendo os campos da pasta e gerencia a lista (buscar, editar, remover, exportar).",
        "steps": [
          "1. Abra Produtos > Ferramentas > Gerar Imagem por IA e confira a lista 'Campos do modulo'.",
          "2. Clique em '+ Novo registro' para abrir o formulario.",
          "3. Preencha os campos exibidos (como a descricao/prompt e demais campos definidos na pasta).",
          "4. Clique em 'Adicionar' para gravar o registro.",
          "5. Use 'Buscar registros' para encontrar registros anteriores.",
          "6. Para alterar, clique em 'Editar' e em 'Salvar alteracoes'; para excluir, clique em 'Remover' e confirme.",
          "7. Clique em 'Exportar CSV' para baixar os registros."
        ],
        "tips": [
          "Descreva bem o produto nos campos de texto para obter melhores resultados de imagem.",
          "Guarde os registros bem-sucedidos para reutilizar o mesmo padrao de descricao em novos produtos.",
          "Use a area de texto (quando disponivel) para detalhes longos como cenario, cor e estilo desejados."
        ],
        "faq": [
          {
            "q": "Onde vejo o resultado da imagem?",
            "a": "Os registros ficam na tabela da pasta. Os campos seguem a configuracao desta pasta; preencha-os e gerencie pelos botoes Editar/Remover."
          },
          {
            "q": "Posso refazer um registro?",
            "a": "Sim. Edite o registro existente ou crie um novo com '+ Novo registro' ajustando a descricao."
          }
        ]
      },
      {
        "id": "ai-product-create",
        "title": "Criar Produto por IA",
        "path": "Produtos > Ferramentas > Criar Produto por IA",
        "summary": "Pasta de registros para apoiar a criacao de produtos com IA (por exemplo, gerar titulos/descricoes). Mesmo fluxo de cadastro de registros: novo, preencher, salvar, buscar, exportar, editar e remover.",
        "steps": [
          "1. Abra Produtos > Ferramentas > Criar Produto por IA e veja os campos em 'Campos do modulo'.",
          "2. Clique em '+ Novo registro'.",
          "3. Preencha os campos do formulario desta pasta (texto, numero, lista ou area de texto, conforme cada campo).",
          "4. Clique em 'Adicionar' para gravar; aparece 'Registro cadastrado.'",
          "5. Use 'Buscar registros' para localizar registros ja criados.",
          "6. Para alterar, clique em 'Editar' e em 'Salvar alteracoes'; para apagar, 'Remover' e confirmar.",
          "7. Use 'Exportar CSV' para baixar todos os registros."
        ],
        "tips": [
          "Quanto mais detalhe voce informar nos campos, mais util fica o conteudo gerado para o produto.",
          "Depois de gerar o conteudo, leve as informacoes finais para o cadastro em Produtos do Armazem.",
          "Mantenha os registros organizados para reaproveitar bons exemplos em produtos parecidos."
        ],
        "faq": [
          {
            "q": "Este modulo cadastra o produto direto no estoque?",
            "a": "Ele funciona como uma pasta de apoio com registros. O cadastro definitivo do produto e feito em Produtos do Armazem."
          },
          {
            "q": "Como corrijo um registro?",
            "a": "Clique em 'Editar' na linha, ajuste os campos e clique em 'Salvar alteracoes'."
          }
        ]
      },
      {
        "id": "data-space",
        "title": "Espaco de Dados",
        "path": "Produtos > Ferramentas > Espaco de Dados",
        "summary": "Galeria que guarda as imagens dos seus produtos/anuncios para reutilizar em publicacoes, rascunhos e importacao de produto, organizada por categorias na lateral.",
        "steps": [
          "1. Abra Produtos > Ferramentas > Espaco de Dados.",
          "2. Na barra lateral 'Espaco de Dados', escolha a pasta desejada em Produtos: 'Imagens de Anuncios', 'Imagens de Produtos', 'Central de Videos' ou 'Outros Arquivos'. Ha tambem 'Anexos de Pedidos' e 'Comprovantes'.",
          "3. Na barra de ferramentas, use o seletor de ordenacao ('Nome da imagem', 'Marketplace' ou 'Data de envio').",
          "4. Use o campo 'Pesquisar imagens de anuncios' para filtrar pelos nomes ou pelo marketplace das imagens.",
          "5. Para subir um novo arquivo, clique em 'Adicionar & Enviar'.",
          "6. Veja a galeria a direita: cada card mostra a imagem, o nome e o marketplace; o cabecalho indica a quantidade de arquivos. Acompanhe o espaco usado no medidor da lateral."
        ],
        "tips": [
          "As imagens vem dos produtos cadastrados que possuem URL de imagem; produtos com imagem aparecem automaticamente aqui.",
          "Use a busca por marketplace para separar rapidamente as artes de cada canal.",
          "Acompanhe o medidor 'Espaco utilizado' na lateral para nao estourar o armazenamento."
        ],
        "faq": [
          {
            "q": "De onde vem as imagens que aparecem na galeria?",
            "a": "Das URLs de imagem cadastradas nos seus produtos. Se nenhum produto tiver imagem, a galeria mostra itens de exemplo da biblioteca."
          },
          {
            "q": "Para que serve guardar as imagens aqui?",
            "a": "Para reutiliza-las em publicacoes, rascunhos de anuncio e na importacao de produto, sem precisar buscar o arquivo de novo a cada vez."
          }
        ]
      }
    ]
  },
  {
    "moduleKey": "produtos-anuncios",
    "moduleLabel": "Produtos - Gestao de Anuncios",
    "icon": "🛒",
    "intro": "Gerencie os anuncios de cada marketplace (Mercado Livre, Shopee, Amazon, Shein, TikTok Shop e Temu) direto no NEXT ERP: rascunhos, anuncios ativos, criacao, catalogo, promocoes, marketing e user product.",
    "topics": [
      {
        "id": "ad-drafts",
        "title": "Rascunhos de anuncios",
        "path": "Produtos > Gestao de Anuncios > [Marketplace] > Rascunhos",
        "summary": "Tela onde voce guarda anuncios em preparacao (que ainda nao foram publicados no marketplace). Funciona como um cadastro: voce cria, edita, busca, exporta e remove rascunhos.",
        "steps": [
          "1. No menu lateral, abra Produtos e, na coluna Gestao de Anuncios, escolha o marketplace desejado (Mercado Livre, Shopee, Amazon, Shein, TikTok Shop ou Temu).",
          "2. Clique na acao Rascunhos. A tela abre com o titulo do marketplace, o bloco Campos do modulo (mostrando exatamente quais campos voce vai preencher) e a tabela [Marketplace] - Registros.",
          "3. Para cadastrar um rascunho, clique no botao + Novo registro. Um formulario aparece logo abaixo da busca.",
          "4. Preencha os campos exibidos no formulario. Os campos sao definidos pela pasta e aparecem listados no bloco Campos do modulo; cada um pode ser texto, numero, area de texto ou uma lista suspensa (nesse caso escolha uma das opcoes).",
          "5. Clique em Adicionar para gravar. A mensagem Registro cadastrado confirma o sucesso e o item passa a aparecer na tabela.",
          "6. Para localizar um rascunho ja salvo, digite qualquer termo no campo Buscar registros; a lista filtra automaticamente conforme voce digita.",
          "7. Para alterar, clique em Editar na linha do rascunho, ajuste os campos e clique em Salvar alteracoes.",
          "8. Para gerar um backup ou planilha, clique em Exportar CSV (o arquivo segue o filtro de busca aplicado no momento).",
          "9. Para apagar, clique em Remover na linha e confirme na janela Remover este registro?."
        ],
        "tips": [
          "A tela de Rascunhos funciona exatamente igual para todos os marketplaces que a possuem; muda apenas o nome no topo e os campos definidos para cada pasta.",
          "Antes de tentar publicar de verdade, conecte a conta do marketplace em Integracoes; o rascunho aqui e um cadastro de preparacao.",
          "O botao Exportar CSV fica desabilitado quando nao ha registros na lista filtrada."
        ],
        "faq": [
          {
            "q": "Quais marketplaces tem a acao Rascunhos?",
            "a": "Todos: Mercado Livre, Shopee, Amazon, Shein, TikTok Shop e Temu."
          },
          {
            "q": "Salvar um rascunho ja publica o anuncio no marketplace?",
            "a": "Nao. Rascunhos e um cadastro de preparacao dentro do ERP. A publicacao depende da conta conectada em Integracoes e do fluxo de criacao."
          },
          {
            "q": "Cancelei o formulario sem querer, perdi tudo?",
            "a": "Se voce nao clicou em Adicionar, o registro nao foi salvo. Basta clicar em + Novo registro e preencher de novo."
          }
        ]
      },
      {
        "id": "active-ads",
        "title": "Anuncios ativos",
        "path": "Produtos > Gestao de Anuncios > [Marketplace] > Ativo",
        "summary": "Lista os anuncios ativos de cada marketplace. Voce pode cadastrar, consultar, editar, exportar e remover os registros de anuncios em vigor.",
        "steps": [
          "1. Abra Produtos no menu e, na coluna Gestao de Anuncios, selecione o marketplace.",
          "2. Clique na acao Ativo. A tela mostra o bloco Campos do modulo e a tabela [Marketplace] - Registros com os anuncios ja cadastrados.",
          "3. Para incluir um anuncio ativo manualmente, clique em + Novo registro.",
          "4. Preencha os campos que aparecem no formulario (eles seguem a configuracao da pasta e estao listados em Campos do modulo).",
          "5. Clique em Adicionar para salvar; a mensagem Registro cadastrado confirma a operacao.",
          "6. Use o campo Buscar registros para filtrar a lista por qualquer texto (titulo, codigo, etc.).",
          "7. Para corrigir dados, clique em Editar na linha, ajuste e clique em Salvar alteracoes.",
          "8. Clique em Exportar CSV para baixar a lista atual em planilha, ou em Remover para excluir um registro (confirme na janela)."
        ],
        "tips": [
          "A gestao de status real (pausar, ativar de fato no site) depende da conta conectada em Integracoes; aqui voce mantem o controle/registro dos anuncios ativos.",
          "Use a busca antes de cadastrar para evitar registros duplicados do mesmo anuncio.",
          "A tela e identica para todos os marketplaces; apenas os campos podem variar conforme a pasta."
        ],
        "faq": [
          {
            "q": "Quais marketplaces tem a acao Ativo?",
            "a": "Todos: Mercado Livre, Shopee, Amazon, Shein, TikTok Shop e Temu."
          },
          {
            "q": "Editar aqui altera o anuncio no marketplace?",
            "a": "A edicao atualiza o registro no ERP. Mudancas refletidas no site dependem da integracao da conta feita em Integracoes."
          },
          {
            "q": "Removi um anuncio por engano, o que acontece?",
            "a": "O registro sai da lista do ERP. Caso precise, cadastre-o novamente com + Novo registro."
          }
        ]
      },
      {
        "id": "create-ad",
        "title": "Criar Anuncio",
        "path": "Produtos > Gestao de Anuncios > [Marketplace] > Criar Anuncio",
        "summary": "Tela para montar um novo anuncio preenchendo os campos do marketplace. Os dados ficam registrados e podem ser editados, buscados, exportados e removidos.",
        "steps": [
          "1. No menu Produtos, coluna Gestao de Anuncios, escolha o marketplace.",
          "2. Clique na acao Criar Anuncio. Confira no bloco Campos do modulo quais informacoes serao pedidas.",
          "3. Clique em + Novo registro para abrir o formulario de criacao.",
          "4. Preencha cada campo apresentado (titulo, preco, descricao e demais campos configurados para a pasta). Campos do tipo lista oferecem opcoes prontas; campos de descricao usam area de texto.",
          "5. Revise os dados e clique em Adicionar para gravar o anuncio. Aparece a mensagem Registro cadastrado.",
          "6. Para ajustar um anuncio ja criado, localize-o com Buscar registros, clique em Editar, altere e clique em Salvar alteracoes.",
          "7. Use Exportar CSV para guardar uma copia da lista, ou Remover para excluir um anuncio (confirmando na janela)."
        ],
        "tips": [
          "Para que o anuncio chegue ao marketplace, conecte primeiro a conta correspondente em Integracoes.",
          "Preencha titulo e descricao com cuidado: sao os campos que mais impactam a busca dentro do marketplace.",
          "Se um campo obrigatorio ficar vazio e o sistema recusar, a mensagem na tela indica o motivo; corrija e clique em Adicionar de novo."
        ],
        "faq": [
          {
            "q": "Quais marketplaces tem a acao Criar Anuncio?",
            "a": "Todos: Mercado Livre, Shopee, Amazon, Shein, TikTok Shop e Temu."
          },
          {
            "q": "Qual a diferenca entre Criar Anuncio e Rascunhos?",
            "a": "Criar Anuncio e a tela para montar o anuncio com os dados do marketplace; Rascunhos serve para guardar itens em preparacao. Ambas sao cadastros no ERP."
          },
          {
            "q": "Por que nao aparecem os mesmos campos em todos os marketplaces?",
            "a": "Cada pasta tem seus proprios campos definidos. Eles aparecem sempre listados no bloco Campos do modulo da tela."
          }
        ]
      },
      {
        "id": "catalog",
        "title": "Catalogo (Mercado Livre)",
        "path": "Produtos > Gestao de Anuncios > Mercado Livre > Catalogo",
        "summary": "Exclusiva do Mercado Livre. Registra e organiza itens de catalogo do ML. Funciona como cadastro: criar, buscar, editar, exportar e remover.",
        "steps": [
          "1. Abra Produtos no menu e, na coluna Gestao de Anuncios, clique em Mercado Livre.",
          "2. Selecione a acao Catalogo. A tela mostra o bloco Campos do modulo e a tabela de registros do catalogo.",
          "3. Clique em + Novo registro para cadastrar um item de catalogo.",
          "4. Preencha os campos exibidos no formulario conforme a configuracao da pasta.",
          "5. Clique em Adicionar para salvar; confira a mensagem Registro cadastrado.",
          "6. Use Buscar registros para encontrar itens, Editar para ajustar (e Salvar alteracoes), Exportar CSV para baixar a lista e Remover para excluir."
        ],
        "tips": [
          "A acao Catalogo existe apenas no Mercado Livre; os demais marketplaces nao tem essa pasta.",
          "Mantenha a conta do Mercado Livre conectada em Integracoes para que o catalogo faca sentido no fluxo de anuncios.",
          "Use a busca para nao duplicar itens de catalogo."
        ],
        "faq": [
          {
            "q": "Esta acao aparece nos outros marketplaces?",
            "a": "Nao. Catalogo e exclusiva do Mercado Livre."
          },
          {
            "q": "Como exporto os itens do catalogo?",
            "a": "Clique em Exportar CSV; o arquivo respeita o filtro de busca aplicado."
          }
        ]
      },
      {
        "id": "promotions",
        "title": "Promocoes (Mercado Livre)",
        "path": "Produtos > Gestao de Anuncios > Mercado Livre > Promocoes",
        "summary": "Exclusiva do Mercado Livre. Cadastra e controla promocoes dos anuncios do ML, com criar, buscar, editar, exportar e remover.",
        "steps": [
          "1. No menu Produtos, coluna Gestao de Anuncios, clique em Mercado Livre.",
          "2. Selecione a acao Promocoes. Veja em Campos do modulo quais dados a pasta pede.",
          "3. Clique em + Novo registro para criar uma promocao.",
          "4. Preencha os campos do formulario (por exemplo nome, periodo e percentuais, conforme configurado para a pasta).",
          "5. Clique em Adicionar para gravar; aparece Registro cadastrado.",
          "6. Use Buscar registros para localizar, Editar para alterar (Salvar alteracoes), Exportar CSV para baixar e Remover para excluir uma promocao."
        ],
        "tips": [
          "A acao Promocoes e exclusiva do Mercado Livre.",
          "Confira datas e percentuais antes de salvar para evitar promocoes com periodo invalido.",
          "Conecte a conta do Mercado Livre em Integracoes para aplicar as promocoes no fluxo real."
        ],
        "faq": [
          {
            "q": "Os outros marketplaces tem Promocoes?",
            "a": "Nao. Apenas o Mercado Livre tem essa acao nesta secao."
          },
          {
            "q": "Como apago uma promocao antiga?",
            "a": "Clique em Remover na linha da promocao e confirme na janela Remover este registro?."
          }
        ]
      },
      {
        "id": "user-products",
        "title": "User Product (Mercado Livre)",
        "path": "Produtos > Gestao de Anuncios > Mercado Livre > User Product",
        "summary": "Exclusiva do Mercado Livre. Registra os produtos de usuario (user products) do ML. Cadastro completo: criar, buscar, editar, exportar e remover.",
        "steps": [
          "1. Abra Produtos no menu e clique em Mercado Livre na coluna Gestao de Anuncios.",
          "2. Selecione a acao User Product. Confira os campos no bloco Campos do modulo.",
          "3. Clique em + Novo registro para cadastrar um produto de usuario.",
          "4. Preencha os campos exibidos no formulario conforme a pasta.",
          "5. Clique em Adicionar para salvar; observe a mensagem Registro cadastrado.",
          "6. Use Buscar registros, Editar (com Salvar alteracoes), Exportar CSV e Remover conforme a necessidade."
        ],
        "tips": [
          "A acao User Product e exclusiva do Mercado Livre.",
          "Mantenha a conta do Mercado Livre conectada em Integracoes para alinhar os user products ao seu catalogo real.",
          "Antes de cadastrar, use a busca para conferir se o item ja existe."
        ],
        "faq": [
          {
            "q": "User Product aparece em outros marketplaces?",
            "a": "Nao. E uma acao exclusiva do Mercado Livre."
          },
          {
            "q": "Posso editar um user product depois de salvo?",
            "a": "Sim. Clique em Editar na linha, ajuste os campos e clique em Salvar alteracoes."
          }
        ]
      },
      {
        "id": "marketing",
        "title": "Marketing (Shopee)",
        "path": "Produtos > Gestao de Anuncios > Shopee > Marketing",
        "summary": "Exclusiva da Shopee. Cadastra e organiza acoes de marketing (campanhas, anuncios pagos, cupons) da Shopee, com criar, buscar, editar, exportar e remover.",
        "steps": [
          "1. No menu Produtos, coluna Gestao de Anuncios, clique em Shopee.",
          "2. Selecione a acao Marketing. Verifique os campos no bloco Campos do modulo.",
          "3. Clique em + Novo registro para criar uma acao de marketing.",
          "4. Preencha os campos do formulario conforme configurado para a pasta (por exemplo nome da campanha, tipo e periodo).",
          "5. Clique em Adicionar para gravar; aparece Registro cadastrado.",
          "6. Use Buscar registros para localizar, Editar para ajustar (Salvar alteracoes), Exportar CSV para baixar a lista e Remover para excluir."
        ],
        "tips": [
          "A acao Marketing e exclusiva da Shopee.",
          "Conecte sua conta Shopee em Integracoes (na Shopee a conexao usa o botao Conectar com Shopee) para que as acoes de marketing tenham efeito no fluxo real.",
          "Use a busca para acompanhar campanhas por nome ou periodo sem rolar a lista inteira."
        ],
        "faq": [
          {
            "q": "Outros marketplaces tem Marketing nesta secao?",
            "a": "Nao. Apenas a Shopee tem a acao Marketing."
          },
          {
            "q": "Onde conecto a conta Shopee?",
            "a": "Em Integracoes. Na Shopee a conexao e feita pelo botao Conectar com Shopee; depois os dados de marketing ficam alinhados a sua loja."
          },
          {
            "q": "Como exporto minhas campanhas?",
            "a": "Clique em Exportar CSV; o arquivo segue o filtro de busca atual."
          }
        ]
      }
    ]
  },
  {
    "moduleKey": "pedidos",
    "moduleLabel": "Pedidos",
    "icon": "📦",
    "intro": "Central de pedidos do NEXT ERP: acompanhe vendas dos marketplaces em cada etapa (emitir nota, enviar, imprimir etiqueta, retirada e despacho), filtre, exporte e trate o pos-venda (devolucoes, reembolsos e reclamacoes).",
    "topics": [
      {
        "id": "orders",
        "title": "Pedidos Recentes (Todos os pedidos)",
        "path": "Pedidos > Gerenciamento de Pedidos > Pedidos Recentes",
        "summary": "Tela principal que mostra TODOS os pedidos, independente da etapa. E o ponto de partida para buscar, filtrar e acompanhar qualquer venda.",
        "steps": [
          "1. No menu superior abra 'Pedidos' e clique em 'Pedidos Recentes'. A tela abre com a barra lateral esquerda (Total Pedidos, Processando Pedidos, Outras), a faixa de fluxo numerada no topo e a tabela de pedidos.",
          "2. Para localizar um pedido, use o primeiro seletor da barra de filtros e escolha o criterio de busca: 'N de Pedido / N da Plataforma', 'N de Rastreio', 'Nome do Destinatario' ou 'Anuncio/SKU'.",
          "3. Digite o termo no campo 'Pesquisar pedidos, SKU, cliente ou rastreio'. A tabela filtra automaticamente conforme voce digita.",
          "4. Refine com os demais filtros: marketplace (lista 'Todas'), metodo de envio ('Todos'), situacao da nota ('Todas as Notas', 'Nao Emitidos', 'Emitidos', 'Falha na Emissao') e etiqueta ('Todas as Etiquetas', 'Nao Impressa', 'Gerada', 'Impressa').",
          "5. Leia cada linha: coluna 'Produtos' (numero do pedido, pacote, produto x quantidade e SKU), 'Valor do Pedido', 'Destinatario', 'N do Pedido da Plataforma', 'Tempo' (Pago, Arranjada e prazo), 'Metodos de Envio' (transportadora e rastreio) e 'Estado' (status, NF-e e etiqueta).",
          "6. Para agir sobre um pedido, use os botoes na coluna 'Acoes': o botao verde avanca o pedido para a proxima etapa e 'Detalhes' abre as informacoes completas.",
          "7. Para salvar a lista filtrada, clique em 'Exportar' (gera o arquivo 'pedidos-marketplace.csv')."
        ],
        "tips": [
          "Os contadores ao lado de cada item da barra lateral e das abas mostram quantos pedidos existem em cada etapa em tempo real.",
          "O filtro de busca pesquisa em varios campos ao mesmo tempo (pedido, plataforma, pacote, produto, SKU, cliente e rastreio), entao basta colar qualquer um desses dados.",
          "Se aparecer 'Nenhum Dado Disponivel', revise os filtros aplicados (marketplace, envio, nota, etiqueta) antes de concluir que nao ha pedidos."
        ],
        "faq": [
          {
            "q": "Qual a diferenca entre 'Pedidos Recentes' e as abas de etapa?",
            "a": "'Pedidos Recentes' mostra todos os pedidos juntos. As abas e itens da barra lateral filtram somente os pedidos de uma etapa especifica (Para Emitir, Para Enviar, etc.)."
          },
          {
            "q": "O Exportar gera todos os pedidos?",
            "a": "Nao. O 'Exportar' gera apenas os pedidos que estao visiveis apos os filtros e a busca aplicados naquele momento."
          },
          {
            "q": "Como seleciono varios pedidos de uma vez?",
            "a": "Marque a caixa no topo da tabela para selecionar todos os visiveis, ou marque as caixas linha a linha. O contador 'Selecionado' acompanha a quantidade."
          }
        ]
      },
      {
        "id": "orders-history",
        "title": "Pedidos Historicos",
        "path": "Pedidos > Gerenciamento de Pedidos > Pedidos Historicos",
        "summary": "Mostra os pedidos ja finalizados: os que foram despachados (Enviado) e os que foram anulados (Anulado). E o arquivo das vendas concluidas.",
        "steps": [
          "1. Abra 'Pedidos' e clique em 'Pedidos Historicos' na secao 'Total Pedidos' da barra lateral.",
          "2. A tela exibe somente pedidos com estado 'Enviado' ou 'Anulado'. O numero ao lado do item soma os dois.",
          "3. Use a busca e os filtros da barra superior (marketplace, metodo de envio, nota e etiqueta) para localizar um pedido antigo.",
          "4. Consulte na coluna 'Tempo' as datas (Pago, Arranjada) e na coluna 'Estado' a situacao da NF-e e da etiqueta para conferencia.",
          "5. Clique em 'Detalhes' na coluna 'Acoes' para ver as informacoes completas do pedido historico.",
          "6. Para guardar um relatorio, clique em 'Exportar' e baixe o CSV com os pedidos historicos filtrados."
        ],
        "tips": [
          "Pedidos historicos ja completaram o fluxo: nao ha botao de avancar etapa para 'Enviado' nem para 'Anulado', apenas 'Detalhes'.",
          "Use esta tela para conferencias e fechamentos: filtre por marketplace e exporte para CSV ao final do periodo."
        ],
        "faq": [
          {
            "q": "Por que um pedido sumiu das etapas e foi para o Historico?",
            "a": "Porque ele chegou ao status 'Enviado' (despachado) ou foi 'Anulado'. Ambos sao considerados finalizados e passam para o Historico."
          },
          {
            "q": "Consigo reverter um pedido do Historico?",
            "a": "A tela de Historico e de consulta. O avanco de etapas acontece nas telas de processamento; pedidos enviados e anulados nao tem acao de avanco."
          }
        ]
      },
      {
        "id": "orders-to-invoice",
        "title": "Para Emitir (Nota Fiscal)",
        "path": "Pedidos > Processando Pedidos > Para Emitir",
        "summary": "Lista os pedidos que ainda precisam de nota fiscal. Aqui voce emite a NF-e e o pedido segue para o envio.",
        "steps": [
          "1. Abra 'Pedidos' e clique em 'Para Emitir' (ou no card '1 Emitir NF' na faixa de fluxo no topo).",
          "2. A tela mostra apenas pedidos com nota pendente. Confira na coluna 'Estado' a marcacao 'NF-e pendente'.",
          "3. Para emitir um pedido, clique no botao 'Emitir Nota Fiscal' na coluna 'Acoes' daquela linha. O pedido passa para 'Para Enviar' e a NF-e fica como emitida.",
          "4. Para emitir varios de uma vez, marque as caixas dos pedidos desejados (ou a caixa do cabecalho para todos) e clique em 'Avancar Etapa' na barra 'Selecionado'.",
          "5. Use os filtros de nota ('Nao Emitidos', 'Falha na Emissao') para focar nos pedidos que precisam de acao.",
          "6. Caso precise cancelar um pedido em vez de emitir, selecione-o e use 'Mais Acoes' para anular (o pedido vai para 'Anulado')."
        ],
        "tips": [
          "Apos emitir, o NEXT ERP gera automaticamente um numero de nota quando o pedido nao tinha um (formato NF-000000).",
          "Confira o filtro 'Falha na Emissao' periodicamente: sao pedidos que tentaram emitir e nao concluiram."
        ],
        "faq": [
          {
            "q": "Emiti a nota e o pedido sumiu daqui. Esta correto?",
            "a": "Sim. Ao emitir, o pedido avanca para 'Para Enviar' e deixa de aparecer em 'Para Emitir'."
          },
          {
            "q": "Posso emitir varias notas ao mesmo tempo?",
            "a": "Sim. Marque os pedidos e clique em 'Avancar Etapa' na barra de selecao para processa-los em lote."
          }
        ]
      },
      {
        "id": "orders-to-ship",
        "title": "Para Enviar (Programar Envio)",
        "path": "Pedidos > Processando Pedidos > Para Enviar",
        "summary": "Pedidos com nota emitida que aguardam a programacao do envio (logistica) e a geracao do rastreio.",
        "steps": [
          "1. Abra 'Pedidos' e clique em 'Para Enviar' (ou no card '2 Programar envio' da faixa de fluxo).",
          "2. Confira na coluna 'Metodos de Envio' a transportadora e se ja existe codigo de rastreio.",
          "3. Para programar, clique em 'Programar Envio' na coluna 'Acoes'. O pedido avanca para 'Para Imprimir', gera o rastreio (quando ausente) e a etiqueta fica como gerada.",
          "4. Para processar em lote, marque os pedidos e clique em 'Avancar Etapa' na barra 'Selecionado'.",
          "5. Use o filtro de metodo de envio para separar por transportadora (ex.: Shopee Xpress, Mercado Envios) antes de programar.",
          "6. Para anular um pedido nesta etapa, selecione-o e clique em 'Mais Acoes'."
        ],
        "tips": [
          "Ao programar o envio, o sistema cria o codigo de rastreio no padrao BR seguido de numeros quando o pedido ainda nao tinha.",
          "Pedidos cuja coluna 'Arranjada' aparece com '-' recebem a marcacao 'Programado agora' ao avancar."
        ],
        "faq": [
          {
            "q": "O que significa 'Programar Envio'?",
            "a": "E confirmar a logistica do pedido: ele recebe rastreio, a etiqueta passa a ser gerada e avanca para 'Para Imprimir'."
          },
          {
            "q": "Preciso emitir a nota antes de programar o envio?",
            "a": "Sim. O fluxo normal e Para Emitir, depois Para Enviar. Pedidos so chegam aqui apos a nota ser emitida."
          }
        ]
      },
      {
        "id": "orders-to-print",
        "title": "Para Imprimir (Etiqueta)",
        "path": "Pedidos > Processando Pedidos > Para Imprimir",
        "summary": "Pedidos com envio programado e etiqueta gerada, prontos para a etiqueta ser impressa antes da coleta/retirada.",
        "steps": [
          "1. Abra 'Pedidos' e clique em 'Para Imprimir' (ou no card '3 Imprimir etiqueta' da faixa de fluxo).",
          "2. Verifique na coluna 'Estado' a marcacao da etiqueta ('Etiqueta gerada' ou 'Etiqueta impressa').",
          "3. Clique em 'Imprimir Etiqueta' na coluna 'Acoes'. O pedido avanca para 'Para Retirada', a etiqueta fica como impressa e o prazo muda para 'Aguardando retirada'.",
          "4. Para lote, marque varios pedidos e clique em 'Avancar Etapa' na barra 'Selecionado'.",
          "5. Use o filtro de etiqueta ('Nao Impressa', 'Gerada', 'Impressa') para focar nos pedidos que ainda faltam imprimir.",
          "6. Exporte com 'Exportar' caso precise de uma lista das etiquetas pendentes para conferencia."
        ],
        "tips": [
          "Confira a coluna 'N do Pedido da Plataforma' e a loja antes de imprimir para nao trocar etiquetas entre lojas.",
          "Apos imprimir, o pedido vai para 'Para Retirada': separe fisicamente o produto correspondente."
        ],
        "faq": [
          {
            "q": "Imprimi a etiqueta. Para onde o pedido vai?",
            "a": "Para a etapa 'Para Retirada', aguardando a coleta da transportadora ou a entrega na agencia."
          },
          {
            "q": "Como filtro so os que faltam imprimir?",
            "a": "No filtro de etiqueta selecione 'Nao Impressa' ou 'Gerada' para ver apenas os pendentes."
          }
        ]
      },
      {
        "id": "orders-pickup",
        "title": "Para Retirada (Aguardando coleta)",
        "path": "Pedidos > Processando Pedidos > Para Retirada",
        "summary": "Pedidos com etiqueta impressa, aguardando a coleta pela transportadora ou a entrega na agencia. Aqui voce marca como despachado.",
        "steps": [
          "1. Abra 'Pedidos' e clique em 'Para Retirada' (ou no card '4 Retirada' da faixa de fluxo).",
          "2. Separe os produtos fisicamente conforme a lista; confira SKU, quantidade e codigo de rastreio na tabela.",
          "3. Quando a transportadora coletar (ou voce entregar na agencia), clique em 'Marcar Despachado' na coluna 'Acoes'.",
          "4. O pedido avanca para 'Enviado', registra a data/hora do despacho e o prazo muda para 'Despachado localmente'.",
          "5. Para confirmar varios despachos juntos, marque os pedidos e clique em 'Avancar Etapa'.",
          "6. Para anular um pedido que nao sera mais enviado, selecione-o e clique em 'Mais Acoes'."
        ],
        "tips": [
          "So marque 'Marcar Despachado' depois que o produto realmente sair, para que o status 'Enviado' reflita a realidade.",
          "O prazo na coluna 'Tempo' ajuda a priorizar coletas com 'Despacho programado' ou prazos curtos."
        ],
        "faq": [
          {
            "q": "O que muda ao clicar em 'Marcar Despachado'?",
            "a": "O pedido vai para 'Enviado', grava a data e hora atuais do despacho e passa a constar no Historico."
          },
          {
            "q": "Posso desfazer um despacho?",
            "a": "Nao ha botao de reverter: pedidos 'Enviado' so tem a acao 'Detalhes'. Use 'Mais Acoes' antes de despachar se precisar anular."
          }
        ]
      },
      {
        "id": "orders-shipped",
        "title": "Enviado (Despachado)",
        "path": "Pedidos > Processando Pedidos > Enviado",
        "summary": "Pedidos ja despachados localmente. E uma tela de acompanhamento e consulta dos pedidos que sairam.",
        "steps": [
          "1. Abra 'Pedidos' e clique em 'Enviado' (ou no card '5 Despachado' da faixa de fluxo).",
          "2. A tela lista apenas pedidos com estado 'Enviado'. O contador mostra quantos foram despachados.",
          "3. Use a busca e os filtros (marketplace, metodo de envio) para localizar um pedido enviado especifico.",
          "4. Confira na coluna 'Metodos de Envio' o rastreio para acompanhar a entrega junto a transportadora.",
          "5. Clique em 'Detalhes' na coluna 'Acoes' para ver os dados completos do pedido despachado.",
          "6. Para guardar um relatorio dos envios, clique em 'Exportar'."
        ],
        "tips": [
          "Pedidos 'Enviado' nao tem botao de avancar etapa, apenas 'Detalhes' — o fluxo operacional ja terminou.",
          "Esses pedidos tambem aparecem em 'Pedidos Historicos', junto com os anulados."
        ],
        "faq": [
          {
            "q": "Onde acompanho a entrega?",
            "a": "Use o codigo de rastreio mostrado na coluna 'Metodos de Envio' no site da transportadora ou do marketplace."
          },
          {
            "q": "Um pedido enviado por engano, como corrijo?",
            "a": "A tela e de consulta. Trate eventuais devolucoes ou reembolsos pelas pastas de pos-venda (Devolucoes/Reembolsos)."
          }
        ]
      },
      {
        "id": "orders-canceled",
        "title": "Anulado (Pedidos cancelados)",
        "path": "Pedidos > Pos-venda > Anulado",
        "summary": "Lista os pedidos que foram anulados. Os pedidos chegam aqui quando voce usa 'Mais Acoes' nas telas de processamento.",
        "steps": [
          "1. Abra 'Pedidos' e clique em 'Anulado' (item da secao 'Outras' na barra lateral / 'Pos-venda' no menu).",
          "2. A tela exibe somente pedidos com estado 'Anulado'. O prazo desses pedidos aparece como 'Pedido anulado'.",
          "3. Para anular um pedido, va a uma tela de processamento (ex.: Para Emitir/Para Enviar/Para Retirada), marque o pedido e clique em 'Mais Acoes'. O sistema move o pedido para esta tela automaticamente.",
          "4. Use a busca e os filtros para encontrar um pedido anulado especifico.",
          "5. Clique em 'Detalhes' para conferir os dados do pedido cancelado.",
          "6. Exporte a lista com 'Exportar' se precisar de um relatorio de cancelamentos."
        ],
        "tips": [
          "O botao 'Mais Acoes' na barra de selecao executa o cancelamento dos pedidos marcados e leva voce direto para a tela 'Anulado'.",
          "Pedidos anulados nao retornam ao fluxo: confira bem antes de cancelar."
        ],
        "faq": [
          {
            "q": "Como anulo um pedido?",
            "a": "Em qualquer tela de processamento, marque o pedido na tabela e clique em 'Mais Acoes' na barra 'Selecionado'. Ele passa para 'Anulado'."
          },
          {
            "q": "Pedido anulado conta no Historico?",
            "a": "Sim. Pedidos anulados aparecem tambem em 'Pedidos Historicos' junto com os enviados."
          }
        ]
      },
      {
        "id": "returns",
        "title": "Devolucoes",
        "path": "Pedidos > Pos-venda > Devolucoes",
        "summary": "Cadastro generico de pos-venda para registrar e acompanhar as devolucoes recebidas dos marketplaces.",
        "steps": [
          "1. Abra 'Pedidos' e clique em 'Devolucoes'. A tela mostra o cabecalho com o nome da pasta, o bloco 'Campos do modulo' e a lista de registros.",
          "2. Clique em '+ Novo registro' para abrir o formulario de cadastro.",
          "3. Preencha os campos da devolucao: 'pedido' (numero do pedido), 'marketplace' (selecione na lista o canal), 'SKU' do produto e 'motivo da devolucao'.",
          "4. Clique em 'Adicionar' para salvar. A mensagem 'Registro cadastrado.' confirma a inclusao e o registro aparece na tabela.",
          "5. Para localizar uma devolucao, digite no campo 'Buscar registros' (a busca varre todos os campos do registro).",
          "6. Na tabela, use 'Editar' para corrigir uma devolucao (altere e clique em 'Salvar alteracoes') ou 'Remover' para excluir (confirme em 'Remover este registro?').",
          "7. Para baixar todas as devolucoes filtradas, clique em 'Exportar CSV'."
        ],
        "tips": [
          "Sempre informe o 'pedido' exatamente como aparece no marketplace para conseguir cruzar a devolucao com a venda original.",
          "Use o campo 'motivo da devolucao' de forma padronizada (ex.: 'produto avariado', 'arrependimento') para facilitar relatorios."
        ],
        "faq": [
          {
            "q": "Quais campos preciso preencher numa devolucao?",
            "a": "Pedido, marketplace, SKU e motivo da devolucao. O marketplace e escolhido em uma lista; os demais sao digitados."
          },
          {
            "q": "Como corrijo uma devolucao cadastrada errada?",
            "a": "Clique em 'Editar' na linha do registro, ajuste os campos e clique em 'Salvar alteracoes'."
          },
          {
            "q": "O 'Exportar CSV' inclui o que?",
            "a": "Inclui os registros visiveis apos a busca, com a coluna 'id' e todos os campos da pasta."
          }
        ]
      },
      {
        "id": "refunds",
        "title": "Reembolsos",
        "path": "Pedidos > Pos-venda > Reembolsos",
        "summary": "Cadastro generico de pos-venda para registrar os reembolsos, com o valor devolvido e o status de cada um.",
        "steps": [
          "1. Abra 'Pedidos' e clique em 'Reembolsos'.",
          "2. Clique em '+ Novo registro' para abrir o formulario.",
          "3. Preencha os campos: 'pedido' (numero do pedido), 'marketplace' (selecione o canal), 'valor' (campo numerico com o valor do reembolso) e 'status do reembolso'.",
          "4. Clique em 'Adicionar' para gravar; a mensagem 'Registro cadastrado.' confirma e o reembolso entra na tabela.",
          "5. Use o campo 'Buscar registros' para localizar um reembolso por pedido, valor ou status.",
          "6. Na tabela, clique em 'Editar' para atualizar o 'status do reembolso' (e clique em 'Salvar alteracoes') ou 'Remover' para excluir.",
          "7. Clique em 'Exportar CSV' para baixar a lista de reembolsos."
        ],
        "tips": [
          "O campo 'valor' e numerico: informe apenas numeros (use ponto para os centavos) para que os relatorios fiquem corretos.",
          "Atualize o 'status do reembolso' conforme o andamento (ex.: 'solicitado', 'aprovado', 'pago') para controlar o que ainda esta pendente."
        ],
        "faq": [
          {
            "q": "Quais campos tem o cadastro de reembolso?",
            "a": "Pedido, marketplace, valor (numerico) e status do reembolso."
          },
          {
            "q": "Como acompanho reembolsos ainda nao pagos?",
            "a": "Digite o status desejado em 'Buscar registros' (ex.: 'pendente') para filtrar apenas esses registros."
          }
        ]
      },
      {
        "id": "claims",
        "title": "Reclamacoes",
        "path": "Pedidos > Pos-venda > Reclamacoes",
        "summary": "Cadastro generico de pos-venda para registrar e acompanhar reclamacoes abertas pelos clientes nos marketplaces.",
        "steps": [
          "1. Abra 'Pedidos' e clique em 'Reclamacoes'.",
          "2. Clique em '+ Novo registro' para abrir o formulario de cadastro.",
          "3. Preencha os campos: 'pedido' (numero do pedido), 'marketplace' (selecione o canal), 'tipo de reclamacao' e 'status'.",
          "4. Clique em 'Adicionar' para salvar; 'Registro cadastrado.' confirma e a reclamacao aparece na tabela.",
          "5. Use 'Buscar registros' para localizar reclamacoes por pedido, tipo ou status.",
          "6. Na tabela, clique em 'Editar' para atualizar o andamento (altere o 'status' e clique em 'Salvar alteracoes') ou 'Remover' para excluir uma reclamacao resolvida/duplicada.",
          "7. Clique em 'Exportar CSV' para gerar um relatorio das reclamacoes."
        ],
        "tips": [
          "Padronize o 'tipo de reclamacao' (ex.: 'produto nao recebido', 'produto diferente') para identificar problemas recorrentes.",
          "Mantenha o 'status' sempre atualizado para saber quais reclamacoes ainda estao abertas e precisam de resposta."
        ],
        "faq": [
          {
            "q": "Quais campos tem o cadastro de reclamacao?",
            "a": "Pedido, marketplace, tipo de reclamacao e status."
          },
          {
            "q": "Como vejo so as reclamacoes em aberto?",
            "a": "Digite o status (ex.: 'aberta' ou 'pendente') no campo 'Buscar registros' para filtrar a tabela."
          },
          {
            "q": "Posso apagar uma reclamacao ja resolvida?",
            "a": "Sim. Clique em 'Remover' na linha do registro e confirme em 'Remover este registro?'."
          }
        ]
      }
    ]
  },
  {
    "moduleKey": "compras",
    "moduleLabel": "Compras",
    "icon": "🛒",
    "intro": "Modulo para planejar reposicao de estoque, gerar e acompanhar pedidos de compra, cadastrar fornecedores e consultar notas fiscais de compra (NF-e).",
    "topics": [
      {
        "id": "purchase-suggestions",
        "title": "Sugestao de Compras",
        "path": "Compras > Controle de Compras > Sugestao de Compras",
        "summary": "Mostra automaticamente quais produtos precisam de reposicao, com quantidade sugerida, prioridade e valor previsto, permitindo gerar pedidos de compra em lote.",
        "steps": [
          "1. Abra Compras > Controle de Compras > Sugestao de Compras. O sistema le os produtos cadastrados e lista apenas os que precisam de reposicao (quantidade sugerida maior que zero).",
          "2. Use a barra de filtros no topo para refinar a lista: o seletor a esquerda escolhe o campo de busca (SKU, Nome do Produto ou Fornecedor) e o campo 'Clique no botao esquerdo para pesquisar SKU ou produto' recebe o texto digitado.",
          "3. Combine com os outros filtros: o seletor de categoria, o seletor de fornecedor e o filtro de estoque ('Todos', 'Sem Estoque' ou 'Fornecedor ausente') para encontrar exatamente o que precisa.",
          "4. Confira cada linha: SKU, Fornecedores/Armazem, Qtd. Sugerida (com Atual e Min), Vendas Totais e Media de Venda por periodo, a Prioridade (Critico, Alto ou Normal) e o Valor Previsto.",
          "5. Marque a caixa de selecao na primeira coluna dos itens desejados, ou use a caixa no cabecalho da tabela para selecionar todos os itens filtrados. O contador 'Selecionado' mostra quantos estao marcados.",
          "6. Clique em 'Criar Pedidos de Compras' para transformar os itens selecionados em pedidos. O sistema cria os pedidos com status Para Comprar e leva voce automaticamente para a aba Para Comprar.",
          "7. Para tirar itens da lista sem comprar, selecione-os e clique em 'Mais Acoes' (descarta as sugestoes selecionadas). Use 'Recalcular' para reiniciar o filtro de estoque.",
          "8. Para exportar a lista atual, clique em 'Exportar' e o arquivo sugestoes-de-compras.csv sera baixado com SKU, produto, fornecedor, estoques e valor previsto.",
          "9. Para ajustar como as sugestoes sao calculadas, clique em 'Regras de Reposicao' para ir a tela de regras de estoque."
        ],
        "tips": [
          "A quantidade sugerida e calculada automaticamente a partir do estoque atual e do estoque minimo do produto. Mantenha o estoque minimo correto no cadastro de produtos para ter sugestoes confiaveis.",
          "Itens com prioridade Critico estao com estoque zerado ou negativo. Trate-os primeiro para evitar falta de produto.",
          "Os botoes 'Criar Pedidos de Compras' e 'Mais Acoes' ficam desabilitados enquanto nada estiver selecionado."
        ],
        "faq": [
          {
            "q": "De onde vem os produtos que aparecem aqui?",
            "a": "Do seu cadastro de produtos. A tela so exibe os itens cuja quantidade sugerida e maior que zero, ou seja, que estao abaixo do alvo de reposicao."
          },
          {
            "q": "Descartei uma sugestao por engano. Como recupero?",
            "a": "Atualize a pagina. O descarte vale apenas durante a sessao atual; ao recarregar, o item volta a aparecer se ainda precisar de reposicao."
          },
          {
            "q": "Por que o fornecedor aparece como 'Fornecedor nao definido'?",
            "a": "Porque o produto nao tem fornecedor preenchido no cadastro. Use o filtro 'Fornecedor ausente' para encontra-los e defina o fornecedor em Produtos."
          }
        ]
      },
      {
        "id": "purchase-orders",
        "title": "Pedidos de Compras",
        "path": "Compras > Controle de Compras > Pedidos de Compras",
        "summary": "Lista e acompanha todos os pedidos de compra organizados por status (Tudo, Para Comprar, Em Transito, Parcial, Completado, Cancelado), com mudanca de status em lote ou linha a linha.",
        "steps": [
          "1. Abra Compras > Controle de Compras > Pedidos de Compras. Por padrao a aba 'Tudo' mostra todos os pedidos; cada aba de status exibe um contador ao lado do nome.",
          "2. Use as abas de status (Tudo, Para Comprar, Em Transito, Parcial, Completado, Cancelado) para filtrar os pedidos pela situacao desejada.",
          "3. Pesquise pelo seletor de campo (N de Compras, SKU ou Fornecedor) e pelo campo 'Pesquisar pedido, SKU ou fornecedor'. Refine ainda mais pelo tipo de data (Data de Criacao ou Data de Compra), pelo campo 'Filtrar por data' e pelo seletor de armazem (Todos Armazens, Catedral MDF ou PINK).",
          "4. Na tabela, confira Informacao do SKU, Valor Total, N de Rastreio, Qtd. Comprada, Recebido/Comprado, Tempo, Estado e Notas de Compras.",
          "5. Para mudar o status de um unico pedido, use o seletor na coluna 'Acoes' da linha e escolha entre Para Comprar, Em Transito, Parcial, Completado ou Cancelado.",
          "6. Para acoes em lote, marque as caixas dos pedidos (ou a do cabecalho para todos) e use os botoes que aparecem conforme a aba: na aba Para Comprar use 'Compras' (move para Em Transito); na aba Parcial use 'Marcar como Concluido' (move para Completado).",
          "7. Use 'Mais Acoes' para cancelar em lote os pedidos selecionados (move para Cancelado).",
          "8. Para baixar a lista filtrada, clique em 'Importar & Exportar' e o arquivo pedidos-de-compras.csv sera gerado com pedido, SKU, produto, fornecedor, quantidade, recebido, total e status."
        ],
        "tips": [
          "Os botoes de acao em lote so aparecem/funcionam de acordo com a aba atual e ficam desabilitados sem selecao. Selecione os pedidos antes de tentar mudar o status.",
          "Os pedidos sao criados a partir da tela Sugestao de Compras. Se a lista estiver vazia, gere pedidos primeiro pelas sugestoes.",
          "Ao mudar o status em lote, o sistema leva voce automaticamente para a aba correspondente ao novo status."
        ],
        "faq": [
          {
            "q": "Como crio um novo pedido de compra?",
            "a": "Pela tela Sugestao de Compras: selecione os itens e clique em 'Criar Pedidos de Compras'. Eles aparecem aqui com status Para Comprar."
          },
          {
            "q": "Qual a diferenca entre Parcial e Completado?",
            "a": "Parcial indica que parte da quantidade ja foi recebida; Completado indica que o pedido foi totalmente recebido. Use 'Marcar como Concluido' para fechar pedidos parciais."
          },
          {
            "q": "Os pedidos somem quando atualizo a pagina?",
            "a": "Sim, os pedidos sao mantidos durante a sessao atual. Exporte por 'Importar & Exportar' se precisar guardar o registro."
          }
        ]
      },
      {
        "id": "purchase-nfe-brasil",
        "title": "Brasil NF-e",
        "path": "Compras > NF-e de Compra > Brasil NF-e",
        "summary": "Tela de consulta das notas fiscais eletronicas de compra, organizada pelos estados Processando, Falhou e Processada.",
        "steps": [
          "1. Abra Compras > NF-e de Compra > Brasil NF-e para ver as notas fiscais de compra.",
          "2. Use o seletor de campo de busca (Chave, Fornecedor ou N da NF-e) e digite no campo 'Pesquisar notas fiscais de compra'.",
          "3. Filtre pelo seletor de estado: 'Todos Estados', 'Processando', 'Falhou' ou 'Processada'.",
          "4. Alterne pelas abas 'Processando', 'Falhou' e 'Processada' (cada uma com seu contador) para ver as notas em cada situacao.",
          "5. Confira na tabela as colunas Chave da Nota Fiscal, Informacoes, Fornecedor, Valor, Estado e Acoes.",
          "6. Quando houver notas, use as opcoes da coluna Acoes para visualizar ou tratar cada nota."
        ],
        "tips": [
          "Notas em 'Falhou' indicam um problema no processamento. Revise os dados da nota ou do fornecedor antes de reprocessar.",
          "Se nenhuma nota aparecer, o painel mostra 'Nenhum Dado Disponivel' - isso significa que ainda nao ha notas de compra registradas para o filtro atual."
        ],
        "faq": [
          {
            "q": "Por que a tela aparece vazia?",
            "a": "Porque ainda nao ha notas fiscais de compra registradas para o estado/filtro selecionado. Verifique os filtros e o estado escolhido nas abas."
          },
          {
            "q": "O que significa cada aba de estado?",
            "a": "Processando: nota em andamento; Falhou: houve erro no processamento; Processada: nota concluida com sucesso."
          }
        ]
      },
      {
        "id": "suppliers",
        "title": "Fornecedores",
        "path": "Compras > Gestao de Fornecedores > Fornecedores",
        "summary": "Lista e cadastra fornecedores. Reune automaticamente os fornecedores vindos do cadastro de produtos e permite adicionar novos manualmente por um formulario rapido.",
        "steps": [
          "1. Abra Compras > Gestao de Fornecedores > Fornecedores. A tabela ja traz os fornecedores extraidos do cadastro de produtos (com a quantidade de SKUs vinculados) mais os adicionados manualmente.",
          "2. Para localizar um fornecedor, use o seletor de campo (Nome de Empresa, Tributacao ou Telefone) e o campo 'Pesquisar fornecedores'.",
          "3. Para cadastrar um novo fornecedor, preencha o formulario com os campos 'Nome da empresa', 'Tributacao / CNPJ', 'Contato', 'Telefone' e 'Observacoes'.",
          "4. Clique em '+ Adicionar Fornecedores' para salvar. O fornecedor entra no topo da lista e o formulario e limpo automaticamente.",
          "5. Confira na tabela as colunas Nome de Empresa, Tributacao, Contatos, Telefone, Observacoes e Criado/Atualizado.",
          "6. Use os botoes 'Editar' e 'Mais' na coluna Acoes de cada linha para gerenciar o fornecedor."
        ],
        "tips": [
          "O campo 'Nome da empresa' e obrigatorio: sem ele o botao '+ Adicionar Fornecedores' nao cadastra nada.",
          "Fornecedores que vem do cadastro de produtos aparecem com a observacao 'Fornecedor vindo do cadastro de produtos' e mostram quantos SKUs estao vinculados.",
          "Os fornecedores adicionados manualmente valem para a sessao atual; para vincular um fornecedor a produtos use a tela Gerenciamento de Fornecedores ou o cadastro de Produtos."
        ],
        "faq": [
          {
            "q": "Por que ja existem fornecedores sem eu ter cadastrado nada?",
            "a": "Porque o sistema le o campo fornecedor dos seus produtos e monta a lista automaticamente, agrupando por nome e contando os SKUs de cada um."
          },
          {
            "q": "Adicionei um fornecedor mas ele nao tem SKUs. Esta correto?",
            "a": "Sim. Fornecedores cadastrados manualmente comecam com 0 SKUs. Eles passam a contar SKUs quando voce vincula produtos a esse fornecedor."
          },
          {
            "q": "Como faco para vincular um fornecedor a um produto?",
            "a": "Va ao cadastro de Produtos (ou use Gerenciamento de Fornecedores) e defina o fornecedor no SKU desejado."
          }
        ]
      },
      {
        "id": "supplier-relations",
        "title": "Gerenciamento de Fornecedores",
        "path": "Compras > Gestao de Fornecedores > Gerenciamento de Fornecedores",
        "summary": "Mostra o vinculo entre SKUs e fornecedores, exibindo fornecedor padrao, ultimo preco e ultima data de compra de cada produto.",
        "steps": [
          "1. Abra Compras > Gestao de Fornecedores > Gerenciamento de Fornecedores. A tela exibe os SKUs com seus fornecedores. O aviso no topo lembra que so aparecem SKUs vinculados a fornecedores.",
          "2. Para buscar, use o seletor de campo (SKU ou Nome do Produto) e o campo 'Clique no botao esquerdo para pesquisa'.",
          "3. Filtre por fornecedor usando o seletor que comeca em 'Todos' e lista todos os fornecedores disponiveis.",
          "4. Analise a tabela: SKU, Nome do Produto, Fornecedores, Fornecedor Padrao, Ultimo Preco e Ultima Data de Compra.",
          "5. Para adicionar fornecedor a SKUs que ainda nao tem, clique em 'Gerenciamento de Produtos' (no aviso ou na barra de acoes) para ir ao cadastro de Produtos.",
          "6. Para abrir o cadastro de fornecedores, clique em 'Adicionar Fornecedores' na barra de acoes em lote.",
          "7. Para exportar o vinculo atual, clique em 'Exportar' e baixe o arquivo fornecedores-por-sku.csv com SKU, produto, fornecedor, ultimo preco e marketplace.",
          "8. Use 'Editar' e 'Mais' na coluna Acoes de cada linha para ajustes pontuais."
        ],
        "tips": [
          "Esta tela so lista SKUs ja vinculados a um fornecedor. Se um produto nao aparece, defina o fornecedor dele em Produtos.",
          "O botao 'Exportar' fica desabilitado quando nao ha linhas para exportar com os filtros atuais.",
          "Use o filtro por fornecedor para revisar rapidamente todos os SKUs de um mesmo fornecedor antes de uma compra."
        ],
        "faq": [
          {
            "q": "Por que um SKU nao aparece nesta lista?",
            "a": "Porque ele ainda nao tem fornecedor definido. Clique em 'Gerenciamento de Produtos' e vincule um fornecedor ao SKU."
          },
          {
            "q": "Onde adiciono um novo fornecedor a partir daqui?",
            "a": "Clique em 'Adicionar Fornecedores' para abrir a tela de cadastro de Fornecedores."
          },
          {
            "q": "O que e o 'Fornecedor Padrao'?",
            "a": "E o fornecedor principal associado ao SKU, usado como referencia nas compras e exibido junto do ultimo preco do produto."
          }
        ]
      }
    ]
  },
  {
    "moduleKey": "estoque",
    "moduleLabel": "Estoque",
    "icon": "📦",
    "intro": "Controle os saldos de estoque cadastrados no ERP, monitore divergencias com os marketplaces, identifique produtos para reposicao e gerencie os armazens de plataforma (Full, FBS e FBA).",
    "topics": [
      {
        "id": "stock",
        "title": "Lista de Estoque",
        "path": "Estoque > Gerenciamento de Estoque > Lista de Estoque",
        "summary": "Tela central do modulo. Mostra todos os SKUs cadastrados no ERP com saldo, estoque minimo, reservado, disponivel, estoque na plataforma e status de sincronizacao.",
        "steps": [
          "1. Abra o menu Estoque e clique em 'Lista de Estoque'. O sistema carrega automaticamente todos os produtos cadastrados.",
          "2. No topo voce ve quatro indicadores (KPIs): 'Produtos monitorados', 'Saldo disponivel', 'Divergencias' e 'Estoque baixo'. Use-os para ter a visao geral antes de filtrar.",
          "3. Use as abas de marketplace ('Todos', 'Shopee', 'Mercado Livre', 'Shein', 'TikTok Shop', 'Amazon', 'Temu') para limitar a lista a um unico canal.",
          "4. No campo de busca, digite o SKU, o nome do produto ou a categoria. O seletor a esquerda (SKU / KIT SKU / Categoria) e a lista de status (Todos, Sincronizado, Divergente, Estoque baixo, Sem estoque) refinam ainda mais a pesquisa.",
          "5. Para atualizar os numeros com os dados mais recentes do cadastro, clique em 'Atualizar saldos' no topo. Aparece a mensagem 'Saldos atualizados com os dados cadastrados no ERP.'.",
          "6. Na tabela, marque os produtos com a caixa de selecao (ou use a caixa do cabecalho para marcar todos os visiveis) e clique em 'Exportar Selecionados' para baixar so o que voce escolheu.",
          "7. Para baixar a planilha completa do filtro atual, clique em 'Exportar CSV' no topo da tela.",
          "8. Na linha de cada produto, clique em 'Atualizar' para reaplicar o saldo do ERP naquele SKU, ou em 'Historico' para ver o saldo atual e o estoque minimo.",
          "9. Precisa corrigir os numeros de varios produtos? Clique em 'Editar em Massa' (vai para a tela de Produtos) ou 'Regras de Reposicao' para configurar parametros de compra."
        ],
        "tips": [
          "A coluna 'Disponivel' e calculada como saldo menos reservado (nunca fica negativa). Se o disponivel estiver zerado mas houver estoque, verifique as reservas por pedido.",
          "O status 'Divergente' aparece quando o estoque do ERP e diferente do estoque na plataforma. Trate essas divergencias antes de anunciar para evitar venda sem saldo.",
          "Os botoes 'Atualizar' e 'Historico' das linhas apenas exibem mensagens informativas; eles nao alteram o cadastro do produto."
        ],
        "faq": [
          {
            "q": "O que significa cada status de estoque?",
            "a": "Sem estoque = saldo zero ou negativo; Estoque baixo = saldo igual ou abaixo do minimo; Divergente = ERP diferente da plataforma; Sincronizado = tudo certo."
          },
          {
            "q": "Por que o botao 'Exportar Selecionados' esta desabilitado?",
            "a": "Ele so habilita depois que voce marca pelo menos um produto na caixa de selecao da tabela."
          },
          {
            "q": "Como corrijo o saldo de um produto?",
            "a": "Use 'Editar em Massa' para ir ate a tela de Produtos, onde os saldos sao realmente cadastrados. Esta tela e de leitura e monitoramento."
          }
        ]
      },
      {
        "id": "marketplace-stock",
        "title": "Saldo por Marketplace",
        "path": "Estoque > Gerenciamento de Estoque > Saldo por Marketplace",
        "summary": "Mostra o saldo cadastrado no ERP agrupado por canal de venda, com quantidade de SKUs, unidades e venda potencial de cada marketplace.",
        "steps": [
          "1. No menu Estoque, clique em 'Saldo por Marketplace'.",
          "2. Observe o bloco 'Saldo por canal': cada cartao mostra um marketplace (Shopee, Mercado Livre, Shein, TikTok Shop, Amazon, Temu) com o numero de SKUs, o total de unidades e o valor em venda potencial.",
          "3. Use as abas de marketplace ou o campo de busca para focar a lista detalhada em um canal especifico.",
          "4. Clique em 'Atualizar saldos' para recalcular os totais com os dados atuais do cadastro.",
          "5. Para exportar os dados, clique em 'Exportar CSV' (lista completa) ou marque produtos e use 'Exportar Selecionados'."
        ],
        "tips": [
          "A 'venda potencial' usa o preco de venda multiplicado pelo saldo. E uma estimativa de faturamento se todo o estoque for vendido pelo preco cadastrado.",
          "Se um canal aparece com 0 SKUs, e porque nenhum produto tem aquele marketplace definido no cadastro."
        ],
        "faq": [
          {
            "q": "Os cartoes consideram os filtros aplicados?",
            "a": "Os cartoes de resumo por canal somam todos os produtos cadastrados; os filtros e a busca afetam a tabela detalhada abaixo."
          },
          {
            "q": "Qual a diferenca para a Lista de Estoque?",
            "a": "Esta tela destaca o resumo por canal de venda; a Lista de Estoque foca no detalhamento SKU a SKU."
          }
        ]
      },
      {
        "id": "stock-low",
        "title": "Estoque Baixo",
        "path": "Estoque > Gerenciamento de Estoque > Estoque Baixo",
        "summary": "Lista apenas os produtos cujo saldo atual esta igual ou abaixo do estoque minimo cadastrado, ajudando a planejar reposicao.",
        "steps": [
          "1. No menu Estoque, clique em 'Estoque Baixo'. A tela ja filtra automaticamente so os produtos abaixo do minimo.",
          "2. Verifique o KPI 'Estoque baixo' no topo para saber quantos itens precisam de atencao.",
          "3. Refine por canal usando as abas de marketplace ou localize um item especifico no campo de busca.",
          "4. Para registrar parametros de compra, clique em 'Regras de Reposicao' no topo da tela.",
          "5. Exporte a lista de reposicao com 'Exportar CSV' para enviar ao setor de compras, ou selecione itens e use 'Exportar Selecionados'."
        ],
        "tips": [
          "Esta tela ja vem filtrada; mesmo que voce mude as abas, ela continua mostrando apenas itens com saldo igual ou abaixo do minimo.",
          "Mantenha o 'estoque minimo' atualizado no cadastro de Produtos para que esta lista reflita a realidade da sua operacao."
        ],
        "faq": [
          {
            "q": "Por que um produto com saldo nao aparece como baixo?",
            "a": "Porque o saldo dele ainda esta acima do estoque minimo cadastrado. So entram itens com saldo igual ou abaixo do minimo."
          },
          {
            "q": "Como defino o estoque minimo de um produto?",
            "a": "O minimo e cadastrado na tela de Produtos. Apos atualizar la, volte aqui e clique em 'Atualizar saldos'."
          }
        ]
      },
      {
        "id": "stock-report",
        "title": "Relatorio de Estoque",
        "path": "Estoque > Gerenciamento de Estoque > Relatorio de Estoque",
        "summary": "Resumo operacional do estoque com indicadores gerais e tabelas de saldo e valor por categoria e por marketplace.",
        "steps": [
          "1. No menu Estoque, clique em 'Relatorio de Estoque'.",
          "2. No bloco 'Indicadores do estoque', confira 'SKUs cadastrados', 'Saldo total' e 'Estoque baixo'.",
          "3. Na tabela 'Por categoria', veja a quantidade de SKUs, saldo, valor em estoque (custo x saldo) e quantos itens estao com estoque baixo em cada categoria.",
          "4. Na tabela 'Por marketplace', acompanhe SKUs, saldo e venda potencial de cada canal.",
          "5. Para gerar uma planilha, clique em 'Exportar CSV' no topo.",
          "6. Use 'Atualizar saldos' antes de analisar para garantir que os numeros estao atualizados."
        ],
        "tips": [
          "O 'valor em estoque' da tabela por categoria usa o custo do produto; ja a 'venda potencial' usa o preco de venda. Sao indicadores diferentes.",
          "As categorias sem nome aparecem agrupadas como 'Sem categoria'. Padronize as categorias no cadastro para um relatorio mais limpo."
        ],
        "faq": [
          {
            "q": "Posso filtrar o relatorio por canal?",
            "a": "As tabelas de resumo consideram todo o estoque cadastrado; para focar em um canal use as abas de marketplace que afetam a lista detalhada."
          },
          {
            "q": "Por que valor em estoque e venda potencial sao diferentes?",
            "a": "Valor em estoque usa o custo (quanto voce pagou); venda potencial usa o preco de venda (quanto voce receberia)."
          }
        ]
      },
      {
        "id": "stock-shopee",
        "title": "Estoque ERP - Shopee",
        "path": "Estoque > Marketplaces > Shopee",
        "summary": "Lista de estoque ja filtrada para os produtos cadastrados com o marketplace Shopee.",
        "steps": [
          "1. No menu Estoque, em 'Marketplaces', clique em 'Shopee'. A aba 'Shopee' ja vem selecionada.",
          "2. Confira a lista de SKUs com saldo, reservado, disponivel, estoque na plataforma e status.",
          "3. Use o campo de busca para localizar um SKU, produto ou categoria especifico da Shopee.",
          "4. Aplique o filtro de status (Sincronizado, Divergente, Estoque baixo, Sem estoque) para priorizar o que tratar.",
          "5. Clique em 'Atualizar saldos' para recarregar os dados e 'Exportar CSV' para baixar a planilha do canal."
        ],
        "tips": [
          "Priorize os itens com status 'Divergente' para evitar vender na Shopee sem saldo real.",
          "Se trocar a aba para 'Todos', a tela passa a mostrar todos os canais; volte para 'Shopee' para manter o filtro."
        ],
        "faq": [
          {
            "q": "Por que um produto Shopee nao aparece aqui?",
            "a": "Ele so aparece se o campo de marketplace do produto estiver definido como Shopee no cadastro."
          }
        ]
      },
      {
        "id": "stock-mercado-livre",
        "title": "Estoque ERP - Mercado Livre",
        "path": "Estoque > Marketplaces > Mercado Livre",
        "summary": "Lista de estoque ja filtrada para os produtos cadastrados com o marketplace Mercado Livre.",
        "steps": [
          "1. No menu Estoque, em 'Marketplaces', clique em 'Mercado Livre'. A aba correspondente ja vem ativa.",
          "2. Veja os SKUs do Mercado Livre com saldo, reservado, disponivel, estoque na plataforma e status.",
          "3. Pesquise por SKU, produto ou categoria no campo de busca.",
          "4. Filtre por status para localizar divergencias ou itens sem estoque.",
          "5. Use 'Atualizar saldos' e 'Exportar CSV' conforme a necessidade."
        ],
        "tips": [
          "Itens com estoque no Mercado Envios Full nao saem do seu deposito; confira tambem a tela 'Mercado Envios Full' para o saldo no armazem da plataforma."
        ],
        "faq": [
          {
            "q": "Esta tela mostra o saldo do Full?",
            "a": "Nao. Aqui voce ve o saldo cadastrado no ERP para o canal Mercado Livre. O saldo do Full e gerenciado na tela 'Mercado Envios Full'."
          }
        ]
      },
      {
        "id": "stock-shein",
        "title": "Estoque ERP - Shein",
        "path": "Estoque > Marketplaces > Shein",
        "summary": "Lista de estoque ja filtrada para os produtos cadastrados com o marketplace Shein.",
        "steps": [
          "1. No menu Estoque, em 'Marketplaces', clique em 'Shein'. A aba 'Shein' ja vem selecionada.",
          "2. Acompanhe os SKUs da Shein com saldo, disponivel, estoque na plataforma e status.",
          "3. Use a busca para encontrar um item especifico.",
          "4. Aplique o filtro de status para priorizar correcoes.",
          "5. Clique em 'Atualizar saldos' e, se precisar, 'Exportar CSV'."
        ],
        "tips": [
          "Use o filtro de status 'Sem estoque' para identificar rapidamente anuncios da Shein que precisam de reposicao urgente."
        ],
        "faq": [
          {
            "q": "Posso exportar so os produtos da Shein?",
            "a": "Sim. Com a aba Shein ativa, clique em 'Exportar CSV' para baixar apenas os itens desse canal."
          }
        ]
      },
      {
        "id": "stock-tiktok",
        "title": "Estoque ERP - TikTok Shop",
        "path": "Estoque > Marketplaces > TikTok Shop",
        "summary": "Lista de estoque ja filtrada para os produtos cadastrados com o marketplace TikTok Shop.",
        "steps": [
          "1. No menu Estoque, em 'Marketplaces', clique em 'TikTok Shop'. A aba 'TikTok Shop' ja vem ativa.",
          "2. Verifique os SKUs do TikTok Shop com saldo, disponivel, estoque na plataforma e status.",
          "3. Pesquise por SKU, produto ou categoria.",
          "4. Filtre por status para encontrar divergencias.",
          "5. Use 'Atualizar saldos' e 'Exportar CSV' quando necessario."
        ],
        "tips": [
          "Campanhas no TikTok Shop costumam gerar picos de venda; revise os itens com status 'Estoque baixo' antes de impulsionar anuncios."
        ],
        "faq": [
          {
            "q": "Como vejo so o que esta divergente no TikTok?",
            "a": "Com a aba TikTok Shop ativa, escolha 'Divergente' no filtro de status."
          }
        ]
      },
      {
        "id": "stock-amazon",
        "title": "Estoque ERP - Amazon",
        "path": "Estoque > Marketplaces > Amazon",
        "summary": "Lista de estoque ja filtrada para os produtos cadastrados com o marketplace Amazon.",
        "steps": [
          "1. No menu Estoque, em 'Marketplaces', clique em 'Amazon'. A aba 'Amazon' ja vem selecionada.",
          "2. Acompanhe os SKUs da Amazon com saldo, disponivel, estoque na plataforma e status.",
          "3. Use a busca para localizar um item especifico.",
          "4. Filtre por status para priorizar correcoes.",
          "5. Clique em 'Atualizar saldos' e, se precisar, 'Exportar CSV'."
        ],
        "tips": [
          "Para itens enviados pela Amazon, confira tambem a tela 'Amazon FBA', que controla o estoque no centro de distribuicao da Amazon."
        ],
        "faq": [
          {
            "q": "Esta tela inclui o estoque do FBA?",
            "a": "Nao. Aqui voce ve o saldo do ERP para o canal Amazon. O estoque no centro da Amazon e gerenciado na tela 'Amazon FBA'."
          }
        ]
      },
      {
        "id": "stock-temu",
        "title": "Estoque ERP - Temu",
        "path": "Estoque > Marketplaces > Temu",
        "summary": "Abre a Lista de Estoque com todos os canais. Para isolar os produtos da Temu, use a aba 'Temu' no proprio painel de filtros.",
        "steps": [
          "1. No menu Estoque, em 'Marketplaces', clique em 'Temu'.",
          "2. Como esta opcao abre a visao geral de estoque, clique na aba 'Temu' no painel de filtros para mostrar apenas os produtos desse canal.",
          "3. Confira saldo, disponivel, estoque na plataforma e status de cada SKU da Temu.",
          "4. Use a busca para localizar um produto especifico.",
          "5. Clique em 'Atualizar saldos' e, se precisar, 'Exportar CSV' para baixar a lista filtrada."
        ],
        "tips": [
          "Diferente dos outros canais, a tela da Temu nao ja vem filtrada: lembre-se de clicar na aba 'Temu' para ver somente esse marketplace.",
          "Se a aba estiver em 'Todos', voce vera produtos de todos os canais misturados."
        ],
        "faq": [
          {
            "q": "Por que a tela mostra produtos de outros canais?",
            "a": "A opcao Temu abre a visao geral. Clique na aba 'Temu' no painel de filtros para limitar a esse canal."
          }
        ]
      },
      {
        "id": "stock-sync",
        "title": "Sincronizacao de Estoque",
        "path": "Estoque > Gerenciamento de Estoque > Sincronizacao de Estoque",
        "summary": "Pasta de cadastro onde voce registra e acompanha as configuracoes de sincronizacao de estoque com os marketplaces.",
        "steps": [
          "1. No menu Estoque, clique em 'Sincronizacao de Estoque' (marcado com o selo 'Hot').",
          "2. Veja no bloco 'Campos do modulo' quais informacoes esta pasta pede antes de cadastrar.",
          "3. Clique em '+ Novo registro' para abrir o formulario e preencha os campos exibidos para esta pasta.",
          "4. Clique em 'Adicionar' para salvar o novo registro (ou 'Cancelar' para descartar).",
          "5. Use a caixa 'Buscar registros' para filtrar a lista por qualquer texto.",
          "6. Para alterar um registro, clique em 'Editar' na linha, ajuste e clique em 'Salvar alteracoes'.",
          "7. Para apagar, clique em 'Remover' na linha e confirme em 'Remover este registro?'.",
          "8. Clique em 'Exportar CSV' para baixar todos os registros listados."
        ],
        "tips": [
          "Os campos exatos do formulario sao definidos para esta pasta e aparecem na lista 'Campos do modulo' e dentro do formulario de '+ Novo registro'.",
          "A busca examina todo o conteudo do registro, entao voce pode pesquisar por qualquer valor cadastrado."
        ],
        "faq": [
          {
            "q": "O botao 'Exportar CSV' esta desabilitado, por que?",
            "a": "Ele so habilita quando ha pelo menos um registro na lista (apos a busca, se houver filtro aplicado)."
          },
          {
            "q": "Posso editar um registro depois de salvo?",
            "a": "Sim. Clique em 'Editar' na linha desejada, faca as alteracoes e clique em 'Salvar alteracoes'."
          }
        ]
      },
      {
        "id": "mercado-envios-full",
        "title": "Mercado Envios Full",
        "path": "Estoque > Armazem de Plataforma > Mercado Envios Full",
        "summary": "Pasta de cadastro para controlar o estoque enviado ao armazem Full do Mercado Livre.",
        "steps": [
          "1. No menu Estoque, em 'Armazem de Plataforma', clique em 'Mercado Envios Full'.",
          "2. Confira em 'Campos do modulo' quais dados esta pasta solicita.",
          "3. Clique em '+ Novo registro', preencha os campos do formulario exibidos para esta pasta e clique em 'Adicionar'.",
          "4. Use 'Buscar registros' para localizar um envio ou item especifico.",
          "5. Clique em 'Editar' para ajustar e 'Salvar alteracoes', ou 'Remover' (confirmando) para excluir.",
          "6. Clique em 'Exportar CSV' para baixar a lista completa."
        ],
        "tips": [
          "Registre aqui apenas o estoque que ja esta fisicamente no Full; o saldo do seu deposito proprio fica na Lista de Estoque.",
          "Mantenha as quantidades atualizadas para conciliar com o painel do Mercado Livre."
        ],
        "faq": [
          {
            "q": "Esse cadastro envia estoque para o Mercado Livre?",
            "a": "Nao. Esta pasta serve para registrar e controlar internamente o que voce enviou ao Full; o envio fisico e feito pela logistica do Mercado Livre."
          }
        ]
      },
      {
        "id": "shopee-fbs",
        "title": "Shopee FBS",
        "path": "Estoque > Armazem de Plataforma > Shopee FBS",
        "summary": "Pasta de cadastro para controlar o estoque armazenado no programa FBS (Fulfillment by Shopee).",
        "steps": [
          "1. No menu Estoque, em 'Armazem de Plataforma', clique em 'Shopee FBS'.",
          "2. Verifique os campos solicitados em 'Campos do modulo'.",
          "3. Clique em '+ Novo registro', preencha os campos do formulario e clique em 'Adicionar'.",
          "4. Use 'Buscar registros' para encontrar um item rapidamente.",
          "5. Edite com 'Editar' + 'Salvar alteracoes' ou exclua com 'Remover' (confirmando).",
          "6. Use 'Exportar CSV' para gerar a planilha dos registros."
        ],
        "tips": [
          "Concilie periodicamente as quantidades cadastradas aqui com o painel FBS da Shopee para evitar divergencias."
        ],
        "faq": [
          {
            "q": "Qual a diferenca entre Shopee FBS e a aba Shopee de estoque?",
            "a": "A aba Shopee mostra o saldo do ERP do canal; Shopee FBS controla o estoque que esta no centro de distribuicao da Shopee."
          }
        ]
      },
      {
        "id": "amazon-fba",
        "title": "Amazon FBA",
        "path": "Estoque > Armazem de Plataforma > Amazon FBA",
        "summary": "Pasta de cadastro para controlar o estoque enviado ao FBA (Fulfillment by Amazon).",
        "steps": [
          "1. No menu Estoque, em 'Armazem de Plataforma', clique em 'Amazon FBA'.",
          "2. Confira em 'Campos do modulo' quais dados sao pedidos.",
          "3. Clique em '+ Novo registro', preencha o formulario e clique em 'Adicionar'.",
          "4. Use 'Buscar registros' para filtrar a lista.",
          "5. Ajuste com 'Editar' + 'Salvar alteracoes' ou exclua com 'Remover' (confirmando).",
          "6. Clique em 'Exportar CSV' para baixar os registros."
        ],
        "tips": [
          "Registre os numeros de remessa e quantidades enviadas ao FBA para acompanhar o que ja foi recebido pela Amazon."
        ],
        "faq": [
          {
            "q": "Esta tela mostra o saldo real no centro da Amazon?",
            "a": "Ela mostra o que voce cadastrou aqui. Concilie com o painel da Amazon para confirmar o saldo realmente disponivel para venda."
          }
        ]
      },
      {
        "id": "stock-reservations",
        "title": "Reservas por Pedido",
        "path": "Estoque > Controle Marketplace > Reservas por Pedido",
        "summary": "Pasta de cadastro para registrar e acompanhar reservas de estoque vinculadas a pedidos.",
        "steps": [
          "1. No menu Estoque, em 'Controle Marketplace', clique em 'Reservas por Pedido'.",
          "2. Veja os campos da pasta em 'Campos do modulo'.",
          "3. Clique em '+ Novo registro', preencha o formulario e clique em 'Adicionar'.",
          "4. Use 'Buscar registros' para localizar uma reserva por pedido ou SKU.",
          "5. Edite com 'Editar' + 'Salvar alteracoes' ou remova com 'Remover' (confirmando).",
          "6. Exporte com 'Exportar CSV' quando precisar de uma planilha."
        ],
        "tips": [
          "As reservas reduzem o 'Disponivel' na Lista de Estoque (disponivel = saldo - reservado). Mantenha as reservas em dia para nao bloquear estoque a toa."
        ],
        "faq": [
          {
            "q": "Reservar aqui altera o saldo disponivel?",
            "a": "O disponivel de um produto e calculado como saldo menos reservado. Registre as reservas para refletir corretamente o que sobra para vender."
          }
        ]
      },
      {
        "id": "stock-in-transit",
        "title": "Estoque em Transito",
        "path": "Estoque > Controle Marketplace > Estoque em Transito",
        "summary": "Pasta de cadastro para acompanhar mercadorias em deslocamento (compras a caminho, transferencias entre depositos ou envios a armazens de plataforma).",
        "steps": [
          "1. No menu Estoque, em 'Controle Marketplace', clique em 'Estoque em Transito'.",
          "2. Confira os campos solicitados em 'Campos do modulo'.",
          "3. Clique em '+ Novo registro', preencha o formulario e clique em 'Adicionar'.",
          "4. Use 'Buscar registros' para localizar um envio especifico.",
          "5. Atualize com 'Editar' + 'Salvar alteracoes' ou exclua com 'Remover' (confirmando).",
          "6. Clique em 'Exportar CSV' para baixar a lista."
        ],
        "tips": [
          "Atualize o registro assim que a mercadoria chegar, para que o estoque em transito reflita apenas o que ainda esta a caminho."
        ],
        "faq": [
          {
            "q": "O estoque em transito ja conta como saldo disponivel?",
            "a": "Nao. E o que esta a caminho. So entra como saldo do ERP quando voce dar a entrada na chegada da mercadoria."
          }
        ]
      },
      {
        "id": "stock-divergences",
        "title": "Divergencias",
        "path": "Estoque > Controle Marketplace > Divergencias",
        "summary": "Pasta de cadastro para registrar e tratar divergencias entre o estoque do ERP e o estoque nos marketplaces.",
        "steps": [
          "1. No menu Estoque, em 'Controle Marketplace', clique em 'Divergencias'.",
          "2. Veja os campos da pasta em 'Campos do modulo'.",
          "3. Clique em '+ Novo registro', preencha o formulario com os dados da divergencia e clique em 'Adicionar'.",
          "4. Use 'Buscar registros' para localizar uma divergencia por SKU ou canal.",
          "5. Atualize o tratamento com 'Editar' + 'Salvar alteracoes' ou remova com 'Remover' (confirmando).",
          "6. Use 'Exportar CSV' para gerar um relatorio de divergencias."
        ],
        "tips": [
          "Para identificar divergencias automaticamente, use o filtro de status 'Divergente' na Lista de Estoque; registre aqui o tratamento de cada caso.",
          "Resolva divergencias rapido: estoque do ERP diferente do marketplace pode causar venda sem saldo."
        ],
        "faq": [
          {
            "q": "Como descubro quais produtos estao divergentes?",
            "a": "Na Lista de Estoque, o KPI 'Divergencias' e o filtro de status 'Divergente' mostram os SKUs com ERP diferente da plataforma."
          }
        ]
      },
      {
        "id": "stock-reposition-rules",
        "title": "Regras de Reposicao",
        "path": "Estoque > Controle Marketplace > Regras de Reposicao",
        "summary": "Cadastre regras locais de estoque minimo, estoque alvo, lead time e fornecedor preferencial por marketplace para orientar sugestoes de compra.",
        "steps": [
          "1. No menu Estoque, em 'Controle Marketplace', clique em 'Regras de Reposicao'. (Tambem da para chegar pelo botao 'Regras de Reposicao' na Lista de Estoque.)",
          "2. No bloco 'Nova regra', escolha o marketplace no seletor (Todos, Shopee, Mercado Livre, Shein, TikTok Shop, Amazon, Temu).",
          "3. Preencha os campos 'Estoque minimo', 'Estoque alvo', 'Lead time em dias' e 'Fornecedor preferencial'.",
          "4. Clique em 'Criar regra'. Aparece a mensagem 'Regra de reposicao criada.' e a regra entra na tabela 'Regras cadastradas'.",
          "5. Para excluir uma regra, clique em 'Remover' na linha correspondente; surge a mensagem 'Regra de reposicao removida.'.",
          "6. Use o botao 'Ver estoque baixo' no topo para ir direto a lista de produtos que precisam de reposicao."
        ],
        "tips": [
          "O 'estoque alvo' deve ser maior que o 'minimo': o minimo dispara o alerta e o alvo indica ate quanto repor.",
          "Use o lead time (prazo de entrega do fornecedor) para comprar com antecedencia e nao ficar sem estoque.",
          "As regras sao salvas localmente nas configuracoes; nao ha botao de edicao, para mudar uma regra remova-a e crie outra."
        ],
        "faq": [
          {
            "q": "Posso editar uma regra ja criada?",
            "a": "Nao ha edicao direta. Clique em 'Remover' na regra e cadastre uma nova com os valores corretos."
          },
          {
            "q": "O que significa 'Lead time'?",
            "a": "E o prazo, em dias, que o fornecedor leva para entregar. Ajuda a planejar a compra antes do estoque acabar."
          },
          {
            "q": "Posso criar uma regra para todos os canais de uma vez?",
            "a": "Sim. Escolha 'Todos' no seletor de marketplace ao criar a regra."
          }
        ]
      }
    ]
  },
  {
    "moduleKey": "precificacao",
    "moduleLabel": "Precificacao",
    "icon": "💰",
    "intro": "Calcule o preco ideal de cada produto considerando custos, taxas oficiais dos marketplaces, impostos e marketing, compare canais, salve no historico e defina padroes automaticos.",
    "topics": [
      {
        "id": "pricing",
        "title": "Calculadora de Preco",
        "path": "Precificacao > Margem e Preco > Calculadora de Preco",
        "summary": "Calcula o preco de venda ideal de um produto somando custos, taxas do marketplace, imposto e marketing, e mostra o lucro liquido e a margem real. E a tela principal do modulo.",
        "steps": [
          "1. Na caixa 'Selecionar produto cadastrado', abra o seletor 'Escolha um produto cadastrado' e clique no produto desejado (lista no formato 'SKU - Nome'). Ao escolher, o sistema preenche automaticamente o 'Custo do produto' e o 'Marketplace' do cadastro. Voce tambem pode pular esta etapa e digitar tudo manualmente.",
          "2. Na caixa 'Dados do Produto', selecione o tipo de vendedor no seletor (CNPJ ou CPF), escolha o 'Marketplace' (Shopee, Mercado Livre, TikTok Shop, Amazon, Shein, Temu ou Kwai Shop). Se escolher Mercado Livre, aparece o seletor de tipo de anuncio (Classico ou Premium). Preencha 'Imposto (%)', 'Custo do produto' e 'Custo da embalagem'.",
          "3. Na caixa 'Consumiveis', informe ate quatro itens com nome e valor (vem preenchidos com Bolha, Caixa, Parafusos e Tinta como exemplo). Edite os nomes e digite o 'Valor' de cada um; deixe em branco os que nao usar. Esses valores somam ao custo do produto.",
          "4. Na caixa 'Como calcular o preco?', clique em um dos tres modos: 'Margem de Lucro %' (digite a margem desejada em 'Margem desejada %'), 'Preco de Venda' (digite o preco fixo em 'Preco de venda R$' e o sistema calcula a margem resultante) ou 'Lucro Desejado R$' (digite o lucro alvo em 'Lucro desejado R$').",
          "5. Na caixa 'Marketing e Simulacoes', preencha o que for usar: 'Vendas estimadas por mes', 'Desconto %', tipo de cupom (Cupom em % ou Cupom em R$) com o 'Valor do cupom' e 'Shopee Ads %'. Se o marketplace for Shopee, marque as caixas extras: 'Programa Frete Gratis Shopee (+6%)', 'Shopee Video (+2%)', 'Comissao de Afiliados' (que libera o campo 'Percentual afiliado %') e o seletor 'Shopee Acelera'. As opcoes 'Campanhas de Destaque (+3,5%)' e 'Devolucao Facil (+R$ 0,49)' aparecem para todos os marketplaces.",
          "6. Veja o resultado no painel 'Preco Sugerido', que mostra o preco final em destaque e a linha 'Lucro Real: R$ X (Y%)'. Os cartoes logo abaixo trazem 'Custo Efetivo da Venda', 'Custo Total + Taxas', 'Taxas Marketplace' e 'Marketing'.",
          "7. Confira a caixa 'Taxas Oficiais Aplicadas' (comissao base, imposto informado, taxa fixa automatica e Devolucao Facil) e a caixa 'Detalhamento de Custos e Taxas' para auditar cada linha do calculo.",
          "8. Para guardar o calculo, va ate a caixa 'Salvar Precificacao' e clique em 'Salvar precificacao' (aparece o aviso 'Precificacao salva no historico!'). Para compartilhar, na caixa 'Compartilhar Resultado' clique em 'Copiar resumo completo' (aparece 'Resumo copiado!') e cole onde quiser."
        ],
        "tips": [
          "Se voce preencher 'Vendas estimadas por mes', surgem automaticamente as caixas 'Projecao Mensal' e 'Projecao Anual' com receita, custos, lucro e margem estimados.",
          "A taxa fixa da Shopee muda conforme o preco (R$ 4 a R$ 26 por faixa) e, para vendedor CPF, vira R$ 7 fixo. Confira sempre o tipo de vendedor antes de fechar o preco.",
          "Os campos de margem, imposto, Shopee Ads, percentual de afiliado e frete gratis ja abrem preenchidos com os padroes definidos em Regras Automaticas; ajuste-os por produto quando necessario."
        ],
        "faq": [
          {
            "q": "Por que o preco sugerido continua aparecendo mesmo sem escolher um produto?",
            "a": "A calculadora funciona com os valores digitados manualmente. Sem produto e sem custos preenchidos ela usa um preco base estimado; preencha custo, embalagem e imposto para um resultado real."
          },
          {
            "q": "Escolhi 'Preco de Venda', onde vejo se tenho lucro?",
            "a": "Nesse modo voce fixa o preco e o sistema calcula o resto. Olhe o painel 'Preco Sugerido' (linha Lucro Real e margem) e a caixa 'Detalhamento de Custos e Taxas' para o lucro liquido."
          },
          {
            "q": "Os checkboxes da Shopee sumiram, e normal?",
            "a": "Sim. Programa Frete Gratis, Shopee Video, Comissao de Afiliados e Shopee Acelera so aparecem quando o marketplace selecionado e Shopee."
          },
          {
            "q": "Cliquei em 'Salvar precificacao', onde encontro depois?",
            "a": "Em Precificacao > Margem e Preco > Historico de Precificacao. Cada calculo salvo entra na tabela com data, SKU, preco, lucro e margem."
          }
        ]
      },
      {
        "id": "pricing-compare-publish",
        "title": "Comparar Marketplaces e Anunciar",
        "path": "Precificacao > Margem e Preco > Calculadora de Preco",
        "summary": "Dentro da calculadora, compara o preco ideal, lucro e margem do mesmo produto nos sete marketplaces e monta o plano de anuncio nos canais escolhidos.",
        "steps": [
          "1. Preencha custos, imposto e o modo de calculo na Calculadora de Preco normalmente (esses dados alimentam a comparacao).",
          "2. Role ate a caixa 'Comparar Marketplaces'. A tabela mostra, para Shopee, Mercado Livre, TikTok Shop, Amazon, Shein, Temu e Kwai Shop, o 'Preco Ideal', o 'Lucro' e a 'Margem' calculados com as taxas de cada canal.",
          "3. Use a comparacao para identificar onde o produto rende mais margem antes de decidir onde anunciar.",
          "4. Na caixa 'Anunciar nos marketplaces', cada marketplace aparece como um botao mostrando preco sugerido, lucro e margem. Clique nos canais desejados para seleciona-los (ficam destacados).",
          "5. Para marcar tudo de uma vez clique em 'Anunciar em todos'; para desmarcar use 'Limpar'.",
          "6. Com pelo menos um produto e um marketplace selecionados, clique em 'Criar plano de anuncio'. O sistema confirma com a mensagem 'Plano de anuncio criado para [produto] em [marketplaces]'.",
          "7. Se faltar produto ou canal, aparece o aviso 'Selecione um produto antes de montar os anuncios.' ou 'Escolha pelo menos um marketplace para anunciar.' Corrija e tente de novo."
        ],
        "tips": [
          "A publicacao real nos marketplaces ainda nao esta ligada: por enquanto o ERP apenas monta o plano de anuncio. A integracao via API entra futuramente.",
          "Ao trocar de produto, o canal sugerido volta a ser o marketplace cadastrado do produto e a mensagem de plano e limpa."
        ],
        "faq": [
          {
            "q": "Criei o plano de anuncio, ja esta publicado na Shopee?",
            "a": "Ainda nao. Hoje o ERP monta o plano para organizar onde voce vai anunciar; a publicacao automatica sera habilitada quando as APIs dos marketplaces forem conectadas."
          },
          {
            "q": "Por que a margem na comparacao difere do painel principal?",
            "a": "Cada marketplace tem comissao e taxa fixa proprias. A coluna recalcula o preco ideal e a margem usando as regras especificas daquele canal."
          }
        ]
      },
      {
        "id": "pricing-history-view",
        "title": "Historico de Precificacao",
        "path": "Precificacao > Margem e Preco > Historico de Precificacao",
        "summary": "Lista todos os calculos salvos pela calculadora, com filtros, indicadores de total e exportacao em CSV.",
        "steps": [
          "1. Abra Precificacao > Margem e Preco > Historico de Precificacao. A tela carrega os calculos salvos e exibe a faixa de indicadores: 'Calculos salvos', 'Preco sugerido total', 'Lucro estimado' e 'Margem media'.",
          "2. Para atualizar a lista (por exemplo apos salvar um novo calculo), clique no botao 'Atualizar' no topo.",
          "3. Use o seletor de marketplace (comeca em 'Todos') para filtrar por um canal especifico. As opcoes refletem os marketplaces presentes no historico.",
          "4. No campo 'Buscar SKU, produto, marketplace ou preco', digite um termo para filtrar a tabela em tempo real. Os indicadores no topo se ajustam ao resultado filtrado.",
          "5. Consulte a tabela com as colunas Data, SKU, Produto, Marketplace, Preco sugerido, Lucro e Margem.",
          "6. Para baixar os dados filtrados, clique em 'Exportar CSV'; o arquivo 'historico-precificacao.csv' e gerado com id, sku, produto, marketplace, preco_sugerido, lucro, margem e criado_em.",
          "7. Se nao houver resultados, a tabela mostra 'Nenhum historico encontrado.'"
        ],
        "tips": [
          "O botao 'Exportar CSV' fica desabilitado quando nao ha registros filtrados; ajuste a busca ou o filtro de marketplace primeiro.",
          "Os totais (preco, lucro e margem media) sempre consideram apenas o que esta filtrado na tela, nao o historico inteiro."
        ],
        "faq": [
          {
            "q": "Meu calculo nao aparece no historico, por que?",
            "a": "Ele so e gravado quando voce clica em 'Salvar precificacao' na calculadora. Depois disso, clique em 'Atualizar' aqui para recarregar."
          },
          {
            "q": "Aparece 'Nao foi possivel carregar o historico', o que faco?",
            "a": "Houve falha de conexao com o servidor. Clique em 'Atualizar' para tentar de novo; se persistir, verifique sua conexao ou contate o suporte."
          },
          {
            "q": "Da para editar um calculo salvo aqui?",
            "a": "Nao. Esta tela e somente de consulta e exportacao. Para um novo valor, refaca o calculo na Calculadora de Preco e salve novamente."
          }
        ]
      },
      {
        "id": "marketplace-fees",
        "title": "Taxas por Marketplace",
        "path": "Precificacao > Margem e Preco > Taxas por Marketplace",
        "summary": "Simulador que mostra quanto cada marketplace desconta de um preco de venda e tabela de referencia com as taxas base e observacoes de cada canal.",
        "steps": [
          "1. Abra Precificacao > Margem e Preco > Taxas por Marketplace.",
          "2. Na caixa 'Simulador de taxas', escolha o marketplace no primeiro seletor (Shopee, Mercado Livre, TikTok Shop, Amazon, Shein, Temu ou Kwai Shop).",
          "3. No campo 'Preco de venda', digite o valor a simular (vem com 100 como exemplo).",
          "4. Selecione o tipo de vendedor (CNPJ ou CPF) e o tipo de anuncio (Classico ou Premium) - esses ajustes afetam principalmente Shopee e Mercado Livre.",
          "5. Veja o resultado na faixa de indicadores: 'Taxa percentual' (com o percentual aplicado), 'Taxa fixa', 'Total descontado' (percentual + fixo) e 'Valor liquido' (preco menos taxas, antes de custo, frete e imposto).",
          "6. Na caixa 'Tabela de referencia', consulte a lista de todos os marketplaces com Taxa base, Taxa fixa e Observacao (por exemplo, regras especiais de Shein, Temu e Kwai Shop)."
        ],
        "tips": [
          "O 'Valor liquido' aqui e antes de custo do produto, frete e imposto: serve para entender so o desconto do marketplace, nao o lucro final. Para o lucro real, use a Calculadora de Preco.",
          "Para Shopee CPF a taxa fixa vira R$ 7; para CNPJ ela varia por faixa de preco (R$ 4 a R$ 26). No Mercado Livre, Premium usa percentual maior que Classico."
        ],
        "faq": [
          {
            "q": "Esta tela calcula meu lucro?",
            "a": "Nao. Ela mostra apenas o quanto o marketplace desconta. O lucro depende de custo, embalagem, consumiveis e imposto, que sao calculados na Calculadora de Preco."
          },
          {
            "q": "As taxas aqui sao as mesmas usadas no calculo do preco?",
            "a": "Sim. Sao as regras locais que a calculadora aplica, por isso o simulador serve para conferir rapidamente o desconto de cada canal."
          },
          {
            "q": "Mudei para CPF e Premium mas o valor nao mudou, e erro?",
            "a": "Nao. Tipo de vendedor afeta a taxa fixa da Shopee e Premium afeta o percentual do Mercado Livre; em outros marketplaces esses campos podem nao alterar o resultado."
          }
        ]
      },
      {
        "id": "pricing-rules",
        "title": "Regras Automaticas",
        "path": "Precificacao > Margem e Preco > Regras Automaticas",
        "summary": "Define os valores padrao que a Calculadora de Preco usa ao abrir: margem, imposto, Shopee Ads, percentual de afiliado, alerta de margem minima e frete gratis Shopee.",
        "steps": [
          "1. Abra Precificacao > Margem e Preco > Regras Automaticas.",
          "2. Na caixa 'Padroes da calculadora', preencha os campos: 'Margem desejada padrao (%)', 'Imposto padrao (%)', 'Shopee Ads padrao (%)', 'Percentual de afiliado padrao (%)' e 'Alerta de margem minima (%)'.",
          "3. No seletor 'Programa de frete gratis Shopee', escolha 'Desativado por padrao' ou 'Ativado por padrao'.",
          "4. Clique em 'Salvar regras'. Enquanto grava, o botao mostra 'Salvando...' e ao concluir aparece a mensagem 'Regras salvas. A calculadora usara estes padroes ao abrir.'",
          "5. Para descartar alteracoes nao salvas e voltar aos valores guardados, clique em 'Recarregar'.",
          "6. Para testar o efeito, clique em 'Abrir calculadora' no topo: a Calculadora de Preco abrira ja com esses padroes preenchidos."
        ],
        "tips": [
          "As regras valem como ponto de partida: dentro da calculadora voce ainda pode ajustar qualquer valor por produto sem alterar o padrao.",
          "Se aparecer 'Nao foi possivel salvar as regras', verifique a conexao e tente novamente; os valores digitados continuam na tela ate voce recarregar."
        ],
        "faq": [
          {
            "q": "Alterei as regras mas a calculadora ja aberta nao mudou, por que?",
            "a": "Os padroes sao aplicados quando a calculadora abre. Feche e reabra a Calculadora de Preco (ou use o botao 'Abrir calculadora') para carregar os novos valores."
          },
          {
            "q": "Para que serve o 'Alerta de margem minima (%)'?",
            "a": "Define o piso de margem que voce considera aceitavel; e salvo junto com as demais regras de precificacao para referencia da calculadora."
          },
          {
            "q": "Cliquei em 'Recarregar' e perdi o que digitei, da para desfazer?",
            "a": "Nao. 'Recarregar' traz de volta os ultimos valores salvos e descarta o que nao foi gravado. Salve antes de recarregar para nao perder ajustes."
          }
        ]
      }
    ]
  },
  {
    "moduleKey": "sac",
    "moduleLabel": "SAC - Atendimento",
    "icon": "💬",
    "intro": "Central de atendimento ao cliente: responda avaliacoes por grau de estrelas, automatize respostas com IA, crie modelos prontos, trate devolucoes, perguntas, mensagens, reclamacoes, bloqueios e use o chatbot de IA.",
    "topics": [
      {
        "id": "sac-reviews",
        "title": "Lista de Avaliacoes (por Grau)",
        "path": "SAC > Avaliacoes > Lista por Grau",
        "summary": "Mostra todas as avaliacoes dos marketplaces separadas por estrelas (boas, medias e ruins) para voce responder uma a uma, com filtros e respostas rapidas.",
        "steps": [
          "1. Abra SAC > Avaliacoes > Lista por Grau. As avaliacoes entram separadas por grau: Boas (4 e 5 estrelas), Medias (3 estrelas) e Ruins (1 e 2 estrelas).",
          "2. Clique em 'Sincronizar Avaliacoes' (botao no topo, dentro do cartao 'Avaliacoes classificadas por estrelas') para puxar as avaliacoes mais recentes dos marketplaces.",
          "3. Na barra de filtros, escolha a loja no seletor 'Todas Lojas' (CATEDRAL MDF, PINK), selecione o grau no seletor que mostra 'Todas - 1 a 5 estrelas', digite no campo 'N do pedido, produto ou comprador' e use o campo de data para refinar.",
          "4. Como alternativa ao seletor de grau, clique direto em um dos cartoes coloridos 'Boas', 'Medias', 'Ruins' ou 'Todas' (cada um mostra a contagem de avaliacoes daquele grau).",
          "5. Use as abas de status 'Pendente', 'Respondido', 'Ignorado' ou 'Todos' para ver so o que falta tratar (por padrao abre em 'Pendente').",
          "6. Em cada cartao de avaliacao, leia o comentario do cliente, as estrelas (Qualificacao) e os dados (Comprador, data, marketplace). Escreva no campo 'Insira conteudo para responder ao comentario' (o contador '0 / 500' limita a 500 caracteres).",
          "7. Clique em 'Enviar' para publicar sua resposta, ou em 'Usar IA' para gerar uma resposta automatica com inteligencia artificial.",
          "8. Use os botoes 'Sincronizar' (atualiza so aquela avaliacao) ou 'Ignorar' (marca como ignorada) na lateral do cartao. No painel direito 'Resposta Rapida', clique em '+ Adicionar' e use o campo 'Procurar conteudo' para aplicar um modelo pronto ao texto da resposta."
        ],
        "tips": [
          "Comece pela aba 'Pendente' e pelo cartao 'Ruins' para tratar primeiro as criticas, que mais afetam a reputacao da loja.",
          "Respeite o limite de 500 caracteres mostrado no contador; respostas curtas e cordiais funcionam melhor.",
          "Se nenhum cartao aparecer, verifique os filtros: a mensagem 'Nenhuma avaliacao nesse filtro' indica que o grau, status ou busca estao restringindo a lista."
        ],
        "faq": [
          {
            "q": "Como uma avaliacao e classificada como boa, media ou ruim?",
            "a": "Pelo numero de estrelas: 4 e 5 sao Boas, 3 e Media, 1 e 2 sao Ruins. A classificacao e automatica."
          },
          {
            "q": "Nao acho uma avaliacao recente. O que fazer?",
            "a": "Clique em 'Sincronizar Avaliacoes' no topo para puxar do marketplace e confira se os filtros de loja, grau e status nao estao escondendo o item."
          },
          {
            "q": "O botao 'Ignorar' apaga a avaliacao?",
            "a": "Nao. Ele apenas marca a avaliacao como ignorada; ela continua acessivel pela aba de status 'Ignorado' ou 'Todos'."
          }
        ]
      },
      {
        "id": "sac-review-auto",
        "title": "Resposta Automatica por IA",
        "path": "SAC > Avaliacoes > Resposta Automatica por IA",
        "summary": "Configura a IA para responder avaliacoes sozinha, definindo se cada faixa de estrelas (boas, medias, ruins) e respondida e qual tom a IA deve usar.",
        "steps": [
          "1. Abra SAC > Avaliacoes > Resposta Automatica por IA. O selo 'IA pronta para configurar' confirma que a automacao esta disponivel.",
          "2. Na tabela com colunas 'Estado', 'Grau', 'Regra por estrelas', 'Mensagem IA', 'Enviada hoje' e 'Acoes', use a chave (toggle) da coluna 'Estado' para ligar ou desligar a resposta automatica de cada grau (Boas, Medias, Ruins).",
          "3. Confira a 'Regra por estrelas' e a 'Mensagem IA' sugerida de cada linha (ex.: Boas = 'Agradecer e reforcar recompra'; Ruins = 'Pedir desculpas e abrir suporte').",
          "4. Clique em 'Configuracoes' na linha do grau que deseja ajustar para carrega-lo no formulario abaixo.",
          "5. No bloco 'Campo de mensagens automaticas por IA', escolha o grau no seletor 'Grau da avaliacao' (Boas - 4 e 5 estrelas, Medias - 3 estrelas, Ruins - 1 e 2 estrelas).",
          "6. Edite o campo 'Instrucao para a IA' descrevendo como a IA deve responder aquele grau (o texto muda conforme o grau selecionado).",
          "7. Marque as opcoes desejadas: 'Apenas responder avaliacoes com comentario' (ja vem marcada) e 'Enviar para aprovacao antes de publicar' (para revisar antes de a IA publicar).",
          "8. Clique em 'Salvar configuracao' para aplicar as regras."
        ],
        "tips": [
          "Mantenha 'Enviar para aprovacao antes de publicar' marcada no inicio, para conferir o tom da IA antes que ela responda sozinha.",
          "Deixe o grau 'Ruins' desligado ate ter certeza da instrucao: criticas mal respondidas pela IA podem piorar a reputacao.",
          "A coluna 'Enviada hoje' mostra quantas respostas a IA ja enviou no dia, ajudando a monitorar a automacao."
        ],
        "faq": [
          {
            "q": "A IA responde toda avaliacao automaticamente?",
            "a": "So os graus com a chave 'Estado' ligada. Se 'Apenas responder avaliacoes com comentario' estiver marcada, ela ignora avaliacoes sem texto."
          },
          {
            "q": "Consigo revisar antes de publicar?",
            "a": "Sim. Marque 'Enviar para aprovacao antes de publicar' para que as respostas fiquem aguardando sua aprovacao."
          },
          {
            "q": "Como mudo o tom da resposta?",
            "a": "Selecione o grau no campo 'Grau da avaliacao', edite a 'Instrucao para a IA' e clique em 'Salvar configuracao'."
          }
        ]
      },
      {
        "id": "sac-review-template",
        "title": "Modelo de Resposta",
        "path": "SAC > Avaliacoes > Modelo de Resposta",
        "summary": "Cria mensagens prontas reutilizaveis para responder avaliacoes em massa, com a opcao de definir um modelo padrao por grau de estrelas.",
        "steps": [
          "1. Abra SAC > Avaliacoes > Modelo de Resposta. Clique em '+ Criar Modelo' (no topo) para iniciar um novo modelo.",
          "2. No bloco 'Criar mensagem padrao', preencha 'Nome do modelo' (ex.: vem com 'Mensagem padrao da loja').",
          "3. No seletor 'Aplicar em', escolha onde o modelo vale: 'Todas as avaliacoes', 'Boas', 'Medias' ou 'Ruins'.",
          "4. Escreva o texto no campo 'Conteudo da resposta'.",
          "5. Se quiser, marque 'Definir como modelo padrao para todas as avaliacoes' para que ele seja aplicado por padrao.",
          "6. Clique em 'Salvar modelo'. O modelo aparecera na tabela 'Nome do Modelo / Grau aplicado / Conteudo / Modelo Padrao / Acoes'.",
          "7. Na tabela, use 'Editar' para alterar um modelo ou 'Duplicar' para criar uma copia e adaptar. Modelos marcados como padrao exibem o selo 'Predefinido'."
        ],
        "tips": [
          "Crie um modelo por grau (Boas, Medias, Ruins) para ter o tom certo a um clique na tela de avaliacoes.",
          "Use 'Duplicar' para reaproveitar um modelo bom e so ajustar o necessario, em vez de escrever do zero.",
          "Apenas um modelo deve ser o padrao; ao marcar um novo como padrao, revise para nao ter conflito de mensagens."
        ],
        "faq": [
          {
            "q": "Onde uso os modelos depois de criados?",
            "a": "Na tela 'Lista por Grau', no painel 'Resposta Rapida', voce aplica o modelo ao campo de resposta da avaliacao."
          },
          {
            "q": "O que significa o selo 'Predefinido'?",
            "a": "Indica que aquele modelo esta marcado como padrao e sera o sugerido para o grau correspondente."
          },
          {
            "q": "Posso ter modelos diferentes por nota?",
            "a": "Sim. No campo 'Aplicar em' escolha Boas, Medias ou Ruins para limitar o modelo a um grau especifico."
          }
        ]
      },
      {
        "id": "sac-returns",
        "title": "Devolucao/Reembolso",
        "path": "SAC > Avaliacoes > Devolucao/Reembolso",
        "summary": "Acompanha pedidos com devolucao ou reembolso solicitado nos marketplaces, com filtros por loja, status e busca por pedido, comprador ou motivo.",
        "steps": [
          "1. Abra SAC > Avaliacoes > Devolucao/Reembolso.",
          "2. No filtro de loja (seletor 'Todas Lojas'), escolha Shopee ou Mercado Livre para limitar os resultados.",
          "3. Digite no campo 'Pedido, comprador ou motivo' para localizar um caso especifico.",
          "4. No seletor 'Todos Status', filtre por 'Pendente', 'Reembolsado' ou 'Em disputa'.",
          "5. Clique em 'Sincronizar' para atualizar a lista com as devolucoes e reembolsos mais recentes dos marketplaces.",
          "6. Confira a tabela com as colunas 'Pedido', 'Marketplace', 'Motivo', 'Status', 'Atualizado' e 'Acoes' e trate cada caso pela coluna de acoes.",
          "7. Quando nao houver pendencias, a tela mostra 'Nenhuma devolucao ou reembolso pendente'."
        ],
        "tips": [
          "Filtre por 'Em disputa' primeiro: sao os casos que exigem resposta dentro do prazo do marketplace.",
          "Use o campo de busca por 'motivo' para agrupar problemas recorrentes (ex.: avaria no transporte) e atacar a causa raiz.",
          "Clique em 'Sincronizar' antes de analisar para garantir que o status mostrado e o atual no marketplace."
        ],
        "faq": [
          {
            "q": "Por que a lista esta vazia?",
            "a": "A mensagem 'Nenhuma devolucao ou reembolso pendente' significa que nao ha casos no filtro atual; troque a loja ou o status para conferir."
          },
          {
            "q": "Quais status existem?",
            "a": "Pendente, Reembolsado e Em disputa, alem de 'Todos Status' para ver tudo."
          },
          {
            "q": "Como atualizo os dados?",
            "a": "Clique em 'Sincronizar' na barra de ferramentas para puxar as informacoes mais recentes do marketplace."
          }
        ]
      },
      {
        "id": "chat",
        "title": "Chatbot de IA",
        "path": "SAC > Gestao de Cliente > Chatbot de IA",
        "summary": "Assistente de inteligencia artificial integrado ao ERP para tirar duvidas sobre estoque, marketplace, precificacao e vendas em linguagem natural.",
        "steps": [
          "1. Abra SAC > Gestao de Cliente > Chatbot de IA. A tela 'Chat GPT' mostra a area de conversa.",
          "2. Se ainda nao houver conversa, voce vera 'Envie uma mensagem para iniciar o assistente.'",
          "3. Escreva sua pergunta no campo de texto (ex.: algo sobre estoque, marketplace, precificacao ou vendas).",
          "4. Clique em 'Enviar'. Enquanto a IA processa, o botao mostra 'Enviando...' e fica desabilitado.",
          "5. A resposta aparece marcada como 'Assistente' e suas mensagens como 'Voce'. Continue digitando para manter a conversa.",
          "6. Se aparecer 'Erro: ...' ou 'Erro ao conectar com o ChatGPT', tente novamente; pode ser instabilidade momentanea de conexao."
        ],
        "tips": [
          "Seja especifico na pergunta (cite produto, loja ou periodo) para receber respostas mais uteis.",
          "Use o chatbot como apoio para redigir respostas a clientes, mas revise antes de enviar ao comprador.",
          "Se receber mensagem de erro de conexao, aguarde alguns segundos e reenvie a pergunta."
        ],
        "faq": [
          {
            "q": "O chatbot responde sobre quais assuntos?",
            "a": "Foi pensado para duvidas de estoque, marketplace, precificacao e vendas, mas aceita perguntas gerais em linguagem natural."
          },
          {
            "q": "Por que apareceu 'Erro ao conectar com o ChatGPT'?",
            "a": "Houve falha de conexao com o servico de IA. Verifique sua internet e tente enviar a mensagem novamente."
          },
          {
            "q": "O botao 'Enviar' ficou travado mostrando 'Enviando...'",
            "a": "Ele fica desabilitado enquanto a IA responde. Assim que a resposta chega, ele volta ao normal."
          }
        ]
      },
      {
        "id": "customer-questions",
        "title": "Perguntas",
        "path": "SAC > Atendimento > Perguntas",
        "summary": "Pasta de cadastro generico para registrar e organizar as perguntas dos compradores, com cadastro, busca, exportacao e edicao.",
        "steps": [
          "1. Abra SAC > Atendimento > Perguntas. O topo mostra o titulo da pasta e o status (Menu criado, Cadastro ativo, Listagem e filtros).",
          "2. Confira o bloco 'Campos do modulo' para ver quais campos esta pasta exige (cada campo aparece com seu tipo entre parenteses).",
          "3. Clique em '+ Novo registro' para abrir o formulario e preencha os campos listados (texto, numero, selecao ou area de texto, conforme cada campo).",
          "4. Clique em 'Adicionar' para salvar; ao editar um registro existente, o botao mostra 'Salvar alteracoes'. Use 'Cancelar' para fechar o formulario sem salvar.",
          "5. Use o campo 'Buscar registros' para filtrar a tabela por qualquer texto do registro.",
          "6. Na tabela, use 'Editar' para alterar ou 'Remover' para excluir (sera pedida a confirmacao 'Remover este registro?').",
          "7. Clique em 'Exportar CSV' para baixar a lista atual (respeita a busca aplicada) em planilha."
        ],
        "tips": [
          "Os campos do formulario sao definidos pelo ERP para esta pasta; consulte o bloco 'Campos do modulo' antes de cadastrar.",
          "A busca filtra por qualquer conteudo do registro, entao basta digitar parte do texto para encontrar.",
          "O botao 'Exportar CSV' fica desabilitado quando nao ha registros na lista filtrada."
        ],
        "faq": [
          {
            "q": "Quais campos preencher?",
            "a": "Os que aparecem no bloco 'Campos do modulo' e no formulario apos clicar em '+ Novo registro'. Eles variam conforme a configuracao da pasta."
          },
          {
            "q": "Como removo um registro por engano?",
            "a": "Ao clicar em 'Remover' surge a confirmacao 'Remover este registro?'. Cancele para nao excluir."
          },
          {
            "q": "A tela mostrou 'Nao foi possivel carregar este modulo'. O que houve?",
            "a": "Houve falha ao buscar os dados. Atualize a pagina e verifique sua conexao."
          }
        ]
      },
      {
        "id": "customer-messages",
        "title": "Mensagens",
        "path": "SAC > Atendimento > Mensagens",
        "summary": "Pasta de cadastro generico para registrar e acompanhar as mensagens trocadas com compradores, com cadastro, busca, exportacao e edicao.",
        "steps": [
          "1. Abra SAC > Atendimento > Mensagens e veja os campos exigidos no bloco 'Campos do modulo'.",
          "2. Clique em '+ Novo registro' para abrir o formulario.",
          "3. Preencha os campos apresentados (cada um pode ser texto, numero, selecao ou area de texto).",
          "4. Clique em 'Adicionar' para criar; em uma edicao, o botao sera 'Salvar alteracoes'. Use 'Cancelar' para descartar.",
          "5. Use 'Buscar registros' para localizar uma mensagem especifica na tabela.",
          "6. Na tabela, clique em 'Editar' para ajustar ou 'Remover' para excluir (confirmando em 'Remover este registro?').",
          "7. Clique em 'Exportar CSV' para baixar as mensagens listadas."
        ],
        "tips": [
          "Registre o numero do pedido nos campos disponiveis para vincular cada mensagem ao cliente certo.",
          "Use a busca para reabrir conversas anteriores antes de responder de novo ao mesmo comprador.",
          "Exporte em CSV periodicamente para manter um historico fora do sistema, se necessario."
        ],
        "faq": [
          {
            "q": "Onde respondo a mensagem do cliente no marketplace?",
            "a": "Esta pasta serve para registrar e organizar mensagens internamente; o envio ao comprador acontece pelo canal do marketplace."
          },
          {
            "q": "Posso editar uma mensagem cadastrada?",
            "a": "Sim. Clique em 'Editar' na linha, ajuste os campos e clique em 'Salvar alteracoes'."
          },
          {
            "q": "Como achar rapido uma mensagem antiga?",
            "a": "Use o campo 'Buscar registros' e digite parte do texto, pedido ou nome do comprador."
          }
        ]
      },
      {
        "id": "claims",
        "title": "Reclamacoes",
        "path": "SAC > Atendimento > Reclamacoes",
        "summary": "Pasta de cadastro generico para registrar e acompanhar reclamacoes de clientes, com cadastro, busca, exportacao e edicao.",
        "steps": [
          "1. Abra SAC > Atendimento > Reclamacoes e confira os campos no bloco 'Campos do modulo'.",
          "2. Clique em '+ Novo registro' para abrir o formulario de cadastro.",
          "3. Preencha os campos da reclamacao conforme aparecem (texto, numero, selecao ou area de texto).",
          "4. Clique em 'Adicionar' para salvar; ao editar, o botao mostra 'Salvar alteracoes'. Use 'Cancelar' para sair sem salvar.",
          "5. Use 'Buscar registros' para encontrar uma reclamacao especifica.",
          "6. Na tabela, use 'Editar' para atualizar o andamento ou 'Remover' para excluir (confirmando em 'Remover este registro?').",
          "7. Clique em 'Exportar CSV' para baixar a lista de reclamacoes."
        ],
        "tips": [
          "Atualize o registro pelo botao 'Editar' a cada novo andamento para manter o historico da reclamacao completo.",
          "A pasta 'Reclamacoes' tambem aparece no fluxo de Pedidos; mantenha o registro unico para nao duplicar casos.",
          "Trate reclamacoes com prioridade: elas costumam ter prazo de resposta no marketplace."
        ],
        "faq": [
          {
            "q": "Esta reclamacao e a mesma do modulo de Pedidos?",
            "a": "A pasta 'Reclamacoes' existe nos dois fluxos; registre uma vez e acompanhe pelo mesmo registro para evitar duplicidade."
          },
          {
            "q": "Como marco uma reclamacao como resolvida?",
            "a": "Clique em 'Editar' e atualize o campo de status/andamento conforme os campos disponiveis, depois 'Salvar alteracoes'."
          },
          {
            "q": "Consigo exportar so as reclamacoes filtradas?",
            "a": "Sim. Aplique a busca e clique em 'Exportar CSV'; o arquivo respeita o filtro atual."
          }
        ]
      },
      {
        "id": "customer-block-list",
        "title": "Lista de Bloqueio",
        "path": "SAC > Atendimento > Lista de Bloqueio",
        "summary": "Pasta de cadastro generico para registrar compradores ou termos que devem ser bloqueados no atendimento, com cadastro, busca, exportacao e edicao.",
        "steps": [
          "1. Abra SAC > Atendimento > Lista de Bloqueio e veja os campos exigidos no bloco 'Campos do modulo'.",
          "2. Clique em '+ Novo registro' para abrir o formulario.",
          "3. Preencha os campos de bloqueio apresentados (texto, numero, selecao ou area de texto).",
          "4. Clique em 'Adicionar' para salvar; ao editar, o botao mostra 'Salvar alteracoes'. Use 'Cancelar' para descartar.",
          "5. Use 'Buscar registros' para verificar se um comprador ja esta na lista.",
          "6. Na tabela, use 'Editar' para ajustar ou 'Remover' para tirar alguem da lista (confirmando em 'Remover este registro?').",
          "7. Clique em 'Exportar CSV' para baixar a lista de bloqueio."
        ],
        "tips": [
          "Antes de bloquear, use a busca para conferir se o comprador ja consta na lista e evitar registros duplicados.",
          "Anote o motivo do bloqueio nos campos disponiveis para que toda a equipe entenda a decisao.",
          "Para liberar um comprador, basta 'Remover' o registro correspondente."
        ],
        "faq": [
          {
            "q": "Qual a diferenca para 'Minha Lista de Bloqueio'?",
            "a": "'Lista de Bloqueio' fica em Atendimento e 'Minha Lista de Bloqueio' em Gestao de Cliente; ambas seguem o mesmo fluxo de cadastro generico."
          },
          {
            "q": "Bloquear aqui impede o cliente de comprar?",
            "a": "A pasta registra a lista no ERP; as regras de venda dependem das politicas do marketplace integrado."
          },
          {
            "q": "Como desbloqueio alguem?",
            "a": "Localize o registro pela busca e clique em 'Remover', confirmando em 'Remover este registro?'."
          }
        ]
      },
      {
        "id": "request-review",
        "title": "Solicitar Avaliacao",
        "path": "SAC > Gestao de Cliente > Solicitar Avaliacao",
        "summary": "Pasta de cadastro generico para registrar e organizar solicitacoes de avaliacao aos compradores, com cadastro, busca, exportacao e edicao.",
        "steps": [
          "1. Abra SAC > Gestao de Cliente > Solicitar Avaliacao e confira os campos no bloco 'Campos do modulo'.",
          "2. Clique em '+ Novo registro' para abrir o formulario.",
          "3. Preencha os campos da solicitacao conforme apresentados (texto, numero, selecao ou area de texto).",
          "4. Clique em 'Adicionar' para salvar; em uma edicao, o botao mostra 'Salvar alteracoes'. Use 'Cancelar' para sair.",
          "5. Use 'Buscar registros' para localizar pedidos ou compradores ja registrados.",
          "6. Na tabela, use 'Editar' para atualizar ou 'Remover' para excluir (confirmando em 'Remover este registro?').",
          "7. Clique em 'Exportar CSV' para baixar a lista de solicitacoes."
        ],
        "tips": [
          "Registre solicitacoes logo apos a entrega: pedidos de avaliacao no momento certo aumentam a taxa de resposta.",
          "Use a busca para nao solicitar avaliacao duas vezes ao mesmo comprador.",
          "Exporte em CSV para acompanhar quantos pedidos de avaliacao foram feitos no periodo."
        ],
        "faq": [
          {
            "q": "Esta tela envia o pedido de avaliacao sozinha?",
            "a": "Ela registra e organiza as solicitacoes no ERP; o envio ao comprador segue as regras do marketplace."
          },
          {
            "q": "Como evito pedir avaliacao repetida?",
            "a": "Antes de cadastrar, use 'Buscar registros' para conferir se aquele pedido ou comprador ja esta na lista."
          },
          {
            "q": "Posso editar uma solicitacao depois?",
            "a": "Sim. Clique em 'Editar' na linha, ajuste e clique em 'Salvar alteracoes'."
          }
        ]
      },
      {
        "id": "buyers-list",
        "title": "Lista de Compradores",
        "path": "SAC > Gestao de Cliente > Lista de Compradores",
        "summary": "Pasta de cadastro generico para manter o cadastro dos compradores da loja, com cadastro, busca, exportacao e edicao.",
        "steps": [
          "1. Abra SAC > Gestao de Cliente > Lista de Compradores e veja os campos no bloco 'Campos do modulo'.",
          "2. Clique em '+ Novo registro' para abrir o formulario de cadastro de comprador.",
          "3. Preencha os campos apresentados (texto, numero, selecao ou area de texto).",
          "4. Clique em 'Adicionar' para salvar; ao editar, o botao mostra 'Salvar alteracoes'. Use 'Cancelar' para descartar.",
          "5. Use 'Buscar registros' para encontrar um comprador pelo nome, pedido ou qualquer dado.",
          "6. Na tabela, use 'Editar' para atualizar os dados ou 'Remover' para excluir (confirmando em 'Remover este registro?').",
          "7. Clique em 'Exportar CSV' para baixar a lista de compradores."
        ],
        "tips": [
          "Mantenha os dados de contato atualizados pelo botao 'Editar' para facilitar o pos-venda.",
          "Use 'Exportar CSV' para gerar mailings ou analisar sua base de clientes em planilha.",
          "A busca varre todo o conteudo do registro, entao funciona com nome, pedido ou observacoes."
        ],
        "faq": [
          {
            "q": "Os compradores aparecem automaticamente aqui?",
            "a": "Esta pasta e de cadastro; voce registra os compradores com '+ Novo registro' conforme os campos definidos."
          },
          {
            "q": "Como exporto minha base de clientes?",
            "a": "Clique em 'Exportar CSV' para baixar todos os registros listados (respeitando a busca aplicada)."
          },
          {
            "q": "Posso bloquear um comprador a partir daqui?",
            "a": "O bloqueio e feito nas pastas 'Lista de Bloqueio' ou 'Minha Lista de Bloqueio'; esta pasta apenas mantem o cadastro."
          }
        ]
      },
      {
        "id": "blocked-buyers",
        "title": "Minha Lista de Bloqueio",
        "path": "SAC > Gestao de Cliente > Minha Lista de Bloqueio",
        "summary": "Pasta de cadastro generico para manter sua propria lista de compradores bloqueados, com cadastro, busca, exportacao e edicao.",
        "steps": [
          "1. Abra SAC > Gestao de Cliente > Minha Lista de Bloqueio e confira os campos no bloco 'Campos do modulo'.",
          "2. Clique em '+ Novo registro' para abrir o formulario.",
          "3. Preencha os campos do comprador a bloquear (texto, numero, selecao ou area de texto).",
          "4. Clique em 'Adicionar' para salvar; ao editar, o botao mostra 'Salvar alteracoes'. Use 'Cancelar' para sair sem salvar.",
          "5. Use 'Buscar registros' para verificar se o comprador ja consta na sua lista.",
          "6. Na tabela, use 'Editar' para ajustar ou 'Remover' para desbloquear (confirmando em 'Remover este registro?').",
          "7. Clique em 'Exportar CSV' para baixar a sua lista de bloqueio."
        ],
        "tips": [
          "Registre o motivo do bloqueio nos campos disponiveis para manter o historico das suas decisoes.",
          "Use a busca antes de adicionar para nao duplicar o mesmo comprador.",
          "Para desbloquear, basta 'Remover' o registro do comprador."
        ],
        "faq": [
          {
            "q": "Qual a diferenca entre esta e a 'Lista de Bloqueio' de Atendimento?",
            "a": "Sao pastas distintas no menu (Gestao de Cliente x Atendimento), mas seguem o mesmo fluxo de cadastro generico."
          },
          {
            "q": "Remover o registro libera o comprador?",
            "a": "Sim. Ao 'Remover', o comprador deixa de constar na sua lista de bloqueio."
          },
          {
            "q": "Consigo exportar minha lista de bloqueio?",
            "a": "Sim. Clique em 'Exportar CSV' para baixar todos os registros listados."
          }
        ]
      }
    ]
  },
  {
    "moduleKey": "analises",
    "moduleLabel": "Analises",
    "icon": "📊",
    "intro": "O modulo Analises reune os indicadores de desempenho do seu negocio: Analise de Vendas, Analise de Lucro, DRE e Comparar Marketplaces. Em cada tela voce cadastra os dados manualmente, filtra os registros e exporta tudo em CSV para acompanhar resultados e tomar decisoes.",
    "topics": [
      {
        "id": "sales-analysis",
        "title": "Analise de Vendas",
        "path": "Analises > Indicadores > Analise de Vendas",
        "summary": "Registra e acompanha o faturamento por periodo, marketplace e produto, permitindo enxergar de onde vem suas vendas e exportar o resultado.",
        "steps": [
          "1. No menu superior, clique em Analises e, na coluna Indicadores, escolha Analise de Vendas. A tela abre com o titulo do modulo, a caixa Status da pasta e a caixa Campos do modulo, que lista os campos disponiveis: Periodo, Marketplace, Produto e Faturamento.",
          "2. Para lancar um novo dado, clique no botao + Novo registro. Um formulario sera exibido logo abaixo da barra de busca.",
          "3. Preencha o campo Periodo (texto livre, ex: 'Junho/2026' ou '01/06 a 30/06') e o campo Produto (texto livre com o nome ou SKU do item).",
          "4. No campo Marketplace, abra a lista suspensa e selecione o canal: Shopee, Mercado Livre, Amazon, Shein, TikTok Shop ou Temu.",
          "5. No campo Faturamento, digite apenas numeros (e o valor total vendido no periodo). Esse campo aceita somente numero.",
          "6. Clique em Adicionar para salvar. A mensagem 'Registro cadastrado.' aparece e o lancamento entra na tabela de registros. Para desistir, clique em Cancelar.",
          "7. Use a barra Buscar registros para filtrar a tabela por qualquer texto (ex: nome do marketplace ou do produto). A lista vai sendo filtrada conforme voce digita.",
          "8. Para baixar os dados, clique em Exportar CSV. O arquivo sales-analysis.csv e gerado com uma coluna por campo, respeitando o filtro atual da busca.",
          "9. Na tabela, use Editar para abrir o registro no formulario (o botao passa a mostrar Salvar alteracoes) ou Remover para apagar; ao remover, confirme em 'Remover este registro?'."
        ],
        "tips": [
          "Padronize o texto do Periodo (sempre o mesmo formato) para conseguir buscar e comparar meses com facilidade.",
          "O campo Faturamento so aceita numero: nao digite 'R$', pontos de milhar ou letras, ou o valor pode nao ser salvo corretamente.",
          "O Exportar CSV considera apenas os registros visiveis apos a busca; limpe o campo Buscar registros se quiser exportar tudo."
        ],
        "faq": [
          {
            "q": "Os dados de vendas entram sozinhos pelas integracoes?",
            "a": "Nao. Esta tela e de cadastro manual: voce registra cada lancamento clicando em + Novo registro e preenchendo Periodo, Marketplace, Produto e Faturamento."
          },
          {
            "q": "Como vejo so as vendas de um marketplace?",
            "a": "Digite o nome do canal (ex: 'Shopee') na barra Buscar registros. A tabela mostra apenas os registros que contem esse texto."
          },
          {
            "q": "Por que o botao Exportar CSV esta desativado?",
            "a": "Ele fica indisponivel quando nao ha registros na lista. Cadastre ao menos um registro (ou limpe o filtro de busca) para liberar a exportacao."
          }
        ]
      },
      {
        "id": "profit-analysis",
        "title": "Analise de Lucro",
        "path": "Analises > Indicadores > Analise de Lucro",
        "summary": "Compara receita e custo de cada produto para evidenciar o lucro, ajudando a identificar itens mais e menos rentaveis.",
        "steps": [
          "1. Acesse Analises > Indicadores > Analise de Lucro. Na caixa Campos do modulo voce vera os campos: Produto, Receita, Custo e Lucro.",
          "2. Clique em + Novo registro para abrir o formulario.",
          "3. No campo Produto, digite o nome ou SKU do item (texto livre).",
          "4. Preencha Receita com o valor total que o produto gerou (somente numero).",
          "5. Preencha Custo com quanto esse produto custou (somente numero: custo do item, taxas, frete etc.).",
          "6. No campo Lucro, informe o resultado (Receita menos Custo). Esse campo nao calcula sozinho: voce mesmo digita o numero.",
          "7. Clique em Adicionar para gravar. Aparece 'Registro cadastrado.' e o item entra na tabela.",
          "8. Use Buscar registros para localizar um produto e Exportar CSV (arquivo profit-analysis.csv) para baixar a planilha.",
          "9. Na tabela, clique em Editar para corrigir valores (confirme em Salvar alteracoes) ou em Remover para excluir."
        ],
        "tips": [
          "O sistema nao calcula o Lucro automaticamente; faca a conta Receita - Custo e digite o resultado para manter os dados coerentes.",
          "Inclua TODOS os custos (produto, comissao, frete, impostos) no campo Custo para que a margem reflita a realidade.",
          "Cadastre um registro por produto e por periodo para acompanhar a evolucao da rentabilidade ao longo do tempo."
        ],
        "faq": [
          {
            "q": "O lucro e calculado automaticamente?",
            "a": "Nao. Os campos Receita, Custo e Lucro sao preenchidos manualmente. Calcule Receita menos Custo e informe o valor no campo Lucro."
          },
          {
            "q": "Posso registrar prejuizo?",
            "a": "Sim. Basta lancar um valor negativo no campo Lucro (ex: -50) quando o custo for maior que a receita."
          },
          {
            "q": "Como descubro o produto menos rentavel?",
            "a": "Exporte os dados em CSV pelo botao Exportar CSV e ordene a coluna Lucro na sua planilha para ver do menor para o maior."
          }
        ]
      },
      {
        "id": "dre",
        "title": "DRE (Demonstrativo de Resultado do Exercicio)",
        "path": "Analises > Indicadores > DRE",
        "summary": "O DRE e o demonstrativo que mostra o resultado do negocio: parte da receita bruta e desconta custos, despesas fixas e impostos para revelar quanto sobra. Aqui voce registra esses valores por periodo.",
        "steps": [
          "1. Acesse Analises > Indicadores > DRE. A caixa Campos do modulo lista os campos: Receita bruta, Custos, Despesas fixas e Impostos.",
          "2. Clique em + Novo registro para abrir o formulario de lancamento.",
          "3. Em Receita bruta, digite o total faturado no periodo (somente numero), sem deduzir nada.",
          "4. Em Custos, informe os custos diretos das mercadorias vendidas (somente numero).",
          "5. Em Despesas fixas, lance os gastos recorrentes do periodo (aluguel, salarios, assinaturas etc.), apenas numero.",
          "6. Em Impostos, informe o total de tributos do periodo (somente numero).",
          "7. Clique em Adicionar para salvar. A mensagem 'Registro cadastrado.' confirma a operacao e o lancamento entra na tabela.",
          "8. Use Buscar registros para localizar um lancamento e Exportar CSV (arquivo dre.csv) para baixar o demonstrativo.",
          "9. Para ajustar valores, clique em Editar na linha desejada e confirme em Salvar alteracoes; para excluir, clique em Remover e confirme."
        ],
        "tips": [
          "Cadastre um registro por periodo (ex: um por mes) para acompanhar a evolucao do resultado mes a mes.",
          "Os quatro campos aceitam somente numero; digite valores limpos, sem 'R$' nem pontos de milhar, para nao perder o dado.",
          "Para encontrar o resultado liquido, exporte o CSV e na planilha calcule Receita bruta - Custos - Despesas fixas - Impostos."
        ],
        "faq": [
          {
            "q": "O que e DRE?",
            "a": "DRE significa Demonstrativo de Resultado do Exercicio. E o relatorio que parte da receita bruta e desconta custos, despesas e impostos para mostrar se o negocio teve lucro ou prejuizo no periodo."
          },
          {
            "q": "O sistema calcula o lucro liquido do DRE?",
            "a": "Esta tela armazena os valores que voce informa (Receita bruta, Custos, Despesas fixas e Impostos). Para o resultado liquido, exporte em CSV e faca a subtracao na sua planilha."
          },
          {
            "q": "Posso ter varios DREs?",
            "a": "Sim. Crie um registro para cada periodo. Use a busca para filtrar e o Editar/Remover para manter os dados atualizados."
          }
        ]
      },
      {
        "id": "marketplace-comparison",
        "title": "Comparar Marketplaces",
        "path": "Analises > Indicadores > Comparar Marketplaces",
        "summary": "Coloca os marketplaces lado a lado com vendas, ticket medio e comissao media, ajudando a decidir em qual canal vale mais a pena investir.",
        "steps": [
          "1. Acesse Analises > Indicadores > Comparar Marketplaces. A caixa Campos do modulo mostra: Marketplace, Vendas, Ticket medio e Comissao media.",
          "2. Clique em + Novo registro para abrir o formulario.",
          "3. No campo Marketplace, abra a lista suspensa e selecione o canal: Shopee, Mercado Livre, Amazon, Shein, TikTok Shop ou Temu.",
          "4. Em Vendas, digite o total vendido naquele canal no periodo (somente numero).",
          "5. Em Ticket medio, informe o valor medio por pedido do canal (somente numero).",
          "6. Em Comissao media, informe a comissao media cobrada pelo marketplace (somente numero, ex: percentual ou valor que voce padronizou).",
          "7. Clique em Adicionar para salvar. Repita os passos criando um registro para cada marketplace que deseja comparar.",
          "8. Use Buscar registros para filtrar por canal e Exportar CSV (arquivo marketplace-comparison.csv) para baixar a comparacao em planilha.",
          "9. Para corrigir um canal, clique em Editar na linha (confirme em Salvar alteracoes); para excluir, clique em Remover e confirme."
        ],
        "tips": [
          "Cadastre um registro por marketplace referente ao mesmo periodo para que a comparacao seja justa.",
          "Padronize como voce informa a Comissao media (sempre em % ou sempre em valor) para nao misturar criterios entre os canais.",
          "Depois de cadastrar todos os canais, exporte o CSV e ordene as colunas Vendas ou Ticket medio para ver rapidamente o canal de melhor desempenho."
        ],
        "faq": [
          {
            "q": "Os numeros vem automaticamente das lojas integradas?",
            "a": "Nao. Voce informa manualmente Vendas, Ticket medio e Comissao media de cada marketplace clicando em + Novo registro."
          },
          {
            "q": "Como adiciono mais de um marketplace na comparacao?",
            "a": "Cadastre um registro separado para cada canal: clique em + Novo registro, selecione o Marketplace na lista e preencha os valores. Repita para cada loja."
          },
          {
            "q": "Meu canal nao aparece na lista Marketplace. O que faco?",
            "a": "As opcoes sao Shopee, Mercado Livre, Amazon, Shein, TikTok Shop e Temu. Se o seu canal nao estiver listado, escolha o mais proximo e detalhe no nome do registro, ou registre o valor onde fizer mais sentido."
          }
        ]
      }
    ]
  },
  {
    "moduleKey": "financeiro",
    "moduleLabel": "Financeiro",
    "icon": "💰",
    "intro": "Controle completo de receitas, despesas, caixa, contas a pagar e receber, lucros, NF-e, NCM e impostos da sua operacao de marketplace.",
    "topics": [
      {
        "id": "finance",
        "title": "Painel Financeiro",
        "path": "Financeiro > Gestao Financeira > Painel Financeiro",
        "summary": "Visao unica da operacao com receitas, despesas, lucro liquido e margem, alem da tabela de lancamentos e do painel de lancamento rapido para cadastrar entradas e saidas.",
        "steps": [
          "1. Abra o menu Financeiro e clique em Painel Financeiro (ou no botao Painel financeiro do menu lateral esquerdo).",
          "2. No topo, leia a barra de aviso azul com o resumo da tela e, sempre que precisar recarregar os dados, clique no botao Atualizar.",
          "3. Confira os cartoes de resumo: Receitas (entradas), Despesas (saidas), Lucro liquido (resultado) e Margem (rentabilidade).",
          "4. Use os filtros: escolha o periodo no seletor (Este mes, Ultimos 7 dias, Ultimos 30 dias ou Este ano), digite no campo Pesquisar numero, categoria, cliente ou fornecedor e selecione um Status (Todos, Receita, Despesa, Recebido ou Nao pago).",
          "5. Para cadastrar uma entrada, va ao painel Lancamento rapido a direita, em Nova receita preencha Descricao da receita e Valor, escolha a categoria (Venda Shopee, Venda Mercado Livre, Venda Amazon, Venda TikTok Shop, Venda Direta ou Outras receitas) e clique em Adicionar receita.",
          "6. Para cadastrar uma saida, em Nova despesa preencha Descricao da despesa e Valor, escolha a categoria (Fixa, Aluguel, Energia, Funcionarios, Pro-labore, MDF, Insumos, Impostos, Marketing ou Outras despesas) e clique em Adicionar despesa.",
          "7. Para remover um lancamento, localize a linha na tabela e clique em Excluir; confirme na janela 'Deseja excluir esta receita?' ou 'Deseja excluir esta despesa?'.",
          "8. Para baixar os dados filtrados, clique em Exportar e o arquivo financeiro-catedral.csv sera gerado."
        ],
        "tips": [
          "O campo Valor aceita apenas numeros (modo decimal). Se deixar Descricao ou Valor em branco, o sistema avisa 'Preencha descricao e valor da receita/despesa'.",
          "A margem so e calculada quando ha receitas no periodo; sem receitas ela aparece como 0,00%.",
          "O botao Exportar fica desabilitado quando nao ha nenhuma linha na tabela filtrada."
        ],
        "faq": [
          {
            "q": "Posso editar um lancamento ja criado?",
            "a": "Nesta tela a tabela oferece apenas a acao Excluir. Para corrigir um valor, exclua o lancamento e cadastre-o novamente pelo painel Lancamento rapido."
          },
          {
            "q": "Excluir uma receita aqui afeta as outras telas?",
            "a": "Sim. Receitas e despesas sao a base de todo o modulo, entao a exclusao reflete em Contas a Receber/Pagar, relatorios e impostos."
          },
          {
            "q": "Por que minha venda nao aparece em um canal especifico?",
            "a": "O canal e identificado pelo texto da categoria/descricao. Use categorias como Venda Shopee, Venda Mercado Livre etc. para que o lancamento seja classificado corretamente."
          }
        ]
      },
      {
        "id": "cash-flow",
        "title": "Caixa e Bancos",
        "path": "Financeiro > Gestao Financeira > Caixa e Bancos",
        "summary": "Fluxo consolidado das contas, somando recebimentos e pagamentos concluidos ou planejados, com o Saldo do periodo destacado no topo.",
        "steps": [
          "1. No menu Financeiro, clique em Caixa e Bancos.",
          "2. Leia o aviso 'Fluxo consolidado das contas onde recebimentos e pagamentos foram concluidos ou planejados'.",
          "3. Veja o Saldo do periodo exibido ao lado do titulo da tela (receitas menos despesas do filtro atual).",
          "4. Ajuste o periodo no seletor (Este mes, Ultimos 7 dias, Ultimos 30 dias, Este ano) e use a busca e o filtro de Status para refinar.",
          "5. Analise a tabela com as colunas Numero, Data, Descricao, Cliente/Fornecedor, Conta, Categoria, Status e Valor; receitas aparecem como Recebido e despesas como Nao pago.",
          "6. Use o painel Lancamento rapido para incluir uma Nova receita ou Nova despesa que impacte o caixa.",
          "7. Clique em Exportar para baixar o extrato consolidado em CSV.",
          "8. Clique em Atualizar para recarregar os saldos apos novos lancamentos."
        ],
        "tips": [
          "O Saldo do periodo soma o valor com sinal: receitas entram positivas e despesas saem negativas.",
          "Use o filtro de Status Recebido para ver apenas o que ja entrou no caixa e Nao pago para o que ainda esta planejado.",
          "Esta visao mostra todos os lancamentos (receitas e despesas) juntos, diferente das telas de Contas a Pagar/Receber."
        ],
        "faq": [
          {
            "q": "Caixa e Bancos cria movimentacoes sozinho?",
            "a": "Nao. Ele consolida as receitas e despesas que voce cadastra no modulo; cadastre os lancamentos pelo painel Lancamento rapido."
          },
          {
            "q": "Como separo entradas de saidas?",
            "a": "Use o filtro de Status: selecione Receita para entradas ou Despesa para saidas."
          },
          {
            "q": "Por que o saldo mudou ao trocar o periodo?",
            "a": "O saldo considera apenas os lancamentos do periodo selecionado no filtro."
          }
        ]
      },
      {
        "id": "accounts-payable",
        "title": "Contas a Pagar",
        "path": "Financeiro > Gestao Financeira > Contas a Pagar",
        "summary": "Lista somente as despesas (pagamentos a fornecedores, despesas fixas e prazos) com o Valor total a pagar destacado, para evitar atrasos.",
        "steps": [
          "1. No menu Financeiro, clique em Contas a Pagar.",
          "2. Confira no topo o indicador Valor total a pagar, que soma todas as despesas filtradas.",
          "3. A tabela exibe apenas lancamentos do tipo Despesa, com status Nao pago e numeracao CP-.",
          "4. Filtre por periodo, use a busca 'Pesquisar numero, categoria, cliente ou fornecedor' e o seletor de Status conforme a necessidade.",
          "5. Para registrar uma nova conta a pagar, use o painel Lancamento rapido em Nova despesa: preencha Descricao da despesa e Valor, escolha a categoria e clique em Adicionar despesa.",
          "6. Para dar baixa/remover uma conta, clique em Excluir na linha e confirme 'Deseja excluir esta despesa?'.",
          "7. Clique em Exportar para gerar a lista de contas a pagar em CSV.",
          "8. Use Atualizar para recarregar apos incluir novas despesas."
        ],
        "tips": [
          "Esta tela filtra somente despesas; receitas nao aparecem aqui (use Contas a Receber para isso).",
          "Cadastre cada compromisso com a categoria correta (Aluguel, Energia, Funcionarios, Impostos etc.) para facilitar relatorios.",
          "Nao ha campo de data de vencimento editavel nesta versao; organize-se pelos valores e categorias exibidos."
        ],
        "faq": [
          {
            "q": "Como marco uma conta como paga?",
            "a": "Nesta versao a baixa e feita excluindo o lancamento com o botao Excluir; o status exibido para despesas e sempre Nao pago."
          },
          {
            "q": "Posso ver receitas nesta tela?",
            "a": "Nao. Contas a Pagar mostra exclusivamente despesas. Para receitas, acesse Contas a Receber."
          },
          {
            "q": "O Valor total a pagar considera os filtros?",
            "a": "Sim, ele soma apenas as despesas que estao visiveis apos aplicar periodo, busca e status."
          }
        ]
      },
      {
        "id": "accounts-receivable",
        "title": "Contas a Receber",
        "path": "Financeiro > Gestao Financeira > Contas a Receber",
        "summary": "Lista somente as receitas (recebimentos de clientes e marketplaces) com o Valor total a receber em destaque e previsao de liquidacao.",
        "steps": [
          "1. No menu Financeiro, clique em Contas a Receber.",
          "2. Veja o indicador Valor total a receber no topo, somando todas as receitas filtradas.",
          "3. A tabela mostra apenas lancamentos do tipo Receita, com status Recebido e numeracao CR-.",
          "4. Refine com o seletor de periodo, a busca por numero/categoria/cliente e o filtro de Status.",
          "5. Para registrar um novo recebimento, use o painel Lancamento rapido em Nova receita: preencha Descricao da receita e Valor, escolha a categoria do canal e clique em Adicionar receita.",
          "6. Para remover uma receita, clique em Excluir na linha e confirme 'Deseja excluir esta receita?'.",
          "7. Clique em Exportar para baixar a lista de recebimentos em CSV.",
          "8. Use Atualizar sempre que cadastrar novas receitas."
        ],
        "tips": [
          "Esta tela filtra somente receitas; despesas ficam em Contas a Pagar.",
          "Escolha a categoria do canal (Venda Shopee, Venda Mercado Livre etc.) para que os relatorios por canal fiquem corretos.",
          "O Valor total a receber acompanha os filtros aplicados na tela."
        ],
        "faq": [
          {
            "q": "As vendas dos marketplaces entram automaticamente?",
            "a": "As receitas exibidas vem dos lancamentos cadastrados no modulo; registre os recebimentos pelo painel Nova receita."
          },
          {
            "q": "Por que todas aparecem como Recebido?",
            "a": "Nesta versao as receitas sao exibidas com status Recebido por padrao. Para controlar pendencias, use a descricao e a categoria."
          },
          {
            "q": "Como corrijo um valor recebido errado?",
            "a": "Exclua a receita pelo botao Excluir e cadastre novamente com o valor correto."
          }
        ]
      },
      {
        "id": "profit-report",
        "title": "Relatorio de Lucros",
        "path": "Financeiro > Relatorios > Relatorio de Lucros",
        "summary": "Resumo de lucro por origem (canal), considerando receitas, custos cadastrados, taxas estimadas do canal e despesas do periodo, com cartoes de Lucro total, Margem media, Pedidos, Recebimento, Custo total, Taxas e Reembolso.",
        "steps": [
          "1. No menu Financeiro, clique em Relatorio de Lucros.",
          "2. No bloco 'Lucros por canal', escolha o canal clicando em Todos canais, Shopee, Shein, TikTok Shop, Pedidos de Vendas ou Lucro da Loja.",
          "3. Acompanhe os cartoes de resumo: Lucro total, Margem media, Pedidos, Recebimento, Custo total, Taxas e Reembolso.",
          "4. Ajuste o periodo e use a busca e o filtro de Status para refinar os lancamentos considerados.",
          "5. Analise a tabela de lucro com as colunas Ordenado, Liquidacao, Pedido, Loja, Valor do pedido, Recebimento, Vendas de produtos, Taxas do canal e Lucro estimado; a primeira linha 'Resumo' traz os totais.",
          "6. Confira o Lucro estimado por pedido (valor menos as taxas do canal estimadas).",
          "7. Clique em Exportar para baixar os dados em CSV.",
          "8. Use Atualizar para recarregar caso cadastre novas receitas/despesas."
        ],
        "tips": [
          "As Taxas do canal sao uma estimativa (cerca de 8% sobre o valor da receita); use como referencia, nao como valor fiscal exato.",
          "O canal e definido pelo texto da categoria/descricao do lancamento, entao categorize as vendas corretamente.",
          "Selecione Todos canais para ver o lucro consolidado de toda a operacao."
        ],
        "faq": [
          {
            "q": "De onde vem o Lucro estimado?",
            "a": "E o valor do pedido menos as taxas estimadas do canal; o custo total tambem entra no resumo geral da tabela."
          },
          {
            "q": "O que e a coluna Pedidos no resumo?",
            "a": "E a quantidade de lancamentos de venda (receitas) considerados no periodo e canal filtrados."
          },
          {
            "q": "Por que um canal aparece vazio?",
            "a": "Nao ha receitas classificadas naquele canal no periodo. Verifique as categorias dos lancamentos ou troque o periodo."
          }
        ]
      },
      {
        "id": "invoice-report",
        "title": "Relatorio de NF-e",
        "path": "Financeiro > Relatorios > Relatorio de NF-e",
        "summary": "Visao gerencial das notas fiscais com valores emitido, devolvido, cancelado e o total liquido, podendo agrupar Por empresa ou Por loja.",
        "steps": [
          "1. No menu Financeiro, clique em Relatorio de NF-e.",
          "2. No bloco 'Relatorio de nota fiscal', escolha como agrupar: clique em Por empresa ou Por loja.",
          "3. Acompanhe os cartoes: Valor total NF-e (liquido), Valor emitido, Valor devolvido e Valor cancelado.",
          "4. Ajuste o periodo e use a busca e o filtro de Status para refinar.",
          "5. Em Por empresa, a tabela mostra Contas NF-e/CNPJ com o CNPJ; em Por loja aparece a coluna Plataforma, identificando o canal.",
          "6. Leia a linha 'Resumo' no topo da tabela para os totais de emitido, devolvido e cancelado.",
          "7. Clique em Exportar para baixar o relatorio em CSV.",
          "8. Use Atualizar para recarregar os valores."
        ],
        "tips": [
          "Esta tela considera apenas lancamentos de Receita (notas de venda).",
          "Os valores de devolvido e cancelado sao estimativas derivadas das taxas/reembolsos; trate como visao gerencial.",
          "Alterne entre Por empresa e Por loja para conferir os mesmos numeros sob otica fiscal ou de canal."
        ],
        "faq": [
          {
            "q": "Qual a diferenca entre Por empresa e Por loja?",
            "a": "Por empresa agrupa pelo CNPJ/participante; Por loja agrupa pelo canal/plataforma de venda, exibindo a coluna Plataforma."
          },
          {
            "q": "O Valor total NF-e e o emitido menos o devolvido?",
            "a": "Sim, o total liquido apresentado e o valor emitido descontando o valor devolvido."
          },
          {
            "q": "Despesas aparecem aqui?",
            "a": "Nao. O Relatorio de NF-e considera somente receitas (notas emitidas)."
          }
        ]
      },
      {
        "id": "ncm-sales-report",
        "title": "NCM Vendas",
        "path": "Financeiro > Relatorios > NCM Vendas",
        "summary": "Resumo fiscal por NCM das notas emitidas, com quantidade vendida, valor total e preco unitario medio.",
        "steps": [
          "1. No menu Financeiro, clique em NCM Vendas.",
          "2. No bloco 'Relatorio NCM', confirme que esta em Relatorios de Vendas (voce pode alternar para Relatorio de Compras ou Relatorio de Estatisticas).",
          "3. Acompanhe os cartoes: NCM total (codigos agrupados), Quantidade total, Valor total e Preco unitario medio.",
          "4. Ajuste o periodo e use a busca e o filtro de Status para refinar.",
          "5. Analise a tabela por NCM com as colunas NCM, Contas NF-e/CNPJ, Quantidade total, Valor total, Preco unitario medio, Quantidade emitida e Valor emitido; a linha 'Resumo' traz os totais.",
          "6. Clique em Exportar para gerar o CSV com os lancamentos filtrados.",
          "7. Use Atualizar para recarregar os dados."
        ],
        "tips": [
          "Esta visao considera apenas receitas (vendas). Para compras, use NCM Compras.",
          "Os NCMs e quantidades sao agrupados automaticamente; confira o Preco unitario medio para analise fiscal.",
          "Use os botoes do bloco Relatorio NCM para navegar rapidamente entre Vendas, Compras e Estatisticas."
        ],
        "faq": [
          {
            "q": "O que e NCM?",
            "a": "E o codigo fiscal que classifica a mercadoria. Esta tela agrupa suas vendas por esse codigo para fins fiscais."
          },
          {
            "q": "Como troco para o relatorio de compras?",
            "a": "Clique em Relatorio de Compras no bloco Relatorio NCM, ou acesse NCM Compras pelo menu."
          },
          {
            "q": "Por que a tabela esta vazia?",
            "a": "Nao ha receitas no periodo filtrado. Cadastre vendas ou ajuste o periodo e os filtros."
          }
        ]
      },
      {
        "id": "ncm-purchase-report",
        "title": "NCM Compras",
        "path": "Financeiro > Relatorios > NCM Compras",
        "summary": "Resumo fiscal por NCM das compras, com fornecedores vinculados, quantidade importada, valor total e preco unitario medio.",
        "steps": [
          "1. No menu Financeiro, clique em NCM Compras.",
          "2. No bloco 'Relatorio NCM', confirme a opcao Relatorio de Compras (pode alternar para Vendas ou Estatisticas).",
          "3. Acompanhe os cartoes: NCM total, Quantidade total, Valor total e Preco unitario medio.",
          "4. Ajuste o periodo e use a busca e o filtro de Status.",
          "5. Analise a tabela com as colunas NCM, Contas NF-e/CNPJ, Fornecedores, Quantidade total, Valor total, Preco unitario medio, Quantidade importada e Valor emitido; a linha 'Resumo' fecha os totais.",
          "6. Clique em Exportar para baixar o CSV.",
          "7. Use Atualizar para recarregar os dados de compras."
        ],
        "tips": [
          "Esta tela considera apenas despesas (compras). Para vendas, use NCM Vendas.",
          "A coluna Fornecedores so aparece no relatorio de compras; cadastre as despesas com participante/categoria adequados.",
          "Acompanhe a Quantidade importada para apoiar o controle fiscal de entradas."
        ],
        "faq": [
          {
            "q": "Por que aparece a coluna Fornecedores aqui?",
            "a": "Porque e o relatorio de compras, que vincula cada NCM ao fornecedor/participante das despesas."
          },
          {
            "q": "Vendas entram neste relatorio?",
            "a": "Nao. NCM Compras considera somente despesas; vendas ficam em NCM Vendas."
          },
          {
            "q": "O que e Quantidade importada?",
            "a": "E a quantidade de itens de compra agrupada por NCM, usada como referencia fiscal de entradas."
          }
        ]
      },
      {
        "id": "ncm-stock-report",
        "title": "NCM Estoque",
        "path": "Financeiro > Relatorios > NCM Estoque",
        "summary": "Estatistica fiscal de estoque por NCM com estoque inicial, estoque final, entradas, saidas e quantidade de compras.",
        "steps": [
          "1. No menu Financeiro, clique em NCM Estoque.",
          "2. No bloco 'Relatorio NCM', confirme a opcao Relatorio de Estatisticas (pode alternar para Vendas ou Compras).",
          "3. Acompanhe os cartoes: NCM total, Quantidade total, Valor total e Preco unitario medio.",
          "4. Ajuste o periodo e use a busca e o filtro de Status.",
          "5. Analise a tabela com as colunas NCM, Contas NF-e/CNPJ, Estoque inicial, Estoque final, Entrada, Quantidade de compras e Saidas; valores negativos de Estoque final aparecem destacados.",
          "6. Leia a linha 'Resumo' para os totais de estoque inicial, final e quantidade.",
          "7. Clique em Exportar para baixar o CSV e use Atualizar para recarregar."
        ],
        "tips": [
          "Esta visao considera receitas e despesas juntas para estimar o movimento de estoque por NCM.",
          "Estoque final negativo (destacado em vermelho) indica saidas maiores que entradas no periodo; revise os lancamentos.",
          "Use junto com NCM Vendas e NCM Compras para entender entradas e saidas."
        ],
        "faq": [
          {
            "q": "Por que o estoque final esta negativo?",
            "a": "Significa que as saidas estimadas superam as entradas no periodo. As celulas negativas ficam destacadas para chamar atencao."
          },
          {
            "q": "Este relatorio substitui o estoque fisico?",
            "a": "Nao. E uma estatistica fiscal por NCM; o controle de estoque detalhado fica no modulo Estoque."
          },
          {
            "q": "Como mudo para Vendas ou Compras?",
            "a": "Use os botoes Relatorios de Vendas ou Relatorio de Compras no bloco Relatorio NCM."
          }
        ]
      },
      {
        "id": "taxes",
        "title": "Impostos",
        "path": "Financeiro > Relatorios > Impostos",
        "summary": "Acompanha os impostos estimados e as categorias fiscais usadas nos lancamentos, somando as despesas que representam carga tributaria.",
        "steps": [
          "1. No menu Financeiro, clique em Impostos.",
          "2. Leia o aviso 'Acompanhe impostos estimados e categorias fiscais usadas nos lancamentos financeiros'.",
          "3. Confira o indicador Impostos estimados no topo, que soma as despesas filtradas.",
          "4. A tabela exibe apenas lancamentos do tipo Despesa (incluindo a categoria Impostos) com as colunas Numero, Data, Descricao, Cliente/Fornecedor, Conta, Categoria, Status e Valor.",
          "5. Ajuste o periodo e use a busca e o filtro de Status para isolar despesas tributarias.",
          "6. Para registrar um imposto, use o painel Lancamento rapido em Nova despesa, escolha a categoria Impostos, preencha Descricao e Valor e clique em Adicionar despesa.",
          "7. Clique em Exportar para baixar o CSV e use Atualizar para recarregar."
        ],
        "tips": [
          "Cadastre tributos sempre com a categoria Impostos para facilitar a leitura desta tela.",
          "Os valores sao estimativas com base nos lancamentos; confirme as guias oficiais com seu contador.",
          "Esta visao considera somente despesas; receitas nao aparecem aqui."
        ],
        "faq": [
          {
            "q": "O sistema calcula os impostos automaticamente?",
            "a": "Nesta tela os impostos estimados sao a soma das despesas cadastradas; lance os tributos como despesa na categoria Impostos."
          },
          {
            "q": "Como separo so os tributos das demais despesas?",
            "a": "Cadastre-os na categoria Impostos e use a busca para filtrar pela descricao desejada."
          },
          {
            "q": "Posso confiar nesse valor para pagar a guia?",
            "a": "Use como referencia gerencial; o valor oficial deve ser validado com seu contador e as apuracoes fiscais."
          }
        ]
      }
    ]
  },
  {
    "moduleKey": "integracoes",
    "moduleLabel": "Integracoes (Conectar Marketplaces)",
    "icon": "🔌",
    "intro": "Conecte suas lojas de marketplace (Shopee, Mercado Livre, Amazon, Shein, TikTok Shop e Temu) a NEXT ERP para sincronizar produtos e pedidos automaticamente.",
    "topics": [
      {
        "id": "store-integrations",
        "title": "Integracoes de Loja (visao geral e Shopee)",
        "path": "Integracoes > Marketplaces > Integracoes de Loja",
        "summary": "Tela central onde voce ve todas as lojas conectadas, filtra por marketplace, conecta a loja Shopee via API oficial e cadastra lojas manualmente. A barra lateral mostra Todas, Mercado Livre, Shopee, Amazon, Shein, TikTok Shop e Temu, cada um com a contagem de lojas.",
        "steps": [
          "1. No menu, acesse Integracoes > Marketplaces > Integracoes de Loja.",
          "2. Na barra lateral esquerda, clique no marketplace desejado (ex.: Shopee) ou em Todas. O numero ao lado de cada nome indica quantas lojas ja estao cadastradas naquele canal.",
          "3. Com o filtro Shopee selecionado, aparece o painel Conta da loja com o status (Credenciais pendentes, Pronta para login, Conectada ou Token expirado) e um resumo com Loja, Shop ID, Ambiente e Callback.",
          "4. Clique no botao Credenciais para abrir o formulario e preencha Partner ID, Partner Key, Shop ID, Nome da loja, o ambiente (Producao ou Sandbox) e a Redirect URL; depois clique em Salvar credenciais.",
          "5. Clique em Conectar com Shopee (ou no botao + Conectar loja do topo). Abre-se uma janela popup com o login oficial da Shopee. Faca login e autorize a loja.",
          "6. Depois de autorizar, volte a NEXT. O sistema detecta a conexao sozinho a cada poucos segundos; se preferir, clique em Ja confirmei na janela de login.",
          "7. Com a loja conectada, clique em Validar conexao para confirmar que esta tudo certo (mostra o nome e o ID da loja).",
          "8. Para encerrar o vinculo, clique em Desconectar e confirme na mensagem que aparece.",
          "9. Use o campo de busca (Nome da sua loja, Shop ID ou status) e a tabela inferior para localizar e gerenciar cada loja com os botoes Editar e Remover."
        ],
        "tips": [
          "O Partner ID e a Partner Key sao obtidos na Shopee Open Platform (open.shopee.com), na sua aplicacao de desenvolvedor. A Redirect URL ja vem preenchida pela NEXT e deve ser cadastrada igual no app da Shopee.",
          "Se o navegador bloquear o popup de login, libere os pop-ups para o site da NEXT ou clique em Abrir login da Shopee na janela que aparece.",
          "Por seguranca, a Partner Key fica oculta apos salva (aparece Partner Key ja salva). So redigite se precisar troca-la."
        ],
        "faq": [
          {
            "q": "Aparece Credenciais pendentes mesmo depois de salvar. O que houve?",
            "a": "Confira se preencheu tanto o Partner ID quanto a Partner Key e clicou em Salvar credenciais. Sem os dois, o botao Conectar com Shopee avisa que faltam credenciais."
          },
          {
            "q": "O status mostra Token expirado. Preciso refazer tudo?",
            "a": "Nao. Clique em Conectar com Shopee novamente para refazer o login e renovar o token; as credenciais salvas sao mantidas."
          },
          {
            "q": "Qual a diferenca entre Producao e Sandbox?",
            "a": "Producao conecta a loja real com vendas verdadeiras. Sandbox e o ambiente de testes da Shopee. Use Producao para operar de verdade."
          }
        ]
      },
      {
        "id": "store-integrations-manual",
        "title": "Cadastro manual de loja",
        "path": "Integracoes > Marketplaces > Integracoes de Loja",
        "summary": "Permite registrar uma loja de qualquer marketplace manualmente (sem conexao por API), util para controle e organizacao das lojas na tabela de integracoes.",
        "steps": [
          "1. Acesse Integracoes > Marketplaces > Integracoes de Loja.",
          "2. Selecione na barra lateral um marketplace diferente de Shopee (ex.: Amazon, Shein) e clique em + Conectar loja no topo para abrir o formulario Conectar loja.",
          "3. Escolha o Marketplace no seletor (Mercado Livre, Shopee, Amazon, Shein, TikTok Shop ou Temu).",
          "4. Preencha Nome da loja (obrigatorio), Pais (ex.: BR), ID da loja / Shop ID e selecione o Status (Ativo, Pendente, Expirado ou Erro).",
          "5. Informe a Data de autenticacao e as Observacoes, se desejar.",
          "6. Clique em Adicionar loja para salvar. A loja passa a aparecer na tabela Integracoes de loja.",
          "7. Para alterar depois, clique em Editar na linha da loja, ajuste os campos e clique em Salvar alteracoes.",
          "8. Para excluir, clique em Remover na linha desejada e confirme na mensagem."
        ],
        "tips": [
          "O cadastro manual e apenas um registro: ele NAO conecta a loja por API nem sincroniza pedidos. Para sincronizacao automatica use os topicos especificos de cada marketplace.",
          "O campo Nome da loja e obrigatorio; sem ele o sistema avisa Informe o nome da loja e nao salva.",
          "Use o Status para acompanhar visualmente a situacao de cada loja na tabela."
        ],
        "faq": [
          {
            "q": "Cadastrei a loja manualmente, mas os pedidos nao entram. Por que?",
            "a": "O cadastro manual nao puxa dados. Para receber pedidos e produtos automaticamente, conecte a loja pela API no topico do marketplace correspondente."
          },
          {
            "q": "Posso editar o marketplace de uma loja ja cadastrada?",
            "a": "Sim. Clique em Editar na linha, troque o Marketplace no seletor e clique em Salvar alteracoes."
          }
        ]
      },
      {
        "id": "importShopee",
        "title": "Importar Produtos Shopee (planilha)",
        "path": "Integracoes > Marketplaces > Importar Shopee",
        "summary": "Importa produtos para a NEXT a partir da planilha de Informacoes de Vendas exportada pela Shopee, nos formatos XLSX ou CSV. Util para subir o catalogo sem conexao por API.",
        "steps": [
          "1. Na Shopee, exporte a planilha de Informacoes de Vendas (formato XLSX ou CSV).",
          "2. Na NEXT, acesse Integracoes > Marketplaces > Importar Shopee.",
          "3. No bloco Upload da planilha, clique no seletor de arquivo e escolha o arquivo .xlsx ou .csv.",
          "4. Clique no botao Importar Produtos. Enquanto processa, o botao mostra Importando....",
          "5. Ao terminar, aparece a mensagem com o resultado, por exemplo: X produtos importados/atualizados e Y linhas ignoradas.",
          "6. Se der erro, leia a mensagem e confirme que o arquivo e mesmo a planilha de Informacoes de Vendas da Shopee."
        ],
        "tips": [
          "Use exatamente a planilha de Informacoes de Vendas da Shopee. Outros relatorios podem ter colunas diferentes e gerar linhas ignoradas.",
          "Importar a mesma planilha de novo atualiza os produtos existentes, nao duplica.",
          "So sao aceitos arquivos .csv e .xlsx; outros formatos nao serao abertos pelo seletor."
        ],
        "faq": [
          {
            "q": "O que significam as linhas ignoradas no resultado?",
            "a": "Sao linhas da planilha que o sistema nao conseguiu interpretar como produto valido (ex.: cabecalhos extras ou dados incompletos). Os demais produtos foram importados normalmente."
          },
          {
            "q": "A importacao puxa pedidos tambem?",
            "a": "Nao. Esta tela importa apenas produtos da planilha. Para pedidos automaticos, conecte a loja Shopee por API em Integracoes de Loja."
          }
        ]
      },
      {
        "id": "mercado-livre-integration",
        "title": "Mercado Livre (conexao OAuth)",
        "path": "Integracoes > Marketplaces > Mercado Livre",
        "summary": "Conecta a conta do Mercado Livre via OAuth para a NEXT acessar pedidos, anuncios e estoque pela API oficial. Mostra o status da conexao e dados do vendedor.",
        "steps": [
          "1. Acesse Integracoes > Marketplaces > Mercado Livre.",
          "2. No bloco Conta do Mercado Livre, confira o painel: Credenciais no backend (Configuradas/Pendentes), Conta conectada (Sim/Nao), Vendedor, ID do vendedor, Token expira em e Redirect URI.",
          "3. Se as credenciais estiverem pendentes, siga o checklist Como conectar a direita: criar a aplicacao em developers.mercadolivre.com.br, copiar App ID e Secret Key e cadastrar a URI de redirect terminada em /mercadolivre/callback.",
          "4. Com as credenciais configuradas, clique em Conectar Mercado Livre (ou Reconectar, se ja houve conexao). Voce sera levado ao login do Mercado Livre.",
          "5. Faca login e autorize a NEXT ERP a acessar a conta. Ao voltar, aparece a mensagem Conta Mercado Livre conectada com sucesso.",
          "6. Clique em Testar conexao para confirmar; o sistema mostra o apelido (nickname) e o ID do vendedor.",
          "7. Para encerrar o vinculo, clique em Desconectar."
        ],
        "tips": [
          "O App ID, a Secret Key e a Redirect URI sao configurados no backend (ML_APP_ID, ML_SECRET_KEY e ML_REDIRECT_URI). Se aparecer Credenciais pendentes, peca ao responsavel tecnico para preencher esses valores e reiniciar o backend.",
          "A URI de redirect cadastrada no Mercado Livre precisa ser HTTPS e terminar em /mercadolivre/callback, igual ao backend.",
          "Os botoes Testar conexao e Desconectar so ficam ativos quando ha uma conta conectada."
        ],
        "faq": [
          {
            "q": "O botao Conectar Mercado Livre esta desabilitado. Por que?",
            "a": "Ele so libera quando as credenciais (App ID, Secret Key e Redirect URI) estao configuradas no backend. Enquanto estiverem pendentes, o botao fica bloqueado."
          },
          {
            "q": "Como sei quando o acesso vai expirar?",
            "a": "O painel mostra o campo Token expira em com a data e hora. A NEXT renova o acesso automaticamente enquanto a conta estiver conectada."
          },
          {
            "q": "Deu Falha ao conectar ao voltar do Mercado Livre. O que fazer?",
            "a": "Confira se a Redirect URI cadastrada no app e identica a do backend e tente Conectar novamente. A mensagem de erro detalha o motivo."
          }
        ]
      },
      {
        "id": "amazon-integration",
        "title": "Amazon (conexao por API)",
        "path": "Integracoes > Marketplaces > Amazon",
        "summary": "Conecta a loja Amazon pela API oficial para sincronizar produtos e pedidos. A tela usa o formulario padrao de marketplaces, com App Key/App Secret, ambiente, metodo de assinatura e URLs ja preenchidas.",
        "steps": [
          "1. Acesse Integracoes > Marketplaces > Amazon.",
          "2. No bloco Dados da aplicacao, preencha App Key / Client ID e App Secret / Client Secret obtidos no portal de desenvolvedor da Amazon.",
          "3. Se tiver, informe Shop ID / Seller ID e Nome da loja; selecione o Ambiente (Producao ou Sandbox) e o metodo de assinatura (Assinatura HMAC ou OAuth Bearer).",
          "4. Confira a Redirect URL (use Copiar Redirect URL para cadastra-la no app) e as demais URLs (Auth URL, Token URL, Refresh URL, Shop info URL, Products URL, Orders URL e API Base), que ja vem preenchidas com os valores mais comuns.",
          "5. Clique em Salvar configuracao. O percentual no topo e o checklist Antes de sincronizar ajudam a ver o que ainda falta.",
          "6. Clique em Conectar loja para abrir a autorizacao oficial e liberar o acesso da NEXT.",
          "7. De volta, clique em Testar conexao para validar (mostra Loja e Shop ID).",
          "8. Clique em Sincronizar produtos e pedidos para puxar os dados; o resultado informa quantos foram criados e atualizados. Use Desconectar para encerrar."
        ],
        "tips": [
          "O App Key e o App Secret sao gerados no portal de desenvolvedor da Amazon (Seller Central / Developer Console). Sem eles a conexao nao avanca.",
          "As URLs ja vem preenchidas; so altere se a Amazon indicar endpoints diferentes para a sua regiao. A Redirect URL precisa estar cadastrada igualzinha no app.",
          "Os botoes Testar conexao e Sincronizar produtos e pedidos so ficam ativos depois que a loja esta conectada."
        ],
        "faq": [
          {
            "q": "Nao sei a diferenca entre Assinatura HMAC e OAuth Bearer. Qual escolho?",
            "a": "Depende de como a API da Amazon exige autenticar as chamadas. Use o metodo indicado na documentacao do seu app; na duvida, mantenha o valor padrao da tela e teste a conexao."
          },
          {
            "q": "O App Secret some depois que salvo. Perdi a chave?",
            "a": "Nao. Por seguranca ele fica oculto e aparece App Secret ja salvo. So redigite se precisar substituir."
          },
          {
            "q": "A sincronizacao trouxe 0 novos. Esta errado?",
            "a": "Nao necessariamente. Significa que nao havia itens novos desde a ultima sincronizacao; os ja existentes podem ter sido apenas atualizados."
          }
        ]
      },
      {
        "id": "shein-integration",
        "title": "Shein (conexao por API)",
        "path": "Integracoes > Marketplaces > Shein",
        "summary": "Conecta a loja Shein pela API oficial para sincronizar produtos e pedidos. Usa o mesmo formulario padrao de marketplaces, com App Key/App Secret, ambiente, metodo de assinatura e URLs ja preenchidas.",
        "steps": [
          "1. Acesse Integracoes > Marketplaces > Shein.",
          "2. Preencha App Key / Client ID e App Secret / Client Secret obtidos no portal de desenvolvedor da Shein.",
          "3. Informe Shop ID / Seller ID e Nome da loja se ja os tiver; escolha o Ambiente (Producao ou Sandbox) e o metodo de assinatura (Assinatura HMAC ou OAuth Bearer).",
          "4. Verifique a Redirect URL (clique em Copiar Redirect URL para cadastra-la no app) e as URLs ja preenchidas (Auth URL, Token URL, Refresh URL, Shop info URL, Products URL, Orders URL, API Base).",
          "5. Clique em Salvar configuracao.",
          "6. Clique em Conectar loja e conclua a autorizacao oficial da Shein.",
          "7. Clique em Testar conexao para confirmar e, em seguida, em Sincronizar produtos e pedidos para importar os dados. Use Desconectar para encerrar."
        ],
        "tips": [
          "Obtenha App Key e App Secret no portal de desenvolvedor da Shein. Sem essas credenciais o botao Conectar loja nao avanca.",
          "Mantenha as URLs padrao da tela, a menos que a Shein informe endpoints especificos para a sua conta.",
          "Acompanhe o percentual de progresso no topo: ele sobe conforme voce preenche as credenciais e URLs necessarias."
        ],
        "faq": [
          {
            "q": "Onde consigo o App Key e o App Secret da Shein?",
            "a": "No portal de desenvolvedor / open platform da Shein, dentro da aplicacao registrada para a sua loja."
          },
          {
            "q": "Preciso preencher todas as URLs manualmente?",
            "a": "Nao. A tela ja vem com os valores mais comuns preenchidos. So edite se a documentacao da Shein indicar endpoints diferentes."
          }
        ]
      },
      {
        "id": "tiktok-integration",
        "title": "TikTok Shop (conexao por API)",
        "path": "Integracoes > Marketplaces > TikTok Shop",
        "summary": "Conecta a loja TikTok Shop pela API oficial para sincronizar produtos e pedidos. Usa o formulario padrao de marketplaces, com App Key/App Secret, ambiente, metodo de assinatura e URLs ja preenchidas.",
        "steps": [
          "1. Acesse Integracoes > Marketplaces > TikTok Shop.",
          "2. Preencha App Key / Client ID e App Secret / Client Secret obtidos no portal de desenvolvedor do TikTok Shop.",
          "3. Informe Shop ID / Seller ID e Nome da loja se desejar; selecione o Ambiente (Producao ou Sandbox) e o metodo de assinatura (Assinatura HMAC ou OAuth Bearer).",
          "4. Confira a Redirect URL (use Copiar Redirect URL para cadastra-la no app) e as URLs ja preenchidas (Auth URL, Token URL, Refresh URL, Shop info URL, Products URL, Orders URL, API Base).",
          "5. Clique em Salvar configuracao.",
          "6. Clique em Conectar loja e conclua a autorizacao oficial do TikTok Shop.",
          "7. Clique em Testar conexao para validar e depois em Sincronizar produtos e pedidos para puxar os dados. Use Desconectar quando quiser encerrar."
        ],
        "tips": [
          "O App Key e o App Secret vem do TikTok Shop Partner Center (portal de desenvolvedor). Cadastre a Redirect URL no app exatamente como aparece na tela.",
          "Os botoes Testar conexao e Sincronizar produtos e pedidos so ficam ativos com a loja ja conectada.",
          "Confira o checklist Antes de sincronizar a direita para garantir que cumpriu todos os pre-requisitos."
        ],
        "faq": [
          {
            "q": "Conectei mas o Testar conexao continua desabilitado. Por que?",
            "a": "Ele so libera quando o status mostra a loja conectada. Refaca Conectar loja e conclua a autorizacao oficial ate aparecer a mensagem de conta conectada."
          },
          {
            "q": "Com que frequencia preciso sincronizar?",
            "a": "Sempre que quiser atualizar produtos e pedidos manualmente. Clique em Sincronizar produtos e pedidos para puxar as novidades; o resultado mostra quantos foram criados e atualizados."
          }
        ]
      },
      {
        "id": "temu-integration",
        "title": "Temu (conexao por API)",
        "path": "Integracoes > Marketplaces > Temu",
        "summary": "Conecta a loja Temu pela API oficial para sincronizar produtos e pedidos. Usa o formulario padrao de marketplaces, com App Key/App Secret, ambiente, metodo de assinatura e URLs ja preenchidas.",
        "steps": [
          "1. Acesse Integracoes > Marketplaces > Temu.",
          "2. Preencha App Key / Client ID e App Secret / Client Secret obtidos no portal de desenvolvedor da Temu.",
          "3. Informe Shop ID / Seller ID e Nome da loja se ja os tiver; escolha o Ambiente (Producao ou Sandbox) e o metodo de assinatura (Assinatura HMAC ou OAuth Bearer).",
          "4. Verifique a Redirect URL (clique em Copiar Redirect URL para cadastra-la no app) e as URLs ja preenchidas (Auth URL, Token URL, Refresh URL, Shop info URL, Products URL, Orders URL, API Base).",
          "5. Clique em Salvar configuracao.",
          "6. Clique em Conectar loja e conclua a autorizacao oficial da Temu.",
          "7. Clique em Testar conexao para validar e depois em Sincronizar produtos e pedidos. Use Desconectar para encerrar o vinculo."
        ],
        "tips": [
          "Obtenha App Key e App Secret no portal de desenvolvedor da Temu. A Redirect URL precisa estar cadastrada no app exatamente como mostrada na tela.",
          "Nao altere as URLs padrao sem necessidade; elas ja vem com os valores corretos para a maioria das contas.",
          "O App Secret fica oculto apos salvo (App Secret ja salvo). So redigite ao trocar a credencial."
        ],
        "faq": [
          {
            "q": "Salvei a configuracao mas nao consigo conectar. O que verifico?",
            "a": "Confira se App Key e App Secret estao corretos e se a Redirect URL foi cadastrada igual no app da Temu. A mensagem de erro abaixo do topo indica o motivo."
          },
          {
            "q": "O que faz o botao Copiar Redirect URL?",
            "a": "Ele copia a Redirect URL para a area de transferencia, para voce colar e cadastrar no portal de desenvolvedor da Temu sem erro de digitacao."
          }
        ]
      },
      {
        "id": "field-mapping",
        "title": "Mapeamento de Campos do Marketplace",
        "path": "Integracoes > Marketplaces > Mapeamento de Campos",
        "summary": "Tela apenas de consulta (somente leitura) que mostra o de/para: como cada dado que chega da API dos marketplaces e distribuido automaticamente para o campo correto (canonico) da NEXT. Organizada em grupos Produto / Anuncio e Pedido / Venda.",
        "steps": [
          "1. Acesse Integracoes > Marketplaces > Mapeamento de Campos.",
          "2. Leia a explicacao no topo: quando um marketplace conecta, a NEXT le o dado recebido e o coloca no campo canonico correto automaticamente.",
          "3. Percorra a secao Produto / Anuncio para ver o mapeamento dos dados de produtos e anuncios.",
          "4. Percorra a secao Pedido / Venda para ver o mapeamento dos dados de pedidos e vendas.",
          "5. Em cada tabela, a coluna Campo na NEXT mostra o nome canonico e a coluna Nomes reconhecidos na API do marketplace lista os apelidos (aliases) aceitos de cada plataforma.",
          "6. Use essa referencia para entender em qual campo da NEXT um determinado dado do marketplace ira cair."
        ],
        "tips": [
          "Esta tela e somente leitura: nao ha campos para editar nem botoes de salvar. Serve apenas como referencia.",
          "Se um dado do marketplace aparece em campo inesperado, confira aqui quais nomes de API sao reconhecidos para aquele campo.",
          "O mesmo mapeamento vale para qualquer plataforma conectada, por isso e um padrao unico para todos os marketplaces."
        ],
        "faq": [
          {
            "q": "Consigo alterar o mapeamento nesta tela?",
            "a": "Nao. O mapeamento e fixo e definido pelo motor da NEXT. A tela apenas mostra o de/para para sua consulta."
          },
          {
            "q": "A tabela esta vazia. O que significa?",
            "a": "Se nada carregar, pode ter ocorrido falha ao buscar o mapeamento (aparece um aviso). Recarregue a pagina; persistindo, contate o suporte."
          }
        ]
      }
    ]
  },
  {
    "moduleKey": "configuracoes",
    "moduleLabel": "Configuracoes do Sistema",
    "icon": "⚙️",
    "intro": "Central de ajustes do NEXT ERP: regras de pedidos, NF-e, etiquetas por marketplace, modelos de impressao, estoque, financeiro, permissoes e registros de atividade.",
    "topics": [
      {
        "id": "settings-orders",
        "title": "Configuracoes padroes de Pedidos",
        "path": "Configuracoes > Pedidos > Configuracoes padroes",
        "summary": "Define o comportamento padrao dos pedidos: marcacao automatica de impressao, prazo de envio, lista de separacao, deducao de estoque, NF-e e separacao por ondas. Cada ajuste e salvo na hora ao ser alterado.",
        "steps": [
          "1. No menu superior abra Configuracoes e, na coluna Pedidos, clique em Configuracoes padroes (item ja vem marcado como ativo).",
          "2. No cartao Configuracoes padroes, use o botao de chave (toggle) Etiqueta marcar como impresso automaticamente para que o pedido seja marcado como impresso assim que a etiqueta sair.",
          "3. Ative ou desative Lista de separacao marcar como impresso automaticamente da mesma forma, conforme sua rotina de conferencia.",
          "4. No campo Prazo de envio escolha a regra no menu: Manual, Usar prazo do marketplace ou Priorizar mesmo dia.",
          "5. Use os toggles Lista de separacao (separacao por lote antes de imprimir) e Deducao de estoque (baixa o estoque quando o pedido entra no ERP) de acordo com sua operacao.",
          "6. No cartao Configuracoes do Pedido, escolha em Separacao por ondas entre Separador padrao, Por marketplace, Por envio ou Por prioridade.",
          "7. Ative Pedido buffering se quiser que pedidos em sincronizacao fiquem fora de revisao ate a sincronizacao terminar.",
          "8. Cada alteracao e salva automaticamente; confirme pela mensagem Configuracao salva exibida no topo da pagina."
        ],
        "tips": [
          "Nao existe botao Salvar nesta tela: cada toggle ou menu grava sozinho ao ser tocado, entao revise com calma antes de mudar.",
          "Deixar Deducao de estoque ligado evita venda de itens sem estoque; desligue apenas se controlar o estoque por fora do ERP.",
          "Use Prazo de envio = Usar prazo do marketplace para alinhar alertas e priorizacao com o SLA do canal."
        ],
        "faq": [
          {
            "q": "Preciso clicar em salvar?",
            "a": "Nao. Toda mudanca grava automaticamente e aparece a mensagem Configuracao salva no alto da tela."
          },
          {
            "q": "O que faz o Pedido buffering?",
            "a": "Mantem pedidos ainda em sincronizacao fora da fila de revisao ate o processo terminar, evitando trabalhar com dados incompletos."
          },
          {
            "q": "Para que serve a Separacao por ondas?",
            "a": "Agrupa pedidos para separacao por lote, marketplace, tipo de envio ou prioridade, agilizando a expedicao."
          }
        ]
      },
      {
        "id": "settings-nfe",
        "title": "NF-e Automatica (configuracoes do pedido)",
        "path": "Configuracoes > Pedidos > NF-e Automatica",
        "summary": "Tela de pedidos voltada a emissao automatica de notas: liga a NF-e automatica, define a faixa de emissao e a classe fiscal de amostra/bonificacao. Os ajustes sao salvos ao serem alterados.",
        "steps": [
          "1. Abra Configuracoes e, na coluna Pedidos, clique em NF-e Automatica.",
          "2. No cartao Configuracoes NF-e, ative o toggle NF-e automatica para emitir a nota fiscal automaticamente quando o pedido chegar.",
          "3. No campo Faixa de emissao escolha Manual, Todos os pedidos ou Por marketplace, conforme o alcance desejado.",
          "4. No campo Amostra gratis / bonificacao digite a Classe fiscal usada para amostras e sorteios.",
          "5. Confirme cada mudanca pela mensagem Configuracao salva no topo da tela.",
          "6. Para configurar de fato o provedor, certificado e tokens da NF-e, va depois a area fiscal (Brasil NF-e) descrita no topico Emissao fiscal Brasil."
        ],
        "tips": [
          "Esta tela apenas define regras de pedido; a emissao real depende do provedor configurado em Brasil NF-e.",
          "So ligue NF-e automatica depois de validar a emissao em homologacao na tela fiscal.",
          "Preencha a Classe fiscal de amostra somente se realmente envia amostras/bonificacoes, para nao tributar errado pedidos normais."
        ],
        "faq": [
          {
            "q": "Ativei a NF-e automatica e nada e emitido. Por que?",
            "a": "E preciso ter o provedor Focus NFe configurado, token salvo e checklist completo na tela Brasil NF-e. Sem isso a SEFAZ nao autoriza."
          },
          {
            "q": "Qual a diferenca entre Todos os pedidos e Por marketplace?",
            "a": "Todos os pedidos emite para qualquer canal; Por marketplace limita a emissao automatica aos canais que voce definir."
          },
          {
            "q": "Onde coloco o token e o certificado?",
            "a": "Nao e aqui. Use a tela fiscal Brasil NF-e, no cartao Provedor fiscal."
          }
        ]
      },
      {
        "id": "settings-auto-program",
        "title": "Auto-Programar",
        "path": "Configuracoes > Pedidos > Auto-Programar",
        "summary": "Tela de regras de pedido para automatizar a programacao da expedicao. Apresenta os mesmos cartoes de Configuracoes padroes (marcacao, prazo, separacao, deducao, NF-e e separacao por ondas), salvos automaticamente.",
        "steps": [
          "1. Abra Configuracoes e, na coluna Pedidos, clique em Auto-Programar.",
          "2. No cartao Configuracoes padroes, ajuste os toggles Etiqueta marcar como impresso automaticamente e Lista de separacao marcar como impresso automaticamente para automatizar a marcacao.",
          "3. Defina o Prazo de envio (Manual, Usar prazo do marketplace ou Priorizar mesmo dia) para orientar a priorizacao automatica.",
          "4. Use os toggles Lista de separacao e Deducao de estoque conforme o fluxo que quer automatizar.",
          "5. No cartao Configuracoes do Pedido, escolha a Separacao por ondas (Separador padrao, Por marketplace, Por envio ou Por prioridade).",
          "6. Ative Pedido buffering se quiser segurar pedidos em sincronizacao antes de program-los.",
          "7. Acompanhe a mensagem Configuracao salva para confirmar que cada ajuste foi gravado."
        ],
        "tips": [
          "Combine Prazo de envio = Priorizar mesmo dia com Separacao por ondas = Por prioridade para automatizar a fila de pedidos urgentes.",
          "As escolhas sao compartilhadas com Configuracoes padroes de Pedidos; mudar aqui reflete la.",
          "Ligue a marcacao automatica de impressao apenas se confia que toda etiqueta impressa sera realmente expedida."
        ],
        "faq": [
          {
            "q": "Auto-Programar tem opcoes diferentes de Configuracoes padroes?",
            "a": "Os cartoes exibidos sao os mesmos; o foco aqui e usar essas regras para automatizar a programacao da expedicao."
          },
          {
            "q": "As mudancas valem para pedidos antigos?",
            "a": "As regras passam a valer para o fluxo a partir de quando sao ativadas; pedidos ja processados nao sao reprocessados automaticamente."
          },
          {
            "q": "Como reverter uma automacao?",
            "a": "Basta desligar o toggle correspondente; a alteracao e salva na hora."
          }
        ]
      },
      {
        "id": "settings-allocation",
        "title": "Regras de Alocacao",
        "path": "Configuracoes > Pedidos > Regras de Alocacao",
        "summary": "Define regras de prioridade para atribuir pedidos automaticamente aos armazens. Se nenhum pedido casar com uma regra, ele vai para o armazem padrao.",
        "steps": [
          "1. Abra Configuracoes e, na coluna Pedidos, clique em Regras de Alocacao.",
          "2. Leia o aviso no topo: pedidos sao atribuidos por prioridade das regras e, sem correspondencia, vao para o armazem padrao.",
          "3. Use a barra de ferramentas para localizar regras: escolha o criterio (Nome da Regra, Marketplace ou Armazem) e digite em Pesquisar regras.",
          "4. Filtre pela situacao no menu de status: Todos Status, Ativo ou Inativo.",
          "5. Clique em + Criar Regras para cadastrar uma nova regra de alocacao.",
          "6. Acompanhe as regras na tabela pelas colunas Status, Prioridade, Nome da Regra, Condicoes, Especificar Armazem e Criado/Atualizado, usando a coluna Acoes para gerenciar cada uma.",
          "7. Enquanto nao houver regras, a tabela mostra Nenhum Dado Disponivel."
        ],
        "tips": [
          "A ordem de Prioridade importa: a primeira regra que casar com o pedido vence, entao posicione as mais especificas no topo.",
          "Garanta que exista um armazem padrao definido, pois ele recebe tudo que nao casa com nenhuma regra.",
          "Use o filtro de status Ativo para revisar rapidamente apenas as regras em vigor."
        ],
        "faq": [
          {
            "q": "O que acontece se o pedido nao bater com nenhuma regra?",
            "a": "Ele e atribuido automaticamente ao armazem padrao."
          },
          {
            "q": "Posso ter varias regras?",
            "a": "Sim. Elas sao aplicadas por prioridade; a primeira correspondencia define o armazem."
          },
          {
            "q": "Como crio a primeira regra?",
            "a": "Clique em + Criar Regras na barra de ferramentas e defina nome, condicoes e o armazem de destino."
          }
        ]
      },
      {
        "id": "settings-shopee-labels",
        "title": "Etiquetas e envio Shopee",
        "path": "Configuracoes > Logisticas e Etiquetas > Shopee",
        "summary": "Configura tipo de etiqueta, tamanho, opcao de entrega, horario de coleta e ativacao para cada metodo de envio da Shopee Brasil. Toda mudanca e salva automaticamente.",
        "steps": [
          "1. Abra Configuracoes e, na coluna Logisticas e Etiquetas, clique em Shopee.",
          "2. Na barra superior mantenha o pais Brasil e, se precisar, use Pesquisar Metodos de Envio para localizar um metodo (ex.: Shopee Xpress, Correios, Retirada na Agencia).",
          "3. Para cada metodo na tabela, escolha em Tipo de Etiqueta entre Etiqueta de Envio Padrao, Etiqueta de Envio Personalizada, Etiqueta Padrao Marketplace, Etiqueta Padrao Shopee ou A4 com declaracao.",
          "4. Defina o Tamanho (10 x 15, A4 ou 10 x 10) e observe os selos DDC/NFe quando aparecerem.",
          "5. Em Opcao de Entrega selecione Entregar na Agencia ou Retirada; em Horarios de Coleta escolha Manha, Tarde ou Integral quando disponivel.",
          "6. Use o toggle da coluna Filtro de Envio para deixar o metodo Ativo para pedidos ou Pausado.",
          "7. Clique em Configuracao de Etiqueta para abrir o painel do modelo de impressao e, ao terminar, clique em Salvar modelo.",
          "8. Confirme cada ajuste pela mensagem Configuracao de envio salva."
        ],
        "tips": [
          "Para impressora termica padrao, use Tamanho 10 x 15; reserve A4 para metodos com declaracao.",
          "Pausar um metodo (toggle desligado) faz com que ele apareca como Pausado e nao seja usado para novos pedidos.",
          "O painel Configuracao de Etiqueta esta preparado para margens e formato; por ora ele apenas registra que o modelo foi preparado."
        ],
        "faq": [
          {
            "q": "Onde ligo ou desligo um metodo de envio?",
            "a": "Na coluna Filtro de Envio, pelo botao de chave (toggle). Ligado mostra Ativo para pedidos; desligado mostra Pausado."
          },
          {
            "q": "Por que alguns metodos nao deixam mudar o tamanho ou a entrega?",
            "a": "Metodos com formato/entrega fixos exibem - nessas colunas porque o marketplace nao permite alterar."
          },
          {
            "q": "O que significam os selos DDC e NFe?",
            "a": "Indicam que o metodo exige Declaracao de Conteudo (DDC) ou nota fiscal (NFe) para a etiqueta."
          }
        ]
      },
      {
        "id": "settings-shein-labels",
        "title": "Etiquetas e envio Shein",
        "path": "Configuracoes > Logisticas e Etiquetas > Shein",
        "summary": "Configura etiquetas e filtros dos metodos de envio da Shein Brasil (Shein logistics, IMB e PGK). Os ajustes sao salvos automaticamente.",
        "steps": [
          "1. Abra Configuracoes e, na coluna Logisticas e Etiquetas, clique em Shein.",
          "2. Mantenha o pais Brasil e use Pesquisar Metodos de Envio para encontrar Shein logistics, IMB ou PGK.",
          "3. Ajuste o Tipo de Etiqueta de cada metodo no menu (ex.: Etiqueta de Envio Personalizada ou Etiqueta de Envio Padrao).",
          "4. Quando o metodo permitir, defina o Tamanho (10 x 15, A4 ou 10 x 10); metodos como PGK aparecem com tamanho fixo (-).",
          "5. Observe os selos DDC e NFe (o IMB, por exemplo, exige NFe) e o estado Ativo para pedidos ou Pausado.",
          "6. Use o toggle de Filtro de Envio para ativar ou pausar o metodo.",
          "7. Clique em Configuracao de Etiqueta para abrir o painel do modelo e depois em Salvar modelo.",
          "8. Confirme pela mensagem Configuracao de envio salva."
        ],
        "tips": [
          "Os metodos da Shein costumam ter entrega e horario fixos (mostram -); concentre-se em tipo e tamanho da etiqueta.",
          "O metodo IMB sinaliza NFe: garanta que sua emissao fiscal esteja configurada para esses envios.",
          "PGK usa Etiqueta de Envio Padrao com tamanho fixo, entao nao tente alterar o formato dela."
        ],
        "faq": [
          {
            "q": "Por que nao consigo trocar o tamanho do PGK?",
            "a": "O PGK tem tamanho fixo definido pela Shein, por isso a coluna exibe - em vez de um menu."
          },
          {
            "q": "O selo NFe no IMB significa o que?",
            "a": "Que esse metodo exige nota fiscal vinculada a etiqueta de envio."
          },
          {
            "q": "As mudancas valem so para a Shein?",
            "a": "Sim. Cada marketplace tem sua propria lista de metodos e configuracoes salvas separadamente."
          }
        ]
      },
      {
        "id": "settings-tiktok-labels",
        "title": "Etiquetas e envio TikTok Shop",
        "path": "Configuracoes > Logisticas e Etiquetas > TikTok Shop",
        "summary": "Controla filtros, etiqueta padrao e etiqueta personalizada dos metodos do TikTok Shop Brasil (TikTok Shop logistics, iMile BR e J&T Express Brazil), com salvamento automatico.",
        "steps": [
          "1. Abra Configuracoes e, na coluna Logisticas e Etiquetas, clique em TikTok Shop.",
          "2. Mantenha o pais Brasil e use Pesquisar Metodos de Envio para localizar o metodo desejado.",
          "3. Defina o Tipo de Etiqueta de cada metodo (Etiqueta de Envio Padrao ou Etiqueta de Envio Personalizada, entre outras opcoes do menu).",
          "4. Ajuste o Tamanho (10 x 15) nos metodos personalizados; o TikTok Shop logistics usa etiqueta padrao com tamanho fixo (-).",
          "5. Verifique os selos DDC (iMile BR e J&T sinalizam DDC) e o estado Ativo para pedidos ou Pausado.",
          "6. Use o toggle de Filtro de Envio para ativar ou pausar o metodo.",
          "7. Clique em Configuracao de Etiqueta para abrir o painel do modelo e em Salvar modelo para registrar.",
          "8. Confirme pela mensagem Configuracao de envio salva."
        ],
        "tips": [
          "Metodos com DDC (iMile, J&T) exigem Declaracao de Conteudo; mantenha esse documento previsto na operacao.",
          "Entrega e horario costumam ser fixos no TikTok Shop (mostram -); foque em tipo e tamanho de etiqueta.",
          "Pause metodos que voce nao usa para evitar selecao indevida em novos pedidos."
        ],
        "faq": [
          {
            "q": "Qual etiqueta usar no TikTok Shop logistics?",
            "a": "Ele vem como Etiqueta de Envio Padrao com tamanho fixo, definido pelo marketplace."
          },
          {
            "q": "O que e o selo DDC?",
            "a": "Indica que o metodo precisa de Declaracao de Conteudo na etiqueta de envio."
          },
          {
            "q": "Como pausar um metodo temporariamente?",
            "a": "Desligue o toggle da coluna Filtro de Envio; ele passa a aparecer como Pausado."
          }
        ]
      },
      {
        "id": "settings-3pl",
        "title": "Logistica suportada por 3PL",
        "path": "Configuracoes > Logisticas e Etiquetas > Logistica suportada por 3PL",
        "summary": "Define transportadora, etiqueta e filtro para operadores logisticos externos (3PL). O metodo vem desativado por padrao e os ajustes sao salvos automaticamente.",
        "steps": [
          "1. Abra Configuracoes e, na coluna Logisticas e Etiquetas, clique em Logistica suportada por 3PL.",
          "2. Mantenha o pais Brasil; localize o metodo Operador logistico na tabela (ele vem Pausado por padrao).",
          "3. Escolha o Tipo de Etiqueta no menu (por padrao Etiqueta de Envio Personalizada) e o Tamanho (10 x 15).",
          "4. Em Opcao de Entrega selecione Entregar na Agencia ou Retirada conforme a regra do operador.",
          "5. Defina o Horario de Coleta (Manha, Tarde ou Integral) quando aplicavel.",
          "6. Ligue o toggle da coluna Filtro de Envio para ativar o operador logistico para pedidos.",
          "7. Clique em Configuracao de Etiqueta e depois em Salvar modelo para preparar o modelo de impressao.",
          "8. Confirme pela mensagem Configuracao de envio salva."
        ],
        "tips": [
          "Como o metodo 3PL chega desativado, lembre-se de ligar o toggle de Filtro de Envio antes de esperar uso em pedidos.",
          "Alinhe a Opcao de Entrega (agencia x retirada) com o contrato do seu operador logistico.",
          "Use Configuracao de Etiqueta para padronizar o modelo de impressao do 3PL com o restante da operacao."
        ],
        "faq": [
          {
            "q": "Por que o metodo 3PL aparece como Pausado?",
            "a": "Ele vem desativado de fabrica. Ligue o toggle de Filtro de Envio para comecar a usa-lo."
          },
          {
            "q": "Posso usar etiqueta A4?",
            "a": "Sim, escolha o tamanho desejado no menu de Tamanho; o padrao sugerido e 10 x 15."
          },
          {
            "q": "Essas configuracoes afetam os marketplaces?",
            "a": "Nao. Sao especificas da logistica 3PL e ficam salvas separadamente."
          }
        ]
      },
      {
        "id": "settings-print-model",
        "title": "Modelo de Impressao",
        "path": "Configuracoes > Logisticas e Etiquetas > Modelo de Impressao",
        "summary": "Configura a Lista de Separacao (predefinida ou personalizada, formato e itens a incluir) e os modelos de Romaneio.",
        "steps": [
          "1. Abra Configuracoes e, na coluna Logisticas e Etiquetas, clique em Modelo de Impressao.",
          "2. No cartao Configuracoes de Lista de Separacao, escolha entre Predefinir e Personalizado na linha Lista de Separacao.",
          "3. No campo Formato selecione Padrao, Compacto ou Com conferente.",
          "4. Em Configuracao, marque as caixas que deseja incluir: Adicionar Numero de Rastreio, Adicionar Notas do Cliente, Adicionar SKU do Armazem e Adicionar Observacoes.",
          "5. Acompanhe o resultado na previa Lista de Separacao exibida ao lado.",
          "6. No cartao Configuracoes de Romaneio, use Editar ou Mais para gerenciar o Standard Template.",
          "7. Clique em + Adicionar Modelo para criar um novo modelo de romaneio."
        ],
        "tips": [
          "Marque Adicionar SKU do Armazem para facilitar a conferencia na separacao por quem nao conhece os SKUs do marketplace.",
          "O formato Com conferente ajuda quando ha dupla checagem antes da expedicao.",
          "Mantenha um modelo de romaneio padrao e crie variacoes apenas quando realmente necessario, para nao confundir a equipe."
        ],
        "faq": [
          {
            "q": "Qual a diferenca entre Predefinir e Personalizado?",
            "a": "Predefinir usa o modelo padrao do sistema; Personalizado permite montar a lista conforme suas opcoes de formato e itens."
          },
          {
            "q": "Como incluo o rastreio na lista de separacao?",
            "a": "Marque a caixa Adicionar Numero de Rastreio na secao Configuracao."
          },
          {
            "q": "Posso ter mais de um modelo de romaneio?",
            "a": "Sim, clique em + Adicionar Modelo na tabela de Configuracoes de Romaneio."
          }
        ]
      },
      {
        "id": "settings-sku-label",
        "title": "Etiqueta do SKU",
        "path": "Configuracoes > Logisticas e Etiquetas > Etiqueta do SKU",
        "summary": "Gerencia os modelos de etiqueta de SKU, incluindo a versao para Mercado Full, com tamanho e modelo padrao.",
        "steps": [
          "1. Abra Configuracoes e, na coluna Logisticas e Etiquetas, clique em Etiqueta do SKU.",
          "2. Alterne entre as abas Etiqueta do SKU e Etiqueta do SKU(Mercado Full) conforme o destino da etiqueta.",
          "3. Consulte a tabela com Nome do Modelo, Tamanho da Etiqueta (Largura x Altura), Modelo Padrao e Data de Criacao.",
          "4. Para criar um modelo novo, clique em + Criar Modelo.",
          "5. Para reaproveitar um modelo existente (ex.: Standard Template, 50mm x 30mm), clique em Duplicar.",
          "6. Use o botao Mais na coluna Acoes para demais opcoes do modelo."
        ],
        "tips": [
          "Duplicar o Standard Template e a forma mais rapida de comecar um modelo proprio sem partir do zero.",
          "Confira sempre o Tamanho da Etiqueta (Largura x Altura) para casar com o rolo da sua impressora termica.",
          "Use a aba Mercado Full somente para etiquetas destinadas ao fulfillment do Mercado Livre."
        ],
        "faq": [
          {
            "q": "Qual o tamanho padrao da etiqueta de SKU?",
            "a": "O modelo Standard Template ja vem em 50mm x 30mm."
          },
          {
            "q": "Como crio uma etiqueta para o Mercado Full?",
            "a": "Selecione a aba Etiqueta do SKU(Mercado Full) e use + Criar Modelo ou Duplicar."
          },
          {
            "q": "Posso editar o Predefinido?",
            "a": "O recomendado e Duplicar o modelo predefinido e ajustar a copia, preservando o original."
          }
        ]
      },
      {
        "id": "settings-shelf-label",
        "title": "Etiqueta de Estante",
        "path": "Configuracoes > Logisticas e Etiquetas > Etiqueta de Estante",
        "summary": "Gerencia modelos de etiqueta de estante (organizacao fisica do armazem), com tamanho e modelo padrao, na mesma tela das etiquetas de SKU.",
        "steps": [
          "1. Abra Configuracoes e, na coluna Logisticas e Etiquetas, clique em Etiqueta de Estante.",
          "2. Use as abas no topo para alternar entre os tipos de etiqueta disponiveis (Etiqueta do SKU e a versao Mercado Full).",
          "3. Consulte a tabela com Nome do Modelo, Tamanho da Etiqueta (Largura x Altura), Modelo Padrao e Data de Criacao.",
          "4. Clique em + Criar Modelo para um novo layout de etiqueta de estante.",
          "5. Use Duplicar para copiar um modelo existente como ponto de partida.",
          "6. Acesse o botao Mais para as demais acoes do modelo."
        ],
        "tips": [
          "Padronize o tamanho das etiquetas de estante para que todas as posicoes do armazem fiquem legiveis a distancia.",
          "Duplique um modelo aprovado em vez de recriar, mantendo consistencia visual no estoque.",
          "Defina um Modelo Padrao para que novas impressoes ja saiam no layout correto."
        ],
        "faq": [
          {
            "q": "Etiqueta de Estante e a mesma coisa que Etiqueta do SKU?",
            "a": "Compartilham a mesma tela e estrutura de modelos, mas a de estante e voltada a organizacao fisica das posicoes do armazem."
          },
          {
            "q": "Como comeco um modelo novo?",
            "a": "Clique em + Criar Modelo no topo da tabela ou Duplicar um modelo ja existente."
          },
          {
            "q": "Onde vejo o tamanho da etiqueta?",
            "a": "Na coluna Tamanho da Etiqueta (Largura x Altura) da tabela."
          }
        ]
      },
      {
        "id": "settings-stock",
        "title": "Configuracoes de Estoque",
        "path": "Configuracoes > Sistema > Estoque",
        "summary": "Controla quando o estoque e deduzido (por status do pedido), as regras de mapeamento de SKU e a sincronizacao automatica de estoque com os marketplaces.",
        "steps": [
          "1. Abra Configuracoes e, na coluna Sistema, clique em Estoque.",
          "2. No cartao Configuracoes padroes, em Deducao de Estoque, ligue o toggle do status a partir do qual o estoque sera ocupado: Para Emitir / Para Enviar ou Nao Pago / Pendente.",
          "3. Ative o terceiro toggle se quiser Somente mapear o SKU do armazem sem descontar estoque ao enviar o produto ao marketplace.",
          "4. Em Regras de mapeamento de SKU, ligue Auto Mapear o SKU do Armazem e clique em Configuracoes para ajustar as regras de mapeamento.",
          "5. No cartao Configuracoes de Sincronizacao de Estoque, use Ajuda de Sincronizacao de Estoque para orientacoes e Registros de Sincronizacao de Estoque para auditar o historico.",
          "6. Ligue o toggle Sincronizacao de Estoque para atualizar automaticamente o estoque do NEXT ERP para o marketplace conectado.",
          "7. Revise as opcoes selecionadas antes de operar com vendas reais."
        ],
        "tips": [
          "Evite ligar ao mesmo tempo a deducao em Para Emitir/Para Enviar e em Nao Pago/Pendente sem entender o impacto, para nao deduzir estoque cedo demais.",
          "A sincronizacao automatica empurra seu estoque para os canais; confira o mapeamento de SKU antes de ativar para nao publicar quantidades erradas.",
          "Use Registros de Sincronizacao de Estoque para investigar divergencias de quantidade entre ERP e marketplace."
        ],
        "faq": [
          {
            "q": "A partir de qual status o estoque e deduzido?",
            "a": "Voce escolhe: pelo status Para Emitir / Para Enviar ou ja em Nao Pago / Pendente, ligando o toggle correspondente."
          },
          {
            "q": "O que faz o Auto Mapear o SKU do Armazem?",
            "a": "Mapeia automaticamente os SKUs de novos pedidos nao mapeados com base nas regras configuradas em Configuracoes."
          },
          {
            "q": "Como o estoque vai para o marketplace?",
            "a": "Ligando a Sincronizacao de Estoque, que atualiza o saldo do ERP para o canal conectado."
          }
        ]
      },
      {
        "id": "settings-finance",
        "title": "Configuracoes Financeiras",
        "path": "Configuracoes > Sistema > Financeiro",
        "summary": "Define como o custo do produto e calculado para o lucro (custo medio ou preco de compra), conta de taxas e ajustes financeiros VIP, como contas e tipos de receita/despesa.",
        "steps": [
          "1. Abra Configuracoes e, na coluna Sistema, clique em Financeiro.",
          "2. No cartao Configuracao de Lucro, leia o aviso: a mudanca do valor de custo so vale para novos pedidos; para pedidos antigos use o botao Recalcule.",
          "3. Em Selecao do valor de custo do produto, escolha uma das opcoes: priorizar o custo medio do inventario (caindo para o preco de compra quando o custo medio for 0) ou usar sempre o preco de compra do produto.",
          "4. Em Conta de Taxas, clique em Configuracoes para definir a conta usada nas taxas.",
          "5. No cartao Configuracao de Financeiro (VIP), use Gerenciamento de contas em Conta financeira para administrar as contas.",
          "6. Em Tipo de receita/despesa financeira, clique em Configuracoes para classificar receitas e despesas.",
          "7. Se mudou o criterio de custo e precisa atualizar o passado, clique em Recalcule."
        ],
        "tips": [
          "Mudou o criterio de custo e quer refletir nos pedidos antigos? Use Recalcule, pois a mudanca so afeta novos pedidos por padrao.",
          "Quando o custo medio do inventario for 0, o sistema usa o preco de compra; mantenha os precos de compra atualizados.",
          "Os recursos marcados como VIP exigem plano compativel; verifique sua assinatura se nao conseguir acessa-los."
        ],
        "faq": [
          {
            "q": "Por que o lucro nao mudou nos pedidos antigos?",
            "a": "A nova selecao de custo so se aplica a novos pedidos. Clique em Recalcule para reaplicar aos anteriores."
          },
          {
            "q": "Qual criterio de custo escolher?",
            "a": "Custo medio do inventario reflete melhor o estoque real; preco de compra e mais simples e direto. Escolha conforme sua contabilidade."
          },
          {
            "q": "O que e a Configuracao de Financeiro VIP?",
            "a": "Sao recursos avancados (gestao de contas e tipos de receita/despesa) disponiveis em planos VIP."
          }
        ]
      },
      {
        "id": "settings-permissions",
        "title": "Subconta / Permissoes",
        "path": "Configuracoes > Permissoes > Subconta",
        "summary": "Cria e gerencia subcontas de usuarios com permissoes de loja, respeitando o limite de subcontas do plano.",
        "steps": [
          "1. Abra Configuracoes e, na coluna Permissoes, clique em Subconta.",
          "2. Para localizar usuarios, escolha o criterio (Nome Completo, Email ou Telefone) e digite em Pesquisar subcontas.",
          "3. Observe o contador Subconta: 0/5 para saber quantas subcontas ainda pode criar.",
          "4. Clique em + Adicionar Subconta para cadastrar um novo usuario.",
          "5. Acompanhe os usuarios na tabela pelas colunas Email, Nome Completo, Telefone, Permissoes de loja, Estado, Data de Criacao e Ultimo Horario do Login.",
          "6. Use a coluna Acoes para editar permissoes ou gerenciar cada subconta.",
          "7. Enquanto nao houver usuarios, a tabela exibe Nenhum Dado Disponivel."
        ],
        "tips": [
          "Conceda apenas as Permissoes de loja necessarias a cada subconta, seguindo o principio do menor privilegio.",
          "Fique de olho no contador (ex.: 0/5): ao atingir o limite do plano voce nao consegue criar novas subcontas.",
          "Use a coluna Ultimo Horario do Login para identificar contas inativas que podem ser desativadas."
        ],
        "faq": [
          {
            "q": "Quantas subcontas posso criar?",
            "a": "Depende do plano; o contador Subconta: X/Y no topo mostra o uso e o limite atual."
          },
          {
            "q": "Como adiciono um colaborador?",
            "a": "Clique em + Adicionar Subconta e preencha os dados; depois defina as Permissoes de loja."
          },
          {
            "q": "Posso limitar o acesso por loja?",
            "a": "Sim. Cada subconta tem Permissoes de loja proprias, controladas na coluna Acoes."
          }
        ]
      },
      {
        "id": "settings-accountant",
        "title": "Configuracoes do Contador",
        "path": "Configuracoes > Permissoes > Configuracoes do Contador",
        "summary": "Cadastra e gerencia o acesso de contadores, vinculando empresas e definindo permissoes especificas para o profissional contabil.",
        "steps": [
          "1. Abra Configuracoes e, na coluna Permissoes, clique em Configuracoes do Contador.",
          "2. Para buscar, escolha o criterio (Nome do Contador ou Email) e digite em Pesquisar contador.",
          "3. Clique em + Adicionar Contador para conceder acesso a um novo profissional.",
          "4. Acompanhe os registros na tabela pelas colunas Email, Nome do Contador, Empresas Vinculadas, Permissoes e Estado.",
          "5. Use a coluna Acoes para editar vinculos de empresa e permissoes ou remover o contador.",
          "6. Sem cadastros, a tabela mostra Nenhum Dado Disponivel."
        ],
        "tips": [
          "Vincule ao contador apenas as Empresas Vinculadas que ele realmente atende, evitando exposicao de dados.",
          "Revise as Permissoes do contador periodicamente, principalmente ao trocar de escritorio contabil.",
          "Desative ou remova contadores que nao prestam mais servico para manter o acesso seguro."
        ],
        "faq": [
          {
            "q": "Qual a diferenca entre Contador e Subconta?",
            "a": "A Subconta e para colaboradores da operacao; o Contador tem area propria, com empresas vinculadas e permissoes voltadas a contabilidade."
          },
          {
            "q": "Como dou acesso ao meu contador?",
            "a": "Clique em + Adicionar Contador, informe email e nome, e defina as empresas e permissoes."
          },
          {
            "q": "Posso vincular varias empresas a um contador?",
            "a": "Sim. A coluna Empresas Vinculadas mostra todas as empresas atribuidas a ele."
          }
        ]
      },
      {
        "id": "settings-activity-log",
        "title": "Registros de Atividades",
        "path": "Configuracoes > Permissoes > Registros de Atividades",
        "summary": "Audita as acoes feitas na conta, mostrando usuario, modulo, acao, IP e data, com busca por criterio.",
        "steps": [
          "1. Abra Configuracoes e, na coluna Permissoes, clique em Registros de Atividades.",
          "2. Escolha o criterio de busca no menu: Usuario, Modulo ou Acao.",
          "3. Digite o termo em Pesquisar registros de atividades para filtrar.",
          "4. Analise os resultados na tabela pelas colunas Usuario, Modulo, Acao, IP e Data.",
          "5. Use o IP e a Data para investigar acessos suspeitos ou confirmar quem fez determinada alteracao.",
          "6. Quando nao houver eventos no filtro, a tabela exibe Nenhum Dado Disponivel."
        ],
        "tips": [
          "Filtre por Usuario para auditar rapidamente o que uma subconta especifica andou fazendo.",
          "Use a coluna IP para identificar acessos de locais incomuns e reforcar a seguranca.",
          "Combine o filtro por Modulo com a Data para reconstruir o historico de uma mudanca especifica."
        ],
        "faq": [
          {
            "q": "O que aparece nos registros?",
            "a": "Cada acao relevante com Usuario, Modulo, Acao, IP e Data de quando ocorreu."
          },
          {
            "q": "Como descubro quem alterou uma configuracao?",
            "a": "Filtre por Modulo ou Acao e confira a coluna Usuario na linha correspondente."
          },
          {
            "q": "A lista esta vazia. E normal?",
            "a": "Sim, se nao houver atividades que casem com o filtro atual aparece Nenhum Dado Disponivel."
          }
        ]
      },
      {
        "id": "settings-dce",
        "title": "DC-e Brasil (Contas Fiscais)",
        "path": "Configuracoes > Notas Fiscais > DC-e Brasil",
        "summary": "Gerencia as contas fiscais (contas NF-e) usadas para emissao, respeitando o limite de empresas do plano.",
        "steps": [
          "1. Abra Configuracoes e, na coluna Notas Fiscais, clique em DC-e Brasil.",
          "2. Para buscar contas, escolha o criterio (Contas NF-e, Razao Social ou CNPJ) e digite em Pesquisar contas fiscais.",
          "3. Observe o contador Quantidade de Empresas: 0/3 para saber quantas contas ainda pode adicionar.",
          "4. Clique em Adicionar uma Conta (na barra de ferramentas ou no centro da tela vazia) para cadastrar uma conta fiscal.",
          "5. Gerencie as contas cadastradas e seus dados fiscais conforme aparecem na listagem.",
          "6. Sem contas, a tela mostra Sem dados com o botao Adicionar uma Conta em destaque."
        ],
        "tips": [
          "Acompanhe o contador Quantidade de Empresas (ex.: 0/3): ao atingir o limite do plano nao sera possivel adicionar novas contas.",
          "Cadastre cada CNPJ que emite nota como uma conta fiscal separada para manter a organizacao por empresa.",
          "Confirme Razao Social e CNPJ ao adicionar para evitar emissao vinculada a empresa errada."
        ],
        "faq": [
          {
            "q": "Quantas empresas posso cadastrar?",
            "a": "Conforme o plano; o contador Quantidade de Empresas mostra o uso e o limite (ex.: 0/3)."
          },
          {
            "q": "Como adiciono uma conta fiscal?",
            "a": "Clique em Adicionar uma Conta, disponivel tanto na barra de ferramentas quanto na area central quando nao ha dados."
          },
          {
            "q": "DC-e Brasil e onde configuro o certificado da NF-e?",
            "a": "Aqui voce gerencia as contas fiscais; a configuracao de token, certificado e emissao fica na tela Brasil NF-e."
          }
        ]
      },
      {
        "id": "settings-fiscal-nfe",
        "title": "Emissao fiscal Brasil (NF-e/NFC-e)",
        "path": "Configuracoes > Notas Fiscais > Brasil NF-e",
        "summary": "Configura o provedor Focus NFe (ambiente, token, dados da empresa), valida o checklist de prontidao, emite NF-e/NFC-e via JSON e acompanha status, DANFE, XML e cancelamentos.",
        "steps": [
          "1. Acesse a tela fiscal Brasil NF-e a partir de Configuracoes > Notas Fiscais.",
          "2. No cartao Checklist Focus NFe, marque os itens prontos: Emitente cadastrado na Focus, NF-e habilitada, Certificado A1 anexado, tokens de homologacao/producao e, para NFC-e, CSC e ID Token. O selo indica Pronto para testar NF-e ou Configuracao incompleta.",
          "3. No cartao Provedor fiscal, selecione o Provedor (Focus NFe), o Ambiente (Homologacao ou Producao), confira a URL API e cole o Token Focus NFe.",
          "4. Preencha Razao social, CNPJ, Inscricao estadual, Regime tributario (Simples Nacional, Simples excesso sublimite ou Regime normal) e Serie NF-e; ligue Emitir automaticamente quando houver pedido integrado se desejar, e clique em Salvar fiscal.",
          "5. No cartao Emitir nota, escolha o Tipo (NF-e ou NFC-e), informe a Referencia, use Modelo vazio ou Modelo com empresa para preencher o JSON e clique em Enviar para SEFAZ (disponivel apenas com o checklist completo).",
          "6. No cartao Notas fiscais, clique em Atualizar lista; em cada nota use Abrir para ver detalhes e Consultar para atualizar o status na SEFAZ.",
          "7. Nos detalhes da nota, use Abrir DANFE e Baixar XML; para cancelar, preencha a Justificativa de cancelamento (minimo 15 caracteres) e clique em Cancelar nota."
        ],
        "tips": [
          "Sempre valide a emissao em Homologacao antes de mudar o Ambiente para Producao.",
          "O botao Enviar para SEFAZ so fica habilitado quando o checklist (emitente, NF-e habilitada, certificado e token) esta completo.",
          "A justificativa de cancelamento exige no minimo 15 caracteres; escreva um motivo claro e valido perante a SEFAZ."
        ],
        "faq": [
          {
            "q": "Por que nao consigo enviar a nota?",
            "a": "O botao Enviar para SEFAZ exige o checklist completo (emitente, NF-e habilitada, certificado A1 e token configurado). Complete-o no cartao Checklist Focus NFe."
          },
          {
            "q": "O JSON esta invalido, e agora?",
            "a": "Use os botoes Modelo vazio ou Modelo com empresa para gerar um JSON valido e ajuste os dados antes de enviar."
          },
          {
            "q": "Onde baixo a DANFE e o XML?",
            "a": "Abra a nota na lista e use os links Abrir DANFE e Baixar XML nos detalhes."
          },
          {
            "q": "Como cancelo uma nota?",
            "a": "Abra a nota, preencha a Justificativa de cancelamento com pelo menos 15 caracteres e clique em Cancelar nota."
          }
        ]
      }
    ]
  },
  {
    "moduleKey": "conta",
    "moduleLabel": "Minha Conta e Planos",
    "icon": "👤",
    "intro": "Gerencie seus dados de perfil, seguranca de login, assinatura, servicos contratados, recompensas, historico de transacoes e o plano do NEXT ERP.",
    "topics": [
      {
        "id": "account-profile",
        "title": "Perfil",
        "path": "Menu da Conta > Perfil",
        "summary": "Tela onde voce visualiza e ajusta seus dados de contato (email, nome, telefone), confere idioma/regiao e liga ou desliga as notificacoes por e-mail.",
        "steps": [
          "1. Abra o menu da conta (clique no seu nome/avatar no canto da barra lateral) e escolha 'Perfil'. Voce cai na pagina 'Configuracoes da Conta', com 'Perfil' ja selecionado no menu lateral, dentro do grupo 'Minha Conta'.",
          "2. No cartao 'Perfil', confira as tres linhas: 'Email', 'Nome Completo' e 'Telefone'. Cada linha mostra o valor atual e um botao de acao.",
          "3. Para trocar o e-mail, clique em 'Mudar Email'. Para preencher ou corrigir seu nome, clique em 'Editar' na linha 'Nome Completo'. Para trocar o celular, clique em 'Mudar de Numero do Celular'.",
          "4. No cartao 'Idioma' logo abaixo, apenas confira as informacoes em modo leitura: 'Idioma de exibicao', 'Pais/Regiao', 'Moeda Padrao' e 'Fuso horario'. Para alterar esses valores, use a tela de Idioma do menu da conta.",
          "5. No cartao 'Notificacao', leia o aviso: ao ligar um aviso, a NEXT envia as atividades para o seu e-mail cadastrado (o endereco aparece entre parenteses no proprio texto).",
          "6. Na tabela 'Tipo de Notificacao', use o botao de liga/desliga (toggle) da coluna 'E-mail' para ativar cada aviso desejado: 'Novos pedidos da plataforma', 'Perguntas Mercado', 'Mensagens Pos Venda Mercado', 'Reclamacoes do Mercado', 'Opinioes do ML' e 'Opinioes da Shopee'.",
          "7. Cada toque no toggle salva sozinho: uma mensagem em destaque confirma 'Aviso ativado e enviado para...', 'Aviso ativado' ou 'Preferencias salvas'. Se aparecer 'Ativado, mas o e-mail falhou', verifique seu e-mail cadastrado."
        ],
        "tips": [
          "As notificacoes vao para o e-mail cadastrado na conta, nao para o app: mantenha esse endereco sempre correto antes de ligar os avisos.",
          "Os toggles de notificacao salvam automaticamente; voce nao precisa clicar em nenhum botao 'Salvar' depois de liga-los.",
          "Se a mensagem indicar falha no envio de e-mail, desligue e ligue o aviso novamente apos confirmar o endereco no cartao 'Perfil'."
        ],
        "faq": [
          {
            "q": "Onde altero meu e-mail de login?",
            "a": "No cartao 'Perfil', clique em 'Mudar Email' na linha 'Email' e siga as instrucoes na tela."
          },
          {
            "q": "Ativei um aviso mas nao recebi e-mail. O que houve?",
            "a": "Confira a mensagem de confirmacao: se disser 'o e-mail falhou', valide o endereco cadastrado no cartao 'Perfil' e ative o aviso de novo."
          },
          {
            "q": "Por que nao consigo mudar o idioma aqui?",
            "a": "No 'Perfil' o cartao 'Idioma' e so leitura. Para alterar idioma, moeda e fuso, use a tela de Idioma no menu da conta, com os campos 'Idioma de exibicao', 'Moeda padrao' e 'Fuso horario'."
          }
        ]
      },
      {
        "id": "account-security",
        "title": "Seguranca",
        "path": "Menu da Conta > Seguranca",
        "summary": "Centraliza a seguranca de acesso: login unico, autenticacao em dois fatores, dispositivos conectados, troca de senha e regras de alerta por comportamento suspeito.",
        "steps": [
          "1. Abra o menu da conta e escolha 'Seguranca'. No menu lateral 'Configuracoes da Conta', o item 'Seguranca' (grupo 'Minha Conta') fica destacado.",
          "2. No cartao 'Seguranca de Login', use o toggle 'Login Unico' para permitir apenas uma sessao ativa por vez (liga/desliga ao clicar).",
          "3. Na linha 'Autenticacao de Dois Fatores', clique em 'Adicionar Metodo de Verificacao' para reforcar o login com uma segunda etapa.",
          "4. Confira a linha 'Seu Dispositivo', que informa em quantos dispositivos voce fez login (ex.: '3 dispositivos voce fez login').",
          "5. Para trocar a senha, clique em 'Mudar Senha' na linha 'Senha'.",
          "6. No cartao 'Estrategia de Seguranca', leia o aviso: quando o sistema detectar os comportamentos listados, ele envia um alerta para o seu e-mail cadastrado antes de liberar a operacao.",
          "7. Em cada regra, ligue o toggle a esquerda para ativa-la, digite o valor/limite no campo de texto ao lado e clique fora do campo para salvar. Uma mensagem confirma 'Preferencias salvas'."
        ],
        "tips": [
          "Ative 'Login Unico' se voce nao quer sessoes simultaneas; isso ajuda a perceber acessos indevidos.",
          "As regras da 'Estrategia de Seguranca' so salvam o valor digitado quando voce sai do campo (ao clicar fora). Confira a mensagem de confirmacao.",
          "Use a 'Autenticacao de Dois Fatores' especialmente se mais de uma pessoa tem acesso a conta da loja."
        ],
        "faq": [
          {
            "q": "Como troco minha senha?",
            "a": "No cartao 'Seguranca de Login', clique em 'Mudar Senha' na linha 'Senha' e siga o fluxo."
          },
          {
            "q": "O que faz o 'Login Unico'?",
            "a": "Mantem apenas uma sessao ativa por vez. Ao liga-lo, novos logins desconectam as sessoes anteriores."
          },
          {
            "q": "Digitei o limite numa regra de seguranca, mas nada salvou. Por que?",
            "a": "O valor so e gravado quando voce clica fora do campo (evento de saida). Toque em outro ponto da tela e aguarde a mensagem 'Preferencias salvas'."
          }
        ]
      },
      {
        "id": "account-subscription",
        "title": "Minha Assinatura",
        "path": "Menu da Conta > Faturas > Minha Assinatura",
        "summary": "Mostra o resumo do seu plano ativo (NEXT ERP Pro), a periodicidade, o periodo de validade e o consumo atual de pedidos, lojas, subcontas, empresas e creditos.",
        "steps": [
          "1. Abra o menu da conta e escolha 'Faturas' (ou 'Minha Assinatura'). A tela abre com a aba 'Minha Assinatura' selecionada na barra de abas superior.",
          "2. No cartao de resumo, veja o plano 'NEXT ERP Pro', a 'Quantidade de Pedidos' (Ilimitado / Mes), a 'Periodicidade' (Mensal) e o 'Periodo Valido' (ex.: 12/06/2026 ~ 12/07/2026).",
          "3. Clique em 'Ver recursos' para conferir o que o plano inclui, ou no botao com o valor 'R$ 389,00 / mes' para detalhes de cobranca.",
          "4. No cartao 'Uso Atual', confira 'Pedidos Disponiveis' e a barra de progresso, alem do resumo 'Total de Pedidos ilimitado | Qtd. Pedidos Usados'.",
          "5. Na grade 'Uso Atual', acompanhe os medidores em anel de cada recurso: 'Lojas', 'Subconta', 'Empresas (CNPJ)', 'Conta de DC-e' e 'Saldo de Creditos', cada um com 'Usado' e 'Total'.",
          "6. Para alternar entre as visoes de cobranca, use a barra de abas: 'Minha Assinatura', 'Servico Assinado' e 'Resgate de Recompensa'."
        ],
        "tips": [
          "Acompanhe o medidor 'Lojas' e 'Empresas (CNPJ)': quando chegar perto do total, voce precisara de um plano/pacote maior para conectar mais.",
          "O 'Periodo Valido' indica ate quando a assinatura esta paga; renove antes dessa data para nao interromper as integracoes.",
          "Os pedidos sao ilimitados no plano, mas o painel exibe 'Qtd. Pedidos Usados' para voce acompanhar o volume da operacao."
        ],
        "faq": [
          {
            "q": "Qual e o meu plano e quanto custa?",
            "a": "O painel mostra 'NEXT ERP Pro' por 'R$ 389,00 / mes', com periodicidade mensal."
          },
          {
            "q": "Como sei quantas lojas ainda posso conectar?",
            "a": "No cartao 'Uso Atual', o medidor 'Lojas' mostra 'Usado' e 'Total' (ex.: 4 de 5)."
          },
          {
            "q": "Ate quando minha assinatura esta valida?",
            "a": "Veja o campo 'Periodo Valido' no cartao de resumo, que traz a data de inicio e de fim do ciclo atual."
          }
        ]
      },
      {
        "id": "account-services",
        "title": "Servico Assinado",
        "path": "Menu da Conta > Faturas > Servico Assinado",
        "summary": "Lista, em formato de tabela, todos os servicos e pacotes contratados, com tipo, periodo de validade, dias totais, data de criacao e estado de cada um.",
        "steps": [
          "1. Em 'Configuracoes da Conta', abra a tela de assinatura e clique na aba 'Servico Assinado' na barra de abas superior.",
          "2. No topo da tabela, veja o contador 'Total' (ex.: Total 36) que indica quantos servicos existem no historico.",
          "3. Use o controle de paginas (ex.: '1 / 2') para navegar entre as paginas de resultados.",
          "4. Ajuste quantos itens aparecem por pagina no seletor, escolhendo '20/pagina' ou '50/pagina'.",
          "5. Leia cada linha pelas colunas: 'Nome do Servico', 'Tipo', 'Periodo Valido', 'Dias Totais', 'Data de Criacao' e 'Estado'.",
          "6. Na coluna 'Estado', o status aparece como uma etiqueta colorida (ex.: 'Ativo'); use-a para identificar rapidamente o que esta vigente."
        ],
        "tips": [
          "Use a coluna 'Estado' para localizar de imediato quais servicos continuam 'Ativo' e quais ja expiraram.",
          "Se a lista estiver grande, troque para '50/pagina' para ver mais servicos sem precisar paginar tantas vezes.",
          "A coluna 'Periodo Valido' mostra o intervalo de vigencia de cada item, util para conferir renovacoes."
        ],
        "faq": [
          {
            "q": "Qual a diferenca entre 'Servico Assinado' e 'Minha Assinatura'?",
            "a": "'Minha Assinatura' resume o plano ativo e o uso atual; 'Servico Assinado' lista o historico de todos os servicos e pacotes contratados."
          },
          {
            "q": "Como vejo pacotes antigos ja vencidos?",
            "a": "Eles continuam na tabela com o 'Estado' correspondente; navegue pelas paginas usando o controle '1 / 2'."
          },
          {
            "q": "Posso mostrar mais itens de uma vez?",
            "a": "Sim, mude o seletor de paginacao de '20/pagina' para '50/pagina'."
          }
        ]
      },
      {
        "id": "account-rewards",
        "title": "Resgate de Recompensa",
        "path": "Menu da Conta > Faturas > Resgate de Recompensa",
        "summary": "Tela simples para inserir um codigo de resgate e ativar beneficios na sua conta de forma imediata.",
        "steps": [
          "1. Em 'Configuracoes da Conta', abra a tela de assinatura e clique na aba 'Resgate de Recompensa' na barra de abas superior.",
          "2. No cartao 'Resgate de Recompensa', clique no campo 'Por favor, insira o codigo de resgate'.",
          "3. Digite ou cole o codigo exatamente como recebido, sem espacos extras.",
          "4. Clique em 'Resgatar' para confirmar.",
          "5. Leia a observacao da tela: os beneficios resgatados tem efeito imediato e codigos nao utilizados expiram automaticamente apos o prazo.",
          "6. Apos resgatar, confira em 'Minha Assinatura' / 'Servico Assinado' se o beneficio foi aplicado."
        ],
        "tips": [
          "Resgate o quanto antes: codigos nao utilizados expiram automaticamente apos o prazo.",
          "Confira o codigo digitado (letras maiusculas/minusculas e numeros parecidos) antes de clicar em 'Resgatar'.",
          "Como o efeito e imediato, verifique o resultado nas telas de assinatura logo apos o resgate."
        ],
        "faq": [
          {
            "q": "Quando o beneficio passa a valer?",
            "a": "Imediatamente apos o resgate, conforme a observacao da propria tela."
          },
          {
            "q": "Meu codigo deu erro. O que fazer?",
            "a": "Verifique se digitou exatamente como recebido, sem espacos, e se o codigo ainda esta dentro do prazo de validade."
          },
          {
            "q": "Onde confirmo que a recompensa foi aplicada?",
            "a": "Apos resgatar, confira nas abas 'Minha Assinatura' e 'Servico Assinado' se o beneficio aparece."
          }
        ]
      },
      {
        "id": "account-transactions",
        "title": "Detalhes da Transacao",
        "path": "Menu da Conta > Faturas > Detalhes da Transacao",
        "summary": "Historico de pagamentos da conta com ID da transacao, datas, valor, detalhes do item, metodo de pagamento, estado e o botao para baixar o recibo.",
        "steps": [
          "1. Abra o menu da conta e va ate 'Faturas'; dentro de 'Configuracoes da Conta', selecione 'Detalhes da Transacao' no grupo 'Faturas' do menu lateral.",
          "2. No topo da tabela, veja o botao 'Configuracoes da Empresa' (dados de cobranca) e o contador 'Total' (ex.: Total 56).",
          "3. Use o controle de paginas (ex.: '1 / 2') e o seletor '50/pagina' ou '20/pagina' para navegar pelo historico.",
          "4. Leia cada transacao pelas colunas: 'ID da Transacao', 'Data de Criacao', 'Hora do Pago', 'Valor Total', 'Detalhes', 'Metodo de Pagamento' e 'Estado'.",
          "5. Na coluna 'Estado', o status aparece como etiqueta (ex.: 'Sucesso') para identificar pagamentos concluidos.",
          "6. Na coluna 'Acao', clique em 'Baixar Recibo' para salvar o comprovante daquela transacao."
        ],
        "tips": [
          "Use 'Baixar Recibo' para guardar comprovantes para a contabilidade da sua empresa.",
          "O botao 'Configuracoes da Empresa' e onde voce ajusta os dados que aparecem nos recibos/notas; mantenha-os corretos.",
          "Localize uma cobranca pelo 'ID da Transacao' ou pela 'Data de Criacao' quando precisar conferir um pagamento especifico."
        ],
        "faq": [
          {
            "q": "Como baixo o comprovante de um pagamento?",
            "a": "Na coluna 'Acao' da linha desejada, clique em 'Baixar Recibo'."
          },
          {
            "q": "Quais formas de pagamento aparecem?",
            "a": "A coluna 'Metodo de Pagamento' mostra o meio usado em cada transacao (ex.: PIX)."
          },
          {
            "q": "Onde altero os dados de cobranca da empresa?",
            "a": "Clique em 'Configuracoes da Empresa', no topo da tabela de transacoes."
          }
        ]
      },
      {
        "id": "account-help",
        "title": "Central de Ajuda",
        "path": "Menu da Conta > Central de Ajuda",
        "summary": "Esta propria central de ajuda do NEXT ERP, com atalhos para guias de integracao, atendimento de suporte e a base de conhecimento.",
        "steps": [
          "1. Clique no icone de ajuda na barra lateral ou abra o menu da conta e escolha 'Central de Ajuda'.",
          "2. Voce chega a esta Central de Ajuda, organizada em tres blocos para resolver duvidas por conta propria.",
          "3. Use o bloco 'Guias de integracao' para aprender a conectar e operar Shopee, Mercado Livre, anuncios, estoque e pedidos.",
          "4. Use o bloco 'Atendimento' para abrir uma solicitacao ao suporte da plataforma quando precisar de ajuda humana.",
          "5. Use o bloco 'Base de conhecimento' para seguir o passo a passo de configuracao do ERP com seguranca.",
          "6. Volte ao menu da conta a qualquer momento para acessar Perfil, Seguranca, Faturas ou Planos."
        ],
        "tips": [
          "Antes de abrir um chamado em 'Atendimento', procure a resposta nos 'Guias de integracao' e na 'Base de conhecimento': muitas duvidas se resolvem ali.",
          "A Central de Ajuda tambem pode ser aberta pelo icone de ajuda na barra lateral, sem precisar passar pelo menu da conta.",
          "Para duvidas de marketplace (Shopee, Mercado Livre), comece pelo bloco 'Guias de integracao'."
        ],
        "faq": [
          {
            "q": "O que e a Central de Ajuda?",
            "a": "E esta propria area de ajuda do NEXT ERP, com guias de integracao, atendimento ao suporte e base de conhecimento."
          },
          {
            "q": "Como falo com o suporte humano?",
            "a": "Use o bloco 'Atendimento' para abrir uma solicitacao ao suporte da plataforma."
          },
          {
            "q": "Onde aprendo a integrar Shopee e Mercado Livre?",
            "a": "No bloco 'Guias de integracao', que cobre Shopee, Mercado Livre, anuncios, estoque e pedidos."
          }
        ]
      },
      {
        "id": "plans",
        "title": "Planos",
        "path": "Menu da Conta > Planos",
        "summary": "Apresenta o plano unico do NEXT ERP (NEXT ERP Pro), com preco, periodicidade, lista de recursos inclusos e o botao para assinar.",
        "steps": [
          "1. Abra o menu da conta e clique em 'Planos' (tambem disponivel como atalho 'Planos' na barra lateral).",
          "2. No topo, leia o cartao de titulo 'Planos', que explica que a NEXT ERP trabalha com um plano unico para simplificar a cobranca.",
          "3. No cartao do plano, confira o selo 'Plano unico', o nome 'NEXT ERP Pro' e a descricao do produto.",
          "4. Veja o preco 'R$ 389,00' e a periodicidade 'BRL / Mensal' logo abaixo.",
          "5. Leia a lista de recursos inclusos: produtos/pedidos/estoque/precificacao, importacao de produtos e planilhas da Shopee, SAC com avaliacoes/IA/modelos de resposta, integracoes de marketplace e controle financeiro, e usuarios e permissoes para equipe.",
          "6. Clique em 'Assinar plano' para contratar e siga o fluxo de pagamento.",
          "7. Apos assinar, acompanhe a vigencia e o consumo em 'Minha Assinatura' e o pagamento em 'Detalhes da Transacao'."
        ],
        "tips": [
          "O NEXT ERP tem um unico plano (NEXT ERP Pro); nao ha varias opcoes a comparar, o que simplifica a decisao.",
          "Depois de assinar, confirme em 'Detalhes da Transacao' se o pagamento ficou com estado 'Sucesso'.",
          "Para conferir o que ja esta liberado na sua conta, abra 'Minha Assinatura' e veja o cartao 'Uso Atual'."
        ],
        "faq": [
          {
            "q": "Quantos planos existem?",
            "a": "Apenas um: o 'NEXT ERP Pro', por 'R$ 389,00' em cobranca mensal (BRL / Mensal)."
          },
          {
            "q": "O que vem incluso no plano?",
            "a": "Produtos, pedidos, estoque e precificacao; importacao da Shopee; SAC com IA; integracoes de marketplace e financeiro; e usuarios e permissoes para a equipe."
          },
          {
            "q": "Como contrato?",
            "a": "Na tela 'Planos', clique em 'Assinar plano' e conclua o pagamento; depois confira em 'Minha Assinatura' e 'Detalhes da Transacao'."
          }
        ]
      }
    ]
  }
];
