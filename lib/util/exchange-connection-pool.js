/* =========================================================================
 *
 * exchange-connection-pool.js
 *  Exports an exchange connection pool
 *
 *  -Setup connections to both the chat AMQP connection and the Feed
 *
 *  ======================================================================== */
var _ = require('lodash');
var nconf = require('nconf');
var logger = require('bragi');
var amqpConnection = require('../amqp-connection-chat');

// Setup rabbitmq exchange connection pool
// --------------------------------------
// NOTE: this array will initiall be empty, but will be populated when the
//  AMQP exchange connections are established
//
var RABBITMQ_EXCHANGES = {}; // connection pool
var numConnections = nconf.get('amqp:exchangeConnectionPoolSize') || 8;

_.each([{name: 'chat', conn: amqpConnection}], function setupFeed(amqpObj){

    RABBITMQ_EXCHANGES[amqpObj.name] = [];

    // if we don't use setImmediate (or nextTick), we get an error (likely from having 
    // exchanges and connections declared in the same tick of the event loop)
    setImmediate(function(){
        amqpObj.conn.on('ready', function setupExchange (){
            logger.log('amqpConnection:setupExchange:' + amqpObj.name, 'Setting up exchange...');

            // Listen on the `chatRoom` exchange (name specified in config), set up a
            // `topic` exchange
            setImmediate(function(){
                _.each(_.range(numConnections), function setupExchange (i){
                    amqpConnection.exchange( 
                        nconf.get('amqp:chatRoomTopic'), 
                        { type: 'topic', autoDelete: false }, 

                        function exchangeOpenCallback (exchange){
                            logger.log('amqpConnection:setupExchange:' + amqpObj.name, 
                                '❖ Connected to exchange! (' + i + ')');

                            // store reference so we can publish on disconnect
                            RABBITMQ_EXCHANGES[amqpObj.name].push(exchange); 
                        }
                    );
                });
            });
        });
    });
});

module.exports = RABBITMQ_EXCHANGES;
