/* =========================================================================
 *
 * getTemplateVariables
 *  Returns an object of template variables to be used when rendering pages
 *
 *  ======================================================================== */
var _ = require('lodash');
var nconf = require('nconf');
var moment = require('moment');
var NODE_ENV = nconf.get('NODE_ENV');

module.exports = function getTemplateVariables( options ){
    // always include these base keys (which can be overwritten)
    return _.extend({
        title: 'Home',
        env: NODE_ENV,
        page: 'home',
        description: '',
        _: _,
        moment: moment
    }, options);
};
