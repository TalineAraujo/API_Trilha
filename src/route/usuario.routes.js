const { Router } = require('express');
const Usuario = require('../models/Usuario');
const { auth } = require('../middleware/auth'); // Certifique-se de que auth está definido corretamente
const Local = require('../models/Local');

const usuarioRoutes = Router();

function validarCPF(cpf) {
    cpf = cpf.replace(/\D/g, ''); // Remove caracteres especiais
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
        return false; // CPF deve ter 11 dígitos e não pode ser sequencial
    }
    return true;
}

usuarioRoutes.post('/', async (req, res) => {
    try {
        const { nome, email, cpf, sexo, senha, data_nascimento, endereco } = req.body;

        if (!nome) return res.status(400).json({ message: 'O nome é obrigatório' });
        if (!senha) return res.status(400).json({ message: 'A senha é obrigatória' });
        if (!email) return res.status(400).json({ message: 'O email é obrigatório' });

        const usuarioCadastrado = await Usuario.findOne({ where: { email } });
        if (usuarioCadastrado) return res.status(400).json({ error: true, message: 'Email já cadastrado!' });

        if (!cpf || !validarCPF(cpf)) return res.status(400).json({ message: 'CPF inválido' });
        if (!data_nascimento) return res.status(400).json({ message: 'A data de nascimento é obrigatória' });
        if (!data_nascimento.match(/\d{4}-\d{2}-\d{2}/)) return res.status(400).json({ message: 'A data de nascimento não está no formato correto' });

        const usuario = await Usuario.create({ nome, email, cpf, sexo, senha, data_nascimento, endereco });

        res.status(201).json(usuario);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Não foi possível cadastrar o usuário' });
    }
});

usuarioRoutes.get('/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const usuario = await Usuario.findByPk(id);
        if (!usuario) return res.status(404).json({ error: 'Usuário não encontrado!' });

        res.json(usuario);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Erro ao buscar usuário' });
    }
});

usuarioRoutes.get('/', auth, async (req, res) => {
    try {
        const usuarios = await Usuario.findAll();
        res.json(usuarios);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Erro ao buscar usuários' });
    }
});

usuarioRoutes.delete('/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const enderecoUsuario = await Local.findOne({ where: { usuario_Id: id } });

        if (enderecoUsuario) return res.status(400).json({ error: true, message: 'Este usuário não pode ser excluído pois possui endereços cadastrados.' });

        const usuarioExcluido = await Usuario.destroy({ where: { id } });

        if (!usuarioExcluido) return res.status(404).json({ error: true, message: 'Usuário não encontrado.' });

        res.json({ message: 'Usuário excluído com sucesso.' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Não foi possível excluir o usuário.' });
    }
});

module.exports = usuarioRoutes;


