const gulp = require("gulp");
const sass = require("gulp-sass");
const browserSync = require("browser-sync").create();
const babel = require("gulp-babel");
const uglify = require('gulp-uglify');
const del = require('del');
const rename = require("gulp-rename");
const dom = require('gulp-dom');
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
function clean() {
    return del('dist/**', {force: true});
}
function html() {
    return gulp
        .src(configuration.paths.src.html)
        .pipe(gulp.dest(configuration.paths.dist.html))
        .pipe(browserSync.stream());
}
function productionHtml() {
    return gulp
        .src(configuration.paths.src.html)
        .pipe(dom(function () {
            const links = this.querySelectorAll('link[href]');
            let idx = links.length;
            while (idx--) {
                if (!links[idx].getAttribute('href').includes('http') && !links[idx].getAttribute('href').includes('.min')) {
                    const href = links[idx].getAttribute('href');
                    const path = href.replace(/\.[^/.]+$/, "");
                    const extension = href.split('.').pop();
                    if (extension === 'css') {
                        const newHref = path + '.min.' + extension;
                        links[idx].setAttribute("href", newHref);
                    }
                }
            }
            const scripts = this.querySelectorAll('script[src]');
            idx = scripts.length;
            while (idx--) {
                if (!scripts[idx].getAttribute('src').includes('http') && !scripts[idx].getAttribute('src').includes('.min')) {

                    const src = scripts[idx].getAttribute('src');
                    const path = src.replace(/\.[^/.]+$/, "");
                    const extension = src.split('.').pop();

                    if (extension === 'js') {
                        const newSrc = path + '.min.' + extension;
                        scripts[idx].setAttribute("src", newSrc);
                    }
                }
            }

        }))
        .pipe(gulp.dest(configuration.paths.dist.html))
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
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(configuration.paths.dist.js))
}
function styles() {
    return gulp
        .src(configuration.paths.src.scss)
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(configuration.paths.dist.scss))
        .pipe(browserSync.stream());
}
function productionStyles() {
    return gulp
        .src(configuration.paths.src.scss)
        .pipe(sass({
            outputStyle: "compressed"
        }).on('error', sass.logError))
        .pipe(rename({suffix: '.min'}))
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
exports.prod = gulp.series(clean, productionHtml, productionStyles, productionScripts);
exports.default = gulp.series(clean, html, styles, scripts, watch);