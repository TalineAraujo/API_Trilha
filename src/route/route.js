const usuarioRoutes = require ('./usuario.routes');
const localRoutes = require('./locais.routes');
const loginRoutes = require ('./login.routes');

const { Router } = require("express");

const route = Router(); 
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');


route.use('/usuario', usuarioRoutes);
      
route.use('/login', loginRoutes);

route.use('/local', localRoutes);

route.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


module.exports = route;