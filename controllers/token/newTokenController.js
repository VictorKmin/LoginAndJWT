const tokenizer = require('../../service/tokenizer');
const viryfiToken = require('../../service/tokenVeryficator');
const secretWord = require('../../helper/constants').refreshSecret;

// accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTEsIm5hbWUiOiIxMSIsImlhdCI6MTUzNDMzOTQ1OSwiZXhwIjoxNjM0MzM5NDU4fQ.7l7FXFpxhbnpJF_pB2Z8d0rR9yXiQwzy0uqm0AUDoak",
//refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTEsIm5hbWUiOiIxMSIsImlhdCI6MTUzNDMzOTQ1OSwiZXhwIjoxMDAxNTM0MzM5NDU4fQ.HrDSvD75JmWUz89bUSJ9RoPGnXaqYknzS5f5QfG9okI"

// accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNTM0MzM5NTU3LCJleHAiOjE2MzQzMzk1NTZ9.HD8TmvLud7GMmWqiPIyMKF57h_6KDgfQdNajMJWM6nI",
//refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywibmFtZSI6InVzZXIiLCJpYXQiOjE1MzQzMzk1NTcsImV4cCI6MTAwMTUzNDMzOTU1Nn0.rsWrSlLz1RG_kh374ShTrWf7P0J0S-icEiChGfjAWY8"
// wrongRefresh: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNTM0MzI3MTgxLCJleHAiOjExNTM0MzI3MTgwfQ._kMaILb5tRg6B0m9px1yFfjzv7_GOEBDFyhMWVyPtIE

module.exports = async (req, res) => {
    try {
        console.log('login User Page');
        const postgres = req.app.get('postgres');
        const TokenModel = postgres.getModel('Token');
        const UserModel = postgres.getModel('User');
        const token = req.get('Authorization');

        //На наявність юзера перевіряю у верифікаторі
        const user = await viryfiToken(token, secretWord);

        let userWhoChangeToken = await UserModel.findOne({
            where: {
                id: user.id,
                name: user.name
            }
        });
        if (!userWhoChangeToken) throw new Error('User is incorrect. Try another token');

        // видаляю старийтокен з бази
        await TokenModel.destroy({
            where: {
                userID: user.id
            }
        });
        //створюю нову пару токенів
        let newTokens = tokenizer(user.id, user.name);

        //Записую новий токен в базу
        await TokenModel.create({
            userID: user.id,
            accessToken: newTokens.accessToken
        });

        res.json(newTokens);

    } catch (err) {
        res.json({
            success: false,
            message: err.message
        })
    }
};