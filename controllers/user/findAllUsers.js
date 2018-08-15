const jwt = require('jsonwebtoken');
const secretWorld = require('../../helper/constants').secret;

//accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNTM0MzI3MTgxLCJleHAiOjE1NDQzMjcxODB9._7z0UwuKuhphEPjUhmxy3oJELNaGYhy0s7CTXqVX06A",
//refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNTM0MzI3MTgxLCJleHAiOjExNTM0MzI3MTgwfQ._kMaILb5tRg6B0m9px1yFfjzv7_GOEBDFyhMWVyPtIE"

module.exports = async (req, res) => {
    try {
        const postgres = req.app.get('postgres');
        const UserModel = postgres.getModel('User');
        const token = req.get('Authorization');
        let unixNow = Math.floor(Date.now() / 1000);

        if (!token) return res.status(401).send({ message: 'Please make sure your request has an Authorization header' });
        let user = null;

        jwt.verify(token, secretWorld, function (err, decoded) {
            if (err) throw new Error('DON\'T HACK MY SITE');
            if (decoded.exp <= unixNow) throw new Error ('TOKEN EXPIRED');
            console.log(decoded);
            user = {
                id: decoded.id
            }
        });

        console.log(user);
        if (!user) throw new Error('User not found');
        const users = await UserModel.findAll();
        res.json(users)
    } catch (err) {
        res.json({
            success: false,
            message: err.message
        })
    }
};