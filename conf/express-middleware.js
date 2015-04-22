/* =========================================================================
 *
 * express-middleware
 *      Middleware util for express
 *
 * ========================================================================= */
var nconf = require('nconf');
var NODE_ENV = nconf.get('NODE_ENV');

function setupResSendPrepared (req, res, next){
    // Expose a `sendPrepared` method which will wrap a passed in
    // response and meta object in an object. We use this because we want
    // all response to look like:
    //  { meta: { error: {Boolean}, message: "" }, 
    //    response: RESPONSE OBJECT
    //  }
    //
    res.sendPrepared = function( response, meta ){
        // Does meta exist without an error passed in? Add one
        if(meta && meta.error === undefined){ meta.error = true; }

        // Does meta not exist? add an error message
        if(!meta){ 
            meta = { error: false, message: "success" };
        }

        if(!meta.responseTime){
            var diff = process.hrtime(req._hrStartTime);
            meta.responseTime = (diff[0] * 1e9 + diff[1]) / 1e6;
        }
        if(!meta.date){ meta.date = Date.now(); }
        if(!meta.reqId){ meta.reqId = req._reqId; }
        if(meta.isLoggedIn === undefined){ meta.isLoggedIn = req.user ? true : false; }

        // if we're in a test env AND requester wants to get headers, send them
        // Note - we need this to help test manual cookie sending for
        // websockets (e.g., testing iOS sending cookies over for WS requests)
        if(NODE_ENV === 'test' && req.param('returnHeaders') === 'true'){ meta.headers = req.headers; }

        
        // Return it
        return res.send({ response: response, meta: meta });
    };

    next();
}
module.exports.setupResSendPrepared = setupResSendPrepared;
