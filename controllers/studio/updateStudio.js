const viryfiToken = require('../../service/tokenVeryficator');
const secretWord = require('../../helper/constants').secret;
const isUserLoggined = require('../../service/isUserLoggined');


// TODO
module.exports = async (req, res) => {
    try {
        const postgres = req.app.get('postgres');
        const StudioModel = postgres.getModel('Studio');
        const token = req.get('Authorization');
        const userFromToken = await viryfiToken(token, secretWord);
        await isUserLoggined(postgres, token);

        const studioObj = req.body;
        const userId = userFromToken.id;
        const studioId = studioObj.id;
        const studioName = studioObj.name;
        const studioAddress = studioObj.address;

        const studio1 = await StudioModel.scope({method: ['findStudiosByUserIdAndStudioId', userId, studioId]}).findOne();
        // const studio = await StudioModel.scope({method: ['findStudiosByUserIdAndStudioId', user.id, studioId]}).findAll();

        const studio = await StudioModel
            .scope({method: ['findStudiosByUserIdAndStudioId', userId, studioId]})
            .update()

        res.json(studio1)
    } catch (err) {
        res.json({
            success: false,
            message: err.message
        });
    }
};