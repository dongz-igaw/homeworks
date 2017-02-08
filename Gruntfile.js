// Gruntfile.js

// our wrapper function (required by grunt and its plugins)
// all configuration goes inside this function
module.exports = function(grunt) {
  // ===========================================================================
  // CONFIGURE GRUNT ===========================================================
  // ===========================================================================
  var path = require('path');
  var cwd = process.cwd();

  grunt.initConfig({

    // get the configuration info from package.json ----------------------------
    // this way we can use things like name and version (pkg.name)
    pkg: grunt.file.readJSON('package.json'),
    usebanner: {
      dist: {
        options: {
          position: 'top',
          banner: '/*\n' +
                  '//==========================================================\n' +
                  '//\n' +
                  '//       ___           ___           ___           ___           ___           ___           ___           ___           ___     \n' +
                  '//      /\\__\\         /\\  \\         /\\__\\         /\\  \\         /\\__\\         /\\  \\         /\\  \\         /\\__\\         /\\  \\    \n' +
                  '//     /:/  /        /::\\  \\       /::|  |       /::\\  \\       /:/ _/_       /::\\  \\       /::\\  \\       /:/  /        /::\\  \\   \n' +
                  '//    /:/__/        /:/\\:\\  \\     /:|:|  |      /:/\\:\\  \\     /:/ /\\__\\     /:/\\:\\  \\     /:/\\:\\  \\     /:/__/        /:/\\ \\  \\  \n' +
                  '//   /::\\  \\ ___   /:/  \\:\\  \\   /:/|:|__|__   /::\\~\\:\\  \\   /:/ /:/ _/_   /:/  \\:\\  \\   /::\\~\\:\\  \\   /::\\__\\____   _\\:\\~\\ \\  \\ \n' +
                  '//  /:/\\:\\  /\\__\\ /:/__/ \\:\\__\\ /:/ |::::\\__\\ /:/\\:\\ \\:\\__\\ /:/_/:/ /\\__\\ /:/__/ \\:\\__\\ /:/\\:\\ \\:\\__\\ /:/\\:::::\\__\\ /\\ \\:\\ \\ \\__\\\n' +
                  '//  \\/__\\:\\/:/  / \\:\\  \\ /:/  / \\/__/~~/:/  / \\:\\~\\:\\ \\/__/ \\:\\/:/ /:/  / \\:\\  \\ /:/  / \\/_|::\\/:/  / \\/_|:|~~|~    \\:\\ \\:\\ \\/__/\n' +
                  '//       \\::/  /   \\:\\  /:/  /        /:/  /   \\:\\ \\:\\__\\    \\::/_/:/  /   \\:\\  /:/  /     |:|::/  /     |:|  |      \\:\\ \\:\\__\\  \n' +
                  '//       /:/  /     \\:\\/:/  /        /:/  /     \\:\\ \\/__/     \\:\\/:/  /     \\:\\/:/  /      |:|\\/__/      |:|  |       \\:\\/:/  /  \n' +
                  '//      /:/  /       \\::/  /        /:/  /       \\:\\__\\        \\::/  /       \\::/  /       |:|  |        |:|  |        \\::/  /   \n' +
                  '//      \\/__/         \\/__/         \\/__/         \\/__/         \\/__/         \\/__/         \\|__|         \\|__|         \\/__/    \n' +
                  '//\n' +
                  '//\n' +
                  '//\n' +
                  '// @ HOMEWORKS FRAMEWORK\n' +
                  '// @ All Rights Reserved IGAWorks Inc.\n' +
                  '//\n' +
                  '//==========================================================\n' +
                  '//\n' +
                  '// @ UPDATE  <%= grunt.template.today("yyyy.mm.dd") %>\n' +
                  '// @ AUTHOR  Kenneth\n' +
                  '//\n' +
                  '//=========================================================\n' + 
                  '*/\n\n',
          linebreak: true
        },
        files: {
          src: [
            'src/js/homeworks.js',
            'src/css/homeworks.css',
            'dist/**.**'
          ]
        }
      }
    },
    uglify: {
      options: {
        sourceMap: true,        
      },
      dist: {
        files: {
          'dist/homeworks.min.js': [
          'src/js/homeworks.js',
          '!src/js/**/test/**.js'
          ]
        }
      },
    },
    qunit: {
      files: ['sample/**/*.html']
    },
    jshint: {
      files: [
        'Gruntfile.js',
         'src/js/**/**.js',
         '!src/js/**/test/**.js'
      ],
      options: {
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
                '!src/js/homeworks.js',
                '!src/js/**/test/**.js'
            ],
            dest: 'src/js/homeworks.js'
        }
    },
    copy: {
      options: {},
      files: [
      ]
    },
    cssmin: {
      options: {
        sourceMap: true,
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
            src: [
              'src/js/homeworks.js',
              'src/css/homeworks.css'
            ],
            dest: './'
          }
        ]
      }
    },
    strip_code: {
      options: {
        blocks: {
          start_block: '/* TEST CODE START */',
          end_block: '/* TEST CODE END */'
        }
      },
      dist: {
        src: [
          'src/js/homeworks.js'
        ]
      }
    },
    less: {
      dist: {
        files: {
          'src/css/homeworks.css': 'src/css/core/index.less'
        }
      }
    },
    watch: {
      options: {
        cliArgs: ['--gruntfile', path.join(cwd, 'Gruntfile.js')],
      },
      files: [
          'src/**/**.less',
          'src/**/**.js',
          '!src/js/homeworks.js',
          'Gruntfile.js'
      ],
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
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-strip-code');
  grunt.loadNpmTasks('grunt-banner');

  grunt.registerTask('default', ['less', 'jshint', 'csslint', 'concat', 'replace', 'strip_code', 'uglify', 'cssmin', 'usebanner']);
  grunt.registerTask('replacement', ['replace']);
  grunt.registerTask('test', ['jshint', 'csslint']);
  grunt.registerTask('init', ['watch']);
};
