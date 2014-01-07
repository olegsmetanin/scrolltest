/*
 *
 * Copyright (c) 2013 Oleg Smetanin
 * MIT License
 */
"use strict";

module.exports = function (grunt) {

	var helpers = require('handlebars-helpers');

	// Project configuration.
	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),

		clean: {
			dist: ['dist/']
		},

		assemble: {
			options: {
				flatten: false,
				helpers:["src/_helpers/*.js"],
				plugins: [ 'assemble-related-pages', 'src/_plugins/*.js' ],
				assets: 'dist',
				partials: 'src/_partials/*.hbs',
				layoutdir: 'src/_layouts',
				sitemap: {
					exclude: ['index']
				}
			},
			all: {
				expand: true,
				cwd: "src/",
				src: ['*.hbs', 'platform/**/*.hbs', 'modules/**/*.hbs', 'tags/**/*.hbs'],
				dest: 'dist'
			}
		},

//		"ossemble": {
//			options: {
//				flatten: false,
//				helpers:["src/_helpers/*.js"],
//				plugins: [ 'assemble-related-pages', 'src/_plugins/*.js' ],
//				assets: 'dist',
//				data: 'src/**/_data/*.{json,yml}',
//				partials: 'src/_partials/*.hbs',
//				layoutdir: 'src/_layouts',
//				layout: 'src/_layouts/index.hbs'
//			},
//			all: {
//				expand: true,
//				cwd: "src/",
//				src: ['*.hbs', 'platform/**/*.hbs', 'modules/**/*.hbs'],
//				dest: 'dist'
//			}
//		},

		copy: {
			all: {
				expand: true,
				cwd: "src/",
				src: [
					'*.*',
					'platform/**',
					'modules/**',
					'!**/*.hbs'],
				dest: 'dist'
			},
			vendor: {
				expand: true,
				cwd: "src/",
				src: [
					'vendor/**'
				],
				dest: 'dist'
			}
		},

		'gh-pages': {
			options: {
				base: 'dist'
			},
			src: ['**']
		},
		connect: {
			server: {
				options: {
					keepalive:true,
					port: 7777,
					base: 'dist'
				}
			}
		},
		watch: {
				options: {
					livereload: true,
				}}
	});

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('assemble');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-frep');
	grunt.loadNpmTasks('grunt-sync-pkg');
	grunt.loadNpmTasks('grunt-gh-pages');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.loadTasks('src/_tasks');

	// Default task to be run with the "grunt" command.
	grunt.registerTask('default', [
		'clean',
		'assemble',
		'copy'
	]);
};