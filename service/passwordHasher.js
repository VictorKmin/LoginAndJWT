const crypto = require('crypto');

module.exports = (password)=> {
    let pass = crypto.createHash('md5').update(password).digest('hex');
    if (!pass) throw new Error('Cant protect your password');
    return pass
};