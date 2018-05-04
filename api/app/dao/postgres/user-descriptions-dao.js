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
            throw new Error(err.message);
        });
    }

    /**
     * Create user description
     * @param {Object} params
     * @return {Promise.<Object>}
     */
    createUserDescription(params) {
        return db.UserDescriptions.create(params).catch(err => {
            throw new Error(err.message);
        });
    }

    /**
     * Update user description
     * @param {Object} fields
     * @param {Object} params
     * @return {Promise.<Object>}
     */
    updateUserDescription(fields, params) {
        return db.UserDescriptions.find({
            where: fields
        })
            .then(userDesc => {
                return userDesc.update(params);
            })
            .catch(err => {
                throw new Error(err.message);
            });
    }
}

module.exports = new UserDescriptionsDao();
