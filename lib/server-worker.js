/* =========================================================================
 * 
 * server-worker
 *      Single worker process that server spins up
 *
 * ========================================================================= */
var constants = require('constants');
var nconf = require('nconf');
require('../conf/configure');

var express = require('express');

var http = require('http'); 
var https = require('https');

var fs = require('fs');
var path = require('path');

var SECRETS = require('../conf/configure-secrets');

// logger configured in configure-bragi
var logger = require('bragi');
require('../conf/configure-bragi')();

// Setup mongo
var db = require('./database');

var redisApi = require('./redis-api');

// Setup App (express app handles its own config)
var app = require('./app');

var NODE_ENV = nconf.get('NODE_ENV');
var PORT_HTTP = nconf.get('app:port');
var PORT_HTTPS = nconf.get('app:portHttps');

// =========================================================================
//
// Server Setup
//
// =========================================================================
// HTTPS
// --------------------------------------
// get the SSL file name (either 'five' or 'local');
var SSL_FILE = nconf.get('app:sslFileName');

logger.log('server-api:ssl', 'SSL files: ../conf/ssl/' + SSL_FILE + '.*');

//// HTTPs server
var sslOptions = {
    secureProtocol: 'SSLv23_method',
    secureOptions: constants.SSL_OP_NO_SSLv3,

    key: fs.readFileSync( path.join(__dirname, '../conf/ssl/' + SSL_FILE + '.key'), 'utf8'),
    cert: fs.readFileSync( path.join(__dirname, '../conf/ssl/' + SSL_FILE + '.crt'), 'utf8'),
    ca: fs.readFileSync( path.join(__dirname, '../conf/ssl/' + SSL_FILE + '.csr'), 'utf8')
};
var serverHttps = https.createServer(sslOptions, app).listen(PORT_HTTPS);

logger.log('server', 
    'App Server started in environment: <' + nconf.get('NODE_ENV') + '> on PORT <' + PORT_HTTPS + '>');

//// HTTP
// --------------------------------------
var server = http.createServer(app).listen(PORT_HTTP);

// Redirect for non test
logger.log('server', 'App Server started in environment: <' + nconf.get('NODE_ENV') + '> on PORT <' + PORT_HTTP + '>');

// Alert if event loop becomes blocked!
// ------------------------------------
var blocked = require('blocked');
blocked(function(ms){
    ms = ms || 0;
    if(ms < 20){
        logger.log('warn:server:eventLoop:blocked', 
            'EVENT LOOP BLOCKED FOR ' + ms + 'ms');

    } else {
        logger.log('error:server:eventLoop:blocked', 
            'EVENT LOOP BLOCKED FOR ' + ms + 'ms');
    }
});

// Cactch and shutdown on errors
// ----------------------------------
// Catch the sigint to close the server
var closeEverything = function(err) {
    logger.log('warn:server', 'Shutting down...do androids dream of electric sheep?');

    if(err){
        // if there are errors, show them
        logger.log('error:server', ''+err);
        logger.log('error:server', ''+err.stack);
    }

    // close the express app
    server.close();
    serverHttps.close();

    // finally, kill the process
    process.exit();
};

// when `SIGINT` event is recieved (user closes the app), shut down everything
process.on('SIGINT', closeEverything);
process.on('SIGTERM', closeEverything);
process.on('uncaughtException', closeEverything);
