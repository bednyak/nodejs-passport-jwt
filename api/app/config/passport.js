const passport = require('passport'),
    DaoFactory = require('../dao'),
    userDao = DaoFactory.loadDao('user-dao');

module.exports = () => {
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        userDao
            .getUserById(id)
            .then(user => {
                done(null, user);
            })
            .catch(err => {
                done(err, null);
            });
    });
};
