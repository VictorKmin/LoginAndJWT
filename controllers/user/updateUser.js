module.exports = async (req, res) => {
    try {
        const viryfiToken = require('../../hepler/tokenVeryficator');
        const isUserLoggined = require('../../hepler/isUserLoggined');
        const secretWord = require('../../constants/constants').secret;
        const postgres = req.app.get('postgres');
        const UserModel = postgres.getModel('User');
        const id = req.body.id;
        const passwordToUpdate = req.body.password;
        const nameToUpdate = req.body.name;
        const token = req.get('Authorization');

        if (!passwordToUpdate) throw new Error('Enter password, please');
        if (!nameToUpdate) throw new Error('Enter name, please');
        if (typeof id !== "number") throw new Error('ID must be a number');
        //Перевірки робляться в файлі верифікації
        const userFromToken = await viryfiToken(token, secretWord);
        // перевіряю чи токен є в базі з токенами
        await isUserLoggined(postgres, token);
        // Перевірка на випадок якщо ми пеедали не той токен, або ввели невірну id в квері
        if (id !== userFromToken.id) throw new Error('Wrong auth or wrong user id');

        //
       const updatedUser = await UserModel.update({
            name: nameToUpdate,
            password: passwordToUpdate,
        }, {
            where: {
                id: id
            }
        });
       if (!updatedUser) throw new Error('Cant update user');

       res.json(updatedUser);

    } catch (err) {
        res.json({
            success: false,
            message: err.message
        });
    }
};