// Gruntfile.js

// our wrapper function (required by grunt and its plugins)
// all configuration goes inside this function
module.exports = function(grunt) {
  // ===========================================================================
  // CONFIGURE GRUNT ===========================================================
  // ===========================================================================
  grunt.initConfig({

    // get the configuration info from package.json ----------------------------
    // this way we can use things like name and version (pkg.name)
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
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
      files: ['Gruntfile.js', 'src/js/**.js'],
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
    copy: {
      options: {},
      files: [
        {expand: true, src: 'homeworks.js', dest: 'src/js/**', cwd: 'C:/Users/User/Documents/visual studio 2015/Projects/CampaignIntelligence/CampaignIntelligence/Content/scripts/'},
        {expand: true, src: 'homeworks.css', dest: 'src/css/**', cwd: 'C:/Users/User/Documents/visual studio 2015/Projects/CampaignIntelligence/CampaignIntelligence/Content/styles/homeworks/'},
      ]
    },
    cssmin: {
      options: {
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
    csslint: {
      dist: ['src/css/**.css']
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
      files: ['<%= jshint.files %>'],
      tasks: ['jshint']
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
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-csslint');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.registerTask('default', ['jshint', 'csslint', 'uglify', 'cssmin', 'replace']);
  grunt.registerTask('replacement', ['replace']);
  grunt.registerTask('test', ['jshint', 'csslint']);
  grunt.registerTask('copy', ['copy']);
};
