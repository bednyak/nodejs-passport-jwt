const db = require('../../models/postgres');

/**
 * User Credentials Dao
 * @class UserCredentialsDao
 */
class UserCredentialsDao {
    /**
     * Get user credential
     * @param {Object} params
     * @return {Promise.<Object>}
     */
    getCredential(params) {
        return db.UserCredentials.findOne({
            where: params
        }).catch(err => {
            throw err;
        });
    }

    /**
     * Create user credential
     * @param {Object} params
     * @return {Promise.<Object>}
     */
    createCredential(params) {
        return db.UserCredentials.create(params).catch(err => {
            throw err;
        });
    }

    /**
     * Update user credential
     * @param {Object} params
     * @return {Promise.<Object>}
     */
    updateCredential(fields, params) {
        return db.UserCredentials.find({
            where: fields
        })
            .then(credentials => {
                credentials.update(params);
            })
            .catch(err => {
                throw err;
            });
    }
}

module.exports = new UserCredentialsDao();
