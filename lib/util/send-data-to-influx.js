
/* =========================================================================
 *
 * add-message-to-influx-db
 *      Analytics util to add data to influx db
 *
 *
 *  ======================================================================== */
var logger = require('bragi');
var nconf = require('nconf');

var _ = require('lodash');
var request = require('request');

// get influx from service wide config
var influxDbUrl = nconf.get('influxdb:url');

// ======================================
//
// Util to send message to influxdb
//
// ======================================
function sendDataToInflux( data ){
    // Function which takes in a data array and sends it to influx. Can be
    // called directly, but is normally called through the interval batching
    logger.log('sendDataToInflux', 'sending data to influx');

    // send the data
    request.post({
        url: influxDbUrl,
        headers: { 'content-type': 'application/json' },
        //pool : 'undefined' !== typeof options.pool ? options.pool : {},
        body: JSON.stringify(data)
    }, function done(e,res,body){
        if(e){ logger.log('error:sendData', 'error with request: ' + e); }
    });
}
module.exports = sendDataToInflux;
