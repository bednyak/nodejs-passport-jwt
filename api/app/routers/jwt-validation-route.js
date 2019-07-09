const express = require('express'),
    ServerError = require('../errors/server-error'),
    passport = require('../config/passport'),
    router = express.Router();

const jwt = require('jsonwebtoken');

/**
 * Check authorization
 * @method post
 * @return 200 Authorization success
 * @return 401 Authorization failed
 */
router.use('', (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err || !user)
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

module.exports = router;
