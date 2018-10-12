const gulp = require('gulp');
const jasmine = require('gulp-jasmine');

gulp.task('build', (done) => {
  console.log('Building ...');
  done();
});

gulp.task('test', gulp.series('build', (done) => {
  gulp.src(['tests/**/*.js'], { read: true })
    .pipe(jasmine());
  done();
}));

gulp.task('watch-test', (done) => {
  gulp.watch(['**/*', '!node_modules/**/*'], gulp.series('test'));
  done();
});

gulp.task('test-cont', gulp.series('watch-test', 'test'));