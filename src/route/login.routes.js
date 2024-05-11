const { Router } = require('express');
const loginRoutes = Router();
const Usuario = require('../models/Usuario');
const { sign } = require('jsonwebtoken');

loginRoutes.post('/login', async (req, res) => {
    try {    
        const email = req.body.email;
        const senha = req.body.senha;

        if (!email) {
            return res.status(400).json({ message: 'O email é obrigatório!' });
        }

        if (!senha) {
            return res.status(400).json({ message: 'A senha é obrigatória!' });
        }

        const usuario = await Usuario.findOne({
            where: { email: email, senha: senha }
        });

        if (!usuario) {
            return res.status(404).json({ message: 'Não foi encontrado usuário correspondente aos dados fornecidos' });
        }

        const payload = { sub: usuario.id, email: usuario.email, nome: usuario.nome };
        const token = sign(payload, process.env.SECRET_JWT);

        res.status(200).json({ token: token });
    } catch(error) {
        console.error(error.message);
        res.status(500).json({ error: 'Erro ao logar!' });
    }
});

module.exports = loginRoutes;
