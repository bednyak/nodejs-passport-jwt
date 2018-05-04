const db = require('../../models/postgres');

/**
 * Reset Password Dao
 * @class ResetPassword
 */
class ResetPasswordDao {
    /**
     * Get reset password hash
     * @param {Object} params
     * @return {Promise.<Object>}
     */
    getResetPasswordHash(params) {
        return db.ResetPasswords.findOne({
            where: params
        }).catch(err => {
            throw new Error(err.message);
        });
    }

    /**
     * Create reset password hash
     * @param {Object} params
     * @return {Promise.<Object>}
     */
    createResetPasswordHash(params) {
        return db.ResetPasswords.create(params).catch(err => {
            throw new Error(err.message);
        });
    }

    /**
     * Update reset password hash
     * @param {Object} params
     * @return {Promise.<Object>}
     */
    updateResetPasswordHash(fields, params) {
        return db.ResetPasswords.find({
            where: fields
        })
            .then(invitation => {
                invitation.update(params);
            })
            .catch(err => {
                throw new Error(err.message);
            });
    }
}

module.exports = new ResetPasswordDao();
