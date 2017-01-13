// Gruntfile.js

// our wrapper function (required by grunt and its plugins)
// all configuration goes inside this function
module.exports = function(grunt) {
  // ===========================================================================
  // CONFIGURE GRUNT ===========================================================
  // ===========================================================================
  var cwd = process.cwd();

  grunt.initConfig({

    // get the configuration info from package.json ----------------------------
    // this way we can use things like name and version (pkg.name)
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        sourceMap: true,
        banner: '//================================================================================\n' +
                '// [<%= pkg.name %>]\n' +
                '// version: <%= pkg.version %>\n' +
                '// update: <%= grunt.template.today("yyyy.mm.dd") %>\n' +
                '//================================================================================\n\n'
      },
      dist: {
        files: {
          'dist/homeworks.min.js': ['src/js/**.js']
        }
      },
    },
    qunit: {
      files: ['sample/**/*.html']
    },
    jshint: {
      files: ['Gruntfile.js', 'src/js/**/**.js'],
      options: {
        // options here to override JSHint defaults
        globals: {
          jQuery: true,
          console: true,
          module: true,
          document: true
        }
      }
    },
    csslint: {
      options: {
        csslintrc: 'test/csslintrc.json',
        quiet: false
      },
      dist: [
        'src/css/**.css'
      ]
    },
    concat: {
        options: {
            sourceMap: true
        },
        dist: {
            src: [
                'src/js/core/index.js',
                'src/js/core/**/**.js',
                'src/js/components/**/index.js',
                'src/js/components/**/hook.js',
                'src/js/components/**/**.js',
                '!src/js/homeworks.js'
            ],
            dest: 'src/js/homeworks.js'
        }
    },
    copy: {
      options: {},
      files: [
        {expand: true, src: 'homeworks.js', dest: 'src/js/**', cwd: 'C:/Users/User/Documents/visual studio 2015/Projects/CampaignIntelligence/CampaignIntelligence/Content/scripts/'},
        {expand: true, src: 'homeworks.css', dest: 'src/css/**', cwd: 'C:/Users/User/Documents/visual studio 2015/Projects/CampaignIntelligence/CampaignIntelligence/Content/styles/homeworks/'},
      ]
    },
    cssmin: {
      options: {
        sourceMap: true,
        banner: '//================================================================================\n' +
                '// [<%= pkg.name %>]\n' +
                '// version: <%= pkg.version %>\n' +
                '// update: <%= grunt.template.today("yyyy.mm.dd") %>\n' +
                '//================================================================================\n\n'
      },
      dist: {
        files: {
          'dist/homeworks.min.css': ['src/css/**.css']
        }
      }
    },
    replace: {
      dist: {
        options: {
          patterns: [
            {
              match: 'VERSION',
              replacement: '<%= pkg.version %>'
            }
          ]
        },
        files: [
          {
            expand: true,
            flatten: true,
            src: ['dist/**.js'],
            dest: 'dist/'
          }
        ]
      }
    },
    watch: {
      options: {
        cliArgs: ['--gruntfile', require('path').join(cwd, 'Gruntfile.js')],
      },
      files: ['src/**/**.js'],
      tasks: ['default']
    }
  });

  // ===========================================================================
  // LOAD GRUNT PLUGINS ========================================================
  // ===========================================================================
  // we can only load these if they are in our package.json
  // make sure you have run npm install so our app can find these
  grunt.loadNpmTasks('grunt-replace');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-csslint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.registerTask('default', ['jshint', 'csslint', 'concat', 'uglify', 'cssmin', 'replace']);
  grunt.registerTask('replacement', ['replace']);
  grunt.registerTask('test', ['jshint', 'csslint']);
  grunt.registerTask('copy', ['copy']);
  grunt.registerTask('init', ['watch']);
};
