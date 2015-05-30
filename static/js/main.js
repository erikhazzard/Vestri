/* =========================================================================
 *
 * main.js
 *  Main entry point into app
 *
 * ========================================================================= */
//==============================================================================
//
// External Dependencies
//
//==============================================================================
var logger = require("bragi-browser");
window.logger = logger;

var jquery = require('jquery');
window.$ = jquery;
window.jQuery = jquery;

var _ = require('lodash');
window._ = _;

// Interal Dependencies
var events = require('./events');

//==============================================================================
//
// Setup
//
//==============================================================================
logger.log('app', 'starting up!');


// Load pages
