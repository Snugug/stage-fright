'use strict';

const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const prefix = require('gulp-autoprefixer');
const eyeglass = require('eyeglass');
const browserSync = require('browser-sync');

const path = require('path');

gulp.task('server', function () {
  browserSync.init({
    server: {
      baseDir: './docs',
    },
  });
});

/*
 * Sass
 */
gulp.task('sass', () => {
  return gulp.src('src/sass/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass(eyeglass({
      outputStyle: 'compressed',
      includePaths: [
        path.join(process.cwd(), 'node_modules'),
      ],
    }))).on('error', e => {
      console.error(e.stack);
    })
    .pipe(prefix())
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest('./docs/css'))
    .pipe(browserSync.stream());
});

gulp.task('sass:watch', ['sass'], () => {
  return gulp.watch('src/sass/**/*.scss', ['sass']);
});

/*
 * JS 
 */
gulp.task('js:reload', () => {
  return gulp.src('docs/js/**/*.js')
    .pipe(browserSync.stream());
});

gulp.task('js:watch', ['js:reload'], () => {
  return gulp.watch('docs/js/**/*.js', ['js:reload']);
});

/*
 * HTML
 */
gulp.task('html', () => {
  return gulp.src(['src/html/**/*.html', '!node_modules/**/*', '!docs/**/*'])
    .pipe(gulp.dest('./docs'))
    .pipe(browserSync.stream());
})

gulp.task('html:watch', ['html'], () => {
  return gulp.watch(['src/html/**/*.html', '!node_modules/**/*', '!docs/**/*'], ['html'])
});

gulp.task('watch', ['js:watch', 'html:watch', 'sass:watch']);

gulp.task('serve', ['watch', 'server']);

gulp.task('default', ['serve']);
