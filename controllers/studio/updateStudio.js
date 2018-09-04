const viryfiToken = require('../../hepler/tokenVeryficator');
const secretWord = require('../../constants/dataBase').secret;
const isUserLoggined = require('../../hepler/isUserLoggined');
const emailValidator = require('../../hepler/emailValidator');
const phoneValidator = require('../../hepler/phoneValidator');

module.exports = async (req, res) => {
    try {
        const postgres = req.app.get('postgres');
        const StudioModel = postgres.getModel('Studio');
        const token = req.get('Authorization');
        const {id : userId} = await viryfiToken(token, secretWord);
        await isUserLoggined(postgres, token);

        const studioObj = req.body;
        // const userId = userFromToken.id;
        const studioId = studioObj.id;
        const studioName = studioObj.name;
        const studioAddress = studioObj.address;
        const studioPhone = studioObj.phone;

        if (!studioId) throw new Error('Please enter studio ID');
        if (!studioName) throw new Error('Please enter studio name');
        const isValidEmail = emailValidator(studioAddress);
        if (!isValidEmail) throw new Error('Please enter email like example@example.com');
        const isPhoneValid = phoneValidator(studioPhone);
        if (!isPhoneValid) throw new Error('Please enter phone like +380123456789');

        const isStudioNamePresent = await StudioModel.scope({method: ['findStudiosByName', studioName]}).findOne();
        if (isStudioNamePresent) throw new Error(`Name ${studioName} is already occupied`);

        const isStudioUpdate = await StudioModel
                    .scope({method: ['findStudiosByUserIdAndStudioId', userId, studioId]})
                    .update({
                        name: studioName,
                        address: studioAddress,
                        phone: studioPhone,
                        updatedAt: new Date()
            });
        if (isStudioUpdate[0] === 0) throw new Error(`Studio with id ${studioId} was not updated`);

        res.json({
            success: true,
            message: 'Studio is updated'
        })
    } catch (err) {
        res.json({
            success: false,
            message: err.message
        });
    }
};