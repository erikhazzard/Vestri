/* =========================================================================
 *
 * User.js
 *
 * ========================================================================= */
var mongoose = require('mongoose');
var async = require('async');
var nconf = require('nconf');
var logger = require('bragi');

var request = require('request');
var bcrypt = require('bcrypt');
var nconf = require('nconf');
var _ = require('lodash');
var analytics = require('../util/analytics');

// ====================================
//
// User Schema
//
// ====================================
var UserSchema = new mongoose.Schema({
    // Username (retrieved from reddit)
    username: {type: 'String', unique: true, index: true, sparse: true},

    // TODO: formalize account status values
    accountStatus: {type: Number, 'default': 0},

    // hashed password
    pw: {type: String},
    created: {type: Date, 'default': Date.now },

    // fields that should not be shown to other users(e.g., tokens)
    _tokens: {},

    // NOTE: this only exists for mongoose validation. 
    // Will be deleted on creation
    _password: {type: String},

    // Meta - data tracking
    // --------------------------------
    lastLoginDate: {type: Date, 'default': Date.now },
    numLogins: {type: Number, 'default': 0 }
});

// ====================================
//
// Functions
// 
// ====================================
function hashPw(password, callback){
    bcrypt.hash(password, 11, function(err, hash){
        if(err){ 
            logger.log('user:hashPw', 'error hashing pw: ' + err);
            return callback(err, null); 
        }

        return callback(null, hash);
    });
}


// Register the schema
// --------------------------------------
mongoose.model('User', UserSchema);
var UserModel = mongoose.model('User');
module.exports = UserSchema;
