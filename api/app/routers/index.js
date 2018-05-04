const express = require('express'),
    app = express(),
    index = require('./v1');

app.use('/api', index);

module.exports = app;
