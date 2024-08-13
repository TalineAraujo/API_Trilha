const { Router } = require("express");
const { auth } = require("../middleware/auth");
const axios = require('axios');
const Usuario = require('../models/Usuario');
const Local = require('../models/Local');

const localRoutes = Router();

localRoutes.post('/', auth, async (req, res) => {
    /*
        #swagger.tags = ['Local'],
        #swagger.parameters = ['body'] ={
           in: 'body',
           description:'Cadastra novos locais!',
           schema: {
            $nome: 'Trilha Morro das Aranhas',
            $descricao: 'Trilha de aproximadamente 45 min de subida, com uma vista para as praias do Santinho, Moçambique e Ingleses',
            $cep: '88058-700',
            $usuario_Id: '5'
        }   
    }
    */ 
    try {
        const { nome, descricao, cep, usuario_Id, pratica_esportiva } = req.body;

        if (!nome || !cep) {
            return res.status(400).json({ message: 'Nome e endereço são obrigatórios!' });
        }

        const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&postalcode=${cep}&country=Brazil&limit=1`);

        if (response.data.length === 0) {
            return res.status(400).json({ message: 'Endereço não localizado' });
        }

        const { lat, lon } = response.data[0];

        const novoLocal = await Local.create({
            nome,
            descricao,
            latitude: parseFloat(lat),
            longitude: parseFloat(lon),
            usuario_Id,
            pratica_esportiva 
        });

        res.status(201).json(novoLocal);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Não foi possível cadastrar o local' });
    }
});


localRoutes.get('/', auth, async (req, res) => {
    /* #swagger.tags = ['Local'],  
        #swagger.parameters['Locais'] = {
            in: 'query',
            description: 'Buscar todos os locais',
            type: 'string'
    } 
    */
    try {
        const usuario_Id = req.query.usuario_Id; 
        const locais = await Local.findAll({ where: { usuario_Id } });

        if (!locais || locais.length === 0) {
            return res.status(404).json({ message: 'Nenhum local cadastrado' });
        }

        res.status(200).json(locais);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Não foi possível obter os locais cadastrados' });
    }
});

localRoutes.get('/:local_id/maps', auth, async (req, res) => {
    /*
        #swagger.tags = ['Local'],  
        #swagger.parameters['local_id'] = {
            in: 'path',
            description: 'ID do local para buscar',
            type: 'string'
    },
        #swagger.parameters['usuario_Id'] = {
            in: 'query',
            description: 'Filtrar local pelo ID do usuário',
            type: 'string'
    }
    */
    try {
        const { local_id } = req.params;
        const { usuario_Id } = req.query;

        if (!usuario_Id) {
            return res.status(400).json({ message: 'ID do usuário é obrigatório!' });
        }

        const local = await Local.findOne({ where: { id: local_id, usuario_Id } });
        if (!local) {
            return res.status(404).json({ message: 'Local não encontrado ou acesso não permitido' });
        }

        const googleMapsLink = `https://www.google.com/maps?q=${local.latitude},${local.longitude}`;
        res.status(200).json({ googleMapsLink });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Não foi possível obter o link do Google Maps para o local' });
    }
});

localRoutes.delete('/:local_id', auth, async (req, res) => {
    /*  #swagger.tags = ['Local'],  
        #swagger.parameters['Usuario_id'] = {
            in: 'query',
            description: 'Excluir local',
            type: 'string'
    } 
    */
    try {
        const usuario_Id = req.query.usuario_Id; 
        const local = await Local.findOne({ where: { id: req.params.local_id, usuario_Id } });

        if (!local) {
            console.log("Local não encontrado ou permissão negada.");
            return res.status(404).json({ message: 'Local não encontrado ou acesso negado' });
        }
        await local.destroy();
        console.log("Local excluído com sucesso.");

        res.status(200).json({ message: 'Local excluído com sucesso.' });

    } catch (error) {
        console.error("Erro ao excluir o local:", error);
        return res.status(500).json({ message: 'Não foi possível excluir o local' });
    }
});

localRoutes.put('/:local_id', auth, async (req, res) => {
    /*
         #swagger.tags = ['Local'],
         #swagger.parameters = ['body'] ={
           in: 'body',
           description:'Atualizar endereço!',
           schema: {
            $nome: 'Morro das Aranhas',
            $descricao: 'Trilha fácil',
            $cep: '88058-700'
        }   
    }
    */ 
    try {
        console.log("Iniciando atualização do local...");

        const { nome, descricao, cep } = req.body;

        if (!nome || !cep) {
            return res.status(400).json({ message: 'Nome e endereço são obrigatórios!' });
        }

        const usuario_Id = req.query.usuario_Id; 
        const local = await Local.findOne({ where: { id: req.params.local_id, usuario_Id } });
        if (!local) {
            console.log("Local não encontrado ou permissão negada.");
            return res.status(404).json({ message: 'Local não encontrado ou você não tem permissão para alterar este local.' });
        }

        local.nome = nome;
        local.descricao = descricao;

        await local.save();

        console.log("Local atualizado com sucesso.");
        res.status(200).json(local);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Não foi possível atualizar as informações do local.' });
    }
});

module.exports = localRoutes;
