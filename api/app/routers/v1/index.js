const express = require('express'),
    app = express(),
    auth = require('./auth-router'),
    users = require('./users-router');

app.use('', auth);
app.use('/user', users);

module.exports = app;
