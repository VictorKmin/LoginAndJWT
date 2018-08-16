const jwt = require('jsonwebtoken');
module.exports = async (token, secretWorld) => {
    let unixNow = Math.floor(Date.now() / 1000);
    let user = null;

    if (!token || !secretWorld) throw new Error('Have not postgres, token or secret word');

    jwt.verify(token, secretWorld, (err, decoded) => {
        if (err) throw new Error('You have bad token.');
        if (decoded.exp <= unixNow) throw new Error('TOKEN EXPIRED');
        console.log(decoded);
        user = {
            id: decoded.id,
            name: decoded.name
        }
    });
    console.log(user);
    if (!user) throw new Error('DON\'T HACK MY SITE');

    return user
};