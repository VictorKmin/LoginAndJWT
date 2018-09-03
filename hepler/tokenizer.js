const jwt = require('jsonwebtoken');
const secretWorld = require('../constants/constants').secret;
const refreshSecret = require('../constants/constants').refreshSecret;


module.exports = (id,name)=> {
        let accessToken = jwt.sign({id: id}, secretWorld, {expiresIn: 99999999});
        let refreshToken = jwt.sign({id: id, name: name}, refreshSecret, {expiresIn: 999999999999});
        let tokens = {
            accessToken,
            refreshToken
        };
        if (!tokens) throw new Error('TOKEN WAS NOT CREATED');
        return tokens;

};