const _ = require('lodash');

/**
 * Auth mapper
 * @class AuthMapper
 */
class AuthMapper {
    /**
     * Requests
     */
    registerUserToRequest(stage, params, userId) {
        if (stage === 'user')
            return {
                username: params.email,
                roleId: params.roleId
            };
        if (stage === 'userDesc')
            return {
                userId: userId,
                firstName: params.firstName,
                lastName: params.lastName,
                email: params.email,
                phoneNumber: params.phoneNumber
            };
        if (stage === 'userCred')
            return {
                userId: userId,
                password: params.hash,
                salt: params.salt
            };
    }

    registerValidationUserExistToRequest(params) {
        return {
            username: params.email
        };
    }

    loginToRequest(params) {
        return {
            userId: params.id
        };
    }

    loginSaveTokenToRequest(params) {
        return {
            userId: params.userId,
            token: params.token
        };
    }

    logoutToRequest(params) {
        return params.headers['authorization'].split(' ')[1];
    }

    deleteTokenToRequest(token) {
        return {
            token: token
        };
    }

    resetPasswordToRequest(params) {
        return {
            username: params.email
        };
    }

    createResetPasswordHashToRequest(params, hash) {
        return {
            userId: params.id,
            hash: hash
        };
    }

    setPasswordValidationHashExistToRequest(params) {
        return {
            hash: params.hash
        };
    }

    setPasswordGetHashToRequest(params) {
        return {
            hash: params.hash
        };
    }

    setPasswordUpdateCredentialsFields(userId) {
        return {
            userId: userId
        };
    }

    setPasswordUpdateCredentials(hash, salt) {
        return {
            password: hash,
            salt: salt
        };
    }

    setPasswordUpdateHashFields(userId) {
        return {
            userId: userId
        };
    }

    setPasswordUpdateHash(status) {
        return {
            status: status
        };
    }

    /**
     * Responses
     */
    signupToResponse() {
        return { status: true };
    }

    resetPasswordToResponse() {
        return { status: true };
    }

    setPasswordToResponse() {
        return { status: true };
    }

    loginToResponse(loginResData) {
        return loginResData;
    }
}

module.exports = new AuthMapper();
