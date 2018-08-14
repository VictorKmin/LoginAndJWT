/**
 * Сторінка логінації
 */
const hasher = require('../../service/passwordHasher');
const uuid = require('uuid');

module.exports = async (req, res)=> {
    console.log(uuid());
    console.log('login User Page');
    let userName = req.body.name;
    let hashedPassword = hasher(req.body.password);

    const postgres = req.app.get('postgres');
    const UserModel = postgres.getModel('User');
    let logginedUser = await UserModel.findAll({
        where: {
            name: userName,
            password: hashedPassword
        }
    });





    // ERRORS
    if (!logginedUser || logginedUser.length === 0) {
        res.render('error', {
            error: 'U A NOT REGISTERED'
        });
    } else {
        console.log('ЗАЛОГІНЕНО');
        res.render('welcome', {
            name: userName
        })
    }
};