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
var sendData = require('./send-data-to-influx');

// ======================================
//
// Send data on interval
//
// ======================================
// specify how long between batches. Every N milliseconds, we'll send over
// data to influx
var SEND_INTERVAL = 100;
var INFLUX_DATA = [];

var INFLUX_TIMEOUT = setInterval( function sendMessageToInflux (){
    // send messages on an interval, then reset the influx data array
    if(INFLUX_DATA.length > 0){ 
        logger.log('sendMessagesToInflux', 
            'sending data: %j', {
                numMessages: INFLUX_DATA.length
            });

        // send it
        sendData( INFLUX_DATA );

        // clear out data 
        INFLUX_DATA.length = 0;  // reset array
    }
}, SEND_INTERVAL);

function addMessageToInfluxData( data ){
    // Add messages to the INFLUX_DATA queue. 

    // ensure time is first column
    if( data.columns[0] !== 'time' ){
        logger.log('warn:addMessageToInfluxData', 
        'called without column[0] being a time stamp');

        //ensure time is added
        var now = +new Date();

        data.columns.unshift( 'time' );

        _.each(data.points, function (d){
            d.unshift(now);
        });
    }

    // update messages
    INFLUX_DATA.push(data);
}

module.exports = addMessageToInfluxData;

