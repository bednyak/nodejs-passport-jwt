const db = require('../../models/postgres');

/**
 * User Descriptions Dao
 * @class UserDescriptionsDao
 */
class UserDescriptionsDao {
    /**
     * Get user description
     * @param {Object} params
     * @return {Promise.<Object>}
     */
    getUserDescription(params) {
        return db.UserDescriptions.findOne({
            where: params
        }).catch(err => {
            throw err;
        });
    }

    /**
     * Create user description
     * @param {Object} params
     * @return {Promise.<Object>}
     */
    createUserDescription(params) {
        return db.UserDescriptions.create(params).catch(err => {
            throw err;
        });
    }
}

module.exports = new UserDescriptionsDao();
