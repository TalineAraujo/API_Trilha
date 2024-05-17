const { QueryInterface, Sequelize } = require("sequelize");
const Usuario = require('../../models/Usuario');

module.exports ={
    up: async (QueryInterface, Sequelize) => {
        await Usuario.bulkCreate([
            {
                nome:"Raphaela Assis",
                email:"rapha.exemplo@hotmail.com",
                cpf: "01236523879",
                sexo:"Feminino",
                senha:"rapha123",
                data_nascimento:"1989-01-05",
                endereco:"Campeche"
            },
            {
                nome:"kauana Araujo",
                email:"kaka.exemplo@hotmail.com",
                cpf: "14151917987",
                sexo:"Feminino",
                senha:"kaka123",
                data_nascimento:"2002-12-09",
                endereco:"Ratones"
            },
            {
                nome:"Tiago Araujo",
                email:"tiago.exemplo@hotmail.com",
                cpf: "78945632115",
                sexo:"masculino",
                senha:"tiago123",
                data_nascimento:"1992-05-10",
                endereco:"Arambaré"
            },
            {
                nome:"Maria Eduarda",
                email:"duda.exemplo@hotmail.com",
                cpf: "526874136985",
                sexo:"Feminino",
                senha:"duda123",
                data_nascimento:"2002-09-19",
                endereco:"Camaquã"
            }
            
        ])

    },

   down: async (QueryInterface, Sequelize) => {
    await Usuario.destroy({email:[
        "rapha.exemplo@hotmail.com",
        "kaka.exemplo@hotmail.com",
        "tiago.exemplo@hotmail.com",
        "duda.exemplo@hotmail.com"
        ]
    })
   }
    
}