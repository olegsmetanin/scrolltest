/*
 * Assemble Plugin: Permalinks
 * https://github.com/assemble/permalinks
 * Assemble is the 100% JavaScript static site generator for Node.js, Grunt.js, and Yeoman.
 *
 * Copyright (c) 2013 Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT license.
 */

// Node.js
var path  = require('path');

// node_modules
var moment = require('moment');
var frep   = require('frep');
var digits = require('digits');

// Local utils


/**
 * Permalinks Plugin
 * @param  {Object}   params
 * @param  {Function} callback
 * @return {String}   The permalink string
 */
module.exports = function(params, callback) {

	'use strict';

	var assemble       = params.assemble;
	var grunt          = params.grunt;

	var options        = assemble.options.permalinks;
	var categories     = assemble.options.categories;
	var originalAssets = assemble.options.originalAssets;

	var async          = require('async');
	var _str           = require('underscore.string');
	var _              = require('lodash');

console.log(pages);

 callback();
};

module.exports.options = {
	stage: 'render:pre:pages'
};