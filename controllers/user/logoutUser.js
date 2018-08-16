const viryfiToken = require('../../service/tokenVeryficator');
const secretWord = require('../../helper/constants').secret;
const isUserLoggined = require('../../service/isUserLoggined');

module.exports = async (req, res) => {
    try {
        const postgres = req.app.get('postgres');
        const TokenModel = postgres.getModel('Token');
        //На наявність токена перевіряю у верифікаторі
        const token = req.get('Authorization');
        await viryfiToken(token, secretWord);

        //перевіряю чи юзер залогований.
       await isUserLoggined(postgres, token);

        await TokenModel.destroy({
            where: {
                accessToken: token
            }
        });
        res.json({
            success: true
        })
    } catch (err) {
        res.json({
            success: false,
            message: err.message
        })
    }

};