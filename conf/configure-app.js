/* =========================================================================
 *
 * configure-app.js
 *  Configures app and express related settings
 *
 *  ======================================================================== */
var _ = require('lodash');
var os = require('os');
var nconf = require('nconf');
require('./configure');

var env = nconf.get('NODE_ENV');

var express = require('express');
var passport = require('../lib/app-passport');

var logger = require('bragi');
var bragiLogRoute = require('./bragi-util.js').logRoute;

var bodyParser = require('body-parser');
var multer = require('multer');
var methodOverride = require('method-override');
var compression = require('compression');

// Configure session stuff
var cookieParser = require('cookie-parser');
var sessionHandler = require('./session-handler'); 

var setCacheHeaders = require('../lib/util/set-cache-headers');
var renderErrors = require('../lib/util/render-errors');

// ejs settings
var ejs = require('ejs');
ejs.open = '{{';
ejs.close = '}}';

var setupResSendPrepared = require('./express-middleware').setupResSendPrepared;


// App Configuration
// --------------------------------------
module.exports = function configureApp(app, routeFunctions){
    // Takes in two params:
    //      app: Express app object
    //      routeFunctions: array of route function objects, each function will
    //          be called with `app` passed in to setup routes
    //Server config
    //-----------------------------------
    //we use EJS for template rendering
    app.set('views', __dirname + '/../templates');
    app.engine('html', ejs.__express);

    // don't expose server info
    app.disable('x-powered-by');

    //// Compress everything
    app.use(compression());

    // Static serve
    app.use('/static', express.static(__dirname + '/../static'));
    app.enable('trust proxy');

    // Show stack errors
    app.set('showStackError', true);

    if(env === 'local' || env === 'develop' || env === 'test'){
        // Set some config options based on environment
        app.locals.pretty = true;
    }

    // ----------------------------------
    //
    // Middleware
    //
    // ----------------------------------
    // Session / cookie related
    app.use(methodOverride('_method'));

    app.use(cookieParser(nconf.get('app:cookie:secret')));

    // individual : 
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    // multipart forms
    app.use(multer({ dest: '/tmp'}));

    // ----------------------------------
    // Override req.param
    // ----------------------------------
    app.use(function(req,res,next){
        // We want to check params / body / query, whatever we can use to
        // find a param. express 4.11.0 deprecates it, but we still need it
        req.param = function param(name, defaultValue) {
            var params = this.params || {};
            var body = this.body || {};
            var query = this.query || {};

            var args = arguments.length === 1 ? 'name' : 'name, default';

            if (null != params[name] && params.hasOwnProperty(name)){ return params[name]; }
            if (null != body[name]){ return body[name]; }
            if (null != query[name]){ return query[name]; }

            return defaultValue;
        };
        next();
    });

    // CORs support
    app.use(function(req, res, next){
        // Enable CORs support
        res.header('Access-Control-Allow-Origin', nconf.get('app:allowedDomains'));
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.header('Access-Control-Allow-Headers', 'Content-Type');
        // use utf8 encoding
        res.charset = 'utf-8';
        next();
    });

    // session info
    app.use(sessionHandler);

    // setup passport
    app.use(passport.initialize());
    app.use(passport.session());

    // -----------------------------------
    //
    // Routes 
    //
    // -----------------------------------
    app.use(setupResSendPrepared);

    ////// use our cache preprocessor
    app.use(function setCacheHeader(req,res,next){
        // set default cache header
        if(req.originalUrl.match(/^\/static/)){ 
            setCacheHeaders(res);
        } else {
            setCacheHeaders(res, 0);
        }
        next();
    });

    // Use bragi as a logger when routes are hit
    app.use(bragiLogRoute);

    // redirect WWW
    app.get('/*', function checkWWW(req, res, next) {
        if (req.headers.host.match(/^www/i) !== null ) {
            res.redirect('http://' + req.headers.host.replace(/^www\./i, '') + req.url);
        } else {
            next();     
        }
    });
    
    // App Routes
    // ----------------------------------
    _.each(routeFunctions, function(route){
        route(app);
    });

    // Then, handle errors
    // ----------------------------------
    app.use(function handleError(err, req, res, next){
        Error.captureStackTrace(err, arguments.callee);
        var stackInfo = err.stack+'';
        stackInfo = stackInfo.replace(/\n/g, '\n\t');

        logger.log('error:express-app', 
        '(in handleError) Error with request: ' + req.url + ' | ' + 
        err + '\n\t' + stackInfo, {
            error: err,
        });

        // Don't set status for cloudfront
        return renderErrors.page500(req, res);
    });

    // Finally, handle missing pages
    // -----------------------------------
    app.use(function handleMissingPage(req, res, next){
        logger.log('error:express-app', 'Invalid page requested: ' + req.url);
        return renderErrors.page404(req, res);
    });

    return app;
};
