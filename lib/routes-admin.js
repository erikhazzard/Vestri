/* =========================================================================
 *
 * routes-admin.js
 *  Handles all admin routes
 *
 *  ======================================================================== */
var _ = require('lodash');
var nconf = require('nconf');
var env = nconf.get('NODE_ENV');

var request = require('request');
var crypto = require('crypto');

var logger = require('bragi');

var middlewareUtils = require('./util/express-middleware');
var requireAuth = middlewareUtils.requireAuth;

var passport = require('./app-passport');
var sendErrors = require('./util/send-req-errors');
var renderErrors = require('./util/render-errors');

// ======================================
//
// ROUTES
//
// ======================================
var routes = function routesApi(app){
    app.get('/admin/ping', function (req, res){
        return res.send('pong');
    });

    // ----------------------------------
    //
    // Admin
    //
    // ----------------------------------
    // All
};

module.exports = routes;
