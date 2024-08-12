const { Router } = require('express');
const Usuario = require('../models/Usuario');
const { auth } = require('../middleware/auth');
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
    /*
         #swagger.tags = ['Usuario'],
         #swagger.parameters = ['body'] ={
           in: 'body',
           description:'Cadastra novos usuários!',
           schema: {
            $nome: 'Taline Araujo',
            $email: 'taline.araujo@hotmail.com',
            $cpf: '02602502789',
            sexo: 'Feminino',
            $senha: 'teste123',
            $data_nascimento: '1996-04-03',
            endereco: 'Vargem pequena' 
        }   
    }
    */ 
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

        if (!senha) {
            return res.status(400).json({ message: 'A senha é obrigatório' });
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

        

        res.status(201).json(usuario);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Não foi possível cadastrar o usuário' });
    }
});

usuarioRoutes.get('/:id', auth, async (req, res) => {
      /*
        #swagger.tags = ['Usuarios'],  
        #swagger.parameters['ID'] = {
            in: 'query',
            description: 'Filtrar usuario pelo ID',
            type: 'string'
    }
    
    */

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

usuarioRoutes.get('/', auth, async (req, res) =>{
   /*   #swagger.tags = ['Usuario'],  
        #swagger.parameters['Usuario'] = {
            in: 'query',
            description: 'Buscar todos os usuarios',
            type: 'string'
    } 
    */
          try{
              const usuario = await Usuario.findAll();
          res.json(usuario);
          }catch(error){
              console.error(error.massage);
              res.status(500).json({ error: 'Erro ao buscar usuarios'})
          }
          
      
});
usuarioRoutes.delete('/:id', auth, async (req, res) => {
    /*  #swagger.tags = ['Usuario'],  
        #swagger.parameters['Usuario_id'] = {
            in: 'query',
            description: 'Excluir usuario',
            type: 'string'
    } 
    */
    try {
        const  {id} = req.params;
        const enderecoUsuario = await Local.findOne({ where: { usuarioId: id } });

        if (enderecoUsuario) {
            return res.status(400).json({ error: true, message: 'Este usuário não pode ser excluído pois possui endereços cadastrados.' });
        }

        
        const usuarioExcluido = await Usuario.destroy({ where: { id } });

        if (!usuarioExcluido) {
            return res.status(404).json({ error: true, message: 'Usuário não encontrado.' });
        }

        res.json({ message: 'Usuário excluído com sucesso.' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Não foi possível excluir o usuário.' });
    }
});



module.exports = usuarioRoutes 