const { QueryInterface, Sequelize } = require("sequelize");
const Local = require('../../models/Local');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await Local.bulkCreate([
      {
        nome: 'Trilha Morro das Aranhas',
        descricao: 'Trilha de aproximadamente 45 min de subida, com uma vista para as praias do Santinho, Moçambique e Ingleses',
        cep: '88058-700',
        usuarioId: 5
      },
      {
        nome: 'Trilha Gravata',
        descricao: 'Trilha fácil',
        cep: '88061-700',
        usuarioId: 4
      },
      {
        nome: 'Trilha Para Galheta',
        descricao: 'Trilha média, com uma vista linda',
        cep: '88061-423',
        usuarioId: 5
      },
      {
        nome: 'Trilha Morro das Feiticeiras',
        descricao: 'Trilha fácil',
        cep: '88056-850',
        usuarioId: 4
      }
    ]);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('locais', null, {});
  }
};

