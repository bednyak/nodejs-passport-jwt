const Sequelize = require('sequelize'),
    config = require('./../config');

class PostgresDataSource {
    constructor() {
        this._sequelize = null;
        this.connect();
        this.testConnection();
    }

    get db() {
        return this._sequelize;
    }

    connect() {
        this._sequelize = new Sequelize(
            config.database.name,
            config.database.user,
            config.database.password,
            {
                host: config.database.host,
                dialect: config.database.dialect
            }
        );
    }

    testConnection() {
        this._sequelize
            .authenticate()
            .then(() => {
                console.log('PostgreSQL connection has been established successfully.');
            })
            .catch(err => {
                console.error('Unable to connect to the database:', err);
            });
    }
}

module.exports = new PostgresDataSource();
