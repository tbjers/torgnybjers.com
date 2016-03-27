var harp = require('harp');
var path = require('path');
var gulp = require('gulp');
var shell = require('gulp-shell');
var cdnizer = require('gulp-cdnizer');
var RevAll = require('gulp-rev-all');
var harpJson = require('./harp.json');

gulp.task('compile', function () {
  return gulp.src('')
    .pipe(shell([
      'harp compile'
    ]));
});

gulp.task('cdn', ['compile'], function () {
  var revAll = new RevAll({
    prefix: harpJson.globals.cdn,
    transformFilename: function (file, hash) {
      var ext = path.extname(file.path), filename = path.basename(file.path, ext);
      if (ext == '.html' || file.path.indexOf('fonts') !== -1) {
        filename = filename + ext;
      } else {
        filename = filename + '.' + hash.substr(0, 8) + ext;
      }
      return filename;
    }
  });
  gulp.src('./www/**')
    .pipe(revAll.revision())
    .pipe(gulp.dest('./www/'));
});

gulp.task('default', ['cdn']);
