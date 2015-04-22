/* =========================================================================
 *
 * configure-amqp.js
 *  Configures amqp related settings
 *
 * ========================================================================= */
var nconf = require('nconf');

module.exports = function configureRedis(){
    nconf.add('amqp', {
        'type': 'literal',
        //amqp
        'amqp': nconf.get('amqp') || { 
            'host': 'localhost',
            'port': 15672,
            'chatRoomTopic': 'someapptopic',
            'unsubscribeHmac': 'thisissomertestporcupineandhootbreakfastdeeply',
            'username': 'guest',
            'password': 'guest'
        }
    });
};
