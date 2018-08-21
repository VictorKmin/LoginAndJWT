// accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTEsIm5hbWUiOiIxMSIsImlhdCI6MTUzNDMzOTQ1OSwiZXhwIjoxNjM0MzM5NDU4fQ.7l7FXFpxhbnpJF_pB2Z8d0rR9yXiQwzy0uqm0AUDoak",
//refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTEsIm5hbWUiOiIxMSIsImlhdCI6MTUzNDMzOTQ1OSwiZXhwIjoxMDAxNTM0MzM5NDU4fQ.HrDSvD75JmWUz89bUSJ9RoPGnXaqYknzS5f5QfG9okI"

// accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNTM0MzM5NTU3LCJleHAiOjE2MzQzMzk1NTZ9.HD8TmvLud7GMmWqiPIyMKF57h_6KDgfQdNajMJWM6nI",
//refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywibmFtZSI6InVzZXIiLCJpYXQiOjE1MzQzMzk1NTcsImV4cCI6MTAwMTUzNDMzOTU1Nn0.rsWrSlLz1RG_kh374ShTrWf7P0J0S-icEiChGfjAWY8"
// wrongRefresh: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNTM0MzI3MTgxLCJleHAiOjExNTM0MzI3MTgwfQ._kMaILb5tRg6B0m9px1yFfjzv7_GOEBDFyhMWVyPtIE

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
            attributes: [],
            include: [{
                model: CarModel,
                attributes: ['model']
            }, {
                model: UserModel,
                attributes: ['name']
            }]
        });


        let final = [];

        // // РОБОЧА на циклах
        // let usersAndCars = [];
        // let uniqueUsersSet = new Set();
        // //Отримую список унікальних імен
        // users.forEach(element => {
        //     let car = (element.getDataValue('Car').dataValues.model);
        //     let userName = (element.getDataValue('User').dataValues.name);
        //     let userWithCar = {userName, car};
        //     // Тут масив з всіма іменами юзерів
        //     uniqueUsersSet.add(userName);
        //     usersAndCars.push(userWithCar);
        // });
        //
        // // Приямаю сет унікальних імен
        // uniqueUsersSet.forEach(uniqueName => {
        //     let userToPrint = {};
        //     let userCar = [];
        //     usersAndCars.forEach(userAndCar => {
        //         if (userAndCar.userName === uniqueName) {
        //             userCar.push(userAndCar.car);
        //         }
        //         userToPrint.name = uniqueName;
        //         userToPrint.cars = userCar;
        //     });
        //     final.push(userToPrint);
        // });
        // res.json(final)

        // РОБОЧА без циклів
        users.forEach(userAndCar => {
            let userToPrint = {};
            let userCar = [];
            let currentCar = (userAndCar.getDataValue('Car').dataValues.model);
            let currentUserName = (userAndCar.getDataValue('User').dataValues.name);
            userToPrint.name = currentUserName;
            userToPrint.cars = userCar;
            final.push(userToPrint);

            final.some(carUserObj => {
                if (carUserObj.name === currentUserName) {
                    carUserObj.cars.push(currentCar);
                    return true;
                }
            });
        });
        let t = final.filter(filteredObj => filteredObj.cars.length > 0);
        res.json(t)
    }
    catch
        (err) {
        res.json({
            success: false,
            message: err.message
        })
    }
}
;