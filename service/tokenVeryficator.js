module.exports = (req, res, next)=> {
    const token = req.get('Authorization');
    let unixNow = Math.floor(Date.now() / 1000);

    if (!token) return res.status(401).send({ message: 'Please make sure your request has token' });
    let user = null;

    jwt.verify(token, secretWorld, (err, decoded) => {
        if (err) throw new Error('You have bad token.');
        if (decoded.exp <= unixNow) throw new Error ('TOKEN EXPIRED');
        console.log(decoded);
        user = {
            id: decoded.id
        }
    });

    console.log(user);
    if (!user) throw new Error('DON\'T HACK MY SITE');
    next();
}