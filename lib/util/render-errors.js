/* =========================================================================
 *
 * render-errors
 *      Renders errors
 *
 *  ======================================================================== */
var getTemplateVariables = require('./get-template-variables');

module.exports.page404 = function ( req, res ){
    return res.render('404.html', getTemplateVariables({
        title: 'Page Not Found',
        page: 'error-404'
    }));
};

module.exports.page500 = function ( req, res ){
    return res.render('500.html', getTemplateVariables({
        title: 'Server error',
        page: 'error-500'
    }));
};

module.exports.page503 = function ( req, res ){
    return res.render('503.html', getTemplateVariables({
        title: 'API Limit Exceeded',
        page: 'error-503'
    }));
};
