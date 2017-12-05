var gulp     = require('gulp'),
	concat   = require('gulp-concat'),
	uglify   = require('gulp-uglify'),
	rename   = require('gulp-rename'),
	babel    = require('gulp-babel');

gulp.task('script-min', function() {
	gulp.src('src/**/*.js')
	.pipe(concat('UploadArea.js'))
	.pipe(babel({
		presets: ['env']
	}))
	.pipe(uglify())
	.pipe(rename({suffix:'.min'}))
    .pipe(gulp.dest('dist'));
});

gulp.task('watch', function() {
	gulp.watch('src/**', ['script-min']);
});

gulp.task('default', ['script-min', 'watch']);