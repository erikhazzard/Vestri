/* ==========================================================================
 *
 * configure.js
 *  Handles the configuration of a passed in express app object based on 
 *  configuration file settings
 *
 *  ========================================================================= */
var nconf = require('nconf');
var logger = require('bragi');
var _ = require('lodash');

//order of hierarchy: 1. command line args, 2. environment vars, 3. file 
nconf.argv()
    .env();

//File is located in `conf/environment.json` where environment is NODE_ENV
var env = nconf.get('NODE_ENV') || 'local';
if(env === 'localhost'){ env = 'local'; nconf.set('NODE_ENV', 'local'); }
if(env === 'development'){ env = 'develop'; nconf.set('NODE_ENV', 'develop'); }

// Get the proper configuration file per environment
var configFile = __dirname + '/environment/' + env + '.json';

//Load secrets files. NOTE: also, may contain a callbackurl for oauth
nconf.file('secrets', __dirname + '/secrets.json');

//Load corresponding file
nconf.file('envsettings', configFile);

//Set defaults. These are overwritten by contents of file
// --------------------------------------
nconf.defaults({
    //If NODE_ENV isn't provided, use a default
    //  NODE_ENV can be one of 'local', 'develop', 'staging', 'production', 
    //      or 'test'
    NODE_ENV: 'local',
    'app': { 
        'cacheNormalTTL': 600,
        'dbTimeout': 1000 * 5,
        // Default port
        'port': 8200,
        'portHttps': 8243,
        'allowedDomains': '*',

        "sessionSecret": "5YJEUvIGWQ5icokpYB9IRvYS6rUiiYc9Vbr6IFfk2y3surUIGLU9smBJQfbsvTy",
        'cookie': {
            'maxAge': 86400000, //one year
            httpOnly: true,
            'key': '_c',
            'secret': '2b,OAjT|C=,hN1ag~,x_fLBX/34wejfinkX,$Rg7J`##G@r2Y`<JLNa=N'
        }
    },
    's3': {
        // uses profile "ios-profiles-s3"
        'key': '',
        'secret': '',
        'bucket': ''
    }
});

// Make sure secrets exists / has data
if(_.keys(nconf.stores.secrets.store).length < 1){
    logger.log('warn:server', 
    'conf/secrets.json NOT found! If your app has secrets, copy conf/secrets.example.json to conf/secrets.json');
}
