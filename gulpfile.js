const gulp = require("gulp");
const sass = require("gulp-sass");
const browserSync = require("browser-sync").create();
const babel = require("gulp-babel");
const uglify = require('gulp-uglify');
const del = require('del');
var configuration = {
  paths: {
    src: {
      html: "./src/**/*.html",
      scss: "./src/scss/**/*.scss",
      js: "./src/js/**/*.js",
    },
    dist: {
      html: "./dist",
      scss: "./dist/css",
      js: "./dist/js",
    },
  },
};
function clean(){
  return del('dist/**', {force:true});
}
function html() {
  return gulp
    .src(configuration.paths.src.html)
    .pipe(gulp.dest(configuration.paths.dist.html))
    .pipe(browserSync.stream());
}
function scripts() {
  return gulp
    .src(configuration.paths.src.js)
    .pipe(
      babel({
        presets: ["@babel/env"],
      })
    )
    .pipe(gulp.dest(configuration.paths.dist.js))
    .pipe(browserSync.stream());
}
function productionScripts() {
  return gulp
    .src(configuration.paths.src.js)
    .pipe(
      babel({
        presets: ["@babel/env"],
      })
    )
    .pipe(uglify())
    .pipe(gulp.dest(configuration.paths.dist.js))
}
function styles() {
  return gulp
    .src(configuration.paths.src.scss)
    .pipe(sass())
    .pipe(gulp.dest(configuration.paths.dist.scss))
    .pipe(browserSync.stream());
}
function productionStyles() {
  return gulp
    .src(configuration.paths.src.scss)
    .pipe(sass({ outputStyle: "compressed" }))
    .pipe(gulp.dest(configuration.paths.dist.scss));
}
function watch() {
  browserSync.init({
    server: "./dist",
  });
  gulp.watch(configuration.paths.src.js, scripts);
  gulp.watch(configuration.paths.src.scss, styles);
  gulp.watch(configuration.paths.src.html, html);
}
exports.prod = gulp.series(clean, html, productionStyles, productionScripts);
exports.default = gulp.series(clean, html, styles, scripts, watch);