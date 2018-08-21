
const viryfiToken = require('../../service/tokenVeryficator');
const secretWord = require('../../helper/constants').secret;
const isUserLoggined = require('../../service/isUserLoggined');

module.exports = async (req, res) => {
    try {
        const postgres = req.app.get('postgres');
        const StudioModel = postgres.getModel('Studio');
        const token = req.get('Authorization');
        const userFromToken = await viryfiToken(token, secretWord);
        await isUserLoggined(postgres, token);

        const idStudioToDelete = req.body.id;
        const userId = userFromToken.id;

        const deletedStudio = await StudioModel.scope({method:['findStudiosByUserIdAndStudioId', userId, idStudioToDelete]}).destroy();

        res.json(deletedStudio)
    } catch (err) {
        res.json({
            success: false,
            message: err.message
        });
    }
};