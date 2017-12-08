let gulp = require('gulp');
let concat = require('gulp-concat');
let uglify = require('gulp-uglify');
let rename = require('gulp-rename');
let babel = require('gulp-babel');

gulp.task('script-min', function() {
	gulp.src('src/**/*.js')
	.pipe(concat('UploadArea.js'))
	.pipe(babel({
		presets: ['env'],
	}))
	.pipe(uglify())
	.pipe(rename({suffix: '.min'}))
	.pipe(gulp.dest('dist'));
});

gulp.task('watch', function() {
	gulp.watch('src/**', ['script-min']);
});

gulp.task('default', ['script-min', 'watch']);
