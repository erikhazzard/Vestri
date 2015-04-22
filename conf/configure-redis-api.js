/* =========================================================================
 *
 * configure-redis-api
 * Configures redis settings for api
 *
 * ========================================================================= */
var nconf = require('nconf');

module.exports = function configureRedisAnalytics(){

    nconf.add('redis-api', {
        'type': 'literal',
        //redis
        'redis-api': nconf.get('redis-api')
    });
};
