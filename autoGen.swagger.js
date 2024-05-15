const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'API_Trilha',
    description: 'API para cadastro de novos usuários/locais',
    version: '1.0.0'
  },
  host: 'http://localhost:9000',
  security: [{"apiKeyAuth": []}],
  securityDefinitions: {
    apiKeyAuth: {
      type: 'apiKey',
      in: 'header', // can be 'header', 'query' or 'cookie'
      name: 'authorization', // name of the header, query parameter or cookie
      description: 'Token de Autenticação'
    }
  }
};

const outputFile = './src/route/swagger.json'; // Corrigido o caminho do arquivo de saída para 'route'
const routes = ['./src/server.js'];

swaggerAutogen(outputFile, routes, doc);
