const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const spritesmith = require('gulp.spritesmith');
const rimraf = require('rimraf');
const rename = require('gulp-rename');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');


gulp.task('server', function () {
    browserSync.init({
        server: {
            port: 9000,
            baseDir: "build"
        }
    });

    gulp.watch('build/**/*').on('change', browserSync.reload);
});

gulp.task('templates:compile', function buildHTML() {
    return gulp.src('src/templates/index.pug')
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulp.dest('build'))
});

gulp.task('styles:compile', function () {
    return gulp.src('src/styles/main.scss')
        .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
        .pipe(rename('main.min.css'))
        .pipe(gulp.dest('build/css'));
});

gulp.task('clean', function del(cb) {
    return rimraf('build', cb);
});

gulp.task('copy:fonts', function () {
    return gulp.src('./src/fonts/**/*.*')
        .pipe(gulp.dest('build/fonts'));
});

gulp.task('copy:images', function () {
    return gulp.src('./src/icons/**/*.*')
        .pipe(gulp.dest('build/images'));
});

gulp.task('copy', gulp.parallel('copy:fonts', 'copy:images'));

gulp.task('watch', function () {
    gulp.watch('src/templates/**/*.pug', gulp.series('templates:compile'));
    gulp.watch('src/styles/**/*.scss', gulp.series('styles:compile'));
});

gulp.task('default', gulp.series(
    'clean',
    gulp.parallel('templates:compile', 'styles:compile', 'copy'),
    gulp.parallel('watch', 'server')
)
);
