/*
 *
 * Copyright (c) 2013 Oleg Smetanin
 * MIT License
 */
"use strict";

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({

    // Project metadata
    pkg   : grunt.file.readJSON('package.json'),
    clean: {
    	dist: ['dist/'],
    },

    assemble: {
      options: {
        flatten: false,
        assets: '.',
        data: 'data/*.{json,yml}',
        // Templates
        partials: 'partials/*.hbs',
        layoutdir: 'layouts'
      },
      pages: {
        src: ['*.hbs'],
        dest: 'dist/'
      },
      modules: {
        src: ['modules/**/*.hbs'],
        dest: 'dist/'        
      }    
    },
    copy: {
    	vendor: {
    		expand: true, src: ['vendor/**'], dest: 'dist/'
    	} 
    }


  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('assemble');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-frep');
  grunt.loadNpmTasks('grunt-sync-pkg');

  // Default task to be run with the "grunt" command.
  grunt.registerTask('default', [
  	'clean',
  	'assemble',
  	'copy'
  ]);
};