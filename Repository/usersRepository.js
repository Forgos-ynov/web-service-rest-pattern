const repository = require("./Repository");
const db = require("../config/mysql_connexion_database");
const functions = require("../Functions");

function retrieveAllUsers() {
    return repository.executeRequest("SELECT * FROM users WHERE is_activated = true");
}

function retrieveUserById(idUser) {
    return repository.executeRequest(`SELECT *
                                      FROM users
                                      WHERE is_activated = true
                                        AND id = ${idUser}`);
}

function retrieveUserByEmail(email) {
    return repository.executeRequest(
        `SELECT *
         FROM users
         WHERE email = '${email}' LIMIT 1`
    );
}

async function createUser(userData) {
    const firstName = db.connection.escape(userData.firstName);
    const lastName = db.connection.escape(userData.lastName);
    const email = db.connection.escape(userData.email);
    const password = await functions.hashPassword(userData.password);
    const isActivated = userData.is_activated ? 1 : 0;

    return repository.executeRequest(
        `INSERT INTO users (firstName, lastName, email, password, is_activated, createdAt, updatedAt)
         VALUES (${firstName}, ${lastName}, ${email}, '${password}', ${isActivated}, NOW(), NOW())`);
}

function updateUser(idUser, setFormatted) {
    return repository.executeRequest(
        `UPDATE users
        ${setFormatted}
        WHERE id = ${idUser}`
    );
}


function deleteUserById(idUser) {
    return repository.executeRequest(`UPDATE users
                                      SET is_activated = false
                                      WHERE id = ${idUser}`);
}

function getLastUser() {
    return repository.getLastDataInTable("users");
}

module.exports = {
    retrieveAllUsers,
    retrieveUserById,
    deleteUserById,
    createUser,
    retrieveUserByEmail,
    updateUser,
    getLastUser
};
