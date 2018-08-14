const jwt = require('jsonwebtoken');
const secretWorld = require('../helper/constants').secret;

module.exports = (userName, password)=> {
    let token = jwt.sign({name: userName,pass: password}, secretWorld);
    return token;
};