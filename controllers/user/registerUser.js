/**
 * сторінка реєстрації
 */
const hasher = require('../../service/passwordHasher');

module.exports = async (req, res) => {
    try {
        console.log('Я В REGISTER ЮЗЕР');
        const postgres = req.app.get('postgres');
        const UserModel = postgres.getModel('User');
        const userName = req.body.name;
        const hashedPassword = hasher(req.body.password);
        if (!userName) throw new Error('Please enter username');

        const users = await UserModel.findOne({
            where: {
                name: userName
            }
        });
        console.log(users);

        if (users) throw new Error('THIS USER IS ALREADY CREATED');
        let userToSave = {
            name: userName,
            password: hashedPassword
        };

        console.log('ЮЗЕРА СТВОРЕНО');
        await UserModel.create({
            name: userName,
            password: hashedPassword
        });
        res.json(userToSave)
    } catch (err) {
        res.json({
            success: false,
            message: err.message
        });
    }
};