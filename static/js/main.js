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

var $ = require('./lib/jquery');
window.jQuery = window.$ = $; // need to expose jQuery to window
var _ = require('./lib/lodash');
window._ = _;

var localforage = require('localforage');
window.localforage = localforage;

var moment = require('moment');
window.moment = moment;
var Backbone = require('Backbone');
window.Backbone = Backbone;
Backbone.$ = window.jQuery || window.$;

// Interal Dependencies
var events = require('./events');

//==============================================================================
//
// Setup
// 
//==============================================================================
logger.log('app', 'starting up!');


// Load pages
