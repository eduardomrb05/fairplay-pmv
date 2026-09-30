# Plano de Testes de Software

<span style="color:red">Pré-requisitos: <a href="02-Especificação do Projeto.md">Especificação do Projeto</a></span>, <a href="04-Projeto de Interface.md">Projeto de Interface</a>

Este documento descreve os casos de teste de software do **FairPlay**, enumerados de forma sequencial (**CT01** em diante). Em cada caso, o campo **Requisito associado** reproduz literalmente o texto definido na seção **Requisitos** de [02-Especificação do Projeto.md](02-Especificação%20do%20Projeto.md). Os passos assumem o aplicativo móvel (Expo) com as telas existentes no repositório; ajuste URLs ou comandos de execução conforme o ambiente da equipe (emulador, dispositivo físico ou build de homologação).

---

## Requisitos funcionais

| **Caso de Teste** | **CT01 – Cadastro de usuário (dados cadastrais)** |
|:---:|:---:|
| Requisito associado | **RF-001** – O sistema deve permitir que usuário se cadastre informando nome, CPF, telefone, email e senha. |
| Objetivo do teste | Verificar se o fluxo de cadastro de pessoa física aceita e valida nome, CPF, telefone, e-mail e senha, concluindo o registro ou exibindo mensagens de validação coerentes. |
| Passos | - Abrir o app e ir até a seleção de tipo de cadastro (`escolher-cadastro`) <br> - Escolher cadastro de pessoa física (`cadastro-pf`) <br> - Preencher nome, CPF, telefone, e-mail e senha com dados válidos e inéditos no sistema <br> - Concluir o envio do formulário conforme implementação (botão de confirmação / etapa seguinte) |
| Critério de êxito | - Dados aceitos sem erro de validação inesperado <br> - Conta criada ou mensagem explícita de sucesso / próxima etapa do cadastro <br> - Persistência verificável (login posterior com as mesmas credenciais ou registro visível no back-end, se disponível para a equipe) |

| **Caso de Teste** | **CT02 – Cadastro com foto em tempo real do rosto** |
|:---:|:---:|
| Requisito associado | **RF-002** – O sistema deve solicitar uma foto em tempo real do rosto para oficializar o cadastro na aplicação. |
| Objetivo do teste | Verificar se o cadastro exige captura ao vivo da face (câmera) e impede concluir o cadastro sem essa etapa quando aplicável. |
| Passos | - Iniciar cadastro de usuário até a etapa em que a captura facial é solicitada <br> - Tentar avançar sem capturar imagem <br> - Capturar imagem pela câmera e concluir a etapa |
| Critério de êxito | - Fluxo obriga ou orienta claramente o uso da câmera em tempo real <br> - Após captura válida, o cadastro prossegue ou finaliza conforme regra de negócio |

| **Caso de Teste** | **CT03 – Login de usuário e de empresa** |
|:---:|:---:|
| Requisito associado | **RF-003** – O sistema deve permitir que usuários e empresas realizem login com credenciais válidas. |
| Objetivo do teste | Verificar autenticação com credenciais corretas para perfil pessoa física e pessoa jurídica. |
| Passos | - Acessar `login-pf`, informar e-mail e senha de usuário válidos e confirmar login <br> - Encerrar sessão (ou reinstalar/limpar sessão conforme necessário) <br> - Acessar `login-pj`, informar credenciais válidas de empresa e confirmar login |
| Critério de êxito | - Em ambos os casos, o sistema autentica e direciona para a área principal ou painel esperado <br> - Credenciais inválidas geram mensagem de erro sem expor detalhes sensíveis |

| **Caso de Teste** | **CT04 – Visualizar e editar perfil do usuário** |
|:---:|:---:|
| Requisito associado | **RF-004** – O sistema deve permitir que o usuário visualize e edite seus dados de perfil. |
| Objetivo do teste | Verificar leitura e atualização dos dados de perfil do usuário autenticado. |
| Passos | - Efetuar login como usuário <br> - Abrir a tela de perfil conforme projeto de interface <br> - Alterar um campo permitido (ex.: telefone) e salvar <br> - Reabrir o perfil e conferir se a alteração permanece |
| Critério de êxito | - Dados exibidos correspondem aos armazenados <br> - Alterações salvas são refletidas após novo acesso |

| **Caso de Teste** | **CT05 – Reserva e cancelamento pelo usuário** |
|:---:|:---:|
| Requisito associado | **RF-005** – O sistema deve permitir que o usuário faça reservas e cancelamentos. |
| Objetivo do teste | Verificar criação de reserva em horário disponível e cancelamento respeitando as regras de negócio implementadas. |
| Passos | - Logar como usuário <br> - Localizar quadra com disponibilidade, escolher data/horário e confirmar reserva <br> - Acessar histórico ou detalhe da reserva e executar cancelamento quando permitido |
| Critério de êxito | - Reserva criada com confirmação e identificador ou estado “confirmada” <br> - Cancelamento altera o estado da reserva e libera o horário conforme implementação |

| **Caso de Teste** | **CT06 – Pagamento pelo usuário** |
|:---:|:---:|
| Requisito associado | **RF-006** – O sistema deve permitir que o usuário faça pagamento. |
| Objetivo do teste | Verificar fluxo de pagamento da reserva (Pix, cartão ou outro meio disponível) até confirmação ou estado pendente coerente com o gateway. |
| Passos | - Com reserva ativa, iniciar fluxo de pagamento <br> - Completar dados solicitados pelo meio de pagamento (sandbox/homologação quando existir) <br> - Confirmar transação |
| Critério de êxito | - Sistema registra pagamento ou exibe status alinhado ao provedor <br> - Reserva associada ao pagamento quando previsto no modelo de dados |

| **Caso de Teste** | **CT07 – Cadastro e perfil inicial da empresa** |
|:---:|:---:|
| Requisito associado | **RF-007** – O sistema deve permitir que empresas se cadastrem e criem seu perfil (nome, CNPJ, contato e localização). |
| Objetivo do teste | Verificar cadastro PJ com nome, CNPJ, contato e localização e criação do perfil da empresa. |
| Passos | - Acessar `cadastro-pj` <br> - Preencher nome, CNPJ, contato e localização com dados válidos <br> - Concluir cadastro e, se houver login, autenticar como empresa |
| Critério de êxito | - Empresa cadastrada com os campos obrigatórios persistidos <br> - Acesso ao contexto da empresa após cadastro/login |

| **Caso de Teste** | **CT08 – Visualizar e editar dados de perfil da empresa** |
|:---:|:---:|
| Requisito associado | **RF-008** – O sistema deve permitir que a empresa visualize e edite seus dados de perfil. |
| Objetivo do teste | Verificar exibição e edição dos dados institucionais da empresa autenticada. |
| Passos | - Logar como empresa <br> - Abrir tela de perfil/dados da empresa <br> - Editar campo permitido (ex.: contato) e salvar |
| Critério de êxito | - Dados atualizados aparecem corretamente após salvar e ao reabrir a tela |

| **Caso de Teste** | **CT09 – Cadastro de espaço esportivo (quadra/campo)** |
|:---:|:---:|
| Requisito associado | **RF-009** – O sistema deve permitir que a empresa cadastre o espaço para a prática dos esportes (ex: Quadras e Campos). |
| Objetivo do teste | Verificar cadastro de quadra ou espaço com informações necessárias (nome, tipo de esporte, endereço ou equivalente definido no sistema). |
| Passos | - Logar como empresa <br> - Acessar `cadastro-quadra` (ou fluxo equivalente) <br> - Preencher dados do espaço e salvar |
| Critério de êxito | - Novo espaço aparece na listagem administrada pela empresa ou na busca do usuário, conforme regra implementada |

| **Caso de Teste** | **CT10 – Visualizar, editar e excluir quadras** |
|:---:|:---:|
| Requisito associado | **RF-010** – O sistema deve permitir que a empresa visualize, edite e exclua quadras. |
| Objetivo do teste | Garantir operações de leitura, atualização e exclusão lógica ou física de quadras sem inconsistência. |
| Passos | - Na área da empresa, listar quadras cadastradas <br> - Editar atributos de uma quadra e salvar <br> - Excluir (ou inativar) uma quadra de teste e confirmar |
| Critério de êxito | - Lista reflete edição e remoção/inativação <br> - Reservas futuras associadas tratadas conforme regra (bloqueio, mensagem ou migração) se aplicável |

| **Caso de Teste** | **CT11 – Cancelamento de reservas pela empresa** |
|:---:|:---:|
| Requisito associado | **RF-011** – O sistema deve permitir que a empresa faça cancelamento de reservas. |
| Objetivo do teste | Verificar se a empresa consegue cancelar reservas de clientes nos casos previstos. |
| Passos | - Logar como empresa com reservas existentes (criar reserva de teste se necessário) <br> - Abrir gestão de agenda/reservas <br> - Cancelar uma reserva específica |
| Critério de êxito | - Estado da reserva atualizado para cancelada (ou equivalente) <br> - Usuário ou sistema recebe feedback coerente (notificação ou atualização de tela) |

| **Caso de Teste** | **CT12 – Integração de pagamento da empresa** |
|:---:|:---:|
| Requisito associado | **RF-012** – O sistema deve permitir que a empresa integre seus sistema de pagamento (como um pagseguro por exemplo). |
| Objetivo do teste | Verificar configuração ou uso da integração de pagamento no contexto da empresa (credenciais, webhook ou fluxo de recebimento em ambiente de teste). |
| Passos | - Acessar configurações de pagamento da empresa <br> - Informar dados de integração de sandbox, se existir tela <br> - Simular recebimento ou validar chamada de API documentada |
| Critério de êxito | - Integração documentada no README ou endpoints <br> - Fluxo de teste conclui sem erro de autenticação/configuração quando dados corretos são usados |

| **Caso de Teste** | **CT13 – Definir dias e horários disponíveis por quadra** |
|:---:|:---:|
| Requisito associado | **RF-013** – O sistema deve permitir que a empresa define dias e horários disponíveis para cada quadra. |
| Objetivo do teste | Verificar cadastro de janelas de disponibilidade distintas por quadra. |
| Passos | - Logar como empresa <br> - Selecionar uma quadra <br> - Definir dias da semana e faixas de horário disponíveis <br> - Salvar e consultar grade resultante |
| Critério de êxito | - Horários salvos aparecem para o usuário na busca/reserva <br> - Alterações em uma quadra não corrompem a grade de outra |

| **Caso de Teste** | **CT14 – Pesquisa de quadras por localização, esporte e preço** |
|:---:|:---:|
| Requisito associado | **RF-014** – O sistema deve permitir que usuários pesquisem quadras por localização, tipo de esporte e preço. |
| Objetivo do teste | Validar filtros de busca e resultado consistente com os critérios. |
| Passos | - Na home ou busca, informar localização ou usar geolocalização se existir <br> - Aplicar filtro de tipo de esporte <br> - Aplicar filtro de faixa de preço <br> - Conferir lista retornada |
| Critério de êxito | - Resultados respeitam combinação de filtros <br> - Ausência de resultados exibe estado vazio claro |

| **Caso de Teste** | **CT15 – Exibição de horários disponíveis e ocupados** |
|:---:|:---:|
| Requisito associado | **RF-015** – O sistema deve exibir os horários disponíveis e ocupados de uma quadra por dia/semana. |
| Objetivo do teste | Verificar visualização diária ou semanal com distinção entre livre e ocupado. |
| Passos | - Abrir detalhe de uma quadra com agenda existente <br> - Alternar entre dia e semana, se houver <br> - Comparar com reservas reais ou semeadas no banco |
| Critério de êxito | - Ocupados e livres distinguíveis visualmente <br> - Dados alinhados às reservas cadastradas |

| **Caso de Teste** | **CT16 – Impedir reserva em horário já ocupado** |
|:---:|:---:|
| Requisito associado | **RF-016** – O sistema deve impedir reservas em horários já ocupados na mesma quadra. |
| Objetivo do teste | Garantir que duas reservas não compartilhem o mesmo slot na mesma quadra (incluindo tentativa simultânea, se testável). |
| Passos | - Criar reserva A em um horário <br> - Com outro usuário ou sessão, tentar reservar o mesmo horário na mesma quadra <br> - Repetir tentativa imediata após refresh |
| Critério de êxito | - Segunda reserva é bloqueada com mensagem adequada <br> - Base de dados mantém unicidade do agendamento |

| **Caso de Teste** | **CT17 – Registrar pagamento e associar à reserva** |
|:---:|:---:|
| Requisito associado | **RF-017** – O sistema deve permitir registrar pagamento (ex.: Pix/cartão) e associar à reserva. |
| Objetivo do teste | Verificar vínculo explícito entre registro de pagamento e identificador da reserva. |
| Passos | - Efetuar pagamento de uma reserva em ambiente de teste <br> - Consultar detalhe da reserva e extrato/histórico de pagamento |
| Critério de êxito | - Pagamento aparece ligado à reserva correta <br> - Método (Pix/cartão) registrado quando aplicável |

| **Caso de Teste** | **CT18 – Bloqueio de novo cadastro para usuário banido** |
|:---:|:---:|
| Requisito associado | **RF-018** – O sistema deve impedir que um usuário banido crie uma nova conta com o mesmo e-mail e CPF. |
| Objetivo do teste | Verificar que e-mail e CPF previamente associados a conta banida não permitem novo cadastro. |
| Passos | - Marcar usuário de teste como banido (ferramenta administrativa ou script, conforme existir) <br> - Tentar novo cadastro com o mesmo e-mail e CPF |
| Critério de êxito | - Cadastro recusado com mensagem de política <br> - Nenhum novo registro ativo duplicando o par e-mail/CPF |

| **Caso de Teste** | **CT19 – Avaliação de quadras e empresas** |
|:---:|:---:|
| Requisito associado | **RF-019** – O sistema deve permitir que os usuários avaliem quadras e empresas com notas. |
| Objetivo do teste | Verificar envio e exibição de nota/avaliação após uso ou reserva concluída. |
| Passos | - Com usuário autenticado e critérios de elegibilidade atendidos, abrir fluxo de avaliação <br> - Atribuir nota e comentário opcional <br> - Conferir média ou lista de avaliações na página da quadra/empresa |
| Critério de êxito | - Avaliação persistida e visível conforme regras de moderação implementadas |

| **Caso de Teste** | **CT20 – Encontrar parceiros para horário e esporte** |
|:---:|:---:|
| Requisito associado | **RF-020** – O sistema deve permitir que usuário localize esporte pelo tipo e tente fechar um horário e data com outros usuários aleatórios. |
| Objetivo do teste | Validar fluxo de matchmaking ou grupo aberto por tipo de esporte, data e horário. |
| Passos | - Selecionar esporte e janela de data/hora desejada <br> - Publicar ou buscar convite/partida aberta <br> - Simular adesão de segundo usuário |
| Critério de êxito | - Estado da proposta atualizado (aberta, fechada, expirada) de forma compreensível |

| **Caso de Teste** | **CT21 – Exportação de agendamentos (.ics / API)** |
|:---:|:---:|
| Requisito associado | **RF-021** – O sistema deve permitir a exportação de agendamentos para calendários externos (Google Calendar, iCal, Outlook) via padrão .ics ou integração via API. |
| Objetivo do teste | Verificar download ou link de `.ics` ou endpoint que retorne eventos compatíveis com calendários externos. |
| Passos | - Na área de reservas do usuário, acionar exportação <br> - Abrir arquivo gerado em cliente de calendário ou chamar API documentada com token válido |
| Critério de êxito | - Evento contém data, hora e título/local coerentes com a reserva |

| **Caso de Teste** | **CT22 – Notificações de reservas e pagamentos** |
|:---:|:---:|
| Requisito associado | **RF-022** – O sistema deve notificar usuário e empresa quanto a reservas e pagamentos. |
| Objetivo do teste | Verificar envio de notificações (push, e-mail ou in-app) em eventos de reserva e pagamento. |
| Passos | - Disparar eventos: nova reserva, cancelamento, confirmação de pagamento <br> - Conferir canal configurado para usuário e empresa |
| Critério de êxito | - Destinatários corretos recebem mensagem com resumo do evento <br> - Falhas exibem retry ou log conforme implementação |

| **Caso de Teste** | **CT23 – Solicitação de mensalista** |
|:---:|:---:|
| Requisito associado | **RF-023** – O sistema deve permitir que o usuário solicite um dia e horário para ser mensalista. |
| Objetivo do teste | Verificar criação de pedido de mensalista com dia e horário desejados. |
| Passos | - Logar como usuário <br> - Abrir fluxo de mensalista na quadra desejada <br> - Informar dia/horário e enviar solicitação |
| Critério de êxito | - Solicitação registrada com status “pendente” ou equivalente visível ao usuário |

| **Caso de Teste** | **CT24 – Resposta da empresa ao pedido de mensalista** |
|:---:|:---:|
| Requisito associado | **RF-024** – O sistema deve retornar aprovação ou não do dia e horário para ser mensal da empresa para usuário, autorizado, não autorizado ou trazendo os dias e horários. |
| Objetivo do teste | Verificar ações da empresa (autorizar, negar ou contra-propor horários) e reflexo no usuário. |
| Passos | - Logar como empresa e localizar solicitações de mensalista <br> - Aprovar, recusar ou sugerir outros horários <br> - Logar como usuário e conferir retorno |
| Critério de êxito | - Estado e mensagem ao usuário refletem a decisão da empresa <br> - Histórico mantém trilha da interação |

| **Caso de Teste** | **CT25 – Bloqueio de datas e horários pela empresa** |
|:---:|:---:|
| Requisito associado | **RF-025** – O sistema deve permitir que a empresa bloqueie datas e horários determinados. |
| Objetivo do teste | Verificar bloqueio manual (manutenção, evento fechado) impedindo novas reservas. |
| Passos | - Logar como empresa <br> - Criar bloqueio em intervalo específico <br> - Tentar reservar como usuário no intervalo bloqueado |
| Critério de êxito | - Intervalo bloqueado não aparece como disponível ou reserva é recusada <br> - Bloqueio pode ser removido pela empresa em teste de regressão |

| **Caso de Teste** | **CT26 – Número de jogadores na reserva** |
|:---:|:---:|
| Requisito associado | **RF-026** – O sistema deve solicitar número de jogadores no ato da reserva. |
| Objetivo do teste | Garantir que o fluxo de reserva solicita quantidade de jogadores e valida limites mín/máx se existirem. |
| Passos | - Iniciar reserva até o passo de confirmação <br> - Informar número de jogadores dentro e fora do permitido |
| Critério de êxito | - Campo obrigatório quando previsto <br> - Valores inválidos bloqueiam avanço com mensagem clara |

| **Caso de Teste** | **CT27 – Limite de reservas no mesmo dia** |
|:---:|:---:|
| Requisito associado | **RF-027** – O sistema deve limitar a quantidade de reservas que o usuário pode realizar no mesmo dia. |
| Objetivo do teste | Verificar política de limite diário de reservas por usuário. |
| Passos | - Criar reservas até o limite configurado para o mesmo dia civil <br> - Tentar uma reserva adicional |
| Critério de êxito | - Reserva extra é impedida com mensagem explicando o limite |

| **Caso de Teste** | **CT28 – Antecedência de 7 dias e cancelamento até 24 h** |
|:---:|:---:|
| Requisito associado | **RF-028** – A reserva pode ser feita 7 dias antes com data e horário marcado; Pode ser cancelada em até 24Hrs antes da data e horário marcados. |
| Objetivo do teste | Validar janela máxima de antecedência para agendar e prazo mínimo para cancelamento sem penalidade conforme regras implementadas. |
| Passos | - Tentar reservar além de 7 dias à frente da política (deve ser impedido ou ajustado à regra) <br> - Tentar cancelar com menos de 24 h antes do jogo |
| Critério de êxito | - Comportamento alinhado à regra de antecedência e cancelamento documentada na especificação/implementação |

| **Caso de Teste** | **CT29 – Conclusão e pagamento até 10 minutos antes** |
|:---:|:---:|
| Requisito associado | **RF-029** – A reserva pode ser feita, concluída e paga até 10 minutos antes do horário combinado. |
| Objetivo do teste | Verificar se o sistema impede pagamento ou confirmação fora da janela de 10 minutos antes do início. |
| Passos | - Criar reserva próxima ao horário de início <br> - Tentar pagar ou confirmar dentro e fora da janela de 10 minutos |
| Critério de êxito | - Dentro da janela, fluxo permitido; fora, bloqueio ou aviso explícito |

---

## Requisitos não funcionais

| **Caso de Teste** | **CT30 – Eficiência na reserva (intuitividade e tempo)** |
|:---:|:---:|
| Requisito associado | **RNF-001** – O sistema deve ser intuitivo, permitindo que um usuário realize uma reserva em até 3 minutos. |
| Objetivo do teste | Medir se usuário representativo conclui uma reserva simples (sem pagamento ou com pagamento simulado) em até 3 minutos, contando a partir da abertura da busca. |
| Passos | - Definir cenário padrão: quadra já conhecida, horário disponível <br> - Cronometrar tarefa completa até confirmação da reserva <br> - Registrar tempo e número de erros de clique |
| Critério de êxito | - Pelo menos 80% dos participantes do teste de usabilidade concluem em ≤ 3 minutos **ou** registro objetivo de tempo em sessão controlada da equipe |

| **Caso de Teste** | **CT31 – Tempo de resposta das ações principais** |
|:---:|:---:|
| Requisito associado | **RNF-002** – O sistema deve responder às principais ações (listar horários, reservar, pagar) em até 3 segundos em condições normais. |
| Objetivo do teste | Medir latência percebida ou tempo de resposta de API nas ações listar horários, criar reserva e iniciar pagamento. |
| Passos | - Usar rede estável e repetir cada ação no mínimo 5 vezes <br> - Registrar tempo até primeira renderização útil ou código HTTP de sucesso |
| Critério de êxito | - Mediana das medições ≤ 3 s em ambiente de referência da equipe **ou** documentação de gargalo com plano de otimização se ultrapassar |

| **Caso de Teste** | **CT32 – Disponibilidade do serviço** |
|:---:|:---:|
| Requisito associado | **RNF-003** – O sistema deve estar disponível 24/7, exceto em janelas de manutenção programada. |
| Objetivo do teste | Verificar acesso contínuo fora de janelas anunciadas e existência de processo de comunicação de manutenção. |
| Passos | - Executar verificações programadas (ping health ou página inicial) em horários distribuídos <br> - Simular indisponibilidade planejada e conferir aviso prévio |
| Critério de êxito | - Fora de manutenção, taxa de sucesso das verificações compatível com ambiente acadêmico (ex.: > 95% no período de medição) <br> - Manutenções documentadas com início e fim |

| **Caso de Teste** | **CT33 – Senha segura, política de complexidade e recuperação** |
|:---:|:---:|
| Requisito associado | **RNF-004** – O sistema deve proteger contas com senha segura (hash + salt) e permitir recuperação de acesso. **RNF-012** – O sistema deve exigir que a senha tenha no mínimo 8 caracteres, incluindo letras, números e caracteres especiais. |
| Objetivo do teste | Validar política de senha no cadastro/alteração e fluxo de “esqueci minha senha”; verificar por inspeção técnica que senhas não são armazenadas em texto plano. |
| Passos | - Tentar cadastrar senhas inválidas (curtas, só letras, sem especial) <br> - Cadastrar senha válida <br> - Executar recuperação de senha <br> - Conferir armazenamento (hash) via documentação ou inspeção autorizada do banco |
| Critério de êxito | - Regras de RNF-012 aplicadas na interface/API <br> - Recuperação conclui com token ou e-mail seguro <br> - Evidência de hash + salt (código ou dump sanitizado) |

| **Caso de Teste** | **CT34 – Dados pessoais: mínimo necessário e consentimento** |
|:---:|:---:|
| Requisito associado | **RNF-005** – O sistema deve armazenar e processar dados pessoais para segurança (mínimo necessário + consentimento). |
| Objetivo do teste | Verificar coleta proporcional, avisos de privacidade e registro de consentimento onde exigido. |
| Passos | - Revisar formulários e comparar campos com o estritamente necessário ao serviço <br> - Confirmar presença de consentimento explícito em coletas sensíveis |
| Critério de êxito | - Campos extra sem justificativa identificados para remoção ou documentação <br> - Consentimento registrado (checkbox, timestamp ou equivalente) |

| **Caso de Teste** | **CT35 – Consistência de reservas, concorrência e hold de checkout** |
|:---:|:---:|
| Requisito associado | **RNF-006** – O sistema deve garantir consistência das reservas, evitando duplicidade e conflito na concorrência. **RNF-015** – O sistema deve garantir a reserva temporária de um horário selecionado por no máximo 10 minutos durante o processo de checkout, liberando-o automaticamente caso o pagamento não seja confirmado. |
| Objetivo do teste | Validar transações concorrentes e expiração de hold de horário no checkout. |
| Passos | - Duas sessões disputam o mesmo slot (ver CT16) <br> - Iniciar checkout e aguardar > 10 minutos sem pagar, se política ativa <br> - Tentar concluir pagamento após expiração |
| Critério de êxito | - Sem reserva duplicada confirmada <br> - Horário liberado após timeout de hold conforme implementação |

| **Caso de Teste** | **CT36 – Navegadores modernos, responsividade e identidade visual** |
|:---:|:---:|
| Requisito associado | **RNF-007** – O sistema deve funcionar em navegadores modernos e ser responsivo para celulares e tablets. **RNF-013** – A aplicação deve manter uma identidade visual consistente em todas as páginas, considerando a paleta de cores, a tipografia e o layout. |
| Objetivo do teste | Verificar renderização em viewports móveis e desktop (se houver PWA/web) e consistência visual entre telas principais. |
| Passos | - Executar fluxos críticos em Chrome/Firefox/Safari recentes e em pelo menos dois tamanhos de tela <br> - Comparar cabeçalhos, cores e tipografia entre telas definidas no projeto de interface |
| Critério de êxito | - Sem quebras críticas de layout <br> - Componentes seguem paleta e tipografia do guia |

| **Caso de Teste** | **CT37 – Escalabilidade e continuidade (degradação e backup)** |
|:---:|:---:|
| Requisito associado | **RNF-008** – O sistema deve suportar crescimento de usuários/quadras sem degradação significativa. **RNF-011** – O sistema deve realizar backups periódicos e permitir restauração em caso de falha. |
| Objetivo do teste | Registrar plano ou evidência de teste de carga simplificado e política de backup/restauração do ambiente de produção/homologação. |
| Passos | - Executar teste de carga leve (ferramenta a critério da equipe) ou revisar limites de pool/conexões <br> - Revisar documentação de backup do provedor de banco/hospedagem |
| Critério de êxito | - Documento com resultados ou justificativa de ambiente acadêmico <br> - Procedimento de backup e restauração descrito com periodicidade |

| **Caso de Teste** | **CT38 – Modularidade e documentação para manutenção** |
|:---:|:---:|
| Requisito associado | **RNF-009** – O sistema deve possuir código modular e documentação mínima (README + endpoints), facilitando a manutenção. |
| Objetivo do teste | Auditar README raiz, instruções de execução e lista de endpoints ou OpenAPI. |
| Passos | - Seguir README para subir projeto do zero em máquina limpa <br> - Validar existência e atualização da lista de endpoints |
| Critério de êxito | - Passos reproduzíveis sem conhecimento oral extra <br> - Endpoints principais documentados |

| **Caso de Teste** | **CT39 – Acessibilidade, navegação básica e mínimo de jogadores** |
|:---:|:---:|
| Requisito associado | **RNF-010** – O sistema deve ter acesibilidade e suporte a navegação básica para usuários e suas limitações. **RNF-017** – O sistema deve ter número mínimo de jogadores para fechamento de datas e horário em relação ao esporte escolhido. |
| Objetivo do teste | Verificar ordem de foco, rótulos e contraste mínimo em telas-chave; validar regra de mínimo de jogadores por esporte na reserva. |
| Passos | - Percorrer fluxo principal apenas com teclado e leitor de tela (amostra) <br> - Tentar reservar com número de jogadores abaixo do mínimo exigido para o esporte |
| Critério de êxito | - Elementos interativos alcançáveis e identificáveis <br> - Reserva abaixo do mínimo bloqueada com mensagem |

| **Caso de Teste** | **CT40 – Notificações críticas (SLA)** |
|:---:|:---:|
| Requisito associado | **RNF-014** – O sistema deve garantir que notificações críticas (confirmação e cancelamento) sejam enviadas com uma taxa de entrega de 99% em até 2 minutos após o evento gerador. |
| Objetivo do teste | Medir atraso entre evento de confirmação/cancelamento e recebimento no canal (fila + provedor). |
| Passos | - Gerar conjunto de eventos de teste em homologação <br> - Registrar timestamps de geração e entrega (logs do servidor ou caixa de e-mail de teste) |
| Critério de êxito | - Em amostra ≥ 20 eventos, ≥ 99% entregues em ≤ 120 s **ou** relatório de limitação do ambiente acadêmico com mitigação proposta |

| **Caso de Teste** | **CT41 – Termos no cadastro (PF e PJ)** |
|:---:|:---:|
| Requisito associado | **RNF-016** – O sistema deve garantir que, no ato do cadastro, o usuário aceite um Termo de Utilização e a empresa aceite o termo de responsabilidade. |
| Objetivo do teste | Garantir que cadastro de usuário e de empresa não conclui sem aceite explícito dos termos. |
| Passos | - Tentar finalizar `cadastro-pf` sem marcar aceite <br> - Marcar aceite e concluir <br> - Repetir para `cadastro-pj` com termo de responsabilidade |
| Critério de êxito | - Bloqueio sem aceite <br> - Registro de aceite (timestamp/versão do termo) persistido quando aplicável |

> **Links úteis**:
> - [IBM - Criação e Geração de Planos de Teste](https://www.ibm.com/developerworks/br/local/rational/criacao_geracao_planos_testes_software/index.html)
> - [Práticas e Técnicas de Testes Ágeis](http://assiste.serpro.gov.br/serproagil/Apresenta/slides.pdf)
> - [Teste de Software: Conceitos e tipos de testes](https://blog.onedaytesting.com.br/teste-de-software/)
> - [Ferramentas de Test para Java Script](https://geekflare.com/javascript-unit-testing/)
> - [UX Tools](https://uxdesign.cc/ux-user-research-and-user-testing-tools-2d339d379dc7)
