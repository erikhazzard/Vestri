/* ==========================================================================
 *
 * app.js
 *  Main express app
 *
 * ========================================================================== */
var fs = require('fs');
var express = require('express');

// app module
var app = express();
var passport = require('./app-passport');

// Configuration
// --------------------------------------
// Configure the app, pass in a reference to it
require('../conf/configure-app.js')(
    //first param is the app
    app, 
    // second param is an array of route objects
    [
        require('./routes-api'),
        require('./routes-app'),
        require('./routes-admin')
    ]
);

module.exports = app;
