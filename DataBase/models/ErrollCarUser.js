'use strict';

module.exports = (sequelize, DataTypes) => {
    const UserModel = sequelize.import(__dirname + "\\User");
    const CarModel = sequelize.import(__dirname + `\\Car`);

    const EnrollCarUser = sequelize.define('EnrollCarUser', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: DataTypes.INTEGER,
        },
        carId: {
            type: DataTypes.INTEGER,
        }
    }, {
        tableName: 'enrollCarUser',
        timestamps: false
    });

    EnrollCarUser.belongsTo(CarModel, {foreignKey: 'carId'});
    EnrollCarUser.belongsTo(UserModel, {foreignKey: 'userId'});


    return EnrollCarUser
};