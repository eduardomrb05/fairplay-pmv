# Registro de Testes de Software

<span style="color:red">Pré-requisitos: <a href="3-Projeto de Interface.md"> Projeto de Interface</a></span>, <a href="8-Plano de Testes de Software.md"> Plano de Testes de Software</a>

Para cada caso de teste definido no Plano de Testes de Software, realize o registro das evidências dos testes feitos na aplicação pela equipe, que comprovem que o critério de êxito foi alcançado (ou não!!!). Para isso, utilize uma ferramenta de captura de tela que mostre cada um dos casos de teste definidos (obs.: cada caso de teste deverá possuir um vídeo do tipo _screencast_ para caracterizar uma evidência do referido caso).

| **Caso de Teste** 	| **CT01 – Cadastrar perfil empresa** 	|
|:---:	|:---:	|
|	Requisito Associado 	| RF-007 - A aplicação deve apresentar, na página principal, a funcionalidade de cadastro de empresas para que esses consigam criar e gerenciar seu perfil. |
|Registro de evidência | Em ajuste de bug |

| **Caso de Teste** 	| **CT02 – Gerenciar perfil empresa** 	|
|:---:	|:---:	|
|	Requisito Associado 	| RF-008 - A aplicação deve permitir que empresa gerencie seus dados assim como cadastrar quadras e conversar com clientes via chat. |
|Registro de evidência | Em construção. Criado apenas front faltando back |

## CT03 – Cadastrar usuário

| Campo | Descrição |
|------|------|
| **Requisito Associado** | **RF-001** - O sistema deve permitir que usuário se cadastre informando nome, CPF, telefone, email e senha. |
| **Registro de evidência** | Cadastro realizado com sucesso através da tela de cadastro de usuários, preenchendo nome, CPF, telefone, email e senha. Após confirmação, os dados foram armazenados corretamente no banco de dados e o usuário foi redirecionado para a tela de login. |

---

## CT04 – Login de usuários e empresas

| Campo | Descrição |
|------|------|
| **Requisito Associado** | **RF-003** - O sistema deve permitir que usuários e empresas realizem login com credenciais válidas. |
| **Registro de evidência** | Login realizado com sucesso utilizando credenciais válidas para usuários e empresas. O sistema validou os dados informados, criou a sessão corretamente e redirecionou para as respectivas áreas do sistema. |

---

## CT05 – Cadastrar perfil empresa

| Campo | Descrição |
|------|------|
| **Requisito Associado** | **RF-007** - O sistema deve permitir que empresas se cadastrem e criem seu perfil (nome, CNPJ, contato e localização). |
| **Registro de evidência** | Cadastro de empresa realizado com sucesso preenchendo nome, CNPJ, telefone, endereço, email e senha. As informações foram persistidas no banco de dados, permitindo posteriormente o gerenciamento do perfil da empresa. |

## Relatório de testes de software

Apresente e discuta detalhadamente os resultados obtidos nos testes realizados, destacando tanto os pontos fortes quanto as fragilidades identificadas na solução. Explique como os aspectos positivos contribuem para o desempenho e a usabilidade do sistema, e como os pontos fracos impactam sua eficácia.

Josué Maciel - Etapa 3 - Durante os testes realizados na funcionalidade de cadastro de empresa, foi identificado que alguns elementos da interface encontram-se sobrepostos, especificamente o botão “Voltar” e a logo da aplicação. Também foi observado que, ao abrir o teclado no dispositivo móvel, os campos do formulário não acompanham o deslocamento da tela, dificultando a visualização e o preenchimento das informações pelo usuário.

Nos testes executados, o botão “Criar” ainda não realiza o redirecionamento esperado e os dados informados não foram persistidos na tabela do banco de dados, indicando necessidade de integração e validação do back-end relacionado ao cadastro da empresa.

Além disso, a página “Perfil da Empresa” encontra-se atualmente com apenas a estrutura de front-end implementada, sendo necessários ajustes visuais e o desenvolvimento das funcionalidades de back-end, principalmente nas seções que dependem de botões de ação e interações dinâmicas da aplicação.

Anna Leocádio - Etapa 4 - Durante os testes realizados nas funcionalidades de usuários e empresas, foram identificados problemas relacionados à integração entre front-end, back-end e banco de dados, principalmente nas funcionalidades de cadastro e login de empresas. Foi necessário realizar ajustes na API, padronização de campos e adequações no banco de dados para garantir o funcionamento correto.

Nos testes realizados, foi possível validar o cadastro de usuários e empresas, autenticação, persistência de dados no banco e carregamento das informações nas telas administrativas. Também foram implementadas funcionalidades relacionadas ao gerenciamento de empresas, incluindo listagem, status e visualização de perfil.

Como pontos positivos, destaca-se a integração funcional com o banco de dados, autenticação funcionando corretamente e evolução significativa da área administrativa. Como fragilidades, ainda existem funcionalidades em desenvolvimento, principalmente relacionadas à edição completa de perfil e refinamentos visuais.

Como melhorias futuras, propõe-se finalizar integrações pendentes, ampliar validações e melhorar a experiência visual e de navegação da aplicação, aumentando estabilidade e usabilidade do sistema.


Por fim, apresente e/ou proponha as melhorias a partir dos testes realizados, destacando os ganhos obtidos e como essas alterações contribuem para a evolução do projeto.

> **Links Úteis**:
> - [Ferramentas de Test para Java Script](https://geekflare.com/javascript-unit-testing/)
