const express = require('express');
const cors = require('cors');
const { connection } = require('./database/connection');
const PORT_API = process.env.PORT_API;


const route = require('./route/route');

// const usuarioRouter = require("./route/usuario.routes");
// const loginRouter = require("./route/login.routes");
// // const locaisRouter = require("./route/locais.routes");

class Server {
  constructor (server = express()) {
    this.middlewares(server);
    this.database();
    this.initializeServer(server);
    server.use(route);
    
  }

  async middlewares(app) {
    app.use(cors());
    app.use(express.json());

    
    
    // Usando as rotas
    // app.use('/usuario', usuarioRouter);
  
    // app.use('/login', loginRouter);
    
    // // app.use('/locais', locaisRouter);
  }

  async database() {
    try {
      await connection.authenticate();
      console.log('Conexão bem sucedida!');
    } catch (error) {
      console.error('Não foi possível conectar no banco de dados.', error);
      throw error;
    }
  }

  async initializeServer(app) {
    app.listen(PORT_API, () => console.log(`Servidor executando na porta ${PORT_API}`));
  }
}

module.exports = { Server };
