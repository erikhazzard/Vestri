/* =========================================================================
 *
 * configure-bragi.js
 *  Configures winston related settings
 * 
 * ========================================================================= */
var nconf = require('nconf');
require('./configure');
var logger = require('bragi');

module.exports = function configBragi(){
    //get level based on environment
    var env = nconf.get('NODE_ENV');

    if(['localhost','test', 'dev', 'develop'].indexOf(env) !== -1){
        logger.options.showStackTrace = true;
        logger.transports.get('Console').property('showStackTrace', true);
    }

    //// Disable certain logging groups 
    //// --------------------------------
    //// If you want to disable certain groups (can do this anywhere)
    // logger.options.groupsDisabled = [ /silly/ ];
    if(env === 'production'){
    }
};
