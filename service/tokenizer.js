const jwt = require('jsonwebtoken');
const secretWorld = require('../helper/constants').secret;
const refreshSecret = require('../helper/constants').refreshSecret;


module.exports = (id)=> {
    let accessToken = jwt.sign({id: id}, secretWorld, {expiresIn: 99999999});
    let refreshToken = jwt.sign({id: id}, refreshSecret, {expiresIn: 999999999999});
    let tokens = {
        accessToken,
        refreshToken
    };

    return tokens;
};