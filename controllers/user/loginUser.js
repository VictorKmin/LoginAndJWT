/**
 * Сторінка логінації
 * Обробляємо помилки в трай кеч. рахується хорошою прктикою
 * Всі константи оголошуємо зверху
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
        const user = await UserModel.findOne({
            where: {
                name: userName,
                password: hashedPassword
            }
        });
        if (!user) throw new Error('User was not found');
        const tokens = tokenizer(user.id);

        // console.log(tokens);
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