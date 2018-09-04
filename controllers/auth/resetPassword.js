/**
 * Сторінка зміни паролю
 */
const tokenizer = require('../../hepler/tokenizer');
const mailSender = require('../../hepler/mailSender');

module.exports = async (req, res) => {
    try {
        const postgres = req.app.get('postgres');
        const UserModel = postgres.getModel('User');
        const userMail = req.body.email;
        if (!userMail) throw new Error('Please enter email');

        // шукаю в базі юзера
        const user = await UserModel.findOne({
            where: {
                email: userMail,
            }
        });
        // перевіряю чи знайшло юзера
        if (!user) throw new Error('User was not found');
        const userID = user.dataValues.id;

        // створюю reset Token
        const token = tokenizer.resetPassword(userID, userMail);
        mailSender(userMail, token);


        // віддаю їх на фронт
        res.json({
            success: true,
            message: 'Повідомлення ззміною паролю відправлене на пошту'
        });

    } catch (err) {
        res.json({
            success: false,
            message: err.message
        })
    }
};