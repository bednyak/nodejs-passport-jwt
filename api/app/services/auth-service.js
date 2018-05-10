const DaoFactory = require('../dao'),
    authMapper = require('../mappers/auth-mapper'),
    passport = require('../config/strategies'),
    bcrypt = require('bcryptjs'),
    _ = require('lodash'),
    DatabaseError = require('../errors/database-error'),
    srs = require('secure-random-string'),
    mailgun = require('../config/mailgun');

/**
 * Auth service
 * @class AuthService
 */
class AuthService {
    constructor() {
        this._userDao = DaoFactory.loadDao('user-dao');
        this._userDescriptionsDao = DaoFactory.loadDao('user-descriptions-dao');
        this._tokenDao = DaoFactory.loadDao('token-dao');
        this._userCredentialsDao = DaoFactory.loadDao('user-credentials-dao');
        this._roleDescriptionsDao = DaoFactory.loadDao('role-descriptions-dao');
        this._resetPasswordDao = DaoFactory.loadDao('reset-password-dao');
    }

    /**
     * User exist validation
     * @param {Object} params
     * @return {Promise.<Object>}
     */
    validationUserExist(params) {
        return this._userDao
            .getUser(authMapper.registerValidationUserExistToRequest(params))
            .catch(err => {
                throw new DatabaseError(err);
            });
    }

    /**
     * Save user access token
     * @param {Object} params
     * @return {Promise.<Object>}
     */
    saveToken(params) {
        return this._tokenDao
            .createUserToken(authMapper.loginSaveTokenToRequest(params))
            .catch(err => {
                throw new DatabaseError(err);
            });
    }

    /**
     * Update user access token
     * @param {Object} params
     * @return {Promise.<Object>}
     */
    updateToken(params) {
        return this._tokenDao
            .updateUserToken(
                authMapper.setLoginUpdateTokenFields(params.userId),
                authMapper.setLoginUpdateToken(params.token)
            )
            .catch(err => {
                throw new DatabaseError(err);
            });
    }

    /**
     * Update user access token
     * @param {Number} userId
     * @return {Promise.<Object>}
     */
    findToken(userId) {
        return this._tokenDao
            .getUserToken(authMapper.loginFindTokenToRequest(userId))
            .catch(err => {
                throw new DatabaseError(err);
            });
    }

    /**
     * Delete user access token
     * @param {String} token
     * @return {Promise.<Object>}
     */
    deleteToken(token) {
        return this._tokenDao.deleteUserToken(authMapper.deleteTokenToRequest(token)).catch(err => {
            throw new DatabaseError(err);
        });
    }

    /**
     * Reset password hash exist validation
     * @param {Object} params
     * @return {Promise.<Object>}
     */
    setPasswordValidationHashExist(params) {
        return this._resetPasswordDao
            .getResetPasswordHash(authMapper.setPasswordValidationHashExistToRequest(params))
            .catch(err => {
                throw new DatabaseError(err);
            });
    }

    /**
     * Register company
     * @param {Object} params
     * @return {Promise.<Object>}
     */
    signup(params) {
        let userData = null;
        return this._userDao
            .createUser(authMapper.registerUserToRequest('user', params, null))
            .then(user => {
                userData = user;
                const password = params.password;
                const salt = bcrypt.genSaltSync();
                const hash = bcrypt.hashSync(password, salt);
                return this._userCredentialsDao.createCredential(
                    authMapper.registerUserToRequest('userCred', { hash, salt }, userData.id)
                );
            })
            .then(() => {
                return this._userDescriptionsDao.createUserDescription(
                    authMapper.registerUserToRequest('userDesc', params, userData.id)
                );
            })
            .then(() => {
                passport.authenticate('local', (err, user, info) => {
                    if (user) {
                        return user;
                    }
                });
            })
            .catch(err => {
                throw new DatabaseError(err);
            });
    }

    /**
     * Login company
     * @param {Object} params
     * @return {Promise.<Object>}
     */
    login(params) {
        let loginRes = {};

        if (params.roleId === 2) {
            return this._userDescriptionsDao
                .getUserDescription(authMapper.loginToRequest(params))
                .then(userDesc => {
                    loginRes.user = {
                        firstName: userDesc.firstName,
                        lastName: userDesc.lastName,
                        email: userDesc.email,
                        phoneNumber: userDesc.phoneNumber
                    };
                    return loginRes;
                })
                .catch(err => {
                    throw new DatabaseError(err);
                });
        }
    }

    /**
     * Send email for initialize password resetting
     * @param {Object} params
     * @return {Promise.<Object>}
     */
    resetPassword(params) {
        let userInfo = null;
        return this._userDao
            .getUser(authMapper.resetPasswordToRequest(params))
            .then(user => {
                userInfo = user;
                return this._resetPasswordDao.getResetPasswordHash(
                    authMapper.findResetPasswordHashToRequest(user)
                );
            })
            .then(passwordHashDesc => {
                if (!passwordHashDesc) {
                    return this._resetPasswordDao.createResetPasswordHash(
                        authMapper.createResetPasswordHashToRequest(userInfo, srs())
                    );
                }
                else {
                    return this._resetPasswordDao.updateResetPasswordHash(
                        authMapper.setUpdateResetPasswordHashFields(passwordHashDesc),
                        authMapper.setUpdateResetPasswordHash(srs())
                    );
                }
            })
            .then(resetPassword => {
                let to = params.email;
                let subject = 'NodePassportLocalJwt password reset';
                let text = `You was initiated the password resetting for NodePassportLocalJwt acc. Please, press on link ${
                    params.urlHost
                }/auth/set-password?hash=${resetPassword.hash} to finish registration`;
                mailgun.sendEmail(to, subject, text);
            })
            .catch(err => {
                throw new DatabaseError(err);
            });
    }

    /**
     * Set new password
     * @param {Object} params
     * @return {Promise.<Object>}
     */
    setPassword(params) {
        let userId = null;
        return this._resetPasswordDao
            .getResetPasswordHash(authMapper.setPasswordGetHashToRequest(params))
            .then(resetPassword => {
                userId = resetPassword.userId;
                const password = params.password;
                const salt = bcrypt.genSaltSync();
                const hash = bcrypt.hashSync(password, salt);
                return this._userCredentialsDao.updateCredential(
                    authMapper.setPasswordUpdateCredentialsFields(userId),
                    authMapper.setPasswordUpdateCredentials(hash, salt)
                );
            })
            .then(() => {
                return this._resetPasswordDao.updateResetPasswordHash(
                    authMapper.setPasswordUpdateHashFields(userId),
                    authMapper.setPasswordUpdateHash(true)
                );
            })
            .catch(err => {
                throw new DatabaseError(err);
            });
    }
}

module.exports = new AuthService();
