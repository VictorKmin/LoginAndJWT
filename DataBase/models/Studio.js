'use strict';

module.exports = (sequelize, DataTypes) => {
    const Studio = sequelize.define('Studio', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: DataTypes.INTEGER,
            foreignKey: true
        },
        name: {
            type: DataTypes.STRING,
        },
        address: {
            type: DataTypes.STRING
        },
        phone: {
            type: DataTypes.STRING
        },
        createdAt: {
            type: DataTypes.DATE
        },
        updatedAt: {
            type: DataTypes.DATE
        }
    }, {
        tableName: 'studios',
        timestamps: false,
        scopes: {
            findStudiosByUserId: userId => {
                return {where: {userId: userId}}
            },
            findStudiosByUserIdAndStudioId: (userId, studioId) => {
                return {where: {id: studioId, userId: userId}}
            },
            findStudiosByName: studioName => {
                return {where: {name: studioName}}
            },
        }
    });
    return Studio
};
