const tokenizer = require('../../../hepler/tokenizer').accessAndRefresh;
const randomPassword = require('uuid').v1();

module.exports = async (req, res) => {
    try {
        const postgres = req.app.get('postgres');
        const TokenModel = postgres.getModel('Token');
        const UserModel = postgres.getModel('User');

        const userFromGoogle = req.user._json;
        const name = userFromGoogle.displayName;
        const email = userFromGoogle.emails[0].value;
        if (!userFromGoogle) throw new Error('Some trouble with facebook');

        // Шукаю чи присутній юзер з мейлом фейсбука в базі
        let isUserLoggined = await UserModel.findOne({
            where: {
                email
            }
        });

        if (isUserLoggined) { // Якщо такий юзер присутній. то я видаляю його токени з бази, даю нову пару токенів та вношу в базу
            const userID = isUserLoggined.id;
            const userName = isUserLoggined.name;
            // Видаляю з бази токени по userID
            await TokenModel.destroy({
                where: {
                    userID
                }
            });
            // Генерю нову пару
            const tokens = tokenizer(userID, userName);

            // Записую access auth в базу Токенів
            await TokenModel.create({
                userID,
                accessToken: tokens.accessToken
            });

            // віддаю їх на фронт
            res.json({
                success: true,
                tokens: {
                    accessToken: tokens.accessToken,
                    refreshToken: tokens.refreshToken
                }
            });

        } else { // Якщо ні, то генерую йому пароль, записую юзера в базу, та генерую йому пару токенів

            await UserModel.create({
                name,
                password: randomPassword,
                email,
            });

            const newUser = await UserModel.findOne({
                where: {
                    email
                }
            });

            const tokens = tokenizer(newUser.id, newUser.name);

            res.json({success: true, tokens});
        }

    } catch (e) {
        res.json({success: false, message: e.message})
    }
};