const { src, dest, series, watch } = require('gulp');
const sass = require('gulp-sass');
const sync = require('browser-sync').create();
const csso = require('gulp-csso');
const htmlmin = require('gulp-htmlmin');
const autoprefixer = require('gulp-autoprefixer');
const concat = require('gulp-concat');

// CssMin
const getCssMin = () => {
    return src('src/scss/**/*.scss')
        .pipe(sass())
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 2 versions']
        }))
        .pipe(csso())
        .pipe(concat('../css/style.min.css'))
        .pipe(dest('src'))
}

exports.getCssMin = getCssMin

// IndexHtmlMin
const getIndexHtmlMin = () => {
    return src('src/index.html')
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(concat('../index.html'))
        .pipe(dest('src'))
}

exports.getIndexHtmlMin = getIndexHtmlMin;

// Copy
const copyImgNormCss = () => {
    return src([
        'src/img/**/**/*.*',
        'src/css/normalize.css'
    ], {
        base: "src"
    })
        .pipe(dest('./'))
}
exports.copyImgNormCss = copyImgNormCss;

// Server
const runServer = () => {
    sync.init({
        server: {
            baseDir: "./"
        },
        notify: false,
    });

    watch('src/index.html', series(getIndexHtmlMin)).on('change', sync.reload)
    watch('src/scss/**/*.scss', series(getCssMin)).on('change', sync.reload)
    watch('src/img/**/*.*', series(copyImgNormCss)).on('change', sync.reload)
}

exports.runServer = runServer;

// Build
exports.start =
    series(
        getIndexHtmlMin,
        getCssMin,
        copyImgNormCss,
        runServer
    )
