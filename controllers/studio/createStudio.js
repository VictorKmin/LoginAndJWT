const viryfiToken = require('../../service/tokenVeryficator');
const secretWord = require('../../helper/constants').secret;
const isUserLoggined = require('../../service/isUserLoggined');

//
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiaWF0IjoxNTM0ODYxMTk1LCJleHAiOjE2MzQ4NjExOTR9.8V-X1xjB8mgxTFHNrubZRwlwUUmYzMtl-W7NNDIjDMk

module.exports = async (req, res) => {
    try {
        const postgres = req.app.get('postgres');
        const StudioModel = postgres.getModel('Studio');
        const token = req.get('Authorization');
        let userFromToken = await viryfiToken(token, secretWord);
        let userId = userFromToken.id;
        console.log(userId);
        await isUserLoggined(postgres, token);

        const studioName = req.body.name;
        const studioAddress = req.body.address;

       // const savedStudio = await StudioModel
       //      .scope({method: ['createStudio',studioAddress,studioName,userId]})
       //      .create()

        // console.log(savedStudio);
        const savedStudio =  await StudioModel.create({
            userId: userId,
            name: studioName,
            address: studioAddress,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        res.json(savedStudio)
    } catch (err) {
        res.json({
            success: false,
            message: err.message
        });
    }
};