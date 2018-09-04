const tokenizer = require('../../../hepler/tokenizer').accessAndRefresh;
const viryfiToken = require('../../../hepler/tokenVeryficator');
const refreshSecret = require('../../../constants/secretWords').refreshSecret;
const accessSecret = require('../../../constants/secretWords').secret;

module.exports =async (req, res) => {
    try {
        const postgres = req.app.get('postgres');
        const TokenModel = postgres.getModel('Token');
        const UserModel = postgres.getModel('User');

        const userFromFacebook = req.user._json;
        const email = userFromFacebook.email;
        if (!userFromFacebook) throw new Error('Some trouble with facebook');

        // Шукаю чи присутній юзер з мейлом фейсбука в базі
        let isUserLoggined = await UserModel.findOne({
            where: {
                email
            }
        });

        if (isUserLoggined) { // Якщо такий юзер присутній. то я видаляю його токени з бази, даю нову пару токенів та вношу в базу
            userID = isUserLoggined.id;
            userName = isUserLoggined.name;
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
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken
            });

        } else { // Якщо ні, то генерую йому пароль, створюю юзера в базу, та генерую йому пару токенів


        }

    } catch (e) {
        res.json({success: false, message: e.message})
    }
};