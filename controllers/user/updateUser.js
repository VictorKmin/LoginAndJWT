const viryfiToken = require('../../hepler/tokenVeryficator');
const isUserLoggined = require('../../hepler/isUserLoggined');
const secretWord = require('../../constants/secretWords').secret;
const emalValidator = require('../../hepler/emailValidator');
const passwordHasher = require('../../hepler/passwordHasher');

module.exports = async (req, res) => {
    try {
        const postgres = req.app.get('postgres');
        const UserModel = postgres.getModel('User');
        const passwordToUpdate = req.body.password;
        const nameToUpdate = req.body.name;
        const emailToUpdate = req.body.email;
        const token = req.get('Authorization');

        if (!passwordToUpdate) throw new Error('Enter password, please');
        if (!nameToUpdate) throw new Error('Enter name, please');
        //Перевірки робляться в файлі верифікації
        const userFromToken = await viryfiToken(token, secretWord);
        // перевіряю чи токен є в базі з токенами
        await emalValidator(emailToUpdate);
        await isUserLoggined(postgres, token);
        // Перевірка на випадок якщо ми пеедали не той токен, або ввели невірну id в квері

        //
        const updatedUser = await UserModel.update({
            name: nameToUpdate,
            password: passwordHasher(passwordToUpdate),
            email: emailToUpdate
        }, {
            where: {
                id: userFromToken.id
            }
        });
        if (!updatedUser) throw new Error('Cant update user');

        res.json({
            success: true,
            message: `Your Name is: ${nameToUpdate}, email is: ${emailToUpdate}`
        });

    } catch (err) {
        res.json({
            success: false,
            message: err.message
        });
    }
};