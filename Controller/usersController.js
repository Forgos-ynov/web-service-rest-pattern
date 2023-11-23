const express = require('express');
const router = express.Router();
const JwtMiddleware = require("../Middleware/JwtMiddleware");
const usersRepository = require('../Repository/usersRepository');
const controller = require("./Controller");
const exceptions = require('../Exceptions');
const {Error} = require("sequelize");
const cache = require('../config/cache').cache;
const cacheMiddleware = require("../Middleware/CacheMiddleware");

const getAllUsersMiddleware = cacheMiddleware.cacheMiddleware("usersController_getAllUsers")
const getUserByIdMiddleware = cacheMiddleware.cacheMiddleware("usersController_getOneUser_idUser_", true)


router.get('/', JwtMiddleware.authenticateJWT, getAllUsersMiddleware, async (req, res) => {
    try {
        const aData = await usersRepository.retrieveAllUsers();
        controller.cacheClient(req, res, aData, function (eTag) {
            if (aData.length >= 1) {
                res.send({"eTag": eTag, "data": aData});
                cache.set("usersController_getAllUsers", aData);
            } else {
                controller.noContent(res);
            }
        })
    } catch (e) {
        controller.error(res, e);
    }
});

router.get('/:id', JwtMiddleware.authenticateJWT, getUserByIdMiddleware, async (req, res) => {
    try {
        const idUser = req.params.id;
        const aUser = await getOneUserById(idUser, req, res);
        if (aUser) {
            res.send(aUser);
        }
    } catch (e) {
        controller.error(res, e);
    }
});

router.post("/", async (req, res) => {
    try {
        const userData = req.body;
        if (validateUserData(userData)) {
            const aDataUserByEmail = await usersRepository.retrieveUserByEmail(userData.email);
            if (aDataUserByEmail.length > 0) {
                throw new exceptions.Conflicts("L'email que vous avez fourni existe déjà");
            } else {
                const createdUser = await usersRepository.createUser(userData);
                if (createdUser !== undefined) {
                    const aUser = await getOneUserById(createdUser.insertId, req, res);
                    if (aUser) {
                        controller.created(res, aUser);
                    }
                } else {
                    throw new Error();
                }
            }
        } else {
            throw new exceptions.BadRequest();
        }
    } catch (e) {
        if (e instanceof exceptions.BadRequest) {
            controller.badRequest(res, e);
        } else if (e instanceof exceptions.Conflicts) {
            controller.conflicts(res, e)
        } else {
            controller.error(res, e);
        }
    }
});

router.put("/:id", JwtMiddleware.authenticateJWT, async (req, res) => {
    try {
        const idUser = req.params.id;
        const body = req.body;
        const setFormatted = await controller.setFormationToUpdate(body);
        if ("email" in body) {
            const aUserByEmail = await usersRepository.retrieveUserByEmail(body.email);
            if (aUserByEmail.length > 0) {
                throw new exceptions.Conflicts("L'email que vous avez fourni existe déjà");
            }
        }
        const updatedUser = await usersRepository.updateUser(idUser, setFormatted);
        if (updatedUser !== undefined) {
            cache.del("usersController_getOneUser_idUser_" + idUser);
            const aUser = await getOneUserById(idUser, req, res);
            if (aUser) {
                res.send(aUser);
            }
        } else {
            throw new Error;
        }
    } catch (e) {
        if (e instanceof exceptions.Conflicts) {
            controller.conflicts(res, e)
        } else {
            controller.error(res, e);
        }
    }
});

router.delete("/:id", JwtMiddleware.authenticateJWT, async (req, res) => {
    try {
        const idUser = req.params.id;
        const userDeleted = await usersRepository.deleteUserById(idUser);
        if (userDeleted !== undefined) {
            cache.del("usersController_getOneUser_idUser_" + idUser);
            controller.noContent(res);
        } else {
            throw new Error;
        }
    } catch (e) {
        controller.error(res, e);
    }
});


module.exports = router;


/**
 * Fonction de validation des données d'un utilisateur
 *
 * @param userData
 * @returns {boolean}
 */
function validateUserData(userData) {
    return userData &&
        typeof userData.firstName === 'string' &&
        userData.firstName.trim() !== '' &&
        typeof userData.lastName === 'string' &&
        userData.lastName.trim() !== '' &&
        typeof userData.email === 'string' &&
        userData.email.trim() !== '' &&
        typeof userData.password === 'string' &&
        userData.password.trim() !== '' &&
        typeof userData.is_activated === 'boolean';
}

/**
 * Fonction permettant de récupérer un utilisateur en redéfinissant son cache
 *
 * @param idUser
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
async function getOneUserById(idUser, req, res) {
    const aData = await usersRepository.retrieveUserById(idUser);
    return new Promise(async (resolve, reject) => {
        controller.cacheClient(req, res, aData, async (eTag) => {
            if (aData.length === 1) {
                const dataToSend = {"eTag": eTag, "data": aData[0]};
                cache.set("usersController_getOneUser_idUser_" + idUser, dataToSend);
                resolve(dataToSend);
            } else {
                controller.noContent(res);
                resolve(null);
            }
        });
    });
}