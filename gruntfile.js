module.exports = function(grunt) {

  'use strict';

  require('time-grunt')(grunt);
  require('load-grunt-tasks')(grunt);
  grunt.option('force', true);

  grunt.registerTask('default', ['build', 'concurrent']);
  grunt.registerTask('build', ['clean', 'jshint', 'browserify', 'less', 'copy', 'concat']);
  grunt.registerTask('release', ['build', 'removelogging', 'uglify', 'cssmin']);
  grunt.registerTask('package', ['release', 'compress:package']);

  var browserify_vendors = [
    'underscore',
    'material-ui',
    'react',
    'react-router',
    'react-tools',
    'react-tap-event-plugin',
  ];

  grunt.initConfig({
    dist: {
      dir: "dist",
      js: "<%= dist.dir %>/js/<%= version %>.js",
      css: "<%= dist.dir %>/css/<%= version %>.css",
    },

    pkg: grunt.file.readJSON('package.json'),
    version: "<%= pkg.name %>-<%= pkg.version %>",
    banner: '/**\n * React - material-ui <%= pkg.version %>\n */\n',

    clean: ['<%= dist.dir %>/*'],

    browserify: {
      vendor: {
        src: [],
        dest: '<%= dist.dir %>/js/vendor.js',
        options: {
          transform: [ require('grunt-react').browserify ],
          require: browserify_vendors
        }
      },
      app: {
        src: 'src/app/app.jsx',
        dest: '<%= dist.js %>',
        options: {
          transform: [
            ['envify', grunt.file.readJSON((grunt.option('env') || 'development') + '.json')],
            require('grunt-react').browserify,
          ],
          external: browserify_vendors
        }
      }
    },

    concat: {
      index: {
        src: ['src/index.html'],
        dest: '<%= dist.dir %>/index.html',
        options: { process: true }
      }
    },

    less: {
      app: {
        files: {'<%= dist.css %>': 'src/less/main.less'}
      }
    },

    copy: {
      images: {
        files: [
          { dest: '<%= dist.dir %>/images/', cwd: 'src/images/', src: '**', expand: true}
        ]
      },
      fonts: {
        files: [
          { dest: '<%= dist.dir %>/fonts/', cwd: 'node_modules/font-awesome/fonts/', src: "**", expand: true}
        ]
      }
    },

    jshint: {
      files: ['gruntfile.js', 'src/app/**/*.jsx']
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
        files: {'<%= dist.css %>': ['<%= dist.css %>']}
      }
    },

    removelogging: {
      app: {
        src: "<%= dist.js %>",
        dest: "<%= dist.js %>"
      }
    },

    compress: {
      package: {
        options: {
          mode: 'tgz',
          archive: '<%= pkg.name %>.tar.gz'
        },
        files: [
          {expand: true, cwd: 'dist/', src: ['**'], dest: '.'}
        ]
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
          open: { appName: process.env.BROWSER }
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

