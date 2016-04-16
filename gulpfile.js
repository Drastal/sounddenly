'use strict';

var gulp = require('gulp');
var plugins = {
    sass: require('gulp-sass'),
    sourcemaps: require('gulp-sourcemaps'),
    inject: require('gulp-inject'),
    angularFilesort: require('gulp-angular-filesort'),
    concat: require('gulp-concat'),
    clean: require('gulp-rimraf')
};

/**
 * Config
 **/
var paths = {
    scripts: 'src/**/*.js',
    style: 'src/**/*.scss',
    index: 'src/index.html',
    build: './dist'
};

/**
 * Tasks
 **/
 gulp.task('default', ['serve']);

 gulp.task('serve', ['clean'], function() {

 });

gulp.task('clean', function() {
    return gulp.src(paths.build, { read: false })
        .pipe(plugins.clean());
});

gulp.task('concat-js', function() {
	return gulp.src(paths.scripts)
		.pipe(plugins.sourcemaps.init())
		.pipe(plugins.angularFilesort(), {relative: true})
		.pipe(plugins.concat('scripts.js'))
		.pipe(plugins.sourcemaps.write())
		.pipe(dest(paths.build + '/js'));
})

gulp.task('inject', function() {
	return gulp.src(paths.index)
		.pipe(plugins.inject(gulp.src([paths.build + '/**/*.js', paths.build + '/**/*.css'], {read: false}), {relative: true}))
		.pipe(gulp.dest(paths.build));
});