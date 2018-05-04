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

    updateUserProfileToRequest(params) {
        return {
            userId: params.id,
            firstName: params.firstName,
            lastName: params.lastName,
            email: params.email,
            phoneNumber: params.phoneNumber,
            title: params.title,
            role: params.role,
            companyId: params.companyId
        };
    }

    /**
     * Responses
     */
    getUserProfileToResponse(userProfile) {
        return {
            firstName: _.get(userProfile.userDesc, 'firstName', null) || null,
            lastName: _.get(userProfile.userDesc, 'lastName', null) || null,
            email: _.get(userProfile.userDesc, 'email', null) || null,
            phoneNumber: _.get(userProfile.userDesc, 'phoneNumberWork', null) || null,
            title: _.get(userProfile.userDesc, 'title', null) || null,
            companyId: _.get(userProfile.userDesc, 'companyId', null) || null,
            role: _.get(userProfile.roleDesc, 'name', null) || null
        };
    }

    updateUserProfileToResponse(userProfile) {
        return {
            firstName: _.get(userProfile.userDesc, 'firstName', null) || null,
            lastName: _.get(userProfile.userDesc, 'lastName', null) || null,
            email: _.get(userProfile.userDesc, 'email', null) || null,
            phoneNumber: _.get(userProfile.userDesc, 'phoneNumberWork', null) || null,
            title: _.get(userProfile.userDesc, 'title', null) || null,
            companyId: _.get(userProfile.userDesc, 'companyId', null) || null,
            role: _.get(userProfile.roleDesc, 'name', null) || null
        };
    }
}

module.exports = new UserMapper();
