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
            throw err;
        });
    }

    /**
     * Create reset password hash
     * @param {Object} params
     * @return {Promise.<Object>}
     */
    createResetPasswordHash(params) {
        return db.ResetPasswords.create(params).catch(err => {
            throw err;
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
                return invitation.update(params);
            })
            .catch(err => {
                throw err;
            });
    }
}

module.exports = new ResetPasswordDao();
