const jwt = require("jsonwebtoken");
const jwtConf = require("../config/JWT");

function authenticateJWT(req, res, next) {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, jwtConf.secretKey, (err, payload) => {
            if (err) {
                return res.sendStatus(403);
            }

            req.payload = payload;
            next();
        });
    } else {
        res.sendStatus(401)
    }
}

module.exports = {
    authenticateJWT
};