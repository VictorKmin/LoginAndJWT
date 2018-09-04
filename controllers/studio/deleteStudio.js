const viryfiToken = require('../../hepler/tokenVeryficator');
const secretWord = require('../../constants/dataBase').secret;
const isUserLoggined = require('../../hepler/isUserLoggined');

module.exports = async (req, res) => {
    try {
        const postgres = req.app.get('postgres');
        const StudioModel = postgres.getModel('Studio');
        const token = req.get('Authorization');
        const userFromToken = await viryfiToken(token, secretWord);
        await isUserLoggined(postgres, token);

        const StudioToDeleteId = req.body.id;
        const userId = userFromToken.id;
        if (!StudioToDeleteId) throw new Error('Please enter studio ID');

        // const isStudioDeleted =
        await StudioModel
            .scope({method: ['findStudiosByUserIdAndStudioId', userId, StudioToDeleteId]})
            .destroy();
        res.json({
            success: true,
            message: `Studio with id ${StudioToDeleteId} is deleted`
        })

    } catch (err) {
        res.json({
            success: false,
            message: err.message
        });
    }
};