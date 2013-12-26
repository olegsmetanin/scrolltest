/*
 *
 * Copyright (c) 2013 Oleg Smetanin
 * MIT License
 */
"use strict";

module.exports = function (grunt) {

	// Project configuration.
	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),

		clean: {
			dist: ['dist/']
		},

		assemble: {
			options: {
				flatten: false,
				assets: 'dist',
				data: 'src/**/data/*.{json,yml}',
				partials: 'src/partials/*.hbs',
				layoutdir: 'src/layouts'
			},
			all: {
				expand: true,
				cwd: "src/",
				src: ['*.hbs', 'modules/**/*.hbs'],
				dest: 'dist/'
			}
		},

		copy: {
			all: {
				expand: true,
				cwd: "src/",
				src: [
					'*.*',
					'modules/**',
					'!**/*.hbs'],
				dest: 'dist/'
			},
			vendor: {
				expand: true,
				cwd: "src/",
				src: [
					'vendor/**'
				],
				dest: 'dist/'
			}
		},

		'gh-pages': {
			options: {
				base: 'dist'
			},
			src: ['**']
		}
	});

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('assemble');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-frep');
	grunt.loadNpmTasks('grunt-sync-pkg');
	grunt.loadNpmTasks('grunt-gh-pages');

	// Default task to be run with the "grunt" command.
	grunt.registerTask('default', [
		'clean',
		'assemble',
		'copy'
	]);
};