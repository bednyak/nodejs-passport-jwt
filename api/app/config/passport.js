const passport = require('passport'),
    DaoFactory = require('../dao'),
    userDao = DaoFactory.loadDao('user-dao'),
    config = require('../config'),
    passportJWT = require('passport-jwt'),
    ExtractJWT = passportJWT.ExtractJwt,
    JWTStrategy = passportJWT.Strategy;

passport.use(
    new JWTStrategy(
        {
            jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.jwtSecretKey
        },
        (jwtPayload, cb) => {
            return userDao
                .getUserById(jwtPayload.id)
                .then(user => {
                    return cb(null, user);
                })
                .catch(err => {
                    return cb(err);
                });
        }
    )
);

module.exports = passport;
