const Sequelize = require('sequelize');
const fs = require('fs');
const resolve = require('path').resolve;
const DBName = require('../helper/constants').dbName;
const DBUser = require('../helper/constants').dbUser;
const DBPass = require('../helper/constants').dbPass;

module.exports = (() => {
    let instance;
    function initConnection() {
        let client = new Sequelize(DBName, DBUser, DBPass, {
            host: 'localhost',
            dialect: 'postgres',
            operatorsAliases: false,
            pool: {
                max: 5,
                min: 0,
                acquire: 30000,
                idle: 10000
            }
        });
        let models = {};

        function getModels() {
            fs.readdir('./DataBase/models', (err, files) => {
                files.forEach(file => {
                    const modelName = file.split('.')[0];
                    models[modelName] = client.import(resolve(`./DataBase/models/${modelName}`));
                });
            });
        }

        return {
            getModel: (modelName) => models[modelName],
            setModels: () => {
                return getModels();
            }
        };
    }

    return {
        getInstance: () => {
            if (!instance) {
                instance = initConnection();
            }
            return instance;
        }
    }
})();