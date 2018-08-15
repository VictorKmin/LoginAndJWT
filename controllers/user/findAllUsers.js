const jwt = require('jsonwebtoken');
const secretWorld = require('../../helper/constants').secret;

// accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTEsIm5hbWUiOiIxMSIsImlhdCI6MTUzNDMzOTQ1OSwiZXhwIjoxNjM0MzM5NDU4fQ.7l7FXFpxhbnpJF_pB2Z8d0rR9yXiQwzy0uqm0AUDoak",
//refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTEsIm5hbWUiOiIxMSIsImlhdCI6MTUzNDMzOTQ1OSwiZXhwIjoxMDAxNTM0MzM5NDU4fQ.HrDSvD75JmWUz89bUSJ9RoPGnXaqYknzS5f5QfG9okI"


// accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNTM0MzM5NTU3LCJleHAiOjE2MzQzMzk1NTZ9.HD8TmvLud7GMmWqiPIyMKF57h_6KDgfQdNajMJWM6nI",
//refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywibmFtZSI6InVzZXIiLCJpYXQiOjE1MzQzMzk1NTcsImV4cCI6MTAwMTUzNDMzOTU1Nn0.rsWrSlLz1RG_kh374ShTrWf7P0J0S-icEiChGfjAWY8"
// wrongRefresh: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNTM0MzI3MTgxLCJleHAiOjExNTM0MzI3MTgwfQ._kMaILb5tRg6B0m9px1yFfjzv7_GOEBDFyhMWVyPtIE


module.exports = async (req, res) => {
    try {
        const postgres = req.app.get('postgres');
        const UserModel = postgres.getModel('User');
        // const token = req.get('Authorization');
        // let unixNow = Math.floor(Date.now() / 1000);
        //
        // if (!token) return res.status(401).send({ message: 'Please make sure your request has token' });
        // let user = null;
        //
        // jwt.verify(token, secretWorld, (err, decoded) => {
        //     if (err) throw new Error('You have bad token.');
        //     if (decoded.exp <= unixNow) throw new Error ('TOKEN EXPIRED');
        //     console.log(decoded);
        //     user = {
        //         id: decoded.id
        //     }
        // });
        //
        // console.log(user);
        // if (!user) throw new Error('DON\'T HACK MY SITE');
        const users = await UserModel.findAll();
        res.json(users)
    } catch (err) {
        res.json({
            success: false,
            message: err.message
        })
    }
};