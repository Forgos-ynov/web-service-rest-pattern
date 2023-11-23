const {DataTypes} = require('sequelize');
const db = require("../config/mysql_connexion_database");

const User = db.sequelize.define('User', {
    firstName: {
        type: DataTypes.STRING
    },
    lastName: {
        type: DataTypes.STRING
    },
    email: {
        type: DataTypes.STRING,
        unique: true
    },
    password: {
        type: DataTypes.STRING
    },
    is_activated: {
        type: DataTypes.BOOLEAN,
        notNull: true,
        defaultValue: true
    }
});


module.exports = User;