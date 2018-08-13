const jwt = require('jsonwebtoken');

module.exports = (userName, password)=> {
    let toket = jwt.sign({name: userName,pass: password}, 'someSecretWorld', {algorithm: 'RSA' });
    console.log(toket);
};