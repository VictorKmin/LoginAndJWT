const jwt = require('jsonwebtoken');
const hasher = require('../../service/passwordHasher');
const tokenizer = require('../../service/tokenizer');
const refreshSecret = require('../../helper/constants').refreshSecret;

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
        let unixNow = Math.floor(Date.now() / 1000);
        let userName = null;
        let userId = null;

        //перевіряю чи мені приходить токен
        if (!token) return res.status(401).send({message: 'Please make sure your request has token'});
        console.log('ТОКЕН Є.... строка 31');
        //верифікую токен на дату придатності та на наявність у нього всіх необхідний параметрів
        jwt.verify(token, refreshSecret, (err, decoded) => {
            if (err) throw new Error('You have bad token.');
            if (decoded.exp <= unixNow) throw new Error('TOKEN EXPIRED');
            console.log(decoded);
            console.log('ТОКЕН ДЕКОДОВАНО.... стока 37');
            userName = decoded.name;
            userId = decoded.id;
            if (!userId || !userName) throw new Error('Please make sure your token is correct')
        });

        //шукаю в базі юзера по id з токена
        let userWhoChangeToken = await UserModel.findOne({
            where: {
                id: userId
            }
        });
        if (!userWhoChangeToken || userName !== userWhoChangeToken.name) throw new Error('User is incorrect. Try another token');
        // дивлюсь чи співпадає їмя юзера в токені та імя юзера в базі
        console.log('ЮЗЕРА ЗНАЙДЕНО... строка 51')

        // видаляю старийтокен з бази
        await TokenModel.destroy({
            where: {
                userID: userId
            }
        });
        console.log('СТАРИЙ ТОКЕН ВИДАЛЕНО... строка 55');
        //створюю нову пару токенів
        let newTokens = tokenizer(userId, userName);
        if (!newTokens) throw new Error('New tokens wasn\'t created');

        console.log('НОВИЙ ТОКЕН СТВОРЕНО .... строка 60');


        //Записую новий токен в базу
         await TokenModel.create({
            userID: userId,
            accessToken: newTokens.accessToken
        });

         res.json(newTokens);
        console.log('Новий токен внесено в базу .... строка 74')

    } catch (err) {
        res.json({
            success: false,
            message: err.message
        })
    }
};