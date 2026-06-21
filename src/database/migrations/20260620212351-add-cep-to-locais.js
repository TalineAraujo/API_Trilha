'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('locais', 'cep', {
      type: Sequelize.STRING
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('locais', 'cep');
  }
};
