const crypto = require('crypto');
const bcrypt = require('bcrypt');

/**
 * Fonction permettant de bien reformatter les dates
 *
 * @param date
 * @returns {string}
 */
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

/**
 * Fonction permettant de hasher en sha256
 *
 * @param data
 * @returns {*}
 */
function hash(data) {
    if (typeof data !== 'string') {
        data = JSON.stringify(data);
    }

    const bufferData = Buffer.from(data);
    const hash = crypto.createHash('sha256');
    hash.update(bufferData);
    return hash.digest('hex');
}

/**
 * Fonction permettant de hasher le mot de passe de l'utilisateur
 *
 * @param password
 * @param saltRounds
 */
function hashPassword(password, saltRounds = 14) {
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, saltRounds, (err, hash) => {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                resolve(hash);
            }
        });
    });
}

/**
 * Fonction permettant de verifier un password
 *
 * @param password
 * @param hashedPassword
 * @returns {Promise<unknown>}
 */
function verifyPassword(password, hashedPassword) {
    return new Promise((resolve, reject) => {
        console.log('Comparing:', password, hashedPassword);
        bcrypt.compare(password, hashedPassword, (err, result) => {
            if (err) {
                console.error('Error during comparison:', err);
                reject(err);
            } else {
                console.log('Comparison result:', result);
                resolve(result);
            }
        });
    });
}



module.exports = {
    formatDate,
    hash,
    hashPassword,
    verifyPassword
};