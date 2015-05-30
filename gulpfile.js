/* =========================================================================
 *
 * gulpfile.js
 *
 *  Gulp config / script setup
 *
 * ========================================================================= */
var gulp = require('gulp');
var browserify = require('browserify');
var logger = require('bragi');
var uglify = require('gulp-uglify');
var source = require('vinyl-source-stream');
var concat = require('gulp-concat');
var imagemin = require('gulp-imagemin');
var sass = require('gulp-sass');
var gutil = require('gulp-util');
var minifycss = require('gulp-minify-css');
var buffer = require('vinyl-buffer');
var webpack = require('gulp-webpack');
var exec = require('child_process').exec;

// Path config
var paths = {
  scripts: './static/js/**/*.js',
  css: ['./static/css/main.scss', './static/css/main.sass'],
  cssTest: ['./static/css/tests.scss', './static/css/tests.sass'],
  cssAdmin: ['./static/css/admin.scss', './static/css/admin.sass'],
  images: './static/img/**/*'
};

// Gulp Tasks
// --------------------------------------
gulp.task('scripts', function() {
    // use browserify and optimize scripts
    gulp.src('./static/js/main.js')
        .pipe(webpack(require('./webpack.config.js')))
        .pipe(gulp.dest('./static/build/js/'));

    // async compress - if we don't, it holds everything else up
    if(['production', 'prod'].indexOf(process.env.NODE_ENV !== -1)){
        logger.log('build:js', 'compressing main JS...');
        var start = Date.now();
        return setTimeout(function(){
            exec('gulp compress-js', function(error, stdout, stderr) {
                if (error !== null) {
                    logger.log('error:build:js', 'error compressing JS: ' + error);
                } else {
                    logger.log('build:js:compressed', 'compressed JS in ' +
                        ((Date.now() - start) / 1000) + ' seconds');
                }
            });
        }, 3000);
    }
});

gulp.task('scripts-tests', function() {
    // Front end script tests
    return gulp.src('./static/js/tests/main.js')
        .pipe(webpack({
            output: {
                path: __dirname + '/static/build/js/',
                filename: 'main.test.js'
            }
        }))
        .pipe(gulp.dest('./static/build/js/'));
});

gulp.task('scripts-admin', function() {
    // Front end script tests
    return browserify('./static/js/admin/main.js')
        .bundle()
        .pipe(source('main-admin.js'))
        .pipe(gulp.dest('./static/build/js/'));
});

function compressJS() {
  return browserify('./static/js/main.js')
    .bundle()
    .pipe(source('main.min.js')) 
    .pipe(buffer()) 
    .pipe(uglify()) 
    .pipe(gulp.dest('./static/build/js'));
}
gulp.task('compress-js', compressJS);

// CSS
// ------------------------------------
gulp.task('sass', function () {
    // SASS Files
    gulp.src(paths.css)
        .pipe(sass())
        .pipe(minifycss())
        .pipe(gulp.dest('./static/build/css'));
});

gulp.task('sass-test', function () {
    // SASS Files
    gulp.src(paths.cssTest)
        .pipe(sass())
        .pipe(minifycss())
        .pipe(gulp.dest('./static/build/css'));
});

gulp.task('sass-admin', function () {
    // SASS Files
    gulp.src(paths.cssAdmin)
        .pipe(sass())
        .pipe(minifycss())
        .pipe(gulp.dest('./static/build/css'));
});

// Images
// ------------------------------------
gulp.task('images', function() {
    // Optimize images
    return gulp.src(paths.images)
        .pipe(imagemin({optimizationLevel: 5}))
        .pipe(gulp.dest('./static/build/img'));
});


// ------------------------------------
//
// Watch
//
// --------------------------------------
gulp.task('watch', function() {
    // When files change, update
    gulp.watch(paths.scripts, ['scripts', 'scripts-admin']);
    gulp.watch(paths.scripts, ['scripts-tests']);
    gulp.watch(paths.images, ['images']);
    gulp.watch(['./static/css/**/*.scss', './static/css/**/*.sass'], ['sass', 'sass-test', 'sass-admin']);
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['scripts', 'scripts-tests', 'images', 'sass', 'watch', 'sass-test', 'sass-admin', 'compress-js']);
