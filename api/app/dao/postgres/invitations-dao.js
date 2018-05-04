const db = require('../../models/postgres');

/**
 * Invitations Dao
 * @class InvitationsDao
 */
class InvitationsDao {
    /**
     * Get invitation
     * @param {Object} params
     * @return {Promise.<Object>}
     */
    getInvitation(params) {
        return db.Invitations.findOne({
            where: params
        }).catch(err => {
            throw new Error(err.message);
        });
    }

    /**
     * Multi create invitations
     * @param {Object} params
     * @return {Promise.<Object>}
     */
    multiCreateInvitations(params) {
        return db.Invitations.bulkCreate(params).catch(err => {
            throw new Error(err.message);
        });
    }

    /**
     * Update invitation
     * @param {Object} fields
     * @param {Object} params
     * @return {Promise.<Object>}
     */
    updateInvitation(fields, params) {
        return db.Invitations.find({
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

module.exports = new InvitationsDao();
