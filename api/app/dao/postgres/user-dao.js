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
            throw new Error(err.message);
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
            throw new Error(err.message);
        });
    }

    /**
     * Get all users
     * @param {Object} params
     * @return {Promise.<Object>}
     */
    getAllUsers(params) {
        return db.Users.findAll({
            where: params
        }).catch(err => {
            throw new Error(err.message);
        });
    }

    /**
     * Create user
     * @param {Object} params
     * @return {Promise.<Object>}
     */
    createUser(params) {
        return db.Users.create(params).catch(err => {
            throw new Error(err.message);
        });
    }

    /**
     * Update user
     * @param {Object} fields
     * @param {Object} params
     * @return {Promise.<Object>}
     */
    updateUser(fields, params) {
        return db.Users.find({
            where: fields
        })
            .then(user => {
                return user.update(params);
            })
            .catch(err => {
                throw new Error(err.message);
            });
    }
}

module.exports = new UserDao();
