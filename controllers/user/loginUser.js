/**
 * Сторінка логінації
 */
const hasher = require('../../service/passwordHasher');
const tokenizer = require('../../service/tokenizer');

module.exports = async (req, res) => {
    try {
        console.log('login User Page');
        const postgres = req.app.get('postgres');
        const UserModel = postgres.getModel('User');
        const userName = req.body.name;
        const hashedPassword = hasher(req.body.password);

        // шукаю в базі юзера
        const user = await UserModel.findOne({
            where: {
                name: userName,
                password: hashedPassword
            }
        });

        // перевіряю чи знайшло юзера
        if (!user) throw new Error('User was not found');

        // створюю пару токенів
        const tokens = tokenizer(user.id, user.name);

        // віддаю їх на фронт
        res.json({
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken
        });

    }catch(err){
        res.json({
            success: false,
            message: err.message
        })
    }
};