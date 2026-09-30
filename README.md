# FairPlay

`Análise e Desenvolvimento de Sistemas`

`Desenvolvimento Mobile`

`3° Semestre`

## Sobre o projeto

O **FairPlay** é um aplicativo desenvolvido em equipe como projeto acadêmico do curso de Análise e Desenvolvimento de Sistemas da PUC Minas. A proposta é facilitar a busca e a reserva de quadras esportivas, aproximando pessoas interessadas em praticar esportes das empresas que disponibilizam espaços para locação.

A aplicação reúne funcionalidades de cadastro de usuários e empresas, consulta e gerenciamento de quadras, reserva de horários e avaliação dos espaços. O aplicativo utiliza **React Native, TypeScript e Expo**, integrado a uma API desenvolvida com **Node.js e Express**, com armazenamento de dados no **Supabase/PostgreSQL**. Alguns recursos, como pagamento e atendimento por mensagens, possuem caráter demonstrativo.

## Integrantes

* Anna Clara Miguel Leocádio
* Eduardo Moreira Ribeiro
* Guilherme Vinicius Costa Damas
* Josué Maciel Reis
* Kaique Gabriel Fernandes
* Marco Vinicius Oliveira Castro Silva

## Orientador

* Udo Fritzke Junior

## Minha participação

Participei ativamente da concepção do **FairPlay**, contribuindo para o planejamento e a estruturação da aplicação. Também colaborei no desenvolvimento geral do projeto, no versionamento do código e nos processos de compilação e integração das contribuições da equipe.

Minha atuação na implementação de funcionalidades concentrou-se nos seguintes requisitos:

| Requisito | Funcionalidade |
|---|---|
| **RF-005** | Realização e cancelamento de reservas pelo usuário. |
| **RF-008** | Visualização e edição do perfil da empresa. |
| **RF-009** | Cadastro de espaços esportivos, como quadras e campos. |
| **RF-010** | Visualização, edição e exclusão de quadras. |
| **RF-013** | Definição de dias e horários disponíveis para cada quadra. |
| **RF-015** | Exibição dos horários disponíveis e ocupados por dia ou semana. |
| **RF-023** | Solicitação de dia e horário para utilização como mensalista. |
| **RF-025** | Bloqueio de datas e horários específicos pela empresa. |

Essas contribuições foram realizadas em colaboração com os demais integrantes, com foco nos fluxos de gerenciamento de espaços esportivos, disponibilidade e reservas.

## Instruções de utilização

### Pré-requisitos

Para executar o projeto localmente, é necessário ter:

- Node.js e npm instalados, em versões compatíveis com o Expo SDK 54.
- Git instalado.
- Um projeto no Supabase com o banco de dados configurado.
- Um dispositivo com Expo Go compatível com o projeto ou um emulador Android configurado.

### 1. Clonar o repositório

Substitua os campos abaixo pelo seu usuário e pelo nome do repositório:

```bash
git clone https://github.com/SEU_USUARIO/NOME_DO_REPOSITORIO.git
cd NOME_DO_REPOSITORIO
```

### 2. Configurar o banco de dados

Utilize um projeto próprio no Supabase para executar a aplicação.

A pasta `database/` contém os scripts SQL disponíveis. O arquivo `supabase-schema.sql` representa a estrutura inicial para Supabase/PostgreSQL, enquanto a pasta `migrations/` contém alterações adicionais.

**Atenção:** os scripts incluídos ainda não contemplam todos os campos utilizados pela API. É necessário complementar o esquema antes de executar todos os fluxos. O arquivo `banco.sql` utiliza sintaxe MySQL e não deve ser executado diretamente no Supabase.

### 3. Configurar e iniciar o backend

Em um terminal, acesse a pasta do backend e instale as dependências:

```bash
cd backend
npm ci
```

Crie um arquivo `.env` nessa pasta, utilizando o `.env.example` como referência, e preencha:

```dotenv
PORT=3000
SUPABASE_URL=https://SEU_PROJETO.supabase.co
SUPABASE_SECRET_KEY=SUA_CHAVE_SECRETA_AQUI
```

A chave secreta deve permanecer exclusivamente no backend. Não inclua o arquivo `.env` no GitHub.

Inicie a API:

```bash
npm run dev
```

Por padrão, ela estará disponível em:

```text
http://localhost:3000
```

A rota abaixo pode ser acessada para verificar se o servidor está respondendo:

```text
http://localhost:3000/health
```

### 4. Configurar o aplicativo

Abra outro terminal na pasta principal do projeto:

```bash
cd mobile
npm ci
```

Crie um arquivo `.env` na pasta `mobile/`, utilizando o `.env.example` como referência. Configure o endereço da API conforme o ambiente:

| Ambiente | Valor de `EXPO_PUBLIC_API_URL` |
|---|---|
| Emulador Android padrão do Android Studio | `http://10.0.2.2:3000` |
| Simulador iOS ou navegador na mesma máquina | `http://localhost:3000` |
| Celular físico | `http://IP_LOCAL_DO_COMPUTADOR:3000` |

Exemplo para celular físico:

```dotenv
EXPO_PUBLIC_API_URL=http://192.168.1.100:3000
```

Substitua o endereço pelo IP do computador que está executando a API. O celular e o computador devem estar na mesma rede, e o firewall precisa permitir a conexão na porta configurada.

Algumas telas também acessam o Supabase diretamente pelo arquivo `mobile/src/services/supabase.js`. Configure nesse arquivo a URL e a chave **publicável** do seu próprio projeto. Nunca utilize a chave secreta do backend no aplicativo.

### 5. Iniciar o aplicativo

Na pasta `mobile/`, execute:

```bash
npm start
```

Abra o aplicativo pelo Expo Go utilizando o QR Code exibido ou utilize um emulador Android.

Mantenha o backend e o Expo em execução durante o uso. Caso altere as variáveis de ambiente, reinicie o processo correspondente.

### Limitações da versão acadêmica

- O fluxo de pagamento é demonstrativo e não realiza cobranças.
- A conversa analisada utiliza mensagens locais e respostas simuladas, sem um chat completo entre usuários.
- A estrutura SQL distribuída ainda precisa ser alinhada a todos os campos utilizados pela aplicação.
- Os mecanismos de autenticação e autorização precisam de melhorias antes do uso com dados reais ou da disponibilização pública da API.

# Documentação

<ol>
<li><a href="docs/01-Documentação de Contexto.md"> Documentação de Contexto</a></li>
<li><a href="docs/02-Especificação do Projeto.md"> Especificação do Projeto</a></li>
<li><a href="docs/03-Metodologia.md"> Metodologia</a></li>
<li><a href="docs/04-Projeto de Interface.md"> Projeto de Interface</a></li>
<li><a href="docs/05-Arquitetura da Solução.md"> Arquitetura da Solução</a></li>
<li><a href="docs/06-Template Padrão da Aplicação.md"> Template Padrão da Aplicação</a></li>
<li><a href="docs/07-Programação de Funcionalidades.md"> Programação de Funcionalidades</a></li>
<li><a href="docs/08-Plano de Testes de Software.md"> Plano de Testes de Software</a></li>
<li><a href="docs/09-Registro de Testes de Software.md"> Registro de Testes de Software</a></li>
<li><a href="docs/10-Plano de Testes de Usabilidade.md"> Plano de Testes de Usabilidade</a></li>
<li><a href="docs/11-Registro de Testes de Usabilidade.md"> Registro de Testes de Usabilidade</a></li>
<li><a href="docs/12-Apresentação do Projeto.md"> Apresentação do Projeto</a></li>
<li><a href="docs/13-Referências.md"> Referências</a></li>
</ol>

# Código

<ol>
<li><a href="src/README.md"> Código Fonte</a></li>
</ol>

# Apresentação

<ol>
<li><a href="presentation/README.md"> Apresentação da solução</a></li>
</ol>
