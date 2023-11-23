const db = require("../config/mysql_connexion_database");

function executeRequest(request) {
    return new Promise((resolve, reject) => {
        db.connection.query(request, (err, results) => {
                if (err) {
                    console.error("Erreur lors de l'exécution de la requête :", err);
                    reject(err);
                } else {
                    resolve(results);
                }
            }
        );
    });
}

function getLastDataInTable(tableName){
    return this.executeRequest(
        `SELECT * FROM ${tableName} ORDER BY id DESC LIMIT 1;`
    );
}

module.exports = {
    executeRequest,
    getLastDataInTable
};