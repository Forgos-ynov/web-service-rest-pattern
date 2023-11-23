const express = require('express');
const router = express.Router();

const exceptions = require('../Exceptions');
const controller = require("./Controller");
const usersRepository = require("../Repository/usersRepository");
const jwt = require("jsonwebtoken");
const jwtConf = require("../config/JWT");
const functions = require("../Functions");


router.post('/login', async (req, res) => {
    try {
        const body = req.body;

        if ("email" in body && "password" in body) {
            const aData = await usersRepository.retrieveUserByEmail(body.email);
            if (aData.length === 1) {
                const data = aData[0];

                let passwordVerified = await functions.verifyPassword(body.password, data.password);
                if (passwordVerified) {
                    const token = jwt.sign({ id: data.id }, jwtConf.secretKey, {expiresIn: "8h"});
                    res.json({ "token": token });
                } else {
                    throw new exceptions.InvalidCredentials();
                }
            } else {
                throw new exceptions.RessourcesMissed("Aucun utilisateur possède cet e-mail");
            }
        } else {
            throw new exceptions.InvalidCredentials();
        }
    } catch (e) {
        console.log(e)
        if (e instanceof exceptions.RessourcesMissed || e instanceof exceptions.InvalidCredentials) {
            controller.badRequest(res, e)
        } else {
            controller.error(res, e);
        }
    }
});


module.exports = router;