const { DataTypes } = require('sequelize');
const { connection } = require('../database/connection');

const Usuario = connection.define('usuario', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
    nome: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        lowercase: true,
    },
    sexo: {
        type: DataTypes.STRING,
    }, 
    senha: {
        type: DataTypes.STRING,
        allowNull: false,
        select: false,
    },
    data_nascimento: {
        type: DataTypes.DATE,
    },
    endereco: {
        type: DataTypes.STRING,
    },
    cpf: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    }
});

module.exports = Usuario;