'use strict';

var gulp = require('gulp');
var plugins = {
    sass: require('gulp-ruby-sass'),
    sourcemaps: require('gulp-sourcemaps'),
    inject: require('gulp-inject'),
    angularFilesort: require('gulp-angular-filesort'),
    concat: require('gulp-concat'),
    clean: require('gulp-rimraf'),
    changed: require('gulp-changed'),
    runSequence: require('run-sequence'),
    bowerFiles: require('main-bower-files')
};

/**
 * Config
 **/
var paths = {
    scripts: 'src/**/*.js',
    style: 'src/**/*.scss',
    views: ['src/**/*.html', '!src/index.html'],
    index: 'src/index.html',
    build: './dist'
};

/**
 * Tasks
 **/
gulp.task('default', ['build']);

gulp.task('build', ['clean'], function(callback) {
    plugins.runSequence('copy-changed-views', 'inject', callback)
});

gulp.task('serve', ['build'], function() {
    gulp.watch(paths.scripts, ['concat-js']);
    gulp.watch(paths.style, ['style']);
    gulp.watch(paths.views, ['copy-changed-views']);
    gulp.watch(paths.index, ['build']);
});

gulp.task('clean', function() {
    return gulp.src(paths.build, { read: false })
        .pipe(plugins.clean());
});

gulp.task('copy-changed-views', function() {
    return gulp.src(paths.views)
        .pipe(plugins.changed(paths.build))
        .pipe(gulp.dest(paths.build))
});

gulp.task('concat-js', function() {
    return gulp.src(paths.scripts)
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.angularFilesort(), { relative: true })
        .pipe(plugins.concat('scripts.js'))
        .pipe(plugins.sourcemaps.write('../maps'))
        .pipe(gulp.dest(paths.build + '/js'));
});

gulp.task('style', function() {
    return plugins.sass(paths.style, { sourcemap: true })
        .on('error', plugins.sass.logError)
        .pipe(plugins.sourcemaps.write('./maps'))
        .pipe(gulp.dest(paths.build));
});

gulp.task('inject', ['concat-js', 'style'], function() {
    return gulp.src(paths.index)
        .pipe(plugins.inject(gulp.src(plugins.bowerFiles({
            paths: {
                bowerrc: '.bowerrc'
            }
        }), { read: false }), { name: 'components' }))
        .pipe(plugins.inject(gulp.src([paths.build + '/**/*.js', paths.build + '/**/*.css'], { read: false }), { relative: true }))
        .pipe(gulp.dest(paths.build));
});
