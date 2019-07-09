const express = require('express'),
    jwt = require('jsonwebtoken'),
    userMapper = require('../../mappers/user-mapper'),
    ValidationError = require('../../errors/validation-error'),
    userService = require('../../services/users-service'),
    authService = require('../../services/auth-service'),
    authMapper = require('../../mappers/auth-mapper'),
    config = require('../../config'),
    router = express.Router();

/**
 * Get user profile
 * @api /api/user/profile
 * @method get
 * @return 200 Get user profile success
 * @return 500 Get user profile failed
 * @return 422 Validation failed
 */
router.get('/profile', (req, res, next) => {
    let errors = req.validationErrors();

    if (errors) {
        return next(new ValidationError(errors));
    }

    let params = jwt.verify(req.headers['authorization'].split(' ')[1], config.jwtSecretKey);

    userService
        .getUserProfile(userMapper.getUserProfileToRequest(params))
        .then(user => {
            res.status(200).json(user);
        })
        .catch(err => {
            return next(err);
        });
});

/**
 * User reset-password
 * @api /api/user/reset-password
 * @method post
 * @return 200 Reset password success
 * @return 500 Reset password failed
 * @return 422 Validation failed
 */
router.post('/reset-password', (req, res, next) => {
    req.checkBody('email', 'Email can not be empty').notEmpty();
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
 * User set-password
 * @api /api/user/set-password
 * @method post
 * @return 200 Set password success
 * @return 500 Set password failed
 * @return 422 Validation failed
 * @return 401 URL hash incompatible
 */
router.post('/set-password', (req, res, next) => {
    req.checkQuery('hash', 'Hash can not be empty').notEmpty();
    req.checkBody('password', 'Password can not be empty').notEmpty();

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
