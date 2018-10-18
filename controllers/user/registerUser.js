const hasher = require('../../hepler/passwordHasher');
const mailValidator = require('../../hepler/emailValidator');
let joi = require('joi');

module.exports = async (req, res) => {
    /**
     * Registration user method
     * @param postgres - DataBase connector
     * @param UserModel - model of user in dataBase
     * @param {string }userName- model of user in dataBase
     */
    try {
        const postgres = req.app.get('postgres');
        const UserModel = postgres.getModel('User');
        const userName = req.body.name;
        const hashedPassword = hasher(req.body.password);
        const userEmail = req.body.email;

        if (!userName) throw new Error('Please enter username');
        mailValidator(userEmail);
        let userImage = null;

        if (!req.file) {
            userImage = `http://localhost:3000/uploads/1.jpg`;
        } else {
            // userImage = `http://localhost:3000/uploads/${req.file.filename}`
            userImage = `${req.body.userAvatar}`
        }

        const users = await UserModel.findOne({
            where: {
                name: userName
            }
        });
        if (users) throw new Error('THIS USER IS ALREADY CREATED');

        await UserModel.create({
            name: userName,
            password: hashedPassword,
            email: userEmail,
            userimage: userImage
        });
        res.json({
            success: true,
            message: `user ${userName} is created`
        })
    } catch (err) {
        res.json({
            success: false,
            message: err.message
        });
    }
};