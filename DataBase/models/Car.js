'use strict';

module.exports = (sequelize, DataTypes) => {
    const Car = sequelize.define('Car', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        model: {
            type: DataTypes.STRING
        },
        year: {
            type: DataTypes.INTEGER
        }
    }, {
        tableName: 'cars',
        timestamps: false
    });
    return Car
};
