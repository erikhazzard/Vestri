/* =========================================================================
 *
 * send-req-errors
 *      Utility functions for sending error responses through the API
 *
 *  ======================================================================== */
var logger = require('bragi');
var _ = require('lodash');

// --------------------------------------
// Database errors
// --------------------------------------
function dbError ( req, res, err ){
    // database error. try to parse error to get type
    logger.log('error:dbError', '[x] error with DB: ' + err);

    var errorType = undefined;
    if(err){
        if((''+err).match(/duplicate/)){ errorType = 'duplicate'; }
    }

    return res.sendPrepared(null, {
        message: 'Server error', error: true,
        errorType: errorType, status: 500
    });
}
module.exports.dbError = dbError;


// --------------------------------------
// Missing user
// --------------------------------------
function noUser ( req, res, err ){
    logger.log('noUser', '[x] no user found, returning');

    return res.sendPrepared(null, {
        message: 'No user', error: true, status: 511
    });
}
module.exports.noUser = noUser;


// --------------------------------------
// Rate limit error
// --------------------------------------
function rateLimit ( req, res, options){
    logger.log('rateLimit', '[x] rate limitting');

    return res.sendPrepared(null, _.extend({
        message: 'Rate limit reached', error: true, status: 420
    }, options));
}
module.exports.rateLimit = rateLimit;


// --------------------------------------
// Reddit Error
// --------------------------------------
function redditError ( req, res, err ){
    logger.log('redditError', '[x] reddit api error: ' + err);

    return res.sendPrepared(null, {
        message: 'Reddit error', error: true, status: 502
    });
}
module.exports.redditError = redditError;


// --------------------------------------
// Invalid Param Error
// --------------------------------------
function invalidParameter ( req, res, err ){
    logger.log('invalidParameter', '[x] invalid params %j', {
        url: req.url, body: req.body
    });

    return res.sendPrepared(null, {
        message: 'Invalid Parameters', error: true, status: 400
    });
}
module.exports.invalidParameter = invalidParameter;
