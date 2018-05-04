const express = require('express'),
    jwt = require('jsonwebtoken'),
    userMapper = require('../../mappers/user-mapper'),
    ValidationError = require('../../errors/validation-error'),
    userService = require('../../services/users-service'),
    ServerError = require('../../errors/server-error'),
    config = require('../../config'),
    _ = require('lodash'),
    router = express.Router();

/**
 * Get user profile
 * @return 200 Get user success
 * @return 500 Get user failed
 * @return 422 Validation failed
 */
router.get('/profile', (req, res, next) => {
    res.status(200).json({ status: true });

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
 * Update user profile
 * @return 200 Update user profile success
 * @return 500 Update user profile failed
 * @return 422 Validation failed
 */
router.put('/profile', (req, res, next) => {
    req.checkBody('firstName', 'Firstname can\'t be empty').notEmpty();
    req.checkBody('lastName', 'Lasttname can\'t be empty').notEmpty();
    req.checkBody('email', 'Email can\'t be empty').notEmpty();
    req.checkBody('email', 'Enter the valid email.').isEmail();
    req.checkBody('role', 'Email can\'t be empty').notEmpty();
    if (req.body.phoneNumber)
        req.checkBody('phoneNumber', 'Phone number must contain only numeric symbols').isNumeric();

    let errors = req.validationErrors();

    if (errors) {
        return next(new ValidationError(errors));
    }

    let params = req.body;
    _.merge(params, jwt.verify(req.headers['authorization'].split(' ')[1], config.jwtSecretKey));

    userService
        .updateUserProfile(userMapper.updateUserProfileToRequest(params))
        .then(user => {
            res.status(200).json(user);
        })
        .catch(err => {
            return next(err);
        });
});

module.exports = router;
