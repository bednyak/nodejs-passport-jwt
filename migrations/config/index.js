const config = require('../../api/app/config');

module.exports = {
    [config.env]: {
        username: config.database.user,
        password: config.database.password,
        database: config.database.name,
        host: config.database.host,
        port: config.database.port,
        dialect: config.database.dialect
    }
};
