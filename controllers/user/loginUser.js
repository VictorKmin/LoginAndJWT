/**
 * Сторінка логінації
 */
const hasher = require('../../hepler/passwordHasher');
const tokenizer = require('../../hepler/tokenizer');

module.exports = async (req, res) => {
    try {
        console.log('login User Page');
        const postgres = req.app.get('postgres');
        const UserModel = postgres.getModel('User');
        const TokenModel = postgres.getModel('Token');
        const userName = req.body.name;
        const hashedPassword = hasher(req.body.password);
        if (!userName) throw new Error('Please enter username first');

        // шукаю в базі юзера
        const user = await UserModel.findOne({
            where: {
                name: userName,
                password: hashedPassword
            }
        });
        // перевіряю чи знайшло юзера
        if (!user) throw new Error('User was not found');
        const userID = user.dataValues.id;

        //перевіряю чи такий юзер ще не залогований
        const isUserLoggined= await TokenModel.findOne({
            where: {
                userID: userID
            }
        });
        if (isUserLoggined) throw new Error('You are logged. Please /logout first');

        // створюю пару токенів
        const tokens = tokenizer.accessAndRefresh(userID, userName);

        // Записую access auth в базу Токенів
        await TokenModel.create({
            userID: userID,
            accessToken: tokens.accessToken
        });

        // віддаю їх на фронт
        res.json({
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken
        });

    } catch (err) {
        res.json({
            success: false,
            message: err.message
        })
    }
};