const config = require('./../config');

class DaoFactory {
    loadDao(daoName) {
        return require(`./../dao/${config.database.dialect}/${daoName}`);
    }
}

module.exports = new DaoFactory();
