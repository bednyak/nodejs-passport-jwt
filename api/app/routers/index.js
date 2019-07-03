const express = require('express'),
    app = express(),
    index = require('./v1'),
    status = require('./status-router');

app.use('/', status);
app.use('/api', index);

module.exports = app;
