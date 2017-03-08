var gulp     = require('gulp'),
	concat   = require('gulp-concat'),
	uglify   = require('gulp-uglify'),
	rename   = require('gulp-rename');

gulp.task('script-min', function() {
	gulp.src('src/**/*.js')
	// .pipe(jshint())
	.pipe(concat('UploadArea.js'))
	.pipe(uglify())
	.pipe(rename({suffix:'.min'}))
    .pipe(gulp.dest('dist'));
});

gulp.task('watch', function() {
	gulp.watch('www/**', ['script-min']);
});

gulp.task('default', ['script-min', 'watch']);