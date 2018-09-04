const viryfiToken = require('../../hepler/tokenVeryficator');
const secretWord = require('../../constants/dataBase').secret;
const isUserLoggined = require('../../hepler/isUserLoggined');

module.exports = async (req, res) => {
    try {
        const postgres = req.app.get('postgres');
        const StudioModel = postgres.getModel('Studio');
        const token = req.get('Authorization');
        const userFromToken = await viryfiToken(token, secretWord);
        const userID = userFromToken.id;
        await isUserLoggined(postgres, token);

        let studios = await StudioModel.scope({method: ['findStudiosByUserId', userID]}).findAll();

        // if (!studios) throw new Error('User have no studios') ;
        if (!studios.length) throw new Error('User have no studios');

        res.json(studios)
    } catch (err) {
        res.json({
            success: false,
            message: err.message
        });
    }
};