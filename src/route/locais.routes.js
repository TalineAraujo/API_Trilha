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
                $nome: 'Trilha Morro das aranhas',
                $descricao: 'Trilha de aproximadamente 45 min de subida, com uma vista para as praias do Santinho, Moçambique e Ingleses',
                $cep: '88058-700',
                $usuario_Id: '5'
            }   
        }
    */ 
    try {
        const {
            nome,
            descricao,
            cep,
            pratica_esportiva
        } = req.body;

        const usuario_Id = req.userId; // Obtém o ID do usuário do token

        // Verifica se os campos obrigatórios estão presentes
        if (!nome || !cep || !usuario_Id) {
            return res.status(400).json({ message: 'Nome, endereço, e ID do usuário são obrigatórios!' });
        }

        // Faz a requisição para obter coordenadas a partir do CEP
        const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&postalcode=${cep}&country=Brazil&limit=1`);

        if (response.data.length === 0) {
            return res.status(400).json({ message: 'Endereço não localizado' });
        }

        const { lat, lon } = response.data[0];

        // Cria o novo local no banco de dados
        const novoLocal = await Local.create({
            nome,
            descricao,
            latitude: parseFloat(lat),
            longitude: parseFloat(lon),
            usuario_Id, // Adiciona o ID do usuário
            pratica_esportiva
        });

        res.status(201).json(novoLocal);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Não foi possível cadastrar o local' });
    }
});

// Rota para obter todos os locais cadastrados para um usuário
localRoutes.get('/', auth, async (req, res) => {
    /*
        #swagger.tags = ['Local'],
        #swagger.parameters = {
            in: 'query',
            description: 'Buscar todos os locais cadastrados',
            type: 'string'
        } 
    */
    try {
        // Busca todos os locais, independentemente do usuário
        const locais = await Local.findAll();

        if (!locais || locais.length === 0) {
            return res.status(404).json({ message: 'Nenhum local cadastrado' });
        }

        res.status(200).json(locais);

    } catch (error) {
        console.error('Erro ao buscar locais:', error);
        return res.status(500).json({ error: 'Não foi possível obter os locais cadastrados' });
    }
});







// Rota para obter o link do Google Maps para um local específico
localRoutes.get('/:local_id/maps', auth, async (req, res) => {
    /*
        #swagger.tags = ['Local'],
        #swagger.parameters = {
            in: 'query',
            description: 'Obter link do Google Maps para um local',
            type: 'string'
        }
    */
    try {
        const usuario_Id = req.query.usuario_id; // Ajustando para 'usuario_Id'
        if (!usuario_Id) {
            return res.status(400).json({ message: 'ID do usuário é obrigatório' });
        }

        const local = await Local.findOne({ where: { id: req.params.local_id, usuario_Id } });
        
        if (!local) {
            return res.status(404).json({ message: 'Local não encontrado ou acesso não permitido' });
        }
        
        const googleMapsLink = `https://www.google.com/maps?q=${local.latitude},${local.longitude}`;
        res.status(200).json({ googleMapsLink });
    } catch (error) {
        console.error('Erro ao obter link do Google Maps:', error);
        return res.status(500).json({ error: 'Não foi possível obter o link do Google Maps para o local' });
    }
});

// Rota para excluir um local
localRoutes.delete('/:local_id', auth, async (req, res) => {
    /*
        #swagger.tags = ['Local'],
        #swagger.parameters = {
            in: 'query',
            description: 'Excluir local',
            type: 'string'
        }
    */
    try {
        const usuario_Id = req.query.usuario_id; // Ajustando para 'usuario_Id'
        if (!usuario_Id) {
            return res.status(400).json({ message: 'ID do usuário é obrigatório' });
        }

        const local = await Local.findOne({ where: { id: req.params.local_id, usuario_Id } });

        if (!local) {
            console.log("Local não encontrado ou permissão negada.");
            return res.status(404).json({ message: 'Local não encontrado ou acesso negado' });
        }

        await local.destroy();
        console.log("Local excluído com sucesso.");

        res.status(200).json({ message: 'Local excluído com sucesso.' });

    } catch (error) {
        console.error('Erro ao excluir o local:', error);
        return res.status(500).json({ message: 'Não foi possível excluir o local' });
    }
});

// Rota para atualizar um local
localRoutes.put('/:local_id', auth, async (req, res) => {
    /*
        #swagger.tags = ['Local'],
        #swagger.parameters = ['body'] ={
            in: 'body',
            description: 'Atualizar informações de um local',
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
            return res.status(400).json({ message: 'Nome e CEP são obrigatórios!' });
        }

        const usuario_Id = req.query.usuario_id; // Ajustando para 'usuario_Id'
        if (!usuario_Id) {
            return res.status(400).json({ message: 'ID do usuário é obrigatório' });
        }

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
        console.error('Erro ao atualizar o local:', error);
        return res.status(500).json({ error: 'Não foi possível atualizar as informações do local.' });
    }
});

module.exports = localRoutes;