var harp = require('harp');
var gulp = require('gulp');
var shell = require('gulp-shell');
var cdnizer = require('gulp-cdnizer');
var harpJson = require('./harp.json');

gulp.task('compile', function () {
  return gulp.src('')
    .pipe(shell([
      'harp compile'
    ]));
});

gulp.task('cdn', ['compile'], function () {
  return gulp.src('./www/**/*.html')
    .pipe(cdnizer({
      defaultCDNBase: harpJson.globals.cdn,
      files: [
        '/assets/js/**/*.js',
        '/assets/css/**/*.css',
        '/assets/**/*.{png,jpg,gif}',
        '/rss.xml'
      ]
    }))
    .pipe(gulp.dest('./www/'));
});

gulp.task('default', ['cdn']);
