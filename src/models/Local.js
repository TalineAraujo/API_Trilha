const { DataTypes } = require("sequelize");
const { connection } = require("../database/connection");
const Usuario = require("./Usuario");

const Local = connection.define('locais', {
    id:{
        type:DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    nome:{
        type: DataTypes.STRING,
        allowNull: false,
    },

    descricao:{
        type: DataTypes.TEXT
    },

    latitude:{
        type: DataTypes.FLOAT
    },

    longitude:{
        type: DataTypes.FLOAT
    },

    usuario_Id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Usuario, 
            key: 'id' 
        }
    },
    pratica_esportiva: {
        type: DataTypes.STRING,
        allowNull: false
    }, 
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    }
});

Usuario.hasMany(Local, { foreignKey: 'usuario_Id' });
Local.belongsTo(Usuario, { foreignKey: 'usuario_Id' });
module.exports = Local;