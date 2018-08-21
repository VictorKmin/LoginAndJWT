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
            createStudio: (studioAddress, studioName, userId) => {
                return {
                    userId: userId,
                    name: studioName,
                    address: studioAddress,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            },
            findStudiosByUserIdAndStudioId: (userId, studioId)=> {
                return{where: {id: studioId, userId: userId}}
            },
            // updatestudio: (userId, studioId, studioName, studioAdd)=> {
            //     return{
            //         name: studioName,
            //         address: studioAdd,
            //         updatedAt: new Date()
            //     }
            // }
        }
    });
    return Studio
};
