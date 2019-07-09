const express = require('express'),
    app = express(),
    auth = require('./auth-router'),
    users = require('./users-router'),
    jwtValidation = require('../jwt-validation-route');

app.use('/auth', auth);
app.use('', jwtValidation);
app.use('/user', users);

module.exports = app;
