class InvalidCredentials extends Error {
    constructor(message = "Les identifiants sont incorrects.") {
        super(message);
        this.name = "InvalidCredentials";
    }
}

class RessourcesMissed extends Error {
    constructor(message) {
        super(message);
        this.name = "RessourcesMissed";
    }
}

class BadRequest extends Error {
    constructor(message = "Problème avec les données envoyées") {
        super(message);
        this.name = "BadRequest";
    }
}

class Conflicts extends Error {
    constructor(message) {
        super(message);
        this.name = "Conflicts";
    }
}

module.exports = {
    InvalidCredentials,
    RessourcesMissed,
    BadRequest,
    Conflicts
};