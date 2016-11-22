'use strict';

const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const prefix = require('gulp-autoprefixer');
const eslint = require('gulp-eslint');
const eyeglass = require('eyeglass');
const browserSync = require('browser-sync');

const rollup = require('rollup-stream');
const nodeResolve = require('rollup-plugin-node-resolve');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');

gulp.task('server', function () {
  browserSync.init({
    server: {
      baseDir: './dest',
    },
  });
});

/*
 * Sass
 */
gulp.task('sass', () => {
  return gulp.src('src/sass/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass(eyeglass()))
    .pipe(prefix())
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest('./dest/css'))
    .pipe(browserSync.stream());
});

gulp.task('sass:watch', ['sass'], () => {
  return gulp.watch('src/sass/**/*.scss', ['sass']);
});

/*
 * JavaScript
 */
gulp.task('js', () => {
  return rollup({
    entry: 'src/js/stage-fright.js',
    sourceMap: true,
    preferConst: true,
    plugins: [
      nodeResolve(),
    ],
  })
    .pipe(source('stage-fright.js', './srcjs/'))
    .pipe(buffer())
    .pipe(sourcemaps.init({
      loadMaps: true,
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./dest/js'))
    .pipe(browserSync.stream());
});

gulp.task('js:watch', ['js'], () => {
  return gulp.watch('src/js/**/*.js', ['js']);
});

/*
 * HTML
 */
gulp.task('html', () => {
  return gulp.src(['src/html/**/*.html', '!node_modules/**/*', '!dest/**/*'])
    .pipe(gulp.dest('./dest'))
    .pipe(browserSync.stream());
})

gulp.task('html:watch', ['html'], () => {
  return gulp.watch(['src/html/**/*.html', '!node_modules/**/*', '!dest/**/*'], ['html'])
});

gulp.task('watch', ['js:watch', 'html:watch', 'sass:watch']);

gulp.task('serve', ['watch', 'server']);

gulp.task('default', ['serve']);
