var gulp = require("gulp");
var ts = require("gulp-typescript");
var sourceMaps = require("gulp-sourcemaps");
var merge = require("merge2");
var replace = require("gulp-replace");
var concat = require("gulp-concat");

var tsConfig = {
    target: "ES5",
    module: "commonjs",
    declaration: true
};

// soo.js
gulp.task("default", function () {
    var tsResult = gulp.src([
        'src/polyfill/*',
        'src/i18n/**',
        'src/utils/*',
        'src/math/Math.ts', 'src/math/plane/*', 'src/math/space/*',
        'src/platform/*',
        'src/core/event/*',
        'src/core/ticker/Ticker.ts', 'src/core/ticker/*',
        'src/core/display/$DisplayObject.ts', 'src/core/display/*',
        'src/core/layout/Layout.ts', 'src/core/layout/LinearLayout.ts',
        'src/core/layout/*',
        'src/core/**',

        // dom
        'src/dom/utils/*',
        'src/dom/display/DOMElement.ts', 'src/dom/display/*',
        'src/dom/canvas/**',

        // canvas

    ])
        .pipe(sourceMaps.init())
        .pipe(ts(tsConfig));

    return merge([
        tsResult.dts.
        pipe(replace(/\/\/\/\s<reference\spath=(.*)\/>/g, ""))
            .pipe(concat("soo.d.ts"))
            .pipe(sourceMaps.write("."))
            .pipe(gulp.dest("dist")),

        tsResult.js.pipe(replace(/\/\/\/\s<reference\spath=(.*)\/>/g, ""))
            .pipe(concat("soo.js"))
            .pipe(sourceMaps.write("."))
            .pipe(gulp.dest("dist"))
    ]);
});