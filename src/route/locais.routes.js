const { Router } = require("express");
const { auth } = require("../middleware/auth");
const axios = require('axios');
const Usuario = require('../models/Usuario');
const Local = require('../models/Local');

const localRoutes = Router();

localRoutes.post('/', auth, async (req, res) => {
    try {
        const {
            nome,
            descricao,
            cep,
            usuarioId
        } = req.body;

        if (!nome || !cep || !usuarioId) {
            return res.status(400).json({ message: 'Nome, endereço e ID são obrigatórios!' });
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
            usuarioId
        });

        res.status(201).json(novoLocal);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Não foi possível cadastrar o local' });
    }
});
localRoutes.get('/', auth, async (req, res) => {
    try {
        const usuarioId = req.query.usuario_Id; // Ajuste para acessar o usuario_Id da consulta
        const locais = await Local.findAll({ where: { usuarioId: usuarioId } });

  
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
    try {
        const usuarioId = req.query.usuario_id; // Ajustando para 'usuario_id'
        const local = await Local.findOne({ where: { id: req.params.local_id, usuarioId: usuarioId } });
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
localRoutes.delete('/:local_id', auth, async (req, res) =>{
  try{

    const usuarioId = req.query.usuario_id; // Ajustando para 'usuario_id'
    const local = await Local.findOne({ where: { id: req.params.local_id, usuarioId: usuarioId } });

      if (!local){
          console.log("Local não encontrado ou permissão negada.");
          return res.status(404).json({message:'Local não encontrado ou acesso negado'})
      }
      await local.destroy();
      console.log("Local excluído com sucesso.");

      res.status(200).json({ message: 'Local excluído com sucesso.' });

  }catch(error){
      console.error("Erro ao excluir o local:", error);
      return res.status(500).json({message: 'Não foi possivel excluir o local'});
  }

});
localRoutes.put('/:local_id', auth, async (req, res) => {
  try {
      console.log("Iniciando atualização do local...");

      const { nome, descricao, cep, } = req.body;

      
      if (!nome || !cep) {
          return res.status(400).json({ message: 'Nome e endereço são obrigatórios!' });
      }

     
      const usuarioId = req.query.usuario_id; // Ajustando para 'usuario_id'
      const local = await Local.findOne({ where: { id: req.params.local_id, usuarioId: usuarioId } });
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
      console.error("Erro ao atualizar o local:", error);
      return res.status(500).json({ error: 'Não foi possível atualizar as informações do local.' });
  }
});
  



module.exports = localRoutes;