/* =========================================================================
 *
 * pages
 *  Controller for rendering pages
 *
 *  ======================================================================== */
var _ = require('lodash');

var nconf = require('nconf');
var env = nconf.get('NODE_ENV');

var mongoose = require('mongoose');
var User = mongoose.model('User');

var _ = require('lodash');
var getTemplateVariables = require('../util/get-template-variables');
var renderPage = require('../util/render-errors');

// =========================================================================
//
// Routes
//
// =========================================================================
module.exports.pageHome = function pageHome(req, res) {
    return res.render(
        'home.html',
        getTemplateVariables({
            title: 'At a Higher Level game development podcast',
            page: 'home'
        })
    );
};

