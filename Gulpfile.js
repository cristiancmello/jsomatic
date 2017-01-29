var gulp = require('gulp');  
var mocha = require('gulp-mocha');

gulp.task('test', function (cb) {  
  gulp.src('test/**/*.js')
    .pipe(mocha({
      reporter: 'spec',
      ui: 'bdd',
      timeout: 30000,
    }))
    .on('end', function () {
      cb();
    });
});

gulp.task('default', ['test']);