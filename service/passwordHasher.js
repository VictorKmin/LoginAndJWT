const crypto = require('crypto');

module.exports = (password)=> {
    return crypto.createHash('md5').update(password).digest('hex');
};