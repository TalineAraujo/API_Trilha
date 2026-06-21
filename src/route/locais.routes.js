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
            $cep: '88058-700'
        }
    }
    */
    try {
        const { nome, descricao, cep } = req.body;
        const usuarioId = req.payload.sub;

        if (!nome || !cep) {
            return res.status(400).json({ message: 'Nome e endereço são obrigatórios!' });
        }

        const viaCepResponse = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);

        if (viaCepResponse.data.erro) {
            return res.status(400).json({ message: 'CEP não encontrado' });
        }

        const { logradouro, bairro, localidade, uf } = viaCepResponse.data;
        const enderecoCompleto = `${logradouro}, ${bairro}, ${localidade}, ${uf}, Brazil`;

        const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(enderecoCompleto)}&limit=1`, {
            headers: { 'User-Agent': 'PathFinder/1.0 (talinearaujo79@gmail.com)' }
        });

        if (response.data.length === 0) {
            return res.status(400).json({ message: 'Endereço não localizado' });
        }

        const { lat, lon } = response.data[0];

        const novoLocal = await Local.create({
            nome,
            descricao,
            cep,
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
     /* #swagger.tags = ['Local'],  
        #swagger.parameters['Locais'] = {
            in: 'query',
            description: 'Buscar todos os locais',
            type: 'string'
    } 
    */
    try {
        const locais = await Local.findAll();
        res.status(200).json(locais);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Não foi possível obter os locais cadastrados' });
    }
});
localRoutes.get('/:local_id', auth, async (req, res) => {
    try {
        const local = await Local.findByPk(req.params.local_id);
        if (!local) {
            return res.status(404).json({ message: 'Local não encontrado' });
        }
        res.status(200).json(local);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Não foi possível obter o local' });
    }
});

localRoutes.get('/:local_id/maps', auth, async (req, res) => {
      /*
        #swagger.tags = ['Local'],  
        #swagger.parameters['Local_id'] = {
            in: 'query',
            description: 'Filtrar local pelo ID',
            type: 'string'
    }
    
    */
    try {
        const usuarioId = req.payload.sub;
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
    /*  #swagger.tags = ['Local'],  
        #swagger.parameters['Usuario_id'] = {
            in: 'query',
            description: 'Excluir local',
            type: 'string'
    } 
    */
  try{

    const usuarioId = req.payload.sub;
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
    /*
         #swagger.tags = ['Local'],
         #swagger.parameters = ['body'] ={
           in: 'body',
           description:'Atualizar endereço!',
           schema: {
            $nome: 'Morro das Aranhas',
            $descrição: 'Trilha facil',
            $cep: '88058-700'
            
        }   
    }
    */ 
  try {
      const { nome, descricao, cep } = req.body;

      if (!nome || !cep) {
          return res.status(400).json({ message: 'Nome e endereço são obrigatórios!' });
      }

      const usuarioId = req.payload.sub;
      const local = await Local.findOne({ where: { id: req.params.local_id, usuarioId: usuarioId } });
      if (!local) {
          return res.status(404).json({ message: 'Local não encontrado ou você não tem permissão para alterar este local.' });
      }

      const viaCepResponse = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);

      if (viaCepResponse.data.erro) {
          return res.status(400).json({ message: 'CEP não encontrado' });
      }

      const { logradouro, bairro, localidade, uf } = viaCepResponse.data;
      const enderecoCompleto = `${logradouro}, ${bairro}, ${localidade}, ${uf}, Brazil`;

      const nominatimResponse = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(enderecoCompleto)}&limit=1`, {
          headers: { 'User-Agent': 'PathFinder/1.0 (talinearaujo79@gmail.com)' }
      });

      if (nominatimResponse.data.length === 0) {
          return res.status(400).json({ message: 'Endereço não localizado' });
      }

      const { lat, lon } = nominatimResponse.data[0];

      local.nome = nome;
      local.descricao = descricao;
      local.cep = cep;
      local.latitude = parseFloat(lat);
      local.longitude = parseFloat(lon);

      await local.save();

      res.status(200).json(local);
  } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Não foi possível atualizar as informações do local.' });
  }
});
  



module.exports = localRoutes;