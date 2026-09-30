# Plano de Testes de Usabilidade

Os testes de usabilidade permitem avaliar a qualidade da interface com o usuário da aplicação interativa do **FairPlay** (reserva de quadras e espaços esportivos).

Um plano de teste de usabilidade deverá conter:

## Definição do(s) objetivo(s)

Para o FairPlay, os objetivos do ciclo de testes de usabilidade são:

- Verificar se **jogadores e grupos amadores** conseguem **localizar quadras**, comparar opções e **concluir uma reserva** sem assistência, em tempo razoável (alinhado ao **RNF-001**: reserva em até 3 minutos como referência de eficiência).
- Identificar **barreiras de navegação** entre cadastro (`escolher-cadastro`, `cadastro-pf`, `cadastro-pj`), login (`login-pf`, `login-pj`) e uso principal (`home` e fluxos de busca/reserva).
- Avaliar **eficiência e satisfação** ao usar filtros (localização, tipo de esporte, preço — **RF-014**) e ao interpretar **horários livres e ocupados** (**RF-015**).
- Verificar se **empresários ou gestores de quadras** compreendem o fluxo de **cadastro de espaço** (`cadastro-quadra`) e de **gestão de disponibilidade** (**RF-013**), sem erros críticos de rotulagem ou ordem de passos.
- Testar **acessibilidade e navegação básica** (**RNF-010**): foco visível, leitura de rótulos em formulários longos e uso em **smartphone** (teclado virtual, rolagem), condizente com **RNF-007** (responsividade).

## Seleção dos participantes

Para garantir que o teste reflita o uso real do sistema, escolha participantes representativos do público-alvo do FairPlay.

**Critérios para selecionar participantes:**

- **Perfil jogador/usuário final**: pessoas que praticam esporte em grupo ou individualmente e já reservaram quadra por telefone, app ou presencialmente.
- **Perfil gestor de quadra** (ou familiarizado com gestão de agenda): dono de espaço, funcionário de arena ou estudante que simule decisões de empresa.
- **Variação de experiência**: participantes com pouca familiaridade com apps e participantes habituados a reservas digitais.
- **Diferentes dispositivos**: Android e iOS, telas pequenas (até 6,1") e médias (tablet, se aplicável ao escopo).
- **Necessidades especiais (se aplicável)**: convidar pelo menos um participante que use zoom aumentado, leitor de tela ou navegação preferencial por teclado, para cobrir **RNF-010**.

**Quantidade recomendada:**

- **Mínimo:** 5 participantes (exigência do projeto).
- **Ideal:** entre 8 e 12 participantes para maior diversidade de idade, esporte preferido e familiaridade tecnológica.

**LGPD:** utilizar **termo de consentimento** informando finalidade da gravação, uso apenas acadêmico e prazo de eliminação das gravações. Nos relatórios e apresentações, utilizar **identificadores anônimos** (P01, P02, …) e **não** publicar nome completo, CPF, e-mail ou voz identificável sem autorização explícita.

## Definição de cenários de teste

Os cenários representam tarefas reais que os usuários executam no sistema. A seguir estão **seis cenários** (acima do mínimo de cinco exigido), cada um com objetivo, contexto, tarefa e critério de sucesso.

---

### Cenário 1 – Primeira reserva como novo usuário

**Objetivo:** Avaliar o primeiro uso: cadastro, eventual captura facial (**RF-002**), aceite de termos (**RNF-016**) e primeira reserva (**RF-005**), medindo facilidade e tempo.

**Contexto:** A pessoa baixou o FairPlay para jogar futsal no fim de semana. Nunca usou o app. Precisa criar conta, aceitar termos e reservar um horário em uma quadra próxima.

**Tarefa(s):**

- Abrir o app e percorrer até `escolher-cadastro` e `cadastro-pf`.
- Completar cadastro com dados válidos, aceitar termo e concluir etapas obrigatórias (incluindo foto em tempo real, se o fluxo exigir).
- Fazer login, buscar quadras de futsal na região desejada, escolher horário livre e confirmar reserva.

**Critério(s) de sucesso:**

- Conclui cadastro e reserva **sem ajuda do moderador**, ou com no máximo **uma** dúvida pontual de vocabulário.
- Encontra filtro de esporte/localização em até **3 minutos** a partir da abertura da busca (referência **RNF-001**).
- Relata compreensão do status da reserva (confirmada / pendente de pagamento) ao final.

---

### Cenário 2 – Busca refinada

**Objetivo:** Avaliar **RF-014** (localização e tipo de esporte) e clareza da listagem.

**Contexto:** O usuário já tem conta. Quer jogar vôlei de areia à noite e prefere locais até 5 km do trabalho.

**Tarefa(s):**

- Logar com credenciais fornecidas pela equipe (conta de teste).
- Aplicar filtros de esporte, distância e região
- Abrir pelo menos dois resultados e horários visíveis antes de escolher um.

**Critério(s) de sucesso:**

- Aplica **dois ou mais filtros** sem erro de interpretação.
- Indica em voz alta qual escolheria e por quê (distância ou horário).

---

### Cenário 3 – Cancelamento dentro da política

**Objetivo:** Avaliar compreensão de **RF-005** e **RF-028** (cancelamento até 24 h antes, conforme implementação e mensagens da UI).

**Contexto:** O usuário reservou para daqui a dois dias, mas vai viajar. Precisa cancelar a reserva o quanto antes pela interface.

**Tarefa(s):**

- Acessar área de “Minhas reservas” ou equivalente.
- Localizar a reserva de teste preparada pela equipe.
- Executar cancelamento e ler qualquer aviso sobre prazo ou taxa.

**Critério(s) de sucesso:**

- Encontra a reserva em até **2 minutos** após abrir o app autenticado.
- Conclui cancelamento ou entende explicitamente o impedimento (ex.: fora do prazo), **sem frustração grave** (escala breve pós-teste).

---

### Cenário 4 – Cadastro e operação como empresa

**Objetivo:** Avaliar **RF-007**, **RF-009** e **RNF-016** (termo de responsabilidade) no fluxo `cadastro-pj` e `cadastro-quadra`.

**Contexto:** Um pequeno empresário quer cadastrar sua arena no FairPlay e publicar uma quadra de tênis com horários comerciais.

**Tarefa(s):**

- Criar conta empresa em `cadastro-pj` (ou fluxo equivalente de PJ), aceitando termo de responsabilidade.
- Após login, acessar cadastro de espaço (`cadastro-quadra`) e preencher dados mínimos solicitados.
- Registrar disponibilidade semanal básica (dias/horários), se a funcionalidade estiver disponível na build testada.

**Critério(s) de sucesso:**

- Completa cadastro PJ com **todos os campos obrigatórios** sem erro de validação evitável (ex.: formato de CNPJ).
- Salva a quadra e consegue **vê-la listada** na área da empresa ou recebe mensagem clara se a etapa for apenas protótipo.

---

### Cenário 5 – Pagamento (ou checkout) da reserva

**Objetivo:** Avaliar clareza do fluxo de **RF-006** / **RF-017** e tolerância a espera (**RNF-002** referência de desempenho percebido).

**Contexto:** O usuário já escolheu horário e precisa **pagar** para garantir a quadra. Em homologação, usar meio de teste (Pix sandbox, cartão de teste ou simulação).

**Tarefa(s):**

- A partir de uma reserva pendente de pagamento (preparada pela equipe), iniciar checkout.
- Preencher dados solicitados e concluir ou abandonar de forma controlada (para testar mensagens).

**Critério(s) de sucesso:**

- Identifica **valor total** e **método de pagamento** antes de confirmar.
- Recebe **confirmação ou erro compreensível** em até **3 segundos** após ação principal, na maior parte das tentativas (referência **RNF-002**).

---

### Cenário 6 – Solicitação de mensalista e acompanhamento de status

**Objetivo:** Avaliar compreensão de **RF-023** e **RF-024** (pedido e resposta da empresa).

**Contexto:** Usuário quer fixar toda terça às 20h na mesma quadra. Precisa enviar solicitação de mensalista e entender o retorno (aprovado, negado ou contraproposta).

**Tarefa(s):**

- Enviar solicitação de mensalista com dia/horário desejados.
- (Opcional, com moderador) Simular resposta da empresa em ambiente de teste.
- Explicar em palavras o status exibido na tela do usuário.

**Critério(s) de sucesso:**

- Preenche o pedido **sem erro de interpretação** dos campos.
- Corretamente descreve o significado do status exibido após a resposta simulada.

---

## Métodos de coleta de dados

Os dados coletados devem ajudar a entender a experiência dos usuários. Para cada sessão (moderada presencial ou remota por videoconferência com compartilhamento de tela do celular), a equipe deve registrar:

| Tipo | O que coletar | Como |
|------|----------------|------|
| **Quantitativo** | Tempo por tarefa (cronômetro), número de toques até objetivo, quantidade de erros (toque em elemento errado), taxa de conclusão sem ajuda | Planilha ou formulário padronizado por cenário |
| **Qualitativo** | Comentários espontâneos, hesitações, expressões de confusão, sugestões de rótulo | Anotações do moderador + transcrição resumida (sem dados pessoais) |
| **Pós-teste** | Questionário curto (ex.: SUS simplificado ou escala 1–5: facilidade, confiança no sistema, probabilidade de recomendar) | Formulário anônimo (sem CPF/e-mail reais; usar “P01” ligado apenas internamente ao termo de consentimento) |

**Gravação:** vídeo da tela (e opcionalmente áudio da voz) apenas com **consentimento**. Armazenar em repositório privado da equipe; **não** incluir em documentos públicos trechos que identifiquem o participante.

**Consistência com o plano de testes de software:** os cenários 1 e 5 alimentam diretamente os indicadores citados nos **CT30** (**RNF-001**) e **CT31** (**RNF-002**) de [08-Plano de Testes de Software.md](08-Plano%20de%20Testes%20de%20Software.md).

> **Links úteis**:
> - [Teste De Usabilidade: O Que É e Como Fazer Passo a Passo (neilpatel.com)](https://neilpatel.com/br/blog/teste-de-usabilidade/)
> - [Teste de usabilidade: tudo o que você precisa saber! | by Jon Vieira | Aela.io | Medium](https://medium.com/aela/teste-de-usabilidade-o-que-voc%C3%AA-precisa-saber-39a36343d9a6/)
> - [Planejando testes de usabilidade: o que (e o que não) fazer | iMasters](https://imasters.com.br/design-ux/planejando-testes-de-usabilidade-o-que-e-o-que-nao-fazer/)
> - [Ferramentas de Testes de Usabilidade](https://www.usability.gov/how-to-and-tools/resources/templates.html)
