/* =========================================================================
 *
 * helpers
 *  various helper functions
 *
 *  ======================================================================== */
var _ = require('lodash');
var nconf = require('nconf');
var LOWEST_VERSION = nconf.get('apiEarliestClientVersionAllowed') || {
    major: 0, minor: 0, patch: 0
};

var validMongoIdRegex = new RegExp("^[0-9a-fA-F]{24}$");
// --------------------------------------
// MongoId
// --------------------------------------
function isValidObjectId ( id ){
    id = (''+id);
    if(id.length !== 24){ return false; }
    return (/^[0-9a-fA-F]{24}$/).test(id);
}
module.exports.isValidObjectId = isValidObjectId;


// --------------------------------------
// version number
// --------------------------------------
function getVersionFromString( version ){
    // parse that string
    var versionObject = {
        major: 0,
        minor: 0,
        patch: 0,
        build: 0,
        isValid: false,
        hasValidParams: false
        
    };
    // check that version is string and is valid. If not, return 0.0.0
    if(!version || typeof version !== 'string'){
        return versionObject;
    }

    var parsed = version.match(/([0-9]*)?\.?([0-9]*)?\.?([0-9]*)?\.?([0-9]*)?/);
    if(!parsed){
        return versionObject;
    }

    versionObject.major = +parsed[1] || 0;
    versionObject.minor = +parsed[2] || 0;
    versionObject.patch = +parsed[3] || 0;
    versionObject.build = +parsed[4] || 0;
    versionObject.isValid = versionIsValid(versionObject);
    versionObject.hasValidParams= true;

    return versionObject;
}
module.exports.getVersionFromString = getVersionFromString;

function versionIsValid( targetVersion , lowestVersion ){
    // Returns true or false to indicate if version number is valid.
    // Normally called from getVersionFromString
    //
    if(!lowestVersion){
        // Allows a version to be passed in explicitly to override configured
        // version number
        lowestVersion = LOWEST_VERSION;
    }
    if(typeof targetVersion === 'string'){
        targetVersion = getVersionFromString(targetVersion);
    }

    //major
    if(targetVersion.major > lowestVersion.major){ return true; } 
    else if(targetVersion.major < lowestVersion.major){ return false; } 

    //minor
    if(targetVersion.minor > lowestVersion.minor){ return true; }
    if(targetVersion.minor < lowestVersion.minor){ return false; }

    // patch
    // last patch number is gte, in case of tie the version IS valid
    if(targetVersion.patch >= lowestVersion.patch ){ return true; }

    return false;

}
module.exports.versionIsValid = versionIsValid;

// ======================================
//
// UTIL
//
// ======================================
function getArrayFromString( queryString ){
    // Get an array from a string. Used to get arrays from client-sent strings
    // and ensure they are valid (e.g., for processing array of phone numbers 
    // from client
    var parsedArray;

    if(!queryString){
        parsedArray = [];

    } else if (typeof queryString === 'string'){
        // Normal case
        //
        // Check for a JSON-like string. If it's JSON, strings must be quotes
        if(queryString[0] === '[' &&
           /['"0-9]/.test(queryString[1])){

            if(/["'][ ]?,[ ]'/.test(queryString) || 
            queryString[1] === "'" || 
            queryString[queryString.length-2] === "'"){
                // replace single quotes with double
                queryString = queryString
                    .replace(/["'],[ ]'/g, '","')
                    // ends with a quote
                    .replace(/'[ ]?,/g, '",')
                    // starts with a quote
                    .replace(/,[ ]?'/g, ',"')
                    .replace(/^\['/, '["')
                    .replace(/'\]$/, '"]');
            }
            parsedArray = JSON.parse(queryString);

        } else {
            // Could not parse - assume it's a string like "tag1,tag2" then 
            // trim and turn into array
            //
            // If they passed in an array of strings NOT quotes, remove the
            // brackets
            if(queryString[0] === '[' &&
            queryString[queryString.length-1] === ']'){
                queryString = queryString
                    .replace(/^\[/, '')
                    .replace(/\]$/, '');
            }
            
            //
            // NOTE: Each item will be treated as a string in this case
            parsedArray = queryString.trim().split(',');
        }

        // clean up array (if it's a string, trim it
        _.each(parsedArray, function(d, i){
            if(typeof d === 'string'){
                parsedArray[i] = d.trim();
            }
        });

    } else if (queryString instanceof Array){
        // check if an array was passed in (it shouldn't be
        parsedArray = queryString;
    }

    return parsedArray;
}
module.exports.getArrayFromString = getArrayFromString;


module.exports.getBoolean = function getBoolean( targetToCheck ){
    // takes in a string and returns a boolean from it. iOS will often pass in
    // a '1' or '0', or 'yes' or 'no', so we want to ensure we catch the right 

    // checks
    if(targetToCheck === undefined || targetToCheck === null || 
       targetToCheck === false || targetToCheck === 0){ 
        return false;

    } else if(targetToCheck === true || 
    targetToCheck === 1 || 
    targetToCheck === '1'){ 
        return true;
    }

    // Check for string or other object type (default return val to false)
    var bool = false;

    // uppercase if we can
    if(targetToCheck.toUpperCase){ targetToCheck = targetToCheck.toUpperCase(); }

    // check for true value
    if(
        targetToCheck === '1' || 
        // NOTE: toUpperCase has been called, so check upper case version
        targetToCheck === 'TRUE' || targetToCheck === 'YES' 
    ){
        bool = true;
    }
    
    return bool;
};

// ======================================
//
// Email validation
//
// ======================================
module.exports.isEmailValid = function isEmailValid ( email ){
    return email.match(/^(?:[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+\.)*[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+@(?:(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!\.)){0,61}[a-zA-Z0-9]?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!$)){0,61}[a-zA-Z0-9]?)|(?:\[(?:(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\.){3}(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\]))$/) ? true : false;
};
