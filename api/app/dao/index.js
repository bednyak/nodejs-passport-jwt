const config = require('./../config');

class DaoFactory {
    loadDao(daoName) {
        return require(`./../dao/${config.dialect}/${daoName}`);
    }
}

module.exports = new DaoFactory();
