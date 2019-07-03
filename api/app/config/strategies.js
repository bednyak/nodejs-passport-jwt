const passport = require('passport'),
    DaoFactory = require('../dao'),
    userDao = DaoFactory.loadDao('user-dao'),
    config = require('../config'),
    tokenDao = DaoFactory.loadDao('token-dao'),
    userCredentialsDao = DaoFactory.loadDao('user-credentials-dao'),
    authHelpers = require('../utils/auth-helpers'),
    passportJWT = require('passport-jwt'),
    ExtractJWT = passportJWT.ExtractJwt,
    LocalStrategy = require('passport-local').Strategy,
    JWTStrategy = passportJWT.Strategy;

const init = require('./passport');

const options = {
    usernameField: 'email',
    passwordField: 'password'
};

init();

// passport.use(
//     new LocalStrategy(options, (username, password, done) => {
//         let userData = null;
//         userDao
//             .getUser({
//                 username
//             })
//             .then(user => {
//                 if (!user) return done(null, 'userNotFound');
//                 userData = user;
//                 return userCredentialsDao.getCredential({
//                     userId: user.id
//                 });
//             })
//             .then(credentials => {
//                 if (!authHelpers.comparePass(password, credentials.password)) {
//                     return done(null, 'wrongPassword');
//                 }
//                 return done(null, userData);
//             })
//             .catch(err => {
//                 return done(err);
//             });
//     })
// );

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
