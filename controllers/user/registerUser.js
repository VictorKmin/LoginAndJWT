/**
 * сторінка реєстрації
 */
const hasher = require('../../service/passwordHasher');

module.exports = async (req,res)=> {

    console.log('Я В REGISTER ЮЗЕР');
    // Якщо забрати render('user'), то буде помилка.
    // так як в формі немає логіна і пароля до того, як пейджа відмалюється
    //Якщо ж це залишити буде помилка через те. що я шлю хедери 2 рази
    res.render('login');

    const postgres = req.app.get('postgres');
    const UserModel = postgres.getModel('User');

    let userName = req.body.name;
    let hashedPassword = hasher(req.body.password);

    let users = await UserModel.findAll({
        where: {
            name: userName
        }
    });
    console.log(users.length);
    if (users.length !== 0) {
        console.log('Я В IF users.length !== 0');
        res.render('error', {
            error: 'PLEASE CHANGE USERNAME'
        })
    } else {
        let userToSave = {
            name: userName,
            password: hashedPassword
        };

        if (!userToSave || userName === null || hashedPassword === null) {
            res.render('error', {
                error: "SOME FIELD IS NULL"
            })
        } else {
            console.log('ЮЗЕРА СТВОРЕНО');
            await UserModel.create({
                name: userName,
                password: hashedPassword
            });
            res.json(userToSave)
        }
    }
};