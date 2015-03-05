module.exports = function(grunt) {

  'use strict';

  require('time-grunt')(grunt);
  require('load-grunt-tasks')(grunt);
  grunt.option('force', true);

  grunt.registerTask('default', ['build', 'concurrent']);
  grunt.registerTask('build', ['clean', 'browserify', 'less', 'copy', 'concat']);
  grunt.registerTask('release', ['build', 'uglify', 'cssmin']);

  var browserify_vendors = [
    'material-ui', 'react', 'react-router', 'react-tools',
    'react-tap-event-plugin', 'reactify', 'underscore'
  ];

  grunt.initConfig({
    distdir: "dist",
    browser: process.env.BROWSER,
    banner: '/**\n * React - material-ui <%= pkg.version %>\n */\n',
    pkg: grunt.file.readJSON('package.json'),
    version: "<%= pkg.name %>-<%= pkg.version %>",

    clean: ['<%= distdir %>/*'],

    browserify: {
      vendor: {
        src: [],
        dest: '<%= distdir %>/js/vendor.js',
        options: {
          transform: [ require('grunt-react').browserify ],
          require: browserify_vendors
        }
      },
      app: {
        src: 'src/app/app.jsx',
        dest: '<%= distdir %>/js/<%= version %>.js',
        options: {
          transform: [ require('grunt-react').browserify ],
          external: browserify_vendors
        }
      }
    },

    concat: {
      index: {
        src: ['src/index.html'],
        dest: '<%= distdir %>/index.html',
        options: { process: true }
      }
    },

    less: {
      app: {
        files: {'<%= distdir %>/css/<%= version %>.css': 'src/less/main.less'}
      }
    },

    copy: {
      images: {
        files: [
          { dest: '<%= distdir %>/images/', cwd: 'src/images/', src: '**', expand: true}
        ]
      },
      fonts: {
        files: [
          { dest: '<%= distdir %>/fonts/', cwd: 'node_modules/font-awesome/fonts/', src: "**", expand: true}
        ]
      }
    },

    uglify: {
      app: {
        options: {banner: "<%= banner %>"},
        src: ['<%= browserify.app.dest %>'],
        dest: '<%= browserify.app.dest %>'
      },
      vendor: {
        src: ['<%= browserify.vendor.dest %>'],
        dest: '<%= browserify.vendor.dest %>'
      }
    },

    cssmin: {
      app: {
        options: {banner: "<%= banner %>"},
        files: {'<%= distdir %>/css/<%= version %>.css': ['<%= distdir %>/css/<%= version %>.css']}
      }
    },

    watch: {
      code: {
        files: ['src/app/**/*.jsx'],
        tasks: ['browserify:app'],
        options: { livereload: true }
      },
      images: {
        files: ['src/images/**/*'],
        tasks: ['copy:images'],
        options: { livereload: true }
      },
      index: {
        files: ['src/index.html'],
        tasks: ['concat'],
        options: { livereload: true }
      },
      less: {
        files: ['src/less/**/*.less'],
        tasks: ['less'],
        options: { livereload: true }
      }
    },

    connect: {
      server: {
        options: {
          keepalive: true,
          port: 8000,
          base: 'dist',
          hostname: 'localhost',
          debug: true,
          livereload: true,
          open: {
            target: "http://localhost:8000",
            appName: "<%= browser %>"
          }
        }
      }
    },

    concurrent: {
      tasks: ['connect', 'watch'],
      options: {
        logConcurrentOutput: true
      }
    }

  });
};

