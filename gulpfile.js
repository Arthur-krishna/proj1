var gulp = require('gulp'),
	less = require('gulp-less'),
	minifyCSS = require('gulp-minify-css'),
	concat = require('gulp-concat'),
	minifyJS = require('gulp-jsmin');

// CSS concat, auto-prefix and minify
gulp.task('styles', function() {
  gulp.src('app/styles/*.less')
	.pipe(less())
    .pipe(concat('site.css'))
    .pipe(minifyCSS())
    .pipe(gulp.dest('www/styles/'));
});

var scriptSC = {
	scriptfy: {
			src: [
				'app/*.js',
				'app/scripts/controllers/*.js'
			],
			dest: 'www/scripts/'
		}
};

gulp.task('scripts', function() {
	return gulp.src(scriptSC.scriptfy.src)
		.pipe(concat('main.js'))
		.pipe(minifyJS())
		.pipe(gulp.dest(scriptSC.scriptfy.dest));
	gulp.src('lib/scripts/*.js')
		.pipe(concat('lib-files.js'))
		.pipe(minifyJS())
		.pipe(gulp.dest('www/scripts/lib/'));
});

gulp.task('express', function() {

	var express = require('express'),
		app = express();

	app.use(express.static(__dirname + '/www'));
	var server = app.listen(process.env.PORT || 3000, function() {
		console.log('Listening on port %d', server.address().port);
	});

});

gulp.task('default', ['express'], function () {
	gulp.run('styles')
	gulp.run('scripts')
	gulp.watch('app/styles/*.less', function () {
		gulp.run('express')
		gulp.run('styles')
	});
	gulp.watch('app/*.js', function () {
		gulp.run('express')	
		gulp.run('scripts')
	});
	gulp.watch('lib/scripts/*.js', function () {
		gulp.run('scripts')
	});
});