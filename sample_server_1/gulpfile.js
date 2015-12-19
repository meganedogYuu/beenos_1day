var gulp   = require('gulp'),
    babel  = require('gulp-babel');
    concat = require("gulp-concat");

gulp.task('babel', function() {
  return gulp.src(['./src/resource.js', './src/flickr.js', './src/app.js'])
    .pipe(concat('app.js'))
    .pipe(babel({presets: ['es2015']}))
    .pipe(gulp.dest('./public/assets/js/'));
});
