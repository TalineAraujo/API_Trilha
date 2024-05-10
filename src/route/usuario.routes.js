const { Router } = require('express');
const Usuario = require('../models/Usuario');
// Importe o middleware 'auth' aqui, se necessário

const usuarioRoutes = Router();

function validarCPF(cpf) {
    cpf = cpf.replace(/\D/g, ''); // Remove caracteres especiais
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
        return false; // CPF deve ter 11 dígitos e não pode ser sequencial
    }
}

usuarioRoutes.post('/usuario', async (req, res) => {
    try {
        const {
            nome,
            email,
            cpf,
            sexo,
            senha,
            data_nascimento,
            endereco
        } = req.body;

        if (!nome) {
            return res.status(400).json({ message: 'O nome é obrigatório' });
        }

        if (!email) {
            return res.status(400).json({ message: 'O email é obrigatório' });
        }

        const usuarioCadastrado = await Usuario.findOne({ where: { email } });
        if (usuarioCadastrado) {
            return res.status(400).json({ error: true, message: 'Email já cadastrado!' });
        }

        if (!cpf || !validarCPF(cpf)) {
            return res.status(400).json({ message: 'CPF inválido' });
        }

        if (!data_nascimento) {
            return res.status(400).json({ message: 'A data de nascimento é obrigatória' });
        }
        if (!data_nascimento.match(/\d{4}-\d{2}-\d{2}/)) {
            return res.status(400).json({ message: 'A data de nascimento não está no formato correto' });
        }

        const usuario = await Usuario.create({
            nome:nome,
            email:email,
            cpf:cpf,
            sexo:sexo,
            data_nascimento:data_nascimento,
            endereco:endereco
        });

        res.status(201).json(usuario);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Não foi possível cadastrar o usuário' });
    }
});




module.exports = usuarioRoutes 