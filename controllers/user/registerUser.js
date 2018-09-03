const hasher = require('../../hepler/passwordHasher');

module.exports = async (req, res) => {
    /**
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
        if (!userEmail) throw new Error('Please enter email');

        const users = await UserModel.findOne({
            where: {
                name: userName
            }
        });
        console.log(users);

        if (users) throw new Error('THIS USER IS ALREADY CREATED');
        let userToSave = {
            name: userName,
            password: hashedPassword,
            email: userEmail
        };

        await UserModel.create({
            name: userName,
            password: hashedPassword,
            email: userEmail,
        });
        res.json(userToSave)
    } catch (err) {
        res.json({
            success: false,
            message: err.message
        });
    }
};