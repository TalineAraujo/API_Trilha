const express = require('express');
const cors = require('cors');
const { connection } = require('./database/connection');
const route = require('./route/route');



const PORT_API = process.env.PORT_API;


class Server {

  constructor(server = express()) {

    this.middlewares(server);
    this.database();
    this.initializeServer(server);
    server.use(route)

  }

  async middlewares(app) {
    app.use(cors());
    app.use(express.json());
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
    app.listen(PORT_API, () =>
      console.log(`Servidor executando na porta ${PORT_API}`)
    );
  }

 
}

module.exports = { Server };
