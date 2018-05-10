const db = require('../../models/postgres');

/**
 * Token Dao
 * @class TokenDao
 */
class TokenDao {
    /**
     * Get user access token
     * @param {Object} params
     * @return {Promise.<Object>}
     */
    getUserToken(params) {
        return db.Tokens.findOne({
            where: params
        }).catch(err => {
            throw err;
        });
    }

    /**
     * Create user access token
     * @param {Object} params
     * @return {Promise.<Object>}
     */
    createUserToken(params) {
        return db.Tokens.create(params).catch(err => {
            throw err;
        });
    }

    /**
     * Update user access token
     * @param {Object} params
     * @return {Promise.<Object>}
     */
    updateUserToken(fields, params) {
        return db.Tokens.find({
            where: fields
        })
            .then(credentials => {
                return credentials.update(params);
            })
            .catch(err => {
                throw err;
            });
    }

    /**
     * Delete user access token
     * @param {Object} params
     * @return {Promise.<Object>}
     */
    deleteUserToken(params) {
        return db.Tokens.destroy({
            where: params
        }).catch(err => {
            throw err;
        });
    }
}

module.exports = new TokenDao();
