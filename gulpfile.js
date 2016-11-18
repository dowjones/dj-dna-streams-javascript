const gulp = require('gulp');
const jasmine = require('gulp-jasmine');

gulp.task('build', () => {
  console.log('Building ...');
});

gulp.task('test', ['build'], () => {
  gulp.src(['tests/**/*'], { read: true })
    .pipe(jasmine());
});

gulp.task('watch-test', () => {
  gulp.watch(['**/*', '!node_modules/**/*'], ['test']);
});

gulp.task('test-cont', ['watch-test'], () => {
  gulp.start('test');
});
