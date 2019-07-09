const express = require('express'),
    authService = require('../../services/auth-service'),
    authMapper = require('../../mappers/auth-mapper'),
    ValidationError = require('../../errors/validation-error'),
    ServerError = require('../../errors/server-error'),
    config = require('../../config'),
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
router.post('/signup', (req, res, next) => {
    req.checkBody('firstName', 'Firstname can not be empty').notEmpty();
    req.checkBody('lastName', 'Lastname can not be empty').notEmpty();
    req.checkBody('email', 'Email can not be empty').notEmpty();
    req.checkBody('email', 'Enter the valid email.').isEmail();
    req.checkBody('password', 'Password can not be empty').notEmpty();
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
router.post('/login', (req, res, next) => {
    req.checkBody('email', 'Email can not be empty').notEmpty();
    req.checkBody('email', 'Enter the valid email.').isEmail();
    req.checkBody('password', 'Password can not be empty').notEmpty();

    let errors = req.validationErrors();

    if (errors) {
        return next(new ValidationError(errors));
    }

    let params = req.body;

    authService
        .login(params)
        .then(payload => {
            jwt.sign(payload, config.jwtSecretKey, { expiresIn: 36000 }, (err, token) => {
                if (err) {
                    return next(
                        new ServerError(
                            'Error signing token.',
                            422,
                            'Login error',
                            'user login',
                            'token'
                        )
                    );
                }
                res.status(200).json(
                    authMapper.loginToResponse({
                        success: true,
                        access_token: token
                    })
                );
            });
        })
        .catch(err => {
            return next(err);
        });
});

module.exports = router;
