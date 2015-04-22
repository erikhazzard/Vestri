/* =========================================================================
 * 
 *  main
 *      main test runner
 *
 * ========================================================================= */
var _ = require('lodash');
var logger = require('bragi-browser');
var should = require('chai').should(); window.should = should;
var chai = require('chai'); window.chai = chai;
var assert = chai.assert; window.assert = assert;

// Start mocha
mocha.setup('bdd');

// Require all tests here
// --------------------------------------


// Run them
mocha.run();
