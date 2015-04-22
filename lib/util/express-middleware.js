/* =========================================================================
 *
 * express-middleware
 *  Various util middleware functions
 *
 *  ======================================================================== */
var _ = require('lodash');
var nconf = require('nconf');
var NODE_ENV = nconf.get('NODE_ENV');

module.exports.requireAuth = function requireAuth(req, res, next) {
    if(req.user && req.user.username) {
        // If user is logged in, req.user will exist
        next();

    } else {
        // If user isn't logged in, show error
        res.sendPrepared(null, {
            error: true,
            status: 511,
            message: 'Authorization required'
        });
    }
};

module.exports.excludeThrowAways = function excludeThrowAways( req, res, next ){
    // Disable throw away accounts
    // If we're in a test env AND a param is specified to override this behavior
    // then return next
    if(NODE_ENV === 'test' && req.param('ignoreThrowAwayCheck')){
        return next();
    }

    // Otherwise, normal behavior: 
    if(req.user && !req.user.isThrowAway) {
        // If user is logged in, req.user will exist
        return next();

    } else {
        // No throw aways allowed
        return res.sendPrepared(null, {
            error: true, status: 431,
            message: 'Your account is too new or does not have enough karma to post new content' 
        });
    }
};
