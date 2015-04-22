//============================================================================
//
//amqp-connection.js
//  returns an amqp connection object 
//
//============================================================================
var nconf = require('nconf');
var amqp = require('amqp');
var logger = require('bragi');

//---------------------------------------
//Setup AMQP client
//---------------------------------------
//Configure it. Note: This only sets defaults if nothing has been set in
//  config files
require('../conf/configure-amqp')();

//Create client
logger.log('amqp-connection','Starting up AMQP connection, waiting to connect...');

var connection = amqp.createConnection({
    host: nconf.get('amqp:host')
});

connection.on('error', function(err) {
    logger.log('error:amqp-connection', 'AMQP Connection Error: ' + err + '');
    logger.log('error:amqp-connection', 'stack: ' + err.stack);

    if((err+'').match('socket is closed')){
        logger.log('warn:amqp-connection', 'Could not connect to AMQP (rabbitmq-server is not running)');
    }
});

connection.on('ready', function(err) {
    //catch redis errors so server doesn't blow up
    logger.log('amqp-connection', 'AMQP Connection ready() : AMQP Server connection established!');
});

//export the client
module.exports = connection;
