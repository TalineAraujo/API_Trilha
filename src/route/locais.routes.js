const { Router } = require("express");
const { auth } = require("../middleware/auth");
const axios = require('axios');
const Usuario = require('../models/Usuario');
const Local = require('../models/Local');

const localRoutes = Router();

localRoutes.post('/', auth, async (req, res) =>{
    try{
        const{
            nome,
            descricao,
            endereco,
            usuarioId
        }= req.body;

      

        if(!nome || !endereco){
            return res.status(400).json({message: 'Nome e endereço são obrigatórios!'})
        }

        const response = await axios.get('https://nominatim.openstreetmap.org/search?q=${endereco}&format=json');
        // console.log(response)


           
        if (response.data.length === 0){
            return res.status(400).json({message: 'Endereço não localizado' })
        }

        const { lat, lon} = response.data[0];

        const novoLocal =  await Local.create({
            nome, 
            descricao,
            latitude: parseFloat(lat),
            longitude: parseFloat(lon),
            usuarioId: usuarioId
        })

        res.status(201).json(novoLocal);


    }catch(error){
        console.error(error);
        return res.status(500).json({error: 'Não foi possível cadastrar o local'});
    }
});

module.exports = localRoutes;