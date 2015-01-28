var gulp = require('gulp');
var qunit = require('node-qunit-phantomjs');
var gulpLoadPlugins = require('gulp-load-plugins');
var plugins = gulpLoadPlugins();

var pkg = require('./package.json');
var banner = ['/**',
    ' * <%= pkg.name %> - <%= pkg.description %>',
    ' * @version v<%= pkg.version %>',
    ' * @link <%= pkg.homepage %>',
    ' * @license <%= pkg.license %>',
    ' */',
    ''].join('\n');

gulp.task('build', function() {
    return gulp.src('src/*.js')
        .pipe(plugins.header(banner, { pkg : pkg } ))
        .pipe(gulp.dest('dist'))
        .pipe(plugins.uglify({
            preserveComments: 'some'
        }))
        .pipe(plugins.rename({
            extname: '.min.js'
        }))
        .pipe(gulp.dest('dist'))
    ;
});

gulp.task('qunit', function() {
    return qunit('./test/browser/lite-url.test.html');
});

gulp.task('bigtest', ['default'], function(){
    return gulp.src([
        './dist/lite-url.min.js',
        './test/browser/*.test.js'
    ])
        .pipe(plugins.karma({
            configFile: 'karma.conf.js',
            action: 'run'
        }))
        .on('error', function(err) {
            // Make sure failed tests cause gulp to exit non-zero
            throw err;
        })
    ;
});

gulp.task('lint', function() {
    return gulp.src(['./src/*.js','gulpfile.js','karma.conf.js'])
        .pipe(plugins.jshint())
        .pipe(plugins.jshint.reporter('fail'))
        ;
});

gulp.task('default',['lint','build','qunit']);
