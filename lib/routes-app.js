/* =========================================================================
 *
 * routes-app.js
 *  Handles all app routes (pages)
 *
 *  ======================================================================== */
var nconf = require('nconf');
var env = nconf.get('NODE_ENV');
var _ = require('lodash');

var controllerPages = require('./controllers/pages');

// ======================================
//
// UTILITY
//
// ======================================
var getTemplateVariables = require('./util/get-template-variables');

// ======================================
//
// ROUTES
//
// ======================================
var routes = function routesApi(app) {
    app.get('/ping', function(req, res) {
        return res.send('pong');
    });
    app.get('/favicon.ico', function(req, res) {
        return res.redirect('/static/build/img/favicon.ico');
    });
    app.get('/favicon.icon', function(req, res) {
        return res.redirect('/static/build/img/favicon.ico');
    });

    // tests
    if (['local', 'localhost', 'test', 'develop'].indexOf(nconf.get('NODE_ENV') !== -1)) {
        app.get('/test', function(req, res) {
            return res.render('test.html', getTemplateVariables({}));
        });
    }

    // Errors
    // --------------------------------
    app.get('/500', function(req, res) {
        return res.render('500.html');
    });
    app.get('/404', function(req, res) {
        return res.render('404.html');
    });

    // ==================================
    //
    // App Pages
    //
    // ==================================
    app.get('/', controllerPages.pageHome);
};

module.exports = routes;
