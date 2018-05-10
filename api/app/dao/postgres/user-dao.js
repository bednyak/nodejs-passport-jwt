const db = require('../../models/postgres');

/**
 * User Dao
 * @class UserDao
 */
class UserDao {
    /**
     * Get user by id
     * @param {number} id
     * @return {Promise.<Object>}
     */
    getUserById(id) {
        return db.Users.findById(id).catch(err => {
            throw err;
        });
    }

    /**
     * Get user
     * @param {Object} params
     * @return {Promise.<Object>}
     */
    getUser(params) {
        return db.Users.findOne({
            where: params
        }).catch(err => {
            throw err;
        });
    }

    /**
     * Create user
     * @param {Object} params
     * @return {Promise.<Object>}
     */
    createUser(params) {
        return db.Users.create(params).catch(err => {
            throw err;
        });
    }
}

module.exports = new UserDao();
