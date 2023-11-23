const functions = require("../Functions");

function error(res, error, code = 500, message = "Erreur lors de la requête SQL") {
    console.error(message, error);
    res.status(code).json({error: message});
}

function created(res, message) {
    res.status(201).json({message: message});
}

function noContent(res) {
    res.status(204).send();
}

function badRequest(res, message) {
    res.status(400).json({error: message});
}

function conflicts(res, message) {
    res.status(409).json({error: message});
}

/**
 * Fonction de formation du set pour l'update d'utilisateur
 *
 * @param body
 * @returns {string}
 */
async function setFormationToUpdate(body) {
    const aKey = Object.keys(body);
    const formattedDate = functions.formatDate(new Date());
    let formattedSet = aKey.length === 0 ? "" : `Set updatedAt = '${formattedDate}', `;

    for (const key of aKey) {
        const index = aKey.indexOf(key);
        if (key === "password") {
            formattedSet += `${key} = '${await functions.hashPassword(body[key])}'`;
        } else {
            formattedSet += `${key} = '${body[key]}'`;
        }

        if (index !== aKey.length - 1) {
            formattedSet += ', ';
        }
    }
    return formattedSet
}

/**
 * Fonction permettant la gestion du cache côté client
 *
 * @param req
 * @param res
 * @param aData
 * @param isNotInCache
 */
function cacheClient(req, res, aData, isNotInCache) {
    const eTag = functions.hash(aData);

    if (req.headers["if-none-match"] === eTag) {
        res.sendStatus(304);
    } else {
        isNotInCache(eTag);
    }
}


module.exports = {
    error,
    noContent,
    created,
    badRequest,
    conflicts,
    setFormationToUpdate,
    cacheClient
};