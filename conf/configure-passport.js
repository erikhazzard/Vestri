// ============================================================================
//
// configure-passport.js
// Configures passport related settings
//
// ============================================================================
var nconf = require('nconf');
var logger = require('bragi');
var _ = require('lodash');

var mongoose = require('mongoose');
var User = mongoose.model('User');

var util = require('util');
var crypto = require('crypto');

var LocalStrategy = require('passport-local').Strategy;

module.exports = function configurePassport(passport){
    // Passport session setup.
    //   To support persistent login sessions, Passport needs to be able to
    //   serialize users into and deserialize users out of the session.  Typically,
    //   this will be as simple as storing the user ID when serializing, and finding
    //   the user by ID when deserializing.  However, since this example does not
    //   have a database of user records, the complete Reddit profile is
    //   serialized and deserialized.
    passport.serializeUser(function(user, done) {
        user.reddit = user.reddit || {};

        // serialize the user so we don't need to have an additional DB hit
        // when user connects to websocket
        var userSerialized = user.username;

        done(null, userSerialized);
    });

    passport.deserializeUser(function(userSerialized, done) {
        var disconnectTimeout = setTimeout(function(){
            logger.log('error:passport:deserializeUser:disconnected',
            'db query timeout');

            return done(null, null);
        }, nconf.get('app:dbTimeout'));

        var username = userSerialized;
        logger.log('passport:deserializeUser', 'called with: %j', { username: username });

        // Try to find user
        User.findOne({ username: username }, function (err, user) {
            clearTimeout(disconnectTimeout);
        
            logger.log('passport:deserializeUser:fetched', 
            'returned: %j', {user: user});

            if(err){ return done(err, null); }

            return done(err, user);
        });
    });


    // ----------------------------------
    //
    // Local
    //
    // ----------------------------------
    // use local strategy to get user auth
    passport.use(new LocalStrategy(
        function(username, password, done) {
            logger.log('passport-local', 'preparing to find user: ' + username);

            // Fetch user
            User.findOne({ username: username }, function (err, user) {
                if (err) { 
                    logger.log('error:passport-local:fetched', 'error: ' + err);
                    return done(err);
                }
                if (!user) { 
                    logger.log('warn:passport-local:fetched:noUser', 'no user');
                    return done(null, false);
                }

                logger.log('passport-local:fetched', 'found user %j', {
                    username: username
                });

                // verify the pw
                User.schema.methods.authenticate.call(
                    user, 
                    password, 
                    function (err, isAuthed){ 
                        if(err || !isAuthed){ 
                            logger.log('passport-local:fetched:authed', 
                            'user is NOT authed  %j', { username: username });
                            return done(null, false); }

                        else { 
                            // User IS authed successfully, update user object
                            // (can happen async)
                            logger.log('passport-local:fetched:authed', 
                            'user IS authed %j', { username: username });
                            user.lastlogin = new Date();
                            user.numLogins++;

                            User.update(
                                { _id: user._id },
                                { lastLoginDate: user.lastLoginDate, $inc: {numLogins: 1} },
                                function(err, updateRes){
                                    if(err){ logger.log('error:passport:local', 'error saving user: ' + err); }
                                });

                            return done(null, user);
                        }
                    });
            });
        }
    ));
};
