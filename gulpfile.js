var gulp = require('gulp');
var gutil = require('gulp-util');
var connect = require('gulp-connect');
var browserify = require('browserify');
var watchify = require('watchify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var sourcemaps = require('gulp-sourcemaps');
var jest = require('jest-cli');
var jshint = require('gulp-jshint');
var react = require('gulp-react');

var chalk = require('chalk');
var _ = require('underscore');

function browserifyBundler(args) {
  args = args || {};
  args = _.extend(args, {
    basedir: __dirname,
    debug: true
  });
  return browserify('./src/App.jsx', args);
}

function browserifyBuild(bundle) {
  return bundle
    .pipe(source('bundle.js')) // gives streaming vinyl file object
    .pipe(buffer()) // convert from streaming to buffered vinyl file object
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./public/js/'));
}

gulp.task('browserify', function() {
  return browserifyBuild(browserifyBundler().bundle());
});

gulp.task('watch', ['build'], function() {
  var bundler = watchify(browserifyBundler(watchify.args));
  bundler.on('update', rebundle);

  function rebundle() {
    console.log(chalk.yellow('Changes detected!'));
    return browserifyBuild(bundler.bundle()
      .on('error', gutil.log.bind(gutil, 'Browserify Error')));
  }

  return rebundle();
});

gulp.task('connect', ['build'], function() {
  connect.server({
    root: './public',
    livereload: true,
    fallback: './public/index.html'
  });
});

gulp.task('test', function(cb) {
  jest.runCLI({}, __dirname, function(success) {
    if (success) {
      console.log(chalk.green('Jest tests succeeded!'));
      return cb();
    } else {
      console.log(chalk.bgRed('Jest tests failed.'));
      cb(new gutil.PluginError('test', { message: "Tests failed", showStack: false}));
    }
  });
});

function lint() {
  return gulp.src('./src/**/*.{jsx,js}')
    .pipe(react())
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'));
}

gulp.task('lint', lint);
gulp.task('lint_after_test', ['test'], lint);

gulp.task('build', ['browserify']);
gulp.task('serve', ['build', 'connect', 'watch']);
gulp.task('check', ['test', 'lint_after_test']);
gulp.task('default', ['check']);
