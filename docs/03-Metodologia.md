# Metodologia  

## Pré-requisitos: Documentação de Especificação  

Para o desenvolvimento do aplicativo **FairPlay**, foi elaborada previamente uma documentação de especificação contendo os requisitos funcionais e não funcionais do sistema, bem como a definição dos principais fluxos de uso da aplicação.

A equipe adotou uma abordagem baseada em metodologias ágeis, com foco na organização incremental do projeto, permitindo ajustes contínuos conforme a evolução do desenvolvimento.

---

## Relação de Ambientes de Trabalho  

Os artefatos do projeto são desenvolvidos utilizando diferentes ambientes e ferramentas, conforme apresentado na tabela abaixo:

| Ambiente                | Plataforma/Ferramenta | Link de Acesso |
|------------------------|----------------------|----------------|
| Desenvolvimento        | Visual Studio Code   | https://code.visualstudio.com/ |
| Versionamento          | GitHub               | https://github.com/ |
| Protótipo/Design       | Figma                | https://www.figma.com/ |
| Gerenciamento          | GitHub Projects      | https://github.com/features/projects |
| Comunicação            | WhatsApp             | https://www.whatsapp.com/ |
| Desenvolvimento Mobile | React Native         | https://reactnative.dev/ |

---

## Controle de Versão  

A ferramenta de controle de versão adotada no projeto foi o **Git**, sendo o **GitHub** utilizado para hospedagem do repositório.

O projeto segue a seguinte convenção para o nome de branches:

- `main`: versão estável já testada do software  
- `unstable`: versão testada, porém instável  
- `testing`: versão em fase de testes  
- `dev`: versão de desenvolvimento  

### Commits  

Os commits são realizados com mensagens descritivas, seguindo o padrão:

- feat: criação da tela de cadastro de usuários
- feat: implementação do sistema de reservas
- fix: correção de conflito de horários nas reservas
- fix: ajuste no carregamento da lista de quadras
- docs: atualização da documentação do projeto
- style: ajustes no layout da tela inicial
- refactor: reorganização da estrutura de componentes
- test: adição de testes para o módulo de reservas

### Merges  

Os merges são realizados após validação na branch `testing`, garantindo maior estabilidade antes da integração na `main`.

### Issues  

As issues são utilizadas para organização das tarefas e seguem as seguintes etiquetas:

- `documentation`: melhorias na documentação  
- `bug`: correção de erros  
- `enhancement`: melhorias em funcionalidades existentes  
- `feature`: novas funcionalidades  

---

## Gerenciamento de Projeto  

### Divisão de Papéis  

A equipe utiliza a metodologia ágil Scrum para organização do desenvolvimento.

- **Scrum Master**: responsável por garantir o processo e remover impedimentos  
- **Product Owner**: responsável por definir requisitos e prioridades  
- **Equipe de Desenvolvimento**: implementação das funcionalidades  
- **Equipe de Design**: criação da interface e experiência do usuário  

---

### Processo  

O desenvolvimento segue o modelo Scrum, dividido em sprints.

Cada sprint inclui:

- Planejamento (Sprint Planning)  
- Desenvolvimento das funcionalidades  
- Testes  
- Revisão (Sprint Review)  

O acompanhamento das tarefas é feito através do **GitHub Projects**, utilizando um quadro Kanban com as seguintes colunas:

- A Fazer  
- Em Desenvolvimento  
- Em Teste  
- Concluído  

---

## Ferramentas  

As ferramentas utilizadas no projeto são:

- **Visual Studio Code**  
  Editor de código escolhido pela integração com Git e suporte a extensões.

- **GitHub**  
  Plataforma de versionamento e colaboração do projeto.

- **React Native**  
  Framework para desenvolvimento de aplicativos móveis multiplataforma.

- **Figma**  
  Ferramenta para criação de protótipos e design de interface.

- **WhatsApp**  
  Utilizado para comunicação rápida entre os membros da equipe.

- **GitHub Projects**  
  Utilizado para gerenciamento das tarefas e acompanhamento do progresso.

---

## Considerações Finais  

A metodologia adotada permite um desenvolvimento organizado, colaborativo e iterativo, garantindo maior qualidade na entrega do aplicativo **FairPlay** e alinhamento com as necessidades dos usuários.
