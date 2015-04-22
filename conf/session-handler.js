/* =========================================================================
 *
 * session-handler
 *  Handles session for express and websocket connections. Need to expose this
 *  to app config and websocket server
 *
 *  ======================================================================== */
var _ = require('lodash');
var nconf = require('nconf');

var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var sessionStore = new RedisStore({ 
    host: nconf.get('redis:host'),
    port: nconf.get('redis:port'),
    ttl: 60 * 60 * 24 * 14 //2 weeks, in seconds
});

var sessionHandler = session({
    secret: nconf.get('app:sessionSecret'),
    cookie: nconf.get('app:cookie'),
    store: sessionStore 
});

module.exports = sessionHandler;
