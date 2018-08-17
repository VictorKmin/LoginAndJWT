// accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTEsIm5hbWUiOiIxMSIsImlhdCI6MTUzNDMzOTQ1OSwiZXhwIjoxNjM0MzM5NDU4fQ.7l7FXFpxhbnpJF_pB2Z8d0rR9yXiQwzy0uqm0AUDoak",
//refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTEsIm5hbWUiOiIxMSIsImlhdCI6MTUzNDMzOTQ1OSwiZXhwIjoxMDAxNTM0MzM5NDU4fQ.HrDSvD75JmWUz89bUSJ9RoPGnXaqYknzS5f5QfG9okI"

// accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNTM0MzM5NTU3LCJleHAiOjE2MzQzMzk1NTZ9.HD8TmvLud7GMmWqiPIyMKF57h_6KDgfQdNajMJWM6nI",
//refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywibmFtZSI6InVzZXIiLCJpYXQiOjE1MzQzMzk1NTcsImV4cCI6MTAwMTUzNDMzOTU1Nn0.rsWrSlLz1RG_kh374ShTrWf7P0J0S-icEiChGfjAWY8"
// wrongRefresh: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNTM0MzI3MTgxLCJleHAiOjExNTM0MzI3MTgwfQ._kMaILb5tRg6B0m9px1yFfjzv7_GOEBDFyhMWVyPtIE


// SELECT users."id", users."name", cars.model
// FROM users
// LEFT OUTER JOIN "enrollCarUser"
// ON users."id" = "enrollCarUser"."userId"
// LEFT OUTER JOIN cars
// ON "enrollCarUser"."carId"= cars."id"


// const ItemTag = sequelize.define('item_tag', {
//     id : {
//         type: DataTypes.INTEGER,
//         primaryKey: true,
//         autoIncrement: true
//     },
//     tag_id: {
//         type: DataTypes.INTEGER,
//         unique: 'item_tag_taggable'
//     },
//     taggable: {
//         type: DataTypes.STRING,
//         unique: 'item_tag_taggable'
//     },
//     taggable_id: {
//         type: DataTypes.INTEGER,
//         unique: 'item_tag_taggable',
//         references: null
//     }
// });
// const Tag = sequelize.define('tag', {
//     name: DataTypes.STRING
// });

// Post.belongsToMany(Tag, {
//     through: {
//         model: ItemTag,
//         unique: false,
//         scope: {
//             taggable: 'post'
//         }
//     },
//     foreignKey: 'taggable_id',
//     constraints: false
// });
// Tag.belongsToMany(Post, {
//     through: {
//         model: ItemTag,
//         unique: false
//     },
//     foreignKey: 'tag_id',
//     constraints: false
// });

const viryfiToken = require('../../service/tokenVeryficator');
const secretWord = require('../../helper/constants').secret;
const isUserLoggined = require('../../service/isUserLoggined');


module.exports = async (req, res) => {
    try {
        const token = req.get('Authorization');
        const postgres = req.app.get('postgres');
        const UserModel = postgres.getModel('User');
        const CarModel = postgres.getModel('Car');
        const EnrollModel = postgres.getModel('ErrollCarUser');
        //На еррор перевіряю в верифікаторі
        await viryfiToken(token, secretWord);
        // Перевіряю чи юзер залогований
        await isUserLoggined(postgres, token);


        let users = await EnrollModel.findAll({
            attributes: ['id'],
            include: [{
                model: CarModel,
                attributes: ['model', 'id']
            }, {
                model: UserModel,
                attributes: ['name', 'id']
            }]
        });


        let usersAndCars = [];

        let userToPrint = new Object();
        let allUsers = new Set();
        //Цикл якийдістає всі значення з масиву який прийшов з бази і вносить їх в інакший масиш
        // ШТООООО
        users.forEach(element => {
            let car = (element.getDataValue('Car').dataValues.model);
            let userName = (element.getDataValue('User').dataValues.name);
            let userWithCar = {userName, car};
            // Тут масив з всіма іменами юзерів
            allUsers.add(userName);
            usersAndCars.push(userWithCar);
        });

        let final = [];
        allUsers.forEach(uniqueName=> {
            userToPrint.name = uniqueName;
            console.log(uniqueName);
            usersAndCars.forEach(userAndCar=>{
                if (uniqueName === userAndCar.userName) {
                    console.log(userAndCar)
                    console.log('__________________________');
                    userToPrint.cars = userAndCar.car
                }
            });

            final.push(userToPrint)
        });

        console.log('+++++++++++++++++++++++++++++++++++++++++')
        console.log(final);


        // usersAndCars.forEach(obj => {
        //     if (allUsers.has(obj.userName)) {
        //         console.log(obj.userName);
        //         console.log(obj.car);
        //         console.log(allUsers);
        //         console.log('__________________');
        //     }
        // });

        res.json(usersAndCars)
    } catch (err) {
        res.json({
            success: false,
            message: err.message
        })
    }
};