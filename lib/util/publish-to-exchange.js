/* =========================================================================
 *
 * publishToExchange.js
 *  Exports a publishToExchange function which publishes a message using a
 *  pool of exchange objects
 *
 *  ======================================================================== */
var _ = require('lodash');
var logger = require('bragi');
var amqpConnection = require('../amqp-connection-chat');
var connectionPool = require('./exchange-connection-pool');

// Send message
// --------------------------------------
function publishToExchange (routingKey, message, options, callback){
    // Publishing a passed in message to the exchange with passed in routing key
    var index = Math.random() * connectionPool.length - 1 | 0;
    logger.log('publishToExchange', 
        '◯  publishing message (' + message.messageType + ') ' +
        ': to ' + routingKey + 
        ' | Pool: ' + index + 
        ' | messageId : ' + message.messageId,
        typeof message === 'object' ? {} :  { message: message }
    );

    // Ensure exchanges exist. If they don't, store message until they do
    if(connectionPool.chat.length < 1){
        logger.log('publishToExchange:notSetup', '⤷ Exchange is not yet setup. Setting a timeout ⤴︎');
        return setTimeout(function publishLater (){
            return publishToExchange( routingKey, message, options, callback );
        }, 200);
    }

    // pick a random exchange connection and publish
    connectionPool.chat[index]
        .publish(routingKey, message);
}

module.exports = publishToExchange;
