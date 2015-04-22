/* =========================================================================
 *
 * redis-api.js
 *      Analytics util DB. 
 *
 * ========================================================================= */
var nconf = require('nconf');
var redis = require('redis');
var logger = require('bragi');

//---------------------------------------
//Setup redis client
//---------------------------------------
//Configure it. Note: This only sets defaults if nothing has been set in
//  config files
require('../conf/configure-redis-api')();

//Create client
var redisClient = redis.createClient(
    nconf.get('redis-api:port'), 
    nconf.get('redis-api:host')
); 

redisClient.on('error', function(err) {
    //catch redis errors so server doesn't blow up
    logger.log('error:redis-api', 'Redis client error:' + err);
});

redisClient.on('connect', function(err, msg) {
    logger.log('redis-api', 'Redis connected to ' + 
        nconf.get('redis-api:host') + ":" + nconf.get('redis-api:port'));
});

//export the client
module.exports = redisClient;
