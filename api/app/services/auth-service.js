const DaoFactory = require('../dao'),
    authMapper = require('../mappers/auth-mapper'),
    bcrypt = require('bcryptjs'),
    DatabaseError = require('../errors/database-error'),
    srs = require('secure-random-string'),
    ServerError = require('../errors/server-error'),
    mailgun = require('../config/mailgun'),
    userDao = DaoFactory.loadDao('user-dao'),
    userCredentialsDao = DaoFactory.loadDao('user-credentials-dao'),
    authHelpers = require('../utils/auth-helpers');

/**
 * Auth service
 * @class AuthService
 */
class AuthService {
    constructor() {
        this._userDao = DaoFactory.loadDao('user-dao');
        this._userDescriptionsDao = DaoFactory.loadDao('user-descriptions-dao');
        this._userCredentialsDao = DaoFactory.loadDao('user-credentials-dao');
        this._roleDescriptionsDao = DaoFactory.loadDao('role-descriptions-dao');
        this._resetPasswordDao = DaoFactory.loadDao('reset-password-dao');
    }

    /**
     * User exist validation
     * @params {Object} params
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
     * Reset password hash exist validation
     * @params {Object} params
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
     * Register user
     * @params {Object} params
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
            .catch(err => {
                throw new DatabaseError(err);
            });
    }

    /**
     * Login user
     * @params {Object} params
     * @return {Promise.<Object>}
     */
    login(params) {
        const userLoginData = {};
        return userDao
            .getUser({ username: params.email })
            .then(user => {
                if (!user) {
                    throw new ServerError(
                        'User not found.',
                        422,
                        'Login error',
                        'user login',
                        'email'
                    );
                }
                return user;
            })
            .then(user => {
                userLoginData.id = user.id;
                userLoginData.username = user.username;
                userLoginData.roleId = user.roleId;

                return userCredentialsDao.getCredential({
                    userId: user.id
                });
            })
            .then(cred => {
                if (!authHelpers.comparePass(params.password, cred.password)) {
                    throw new ServerError(
                        'Wrong password.',
                        422,
                        'Login error',
                        'user login',
                        'password'
                    );
                }

                return userLoginData;
            });
    }

    /**
     * Send email for initialize password resetting
     * @params {Object} params
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
                } else {
                    return this._resetPasswordDao.updateResetPasswordHash(
                        authMapper.setUpdateResetPasswordHashFields(passwordHashDesc),
                        authMapper.setUpdateResetPasswordHash(srs())
                    );
                }
            })
            .then(resetPassword => {
                const to = params.email;
                const subject = 'NjsJwt password reset';
                const text = `You was initiated the password resetting for NjsJwt acc. Please, press on link ${
                    params.urlHost
                }/api/user/set-password?hash=${resetPassword.hash} to finish registration`;
                mailgun.sendEmail(to, subject, text);
            })
            .catch(err => {
                throw new DatabaseError(err);
            });
    }

    /**
     * Set new password
     * @params {Object} params
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
