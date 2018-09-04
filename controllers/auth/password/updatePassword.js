const viryfiToken = require('../../../hepler/tokenVeryficator');
const passwordHasher = require('../../../hepler/passwordHasher');
const resetPassWord = require('../../../constants/secretWords').resetPassWord;

module.exports = async (req, res)=> {

    try {
        const postgres = req.app.get('postgres');
        const UserModel = postgres.getModel('User');
        const firstPass = req.body.firstPass;
        const secondPass = req.body.secondPass;
        const token = req.body.token;

        if (firstPass !== secondPass) throw new Error (`Паролі не співпадають`);

        const userFromToken = await viryfiToken(token, resetPassWord);

        const user = await UserModel.findOne({
            where: {
                id: userFromToken.id,
                email: userFromToken.email
            }
        });
        if (!user) throw new Error('User not found');
        const newPass = passwordHasher(firstPass);


        const updatedUser = await UserModel.update({
            password: newPass,
        }, {
            where: {
                email: userFromToken.email
            }
        });
        if (!updatedUser) throw new Error('Cant update user');

        res.json({success: true, message: `Password changed`})
    } catch (err) {
        res.json({
            success: false,
            message: err.message
        });
    }
};