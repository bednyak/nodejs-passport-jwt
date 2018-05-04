const express = require('express'),
    DaoFactory = require('../../dao'),
    authService = require('../../services/auth-service'),
    authMapper = require('../../mappers/auth-mapper'),
    ValidationError = require('../../errors/validation-error'),
    ServerError = require('../../errors/server-error'),
    DatabaseError = require('../../errors/database-error'),
    config = require('../../config'),
    passport = require('../../config/strategies'),
    router = express.Router();

const jwt = require('jsonwebtoken');

/**
 * Auth signup
 * @api /api/auth/signup
 * @method post
 * @return 200 Registration success
 * @return 500 Registration failed
 * @return 422 Validation failed
 */
router.post('/auth/signup', (req, res, next) => {
    req.checkBody('firstName', 'Firstname can\'t be empty').notEmpty();
    req.checkBody('lastName', 'Lasttname can\'t be empty').notEmpty();
    req.checkBody('email', 'Email can\'t be empty').notEmpty();
    req.checkBody('email', 'Enter the valid email.').isEmail();
    req.checkBody('password', 'Password can\'t be empty').notEmpty();
    if (req.body.phoneNumber)
        req.checkBody('phoneNumber', 'Phone number must contain only numeric symbols').isNumeric();
    let errors = req.validationErrors();

    if (errors) {
        return next(new ValidationError(errors));
    }

    let params = req.body;
    params.roleId = 2;

    authService
        .validationUserExist(params)
        .then(user => {
            if (user)
                throw new ServerError(
                    'User with this email already exist.',
                    422,
                    'Registration error',
                    'register company',
                    'email'
                );

            return authService.signup(params);
        })
        .then(() => {
            res.status(200).json(authMapper.signupToResponse());
        })
        .catch(err => {
            return next(err);
        });
});

/**
 * Auth login
 * @api /api/auth/login
 * @method post
 * @return 200 Login success
 * @return 500 Login failed
 * @return 422 Validation failed
 */
router.post('/auth/login', (req, res, next) => {
    passport.authenticate('local', { session: false }, (err, user, info) => {
        if (err) {
            return next(new DatabaseError(err));
        }
        if (user === 'userNotFound') {
            return next(
                new ServerError('User not found.', 422, 'Login error', 'user login', 'email')
            );
        }
        if (user === 'wrongPassword') {
            return next(
                new ServerError('Wrong password.', 422, 'Login error', 'user login', 'password')
            );
        }
        req.logIn(user, err => {
            let loginResData = null;
            let params = {};
            if (err) {
                return next(new DatabaseError(err));
            }
            authService
                .login(user)
                .then(loginRes => {
                    loginResData = loginRes;
                    const token = jwt.sign(user.toJSON(), config.jwtSecretKey);
                    return token;
                })
                .then(token => {
                    params.userId = user.id;
                    params.token = token;
                    return authService.saveToken(params);
                })
                .then(userToken => {
                    loginResData.token = {
                        access_token: userToken.token
                    };
                    return res.status(200).json(authMapper.loginToResponse(loginResData));
                })
                .catch(err => {
                    return next(new DatabaseError(err));
                });
        });
    })(req, res, next);
});

/**
 * Auth logout
 * @api /api/auth/logout
 * @method post
 * @return 200 Logout success
 * @return 500 Logout failed
 */
router.post('/auth/logout', (req, res, next) => {
    return authService
        .deleteToken(authMapper.logoutToRequest(req))
        .then(() => {
            req.logout();
            res.status(200).json({ status: true });
        })
        .catch(err => {
            return next(new DatabaseError(err));
        });
});

/**
 * Check authorization
 * @method post
 * @return 200 Authorization success
 * @return 500 Authorization 2-d step failed
 * @return 422 Validation failed
 * @return 401 Authorization 1-st step failed
 */
router.use('', (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err)
            return next(
                new ServerError(
                    'User token unauthorized',
                    401,
                    'Authorization error',
                    'authorize token',
                    'token'
                )
            );
        if (!user)
            return next(
                new ServerError(
                    'User token unauthorized',
                    401,
                    'Authorization error',
                    'authorize token',
                    'token'
                )
            );
        next();
    })(req, res, next);
});

/**
 * Auth reset-password
 * @api /api/auth/reset-password
 * @method post
 * @return 200 Reset password success
 * @return 500 Reset password failed
 * @return 422 Validation failed
 */
router.post('/auth/reset-password', (req, res, next) => {
    req.checkBody('email', 'Email can\'t be empty').notEmpty();
    req.checkBody('email', 'Enter the valid email.').isEmail();

    let errors = req.validationErrors();

    if (errors) {
        return next(new ValidationError(errors));
    }

    let params = req.body;
    params.urlHost = req.protocol + '://' + config.urlHost;
    return authService
        .validationUserExist(params)
        .then(userEmail => {
            if (!userEmail) {
                throw new ServerError(
                    'User with this email not found.',
                    422,
                    'Change password initiating error',
                    'Send email',
                    'email'
                );
            }
            authService
                .resetPassword(params)
                .then(() => {
                    res.status(200).json(authMapper.resetPasswordToResponse());
                })
                .catch(err => {
                    return next(err);
                });
        })
        .catch(err => {
            return next(err);
        });
});

/**
 * Auth set-password
 * @api /api/auth/set-password
 * @method post
 * @return 200 Set password success
 * @return 500 Set password failed
 * @return 422 Validation failed
 * @return 401 URL hash incompatible
 */
router.post('/auth/set-password', (req, res, next) => {
    req.checkQuery('hash', 'hash can\'t be empty').notEmpty();
    req.checkBody('password', 'Password can\'t be empty').notEmpty();

    let errors = req.validationErrors();

    if (errors) {
        return next(new ValidationError(errors));
    }

    let params = req.body;
    params.hash = req.query.hash;
    authService
        .setPasswordValidationHashExist(params)
        .then(resetPassword => {
            if (!resetPassword)
                throw new ServerError(
                    'URL contains wrong hash',
                    401,
                    'Change password error',
                    'set new password',
                    'hash'
                );
            if (resetPassword && resetPassword.status)
                throw new ServerError(
                    'Hash has already used for changing password',
                    422,
                    'Change password error',
                    'set new password',
                    'hash'
                );
            return authService
                .setPassword(params)
                .then(() => {
                    res.status(200).json(authMapper.setPasswordToResponse());
                })
                .catch(err => {
                    return next(err);
                });
        })
        .catch(err => {
            return next(err);
        });
});

module.exports = router;
