const gulp = require('gulp');


gulp.task('minify-svg', async function () {
    const { default: imagemin } = await import('gulp-imagemin');
    const { default: imageminSvgo } = await import('imagemin-svgo');
    gulp.src('./src/assets/icons/*.svg')
        .pipe(imagemin([
            imageminSvgo()
        ]))
        .pipe(gulp.dest('./src/assets/icons/minified'))
});

gulp.task('minify-image', async function () {
    const { default: imagemin } = await import('gulp-imagemin');
    gulp.src('./src/assets/images/*')
        .pipe(imagemin())
        .pipe(gulp.dest('./src/assets/images/minified'))
});

gulp.task('watch', async function () {
    gulp.watch(['./src/assets/images/*', './src/assets/icons/*.svg'], gulp.series(['minify-image', 'minify-svg']));
});