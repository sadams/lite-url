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
                        'http://localhost:8000/test/lite-url.test.html'
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
                banner: '/*! <%= pkg.name %> v<%= pkg.version %> <%= grunt.template.today("dd-mm-yyyy") %> ' +
                '<%= pkg.repository %> <%= pkg.authors %> */\n',
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
                    'test/**/*.html',   // .html support...
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
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-wiredep');

    // Default task(s).
    grunt.registerTask('test', ['wiredep','connect','qunit']);
    grunt.registerTask('build', ['jshint','uglify']);
    grunt.registerTask('default', ['build','test']);

};
