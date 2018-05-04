const db = require('../../models/postgres');

/**
 * Token Dao
 * @class TokenDao
 */
class TokenDao {
    /**
     * Get user description
     * @param {Object} params
     * @return {Promise.<Object>}
     */
    getUserToken(params) {
        return db.Tokens.findOne({
            where: params
        }).catch(err => {
            throw new Error(err.message);
        });
    }

    /**
     * Create user description
     * @param {Object} params
     * @return {Promise.<Object>}
     */
    createUserToken(params) {
        return db.Tokens.create(params).catch(err => {
            throw new Error(err.message);
        });
    }

    /**
     * Delete user description
     * @param {Object} params
     * @return {Promise.<Object>}
     */
    deleteUserToken(params) {
        return db.Tokens.destroy({
            where: params
        }).catch(err => {
            throw new Error(err.message);
        });
    }
}

module.exports = new TokenDao();
