const usuarioRoutes = require ('./usuario.routes');
const localRoutes = require('./locais.routes');
const loginRoutes = require ('./login.routes');

const { Router } = require("express");

const route = Router(); 


route.use('/usuario', usuarioRoutes);
      
route.use('/login', loginRoutes);

route.use('/local', localRoutes);


module.exports = route;