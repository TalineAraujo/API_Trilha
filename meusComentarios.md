npm init
npm install --dev
npm install -g nodemon
npm install express
npm install cors
npm install sequelize
npm install pg
npm install -g sequelize-cli
npm install dotenv
npm install jsonwebtoken

git init
git remote add origin https://github.com/TalineAraujo/API_Trilha.git
git add. 
git commit -m 
git push -u origin main

git checkout -b develop

Por exemplo, se você quiser adicionar um novo arquivo e enviar para a branch "develop", você pode fazer algo assim:

git add novo_arquivo.js
git commit -m "Adicionando novo arquivo"
git push origin develop

Preciso arrumar a porta na main, pq não ficou igual a 6000

09/05 

Consegui criar o banco de dados, mas estou com problema no postman, toda hora preciso trocar a porta pq fala que tá sendo usada, e não estou conseguindo cadastrar os usuarios, preciso corrigir as configurações 

11/05 

criei a rota login.routes.js para fazer a authencicação do usuário 

npx sequelize-cli migration:generate --name create-Usuario
npx sequelize-cli migration:generate --name create-locais
sequelize db:migrate


12/05 

Que diabeira foi arrumar essas rotas 

para implemntar a regra de authenticação tive que criar duas variaveis para guardar os valores passados por req.query e req.params 
fiz os teste e ficou tudo funcionando direitinho 
Preciso verificar o swagger e seeders 
Criar o READMI.md 

npm install swagger-ui-express
npm install swagger-autogen
npm run swagger 


meu olho treme, mas conferi os teste e tá tudo certo 