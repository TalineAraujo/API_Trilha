const { Router } = require('express');
const Usuario = require('../models/Usuario');
// Importe o middleware 'auth' aqui, se necessário

const usuarioRoutes = Router();

function validarCPF(cpf) {
    cpf = cpf.replace(/\D/g, ''); // Remove caracteres especiais
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
        return false; // CPF deve ter 11 dígitos e não pode ser sequencial
    }
    return true;
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

        console.log("Dados recebidos:", req.body);

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
            senha: senha,
            data_nascimento:data_nascimento,
            endereco:endereco
        });

        console.log("Dados recebidos:", req.body);

        res.status(201).json(usuario);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Não foi possível cadastrar o usuário' });
    }
});

usuarioRoutes.get('/usuario/:id', async (req, res) => {
    try{
        const {id} = req.params;
        const usuario = await Usuario.findByPk(id);
        if (!usuario){
            return res.status(404).json({ error: 'Usuário não encontrado!'});
        }

        res.json(usuario);
    }catch (error){
        console.error (error.massage);
        res.status(500).json({ error: "erro ao buscar usuario"});
    }

});

usuarioRoutes.get('/usuario', async (req, res) =>{
    try{
        const usuario = await Usuario.findAll();
    res.json(usuario);
    }catch(error){
        console.error(error.massage);
        res.status(500).json({ error: 'Erro ao buscar usuarios'})
    }
    

})

module.exports = usuarioRoutes 