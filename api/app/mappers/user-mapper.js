const _ = require('lodash');

/**
 * User mapper
 * @class UserMapper
 */
class UserMapper {
    /**
     * Requests
     */
    getUserProfileToRequest(params) {
        return {
            userId: params.id,
            roleId: params.roleId
        };
    }

    /**
     * Responses
     */
    getUserProfileToResponse(userProfile) {
        const roleName = _.get(userProfile.roleDesc, 'name', 'N/A') || 'N/A';
        return {
            firstName: _.get(userProfile.userDesc, 'firstName', null) || null,
            lastName: _.get(userProfile.userDesc, 'lastName', null) || null,
            email: _.get(userProfile.userDesc, 'email', null) || null,
            phoneNumber: _.get(userProfile.userDesc, 'phoneNumber', null) || null,
            role: roleName
        };
    }
}

module.exports = new UserMapper();
