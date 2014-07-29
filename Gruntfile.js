var banner = '/*! <%= pkg.name %> v<%= pkg.version %> <%= grunt.template.today("dd-mm-yyyy") %> ' +
    '<%= pkg.repository.url %> */\n';

module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            all: ['Gruntfile.js', 'src/**/*.js']
        },
        qunit: {
            all: {
                options: {
                    urls: [
                        'http://localhost:8000/test/browser/lite-url.test.html'
                    ]
                }
            }
        },
        connect: {
            server: {
                options: {
                    port: 8000,
                    base: '.'
                }
            }
        },
        uglify: {
            options: {
                banner: banner,
                browser: true
            },
            dist: {
                files: {
                    'dist/lite-url.min.js': ['src/lite-url.js']
                }
            }
        },
        wiredep: {

            target: {

                // Point to the files that should be updated when
                // you run `grunt wiredep`
                src: [
                    'test/browser/**/*.html'   // .html support...
                ],

                // Optional:
                // ---------
                cwd: '',
                dependencies: true,
                devDependencies: true,
                exclude: [],
                fileTypes: {},
                ignorePath: '',
                overrides: {}
            }
        },
        nodeunit: {
            all: ['test/node/*.test.js']
        },
        concat: {
            options: {
                stripBanners: true,
                banner: banner
            },
            dist: {
                src: ['src/lite-url.js'],
                dest: 'dist/lite-url.js'
            }
        }

    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-wiredep');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');
    grunt.loadNpmTasks('grunt-contrib-concat');

    // Default task(s).
    grunt.registerTask('build', ['jshint','uglify','concat']);
    grunt.registerTask('test', ['build','wiredep','connect','qunit','nodeunit']);
    grunt.registerTask('default', ['test']);

};
