const viryfiToken = require('../../hepler/tokenVeryficator');
const secretWord = require('../../constants/dataBase').secret;
const isUserLoggined = require('../../hepler/isUserLoggined');
const emailValidator = require('../../hepler/emailValidator');
const phoneValidator = require('../../hepler/phoneValidator');

//
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiaWF0IjoxNTM0ODYxMTk1LCJleHAiOjE2MzQ4NjExOTR9.8V-X1xjB8mgxTFHNrubZRwlwUUmYzMtl-W7NNDIjDMk
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiaWF0IjoxNTM0OTIyNzQ2LCJleHAiOjE2MzQ5MjI3NDV9.5heIbmT0DI7zC1qqAv4B64Gc-dr7DuqxgEhb0_47rRs
// БЕЗ СТУДІЙ
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTMsImlhdCI6MTUzNDkyMzMyMywiZXhwIjoxNjM0OTIzMzIyfQ.XVUS_b8iEkm2ODTS40osl-hCaDeqasF-FBWw9S4CCCU
module.exports = async (req, res) => {
    try {
        const postgres = req.app.get('postgres');
        const StudioModel = postgres.getModel('Studio');
        const token = req.get('Authorization');
        let userFromToken = await viryfiToken(token, secretWord);
        await isUserLoggined(postgres, token);

        let userId = userFromToken.id;
        const studioName = req.body.name;
        const studioAddress = req.body.address;
        const studioPhone = req.body.phone;

        if (!studioName) throw new Error('Please enter studio name');
        const isValidEmail = emailValidator(studioAddress);
        if (!isValidEmail) throw new Error('Please enter email like example@example.com');
        const isPhoneValid = phoneValidator(studioPhone);
        if (!isPhoneValid) throw new Error('Please enter phone like +380123456789');

        // const savedStudio = await StudioModel
        //      .scope({method: ['createStudio',userId, studioName, studioAddress ]})
        //      .create()

        const isStudioNamePresent = await StudioModel.scope({method: ['findStudiosByName', studioName]}).findOne();

        if (isStudioNamePresent) throw new Error (`Name ${studioName} is already occupied`);

        const savedStudio = await StudioModel.create({
            userId,
            name: studioName,
            address: studioAddress,
            phone: studioPhone,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });
        if (!savedStudio) throw new Error('Cant create studio');
        res.json(savedStudio);
    } catch (err) {
        res.json({
            success: false,
            message: err.message
        });
    }
};