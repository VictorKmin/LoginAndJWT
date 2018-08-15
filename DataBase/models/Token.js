'use strict';

module.exports = (sequelize, DataTypes) => {
    const Token = sequelize.define('Token', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userID: {
            type: DataTypes.INTEGER
        },
        accessToken: {
            type: DataTypes.STRING
        }
    }, {
        tableName: 'tokens',
        timestamps: false
    });
    return Token
};