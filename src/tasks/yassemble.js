module.exports = function (grunt) {

	// Grunt utils
	var async = require('async');
	var _str = require('underscore.string');
	var file = grunt.file;

	// Node.js
	var path = require('path');
	var fs = require('fs');
	var util = require('util');

	// node_modules
	var yfm = require('assemble-yaml');
	var _ = require('lodash');

	var utils = require('../lib/utils.js');


	var handlebars = require('handlebars');
	var handlebars_helpers = null;

	try {
		handlebars_helpers = require('handlebars-helpers');
	} catch (ex) {
		console.log('WARNING: ', ex);
		console.log('To use handlebars-helpers run `npm install handlebars-helpers`');
	}

	grunt.registerMultiTask('yassemble', 'Compile template files with handlebars', function () {

		var self = this;

		//grunt.log.writeln('Begin');

		this.requiresConfig('yassemble');
		var config = grunt.config('yassemble');

		var done = this.async();

		//console.log(__dirname);
		//console.log(__filename);

		yassemble = {

			producers: {},

			context: {},

			registerProducer: function (name, fn) {
				this.producers[name] = fn
			},

			registerProducers: function (pattern) {
				var self = this;
				var producers = grunt.file.expand(pattern);
				producers.forEach(function (file) {
					var producer = null;
					try {
						producer = require(path.normalize(path.join(process.cwd() || '', file)));

						if (typeof producer !== 'undefined') {
							if (typeof producer.register !== 'undefined') {
								producer.register(self);
							} else {
								grunt.log.writeln('Cannot register producer: ' + file);
							}
						}
					} catch (ex) {
						grunt.log.writeln('Error loading helpers from file: ' + file);
						grunt.log.writeln(ex);
					}
				});
			},

			registerHelpers: function (pattern) {
				var helpers = grunt.file.expand(pattern);
				helpers.forEach(function (file) {
					var helper = null;
					try {
						helper = require(path.normalize(path.join(process.cwd() || '', file)));

						if (typeof helper !== 'undefined') {
							if (typeof helper.register !== 'undefined') {
								helper.register(handlebars);
							} else {
								grunt.log.writeln('Cannot register helper: ' + file);
							}
						}
					} catch (ex) {
						grunt.log.writeln('Error loading helpers from file: ' + file);
						grunt.log.writeln(ex);
					}
				});
			},

			registerPartials: function (pattern) {
				var partials = grunt.file.expand(pattern);
				partials.forEach(function (file) {
					var partial = null;
					try {

						var partial = grunt.file.read(path.normalize(path.join(process.cwd() || '', file)));
						var filename = file.split('\\').pop().split('/').pop();
						var partialName = filename.substr(0, filename.lastIndexOf('.'));
						handlebars.registerPartial(partialName, partial);

					} catch (ex) {
						grunt.log.writeln('Error loading helpers from file: ' + file);
						grunt.log.writeln(ex);
					}
				});
			},

			utils: {
				groupCollectionByTerm: groupCollectionByTerm,
				filterByCategories: filterByCategories
			}
		}

		// Register handlebars helpers from handlebars-helpers
		if (handlebars_helpers && handlebars_helpers.register) {
			handlebars_helpers.register(handlebars, {});
		}

		// Register handlebars helpers
		yassemble.registerHelpers(config.options.helpers);

		// Register producers
		yassemble.registerProducers(config.options.producers);

		// Register partials
		yassemble.registerPartials(config.options.partials);

		// Fill source data
		var sourcedata = [];

		this.files.forEach(function (file) {
			sourcedata = file.src.filter(function (filepath) {
				// Remove nonexistent files (it's up to you to filter or warn here).
				if (!grunt.file.exists(file.cwd + '/' + filepath)) {
					grunt.log.warn('Source file "' + file.cwd + '/' + filepath + '" not found.');
					return false;
				} else {
					return true;
				}
			}).map(function (filepath) {
					var res = yfm.extract(file.cwd + '/' + filepath);

					var path = filepath.substr(0, filepath.lastIndexOf('/') || filepath.lastIndexOf('\\'));
					var filename = filepath.split('\\').pop().split('/').pop();
					var basename = filename.substr(0, filename.lastIndexOf('.'));

					var sd = _.merge({
						cwd: file.cwd,
						path: path,
						srcpath: file.cwd + '/' + path,
						filename: filename,
						basename: basename,
						content: res.content
					}, res.context);

					return sd;
				});
		});

		yassemble.context.sourcedata = sourcedata;

		// Fill pages
		var allpages = [];

		this.data.produce.forEach(function (producerdef) {
			//console.log(producerdef);
			var newpages = yassemble.producers[producerdef.producer](yassemble.context, producerdef.options);
			newpages.forEach(function (page) {
				page.layout = producerdef.layout;
			});
			allpages = allpages.concat(newpages);
		});

		yassemble.context.allpages = allpages;

		// Fill allcategories with pages
		yassemble.context.allcategories = groupCollectionByTerm(yassemble.context.allpages, 'categories', 'category', 'pages');

		// Fill tags with pages
		yassemble.context.alltags = groupCollectionByTerm(yassemble.context.allpages, 'tags', 'tag', 'pages');

		// Render pages
		_.forEach(yassemble.context.allpages, function (pagectx) {
			var layouttpl = grunt.file.read(pagectx.layout);
			grunt.log.write("Write " + self.options().dest + "/" + pagectx.path + (pagectx.path == '' ? '' : "/") + pagectx.basename + ".html...");
			var pagelayout = layouttpl.replace('{{> body }}', pagectx.content);
			var layout = handlebars.compile(pagelayout);
			var ctx = pagectx;
			ctx.alltags = yassemble.context.alltags;
			ctx.allcategories = yassemble.context.allcategories;
			var pagehtml = layout(ctx);
			grunt.file.write(self.options().dest + "/" + ctx.path + (ctx.path == '' ? '' : "/") + ctx.basename + ".html", pagehtml);
			grunt.log.writeln(("OK").green);
		})

		done(true);


		// Utils

		function filterByCategories(array, categories) {

			if (typeof categories === 'undefined' || !_.isArray(categories)) {
				return []
			} else {
				return _.filter(array, function (item) {
					if ((typeof item.categories === 'undefined')) {
						return false;
					} else {
						return (_.intersection(item.categories, categories).length !== 0)
					}
				})
			}
		}


		function groupCollectionByTerm(arr, prop, term, val) {
			return groupCollection(arr, prop, function (hashed) {
				var ret = {};
				ret[term] = hashed.term;
				ret[val] = hashed.data;
				return ret;
			});
		}

		function groupCollection(arr, prop, cb) {
			var allterms = {};
			for (var i = 0; i < arr.length; i++) {
				var data = arr[i];
				if (typeof data[prop] !== 'undefined') {


					for (var j = 0; j < data[prop].length; j++) {
						var term = data[prop][j];
						if (typeof allterms[term] === 'undefined') {
							allterms[term] = {
								term: term,
								data: [data]
							}
						} else {
							allterms[term].data.push(data);
						}
					}
				}
			}

//      Funcway
//			var plainterms = _.map(arr,function (data) {
//				return _.map(data[prop], function (term) {
//					return {
//						term: term,
//						data: data
//					};
//				});
//			}).flatten();
//
//			var allterms = _.transform(_.groupBy(plainterms, "term"), function (result, val, key) {
//				result[key] = {
//					term: key,
//					data: val
//				}
//			})

			return _.map(allterms, cb);
		}

		/**
		 * Merge two arrays by object property.
		 *
		 * @param {Array} array1 First array.
		 * @param {Array} array1 Second array.
		 * @param {string} prop Property name of Array item.
		 * @returns {Array} Returns merged array.
		 * @example
		 *
		 * mergeByProperty([
		 *   {"prop": "val1", "otherprop":["qwe", "rty"]},
		 *   {"prop": "val2", "otherprop":["asd", "fgh"]},
		 * ],[
		 *   {"prop": "val3", "otherprop":["tyu", "iop"]},
		 *   {"prop": "val1", "otherprop":["zxc", "vbn"]}
		 * ],'prop')
		 * //=>
		 * // [
		 * //  {"prop": "val1", "otherprop":["qwe", "rty", "zxc", "vbn"]},
		 * //  {"prop": "val2", "otherprop":["asd", "fgh"]},
		 * //  {"prop": "val3", "otherprop":["tyu", "iop"]}
		 * // ]
		 *
		 */
		function mergeByProperty(array1, array2, prop) {


			var index = {};
			var resarr = _.clone(array1);

			for (var i = 0; i < resarr.length; i++) {
				index[resarr[i][prop]] = i;
			}

			for (var i = 0; i < array2.length; i++) {
				var propval = array2[i][prop];
				if (typeof index[propval] === 'undefined') {
					resarr.push(array2[i]);
					index[propval] = resarr.indexOf(propval);
				} else {
					resarr[index[propval]] = _.merge(resarr[index[propval]], array2[i]);
				}

			}

			return resarr;
		}
	});
}
