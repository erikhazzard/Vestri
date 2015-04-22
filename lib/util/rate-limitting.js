/* =========================================================================
 *
 * rate-limitting
 *  Rate limitting util
 *
 *  ======================================================================== */
var _ = require('lodash');
var logger = require('bragi');
var nconf = require('nconf');

// redis client
var redisApiClient = require('../redis-api');

var DEFAULT_MAX_COUNT = 20;

// =========================================================================
//
// Rate limiting function
//
// =========================================================================
module.exports = function rateLimit( options, callback ){
    // Hits redis to check rate limiting based on key. 
    //
    // Calls callback with success or error (if too many rate limitting)
    //
    callback = callback || function(){};
    options = options || {};

    // if only a key was passed in (as a string), use it instead
    if(typeof options === 'string'){
        options = {key: options};
    }

    // api rate limitting key. should usually be keyed on user id and some 
    // namespaced key
    var key = options.key;

    // How many times the key can be requested before timing out
    var ttl = options.ttl || 10;

    // maximum number of times it can hit it
    var maxCount = options.maxCount || DEFAULT_MAX_COUNT;

    if(!key){
        maxCount = 9999;
        key = '_noKeySet';
        ttl = 1;
        logger.log('warn:rateLimit', 'NO KEY SET');
    }

    // Hit redis
    // ----------------------------------
    redisApiClient.get( key, function gotRedisAPILimitData( err, apiHitCount ){
        if(err){
            logger.log('error:rateLimit', 'key: ' + key + ' || err: ' + err);
            return callback(err, null);
        }
        logger.log('rateLimit', 'key: ' + key + ' || hit count: ' + apiHitCount);

        // Increment key
        redisApiClient.incr(key);

        // Set TTL if it hasn't been set yet
        //  This will cause the time to be from the first request made, as
        //  opposed to a rolling time out (e.g., if you get locked out and
        //  make a request 9 seconds later, the timer resets at 9, so you
        //  end up waiting 10 more seconds instead of 1)
        if(!apiHitCount){
            redisApiClient.expire(key, ttl);
        } 

        // Check for exceeded limit
        if(apiHitCount > maxCount){
            logger.log('warn:rateLimit:exceeded', 
            'Rate limit exceeded: key: ' + key +
            ' || hit count: ' + apiHitCount);

            return res.sendPrepared(null, {
                error: true,
                message: 'API Limit reached',
                status: 420
            });
        }

        // Success
        return callback(null, (+apiHitCount)+1);
    });
};
