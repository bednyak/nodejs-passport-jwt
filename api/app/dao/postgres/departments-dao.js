const db = require('../../models/postgres');

/**
 * Departments Dao
 * @class DepartmentsDao
 */
class DepartmentsDao {
    /**
     * Get department
     * @param {Object} params
     * @return {Promise.<Object>}
     */
    getDepartment(params) {
        return db.Departments.findOne({
            where: params
        }).catch(err => {
            throw new Error(err.message);
        });
    }

    /**
     * Multi create departments
     * @param {Object} params
     * @return {Promise.<Object>}
     */
    multiCreateDepartments(params) {
        return db.Departments.bulkCreate(params).catch(err => {
            throw new Error(err.message);
        });
    }
}

module.exports = new DepartmentsDao();
