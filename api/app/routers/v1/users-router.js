const express = require('express'),
    jwt = require('jsonwebtoken'),
    userMapper = require('../../mappers/user-mapper'),
    ValidationError = require('../../errors/validation-error'),
    userService = require('../../services/users-service'),
    config = require('../../config'),
    router = express.Router();

/**
 * Get user profile
 * @return 200 Get user success
 * @return 500 Get user failed
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

module.exports = router;
