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
            throw err;
        });
    }
}

module.exports = new RoleDescriptionsDao();
