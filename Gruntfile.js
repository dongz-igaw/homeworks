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
            'build/js/homeworks.js',
            'build/css/homeworks.css',
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
          'build/js/homeworks.js'
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
         '!src/js/homeworks.js',
         '!src/js/**/test/**.js'
      ],
      options: {
        globals: {
          jQuery: true,
          console: true,
          module: true,
          document: true
        },
        esversion: 6
      }
    },
    csslint: {
      options: {
        csslintrc: 'test/csslintrc.json',
        quiet: false
      },
      dist: [
        'src/css/**.css',
        '!src/css/homeworks.css'
      ]
    },
    babel: {
      options: {
        sourceMap: true,
        presets: [
            'es2015'
        ]
      },
      dist: {
        files: [
          {
            expand: true,
            cwd: 'src/',
            src: [
                '**/**.js',
                '!js/homeworks.js'
            ],
            dest: 'build/'
          }
        ]
      }
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
    clean: {
      dist: {
        src: [
            'build'
        ]
      }
    },
    copy: {
      dist: {
        files: [
            {
                src: ['build/js/homeworks.js'],
                dest: 'src/js/homeworks.js',
                filter: 'isFile'
            },
            {
                src: ['build/css/homeworks.css'],
                dest: 'src/css/homeworks.css',
                filter: 'isFile'
            }
        ]
      },
    },
    cssmin: {
      options: {
        sourceMap: true,
      },
      dist: {
        files: {
          'dist/homeworks.min.css': [
            'build/css/homeworks.css'
          ]
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
                src: ['build/js/homeworks.js'],
                dest: 'build/js/homeworks.js',
                filter: 'isFile'
            },
            {
                src: ['build/css/homeworks.css'],
                dest: 'build/css/homeworks.css',
                filter: 'isFile'
            }
        ]
      }
    },
    requirejs: {
      dist: {
         options: {
          name: 'main',
          baseUrl: 'build/js/',
          optimize: 'none',
          generateSourceMaps: true,
          findNestedDependencies: true,
          include: [
            'almond'
          ],
          paths: {
            almond: '../../node_modules/almond/almond'
          },
          out: 'build/js/homeworks.js',
          wrap: {
            startFile: 'wrapper/start.js',
            endFile: 'wrapper/end.js'
          }
        }
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
          'build/js/homeworks.js'
        ]
      }
    },
    less: {
      dist: {
        files: {
          'build/css/homeworks.css': 'src/css/main.less'
        }
      }
    },
    watch: {
      options: {
        cliArgs: ['--gruntfile', path.join(cwd, 'Gruntfile.js')],
      },
      files: [
          'src/**/**.js',
          'src/**/**.less',
          'Gruntfile.js',
          '!src/js/homeworks.js',
          '!src/css/homeworks.css'
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
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-strip-code');
  grunt.loadNpmTasks('grunt-banner');
  grunt.loadNpmTasks('grunt-babel');

  grunt.registerTask('default', ['less', 'jshint', 'csslint', 'build', 'replace', 'strip_code', 'uglify', 'cssmin', 'usebanner', 'copy', 'clean']);
  grunt.registerTask('build', ['babel', 'requirejs']);
  grunt.registerTask('replacement', ['replace']);
  grunt.registerTask('test', ['jshint', 'csslint']);
  grunt.registerTask('init', ['watch']);
};
