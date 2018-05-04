const db = require('../../models/postgres');

/**
 * Role Descriptions Dao
 * @class RoleDescriptionsDao
 */
class RoleDescriptionsDao {
    /**
     * Get role description by ID
     * @param {Number} id
     * @return {Promise.<Object>}
     */
    getRoleDescriptionById(id) {
        return db.RoleDescriptions.findById(id).catch(err => {
            throw new Error(err.message);
        });
    }

    /**
     * Get role description
     * @param {Object} params
     * @return {Promise.<Object>}
     */
    getRoleDescription(params) {
        return db.RoleDescriptions.findOne({
            where: params
        }).catch(err => {
            throw new Error(err.message);
        });
    }
}

module.exports = new RoleDescriptionsDao();
