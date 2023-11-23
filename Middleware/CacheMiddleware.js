const {cache} = require("../config/cache");
const functions = require("../Functions");

function cacheMiddleware(keyCache, haveIdToFind = false) {
    return function (req, res, next) {
        if (haveIdToFind) {
            keyCache += req.params.id;
        }
        const isCachedKey = cache.has(keyCache);
        if (isCachedKey) {
            const cachedData = cache.get((keyCache));
            if (req.headers["if-none-match"] !== undefined) {
                if (req.headers["if-none-match"] === functions.hash(cachedData)) {
                    res.sendStatus(304);
                }
            }
            res.json({"eTag": functions.hash(cachedData), "data": cachedData});
        } else {
            next();
        }
    };
}

module.exports = {
    cacheMiddleware
}
