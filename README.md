# API de Avaliação de Trilhas

## Descrição do Projeto
Desenvolvi uma API com as funções CRUD para cadastrar novos usuários e locais em uma plataforma de avaliação de trilhas. O objetivo do projeto é que o usuário possa cadastrar os locais que já visitou e fazer uma breve descrição do que achou da trilha.

## Funcionalidades
- Cadastro de novos usuários
- Cadastro de locais visitados
- Avaliação e descrição de trilhas pelos usuários

## Melhorias Planejadas
Para um melhor desempenho, seria interessante incluir:
- Upload de imagens do local
- Registro do tempo que a pessoa levou para concluir a trilha
- Exibição do perfil do usuário (iniciante ou experiente) que cadastrou a trilha

## Dificuldades e Futuras Melhorias
Desenvolver o projeto sozinha trouxe algumas dificuldades que foram boas para o aprendizado. Minhas maiores dificuldades foram:
- Rotas: Inicialmente, fiz as rotas separadas dos controllers, mas enfrentei problemas com a nomenclatura inconsistente (singular/plural), o que me confundiu. Tive que reiniciar o projeto e optei por fazer as rotas sem controllers.
- Comentários: Notei a falta de comentários nas rotas, o que dificulta a compreensão do código.

Futuras melhorias incluem:
- Criação de controllers
- Inclusão de comentários no código
- Consistência na definição dos nomes de pastas e arquivos

## Bibliotecas Utilizadas
- Sequelize: `npm install sequelize`
- Driver do PostgreSQL: `npm install pg`
- CLI do Sequelize: `npm install -g sequelize-cli`
- Dotenv: `npm install dotenv`
- JsonWebToken (JWT): `npm install jsonwebtoken`
- Axios: `npm install axios`
- Swagger UI: `npm install swagger-ui-express`
- Swagger AutoGen: `npm install swagger-autogen`

## Comandos Git Utilizados
- Inicializar repositório: `git init`
- Adicionar repositório remoto: `git remote add origin https://github.com/TalineAraujo/API_Trilha.git`
- Adicionar arquivos: `git add .`
- Comitar alterações: `git commit -m "mensagem"`
- Enviar para o repositório remoto: `git push -u origin main`
- Criar nova branch: `git checkout -b develop`

## Rotas Utilizadas
A documentação das rotas pode ser acessada em: [Documentação das Rotas](http://localhost:9000/docs/#/)

**Atenção para a porta 9000**

## Executando o Repositório



### Instalação das Dependências

Na primeira vez, instale as dependências:
npm install
npm install --dev
cp .env_example .env

### Rodar o Projeto em Ambiente Local

npm run start:dev

## Trabalhando com Migrations

### Criar uma Migração

npx sequelize-cli migration:generate --name create-Usuario
npx sequelize-cli migration:generate --name create-locais

### Rodar as Migrations e Seeders

sequelize db:migrate
npm run swagger