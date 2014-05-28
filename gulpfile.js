var gulp = require('gulp');
var concat = require('gulp-concat');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var through = require('through2');

var paths = {
    scripts: ['./src/*.js'],
    styles: ['./src/*.css']
};

// function bundle() {
//     return through.obj(function(file, enc, callback) {
//         file.contents = browserify()
//             .require(file, {entry: file.path})
//             .bundle();
//         this.push(file);
//         callback();
//     });
// }

gulp.task('scripts', function() {
    return browserify('./src/main.js')
        .bundle()
        .pipe(source('desktop.js'))
        .pipe(gulp.dest('./build/'));
});

gulp.task('styles', function() {
    return gulp.src(paths.styles)
        .pipe(concat('desktop.css'))
        .pipe(gulp.dest('./build/'));
});

gulp.task('watch', function() {
    gulp.watch(paths.scripts, ['scripts']);
    gulp.watch(paths.styles, ['styles']);
});

gulp.task('dev', ['styles', 'scripts', 'watch']);