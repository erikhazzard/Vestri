/* =========================================================================
 *
 * analytics
 *      Analytics util
 *
 *  ======================================================================== */
var _ = require('lodash');
var logger = require('bragi');
var addMessageToInfluxData = require('./add-message-to-influx-db');
var sendData = require('./send-data-to-influx');

var os = require('os');
var hostname = os.hostname();

function track ( options ){
    options = options || {};

    // Send to influx db
    // ----------------------------------
    var columns = ['time', 'value'];
    var point = [options.time ? options.time : Date.now() ];

    // have value always be second item
    if(!options.value){ point.push(1); } 
    else { point.push(options.value); }

    // should we batch it or manually send now (e.g., for db stats)
    var sendNow = options._sendNow;
    delete options._sendNow;

    // add other keys
    _.each(options, function(value, key){
        // skip some keys
        if(key === 'group' || key === 'value'){
            // no op

        } else {
            // Update date to push
            columns.push(key);
            point.push(value);
        }
    });

    columns.push('hostname');
    point.push(hostname);

    if(sendNow){
        // send data immediately
        sendData([{
            name: options.group,
            columns: columns,
            points: [point]
        }]);

    } else {
        // add data as a message which will be batched and sent later
        addMessageToInfluxData({
            name: options.group,
            columns: columns,
            points: [point]
        });
    }
}

module.exports.track = track;
