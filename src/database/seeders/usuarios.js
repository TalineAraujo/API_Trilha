const bcrypt = require('bcrypt');
const Usuario = require('../../models/Usuario');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await Usuario.bulkCreate([
            {
                nome: "Raphaela Assis",
                email: "rapha.exemplo@hotmail.com",
                cpf: "01236523879",
                sexo: "Feminino",
                senha: bcrypt.hashSync("rapha123", 10),
                data_nascimento: "1989-01-05",
                endereco: "Campeche"
            },
            {
                nome: "Kauana Araujo",
                email: "kaka.exemplo@hotmail.com",
                cpf: "14151917987",
                sexo: "Feminino",
                senha: bcrypt.hashSync("kaka123", 10),
                data_nascimento: "2002-12-09",
                endereco: "Ratones"
            },
            {
                nome: "Tiago Araujo",
                email: "tiago.exemplo@hotmail.com",
                cpf: "78945632115",
                sexo: "Masculino",
                senha: bcrypt.hashSync("tiago123", 10),
                data_nascimento: "1992-05-10",
                endereco: "Arambaré"
            },
            {
                nome: "Maria Eduarda",
                email: "duda.exemplo@hotmail.com",
                cpf: "52687413698",
                sexo: "Feminino",
                senha: bcrypt.hashSync("duda123", 10),
                data_nascimento: "2002-09-19",
                endereco: "Camaquã"
            }
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('usuarios', {
            email: [
                "rapha.exemplo@hotmail.com",
                "kaka.exemplo@hotmail.com",
                "tiago.exemplo@hotmail.com",
                "duda.exemplo@hotmail.com"
            ]
        });
    }
};
