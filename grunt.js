/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    meta: {
      version: '0.4.5',
      banner: '/*! yabox.js - v<%= meta.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '* http://bebraw.github.com/yabox.js/\n' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> ' +
        'Juho Vepsalainen; Licensed MIT */'
    },
    concat: {
      dist: {
        src: ['<banner:meta.banner>',
              'src/jquery.center.js',
              'src/jquery.yabox.js'],
        dest: 'dist/jquery.yabox.js'
      }
    },
    min: {
      dist: {
        src: ['<banner:meta.banner>', '<config:concat.dist.dest>'],
        dest: 'dist/jquery.yabox.min.js'
      }
    },
    watch: {
      files: 'src/**/*.js',
      tasks: 'concat min'
    },
    uglify: {}
  });

  // Default task.
  grunt.registerTask('default', 'concat min');

};
