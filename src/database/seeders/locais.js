const Local = require('../../models/Local');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await Local.bulkCreate([
            {
                nome: 'Trilha Morro das Aranhas',
                descricao: 'Trilha de aproximadamente 45 min de subida, com uma vista para as praias do Santinho, Moçambique e Ingleses',
                latitude: -27.4495,
                longitude: -48.3794,
                usuarioId: 1
            },
            {
                nome: 'Trilha Gravatá',
                descricao: 'Trilha fácil',
                latitude: -27.5156,
                longitude: -48.4960,
                usuarioId: 2
            },
            {
                nome: 'Trilha Para Galheta',
                descricao: 'Trilha média, com uma vista linda',
                latitude: -27.5821,
                longitude: -48.4215,
                usuarioId: 1
            },
            {
                nome: 'Trilha Morro das Feiticeiras',
                descricao: 'Trilha fácil',
                latitude: -27.5550,
                longitude: -48.5020,
                usuarioId: 2
            }
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('locais', null, {});
    }
};
