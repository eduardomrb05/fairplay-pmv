# Arquitetura da Solução

<span style="color:red">Pré-requisitos: <a href="3-Projeto de Interface.md"> Projeto de Interface</a></span>

Arquitetura da Solução

A arquitetura do sistema FairPlay é baseada em um modelo cliente-servidor, onde a aplicação móvel atua como interface principal de interação com o usuário.

O front-end foi desenvolvido utilizando React Native, sendo responsável pela apresentação das telas, navegação e interação do usuário com as funcionalidades do sistema, como cadastro, busca de quadras, reservas e pagamentos.

Para simular o back-end, foi utilizado o json-server, que atua como uma API REST fake, permitindo a comunicação entre o aplicativo e os dados armazenados. Essa abordagem possibilita realizar operações de criação, leitura, atualização e exclusão (CRUD) de forma prática durante o desenvolvimento.

Os dados da aplicação são armazenados em um arquivo db.json, que representa o banco de dados da aplicação, contendo informações como usuários, empresas, quadras, reservas e pagamentos.

Dessa forma, a arquitetura permite uma separação clara entre interface, lógica e dados, facilitando a manutenção, escalabilidade e evolução do sistema.

<img width="800" height="500" alt="arquitetura_fairplay" src="https://github.com/user-attachments/assets/e9d42c98-5aaa-42ef-b41f-e7ce7cff79fd" />

## Diagrama de Classes

<img width="1316" height="963" alt="Diagrama de Classe FairPlay" src="https://github.com/user-attachments/assets/38c2db61-bd0d-4f14-8c16-3b50907f954d" />

O diagrama de classes ilustra graficamente como será a estrutura do software, e como cada uma das classes da sua estrutura estarão interligadas. Essas classes servem de modelo para materializar os objetos que executarão na memória.

> - [Diagrama de Classe | Lucidchart](https://lucid.app/lucidchart/12665a9a-10d0-4306-b5f2-6344c99a64f9/edit?invitationId=inv_b2c0fa18-cae0-4ad1-8b79-d463d71f0871&page=HWEp-vi-RSFO#)

## Modelo ER

<img width="1536" height="1024" alt="Modelo ER FairPlay" src="https://github.com/user-attachments/assets/f6de9fea-e125-4f88-af21-c509c623edc9" />

Descrição do Modelo Entidade-Relacionamento (DER)

O modelo Entidade-Relacionamento (DER) do sistema FairPlay representa a estrutura de dados de um aplicativo voltado para o gerenciamento e reserva de quadras esportivas.

As principais entidades do sistema são: Usuário, Empresa, Quadra, Reserva, Pagamento, Avaliação, Conversa, Mensagem e Disponibilidade. O Usuário é responsável por realizar reservas, podendo associar-se a várias delas, enquanto a Empresa gerencia as Quadras disponíveis para locação.

Cada Quadra pertence a uma Empresa e pode possuir múltiplas reservas e disponibilidades de horários. A Reserva representa o agendamento feito por um usuário para uma quadra específica e está diretamente associada a um Pagamento.

O sistema também permite que Usuários realizem Avaliações das quadras utilizadas, além de possibilitar a comunicação entre Usuários e Empresas por meio de Conversas e Mensagens.

Dessa forma, o modelo organiza as relações entre os dados de maneira consistente, garantindo suporte adequado às funcionalidades do sistema e às regras de negócio propostas.

## Modelo DER

<img width="1006" height="816" alt="Modelo DER" src="https://github.com/user-attachments/assets/244ee7d6-1f80-4d4e-aa8f-ac1fa5fe89d8" />

## Esquema Relacional

<img width="1536" height="1024" alt="Modelo Relacional FairPlay" src="https://github.com/user-attachments/assets/22d7d26a-d008-487a-9e49-184a344758af" />

O Esquema Relacional corresponde à representação dos dados em tabelas juntamente com as restrições de integridade e chave primária.

 
## Modelo Físico

Entregar um arquivo banco.sql contendo os scripts de criação das tabelas do banco de dados. Este arquivo deverá ser incluído dentro da pasta src\bd.

## Tecnologias Utilizadas

Descreva aqui qual(is) tecnologias você vai usar para resolver o seu problema, ou seja, implementar a sua solução. Liste todas as tecnologias envolvidas, linguagens a serem utilizadas, serviços web, frameworks, bibliotecas, IDEs de desenvolvimento, e ferramentas.

Apresente também uma figura explicando como as tecnologias estão relacionadas ou como uma interação do usuário com o sistema vai ser conduzida, por onde ela passa até retornar uma resposta ao usuário.

## Hospedagem

Explique como a hospedagem e o lançamento da plataforma foi feita.

> **Links Úteis**:
>
> - [Website com GitHub Pages](https://pages.github.com/)
> - [Programação colaborativa com Repl.it](https://repl.it/)
> - [Getting Started with Heroku](https://devcenter.heroku.com/start)
> - [Publicando Seu Site No Heroku](http://pythonclub.com.br/publicando-seu-hello-world-no-heroku.html)

## Qualidade de Software

Conceituar qualidade de fato é uma tarefa complexa, mas ela pode ser vista como um método gerencial que através de procedimentos disseminados por toda a organização, busca garantir um produto final que satisfaça às expectativas dos stakeholders.

No contexto de desenvolvimento de software, qualidade pode ser entendida como um conjunto de características a serem satisfeitas, de modo que o produto de software atenda às necessidades de seus usuários. Entretanto, tal nível de satisfação nem sempre é alcançado de forma espontânea, devendo ser continuamente construído. Assim, a qualidade do produto depende fortemente do seu respectivo processo de desenvolvimento.

A norma internacional ISO/IEC 25010, que é uma atualização da ISO/IEC 9126, define oito características e 30 subcaracterísticas de qualidade para produtos de software.
Com base nessas características e nas respectivas sub-características, identifique as sub-características que sua equipe utilizará como base para nortear o desenvolvimento do projeto de software considerando-se alguns aspectos simples de qualidade. Justifique as subcaracterísticas escolhidas pelo time e elenque as métricas que permitirão a equipe avaliar os objetos de interesse.

> **Links Úteis**:
>
> - [ISO/IEC 25010:2011 - Systems and software engineering — Systems and software Quality Requirements and Evaluation (SQuaRE) — System and software quality models](https://www.iso.org/standard/35733.html/)
> - [Análise sobre a ISO 9126 – NBR 13596](https://www.tiespecialistas.com.br/analise-sobre-iso-9126-nbr-13596/)
> - [Qualidade de Software - Engenharia de Software 29](https://www.devmedia.com.br/qualidade-de-software-engenharia-de-software-29/18209/)
