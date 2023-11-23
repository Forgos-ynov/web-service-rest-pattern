const mysql = require('mysql2');
const {Sequelize} = require('sequelize');

// Connexion à changer pour la connexion à la db
const host = "localhost";
const user = "root";
const password = "";
const database = "pattern_nodejs_api";


const connection = mysql.createConnection({
    host: host,
    user: user,
    password: password,
    database: database
});

const sequelize = new Sequelize(database, user, password, {
    host: host,
    dialect: 'mysql',
});


connection.connect((err) => {
    if (err) {
        console.error('Erreur de connexion à la base de données :', err);
    } else {
        console.log('Connexion à la base de données réussie');
    }
});

module.exports = {
    connection,
    sequelize
};
