const gulp = require('gulp'),
  browser = require('browser-sync').create(),
  sass = require('gulp-sass'),
  autoprefixer = require('gulp-autoprefixer'),
  cleancss = require('gulp-clean-css'),
  sourcemaps = require('gulp-sourcemaps'),
  uglify = require('gulp-uglify'),
  imagemin = require('gulp-imagemin'),
  pump = require('pump'),
  environments = require('gulp-environments'),
  color = require('gulp-color'),
  changed = require('gulp-changed'),
  del = require('del');

const development = environments.development,
  production = environments.production;

const ignore = ['!dist/**/*', '!node_modules/**/*'].toString();

const cb = function(err) {
  if (err) console.log('Error: ', err.toString());
};

console.log('Env: ' + color(environments.current().$name, 'green'));

if (development()) {
  gulp.task('sass', function(cb) {
    pump(
      [
        gulp.src('./src/*.scss'),
        sourcemaps.init(),
        sass(),
        sourcemaps.write(),
        gulp.dest('./dist'),
        browser.stream()
      ],
      cb
    );
  });

  gulp.task('js', function(cb) {
    pump(
      [
        gulp.src('./src/assets/**/*.js'),
        changed('./dist/assets'),
        gulp.dest('./dist/assets'),
        browser.stream()
      ],
      cb
    );
  });

  gulp.task('default', ['sass', 'js'], function() {
    gulp.start('copy');
  });
} else if (production()) {
  gulp.task('images', function(cb) {
    pump(
      [
        gulp.src('./src/assets/**/*.{jpg,png,gif,svg}'),
        changed('./src/assets'),
        imagemin({ verbose: true }),
        gulp.dest('./src/assets')
      ],
      cb
    );
  });

  gulp.task('sass', function(cb) {
    pump(
      [
        gulp.src('./src/*.scss'),
        sass(),
        autoprefixer({ browsers: ['last 2 versions'] }),
        cleancss({ level: 2, compatibility: 'ie8' }),
        gulp.dest('./dist'),
        browser.stream()
      ],
      cb
    );
  });

  gulp.task('js', function(cb) {
    pump(
      [
        gulp.src('./src/assets/**/*.js'),
        changed('./dist/assets'),
        uglify(),
        gulp.dest('./dist/assets'),
        browser.stream()
      ],
      cb
    );
  });

  gulp.task('default', ['images', 'sass', 'js'], function() {
    gulp.start('copy');
  });
}

gulp.task('clean', function(cb) {
  return del(['./dist']);
});

gulp.task('copy', function(cb) {
  pump(
    [
      gulp.src(
        [
          './src/**/*.{php,html,jpg,png,gif,svg,ico}',
          './src/assets/**/*',
          ignore
        ],
        { options: { read: false } }
      ),
      changed('dist'),
      gulp.dest('dist'),
      browser.stream()
    ],
    cb
  );
});

gulp.task('watch', ['default'], function() {
  browser.init({
    proxy: '<%= props.domain %>',
    notify: false
  });

  gulp.watch(['./src/**/*.scss', ignore], ['sass']),
    gulp.watch(['./src/**/*.js', '!gulpfile.js', ignore], ['js']),
    gulp.watch(['./src/**/*.php', ignore], ['copy']);
});

gulp.task('serve', ['clean'], function() {
  gulp.start('watch');
});

gulp.task('build', ['clean'], function() {
  gulp.start('default');
});
