import fs from 'fs';
import path from 'path';
import gulp from 'gulp';
import plumber from 'gulp-plumber';
import gutil from 'gulp-util';
import concat from 'gulp-concat';
import uglify from 'gulp-uglify';
import copy from 'gulp-copy';
import compass from 'gulp-compass';
import jade from 'gulp-jade';
import cleanCSS from 'gulp-clean-css';
import sourcemaps from 'gulp-sourcemaps';
import clean from 'gulp-clean';
import merge from 'merge-stream';
import babel from 'gulp-babel';
import browserify from 'gulp-browserify';
import watch from 'gulp-watch';
import runSequence from 'run-sequence';
import imagemin from 'gulp-imagemin';
import archiver from 'archiver';
import glob from 'glob';
const browserSync = require('browser-sync').create();

import pkg from './package.json';
const dirs = pkg['f2e-configs'].directories;
const assetPath = pkg['f2e-configs'].assets;
const scriptsPath = pkg['f2e-configs'].scripts;
const cssPath = pkg['f2e-configs'].styles;

var srcPath = {
  sass: dirs.src + '/sass',
  css: dirs.src + '/css/',
  js: dirs.src + '/js/*.js',
  jade: dirs.src + "/template/**/*.jade",
  partials: dirs.src + "/partials/**/*.jade",
  img: dirs.src + '/img',
  font: dirs.src + '/fonts'
};
var dist = {
  font: dirs.dist + '/fonts',
  style: dirs.dist + '/css',
  js: dirs.dist + '/js',
  html: dirs.dist + '/html',
  img: dirs.dist + '/img'
};

const date = new Date();
const today = date.toLocaleDateString().replace(/\-/g, '') + '';

gulp.task('archive:create_archive_dir', () => {
  if (!fs.existsSync(dirs.archive)) {
    fs.mkdirSync(path.resolve(dirs.archive), '0755');
  }

  if (fs.existsSync(dirs.archive + `/${pkg.name}-${today}.zip`)) {
    fs.unlinkSync(dirs.archive + `/${pkg.name}-${today}.zip`);
  }
});

gulp.task('archive:zip', (done) => {

  const archiveName = path.resolve(dirs.archive, `${pkg.name}-${today}.zip`);
  const zip = archiver('zip');
  const files = glob.sync('**/*.*', {
    'cwd': dirs.dist,
    'dot': true // include hidden files
  });
  const output = fs.createWriteStream(archiveName);

  zip.on('error', (error) => {
    done();
    throw error;
  });

  output.on('close', done);

  files.forEach((file) => {

    const filePath = path.resolve(dirs.dist, file);

    // `zip.bulk` does not maintain the file
    // permissions, so we need to add files individually
    zip.append(fs.createReadStream(filePath), {
      'name': file,
      'mode': fs.statSync(filePath).mode
    });

  });

  zip.pipe(output);
  zip.finalize();

});

// Concat JS Libray
gulp.task('compileJS', () => {
  var pipe = gulp.src(srcPath.js)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(browserify())
    .pipe(sourcemaps.write('.'))
    .pipe(plumber.stop())
    .pipe(gulp.dest(dist.js))
    .pipe(browserSync.stream());
  pipe.on('error', () => {

  });

  return pipe;
});


gulp.task('minifyJS', () => {
  var pipe = gulp.src(dist.js + '/!(lib).js')
    .pipe(uglify())
    .pipe(gulp.dest(dist.js))
});

/** Compass **/
gulp.task('compass', () => {
  return gulp.src([
      srcPath.sass + '/*.sass',
      srcPath.sass + '/pages/*.sass'
    ])
    .pipe(plumber({
      errorHandler(err) {
        console.log(err.message);
        this.emit('end')
      }
    }))
    .pipe(sourcemaps.init())
    .pipe(compass({
      project: path.join(__dirname, '/src'),
      css: 'css',
      image: 'img',
      sass: 'sass'
    }))
    .pipe(sourcemaps.write('.'))
    .on('error', (err) => {
      console.log(err.message);
      // Would like to catch the error here 
    })
    .pipe(gulp.dest('css'));
});

gulp.task('clean-img', () => {
  return gulp.src(dist.img, {
    read: false
  }).pipe(clean());
});

gulp.task('clean-html', () => {
  return gulp.src(dist.html, {
    read: false
  }).pipe(clean());
});

gulp.task('copy-font', () => {
  return gulp.src(assetPath).pipe(gulp.dest(dist.font));
});

gulp.task('compileCSS', ['compass', 'clean-img'], () => {
  var css = gulp.src(srcPath.css + '/**/!(lib).css')
    .pipe(cleanCSS())
    .pipe(gulp.dest(dist.style));
  
  var img = gulp.src([
      srcPath.img + "/*.png",
      srcPath.img + "/*.jpg",
      srcPath.img + "/*.gif",
      srcPath.img + "/!(icons|icons-2x)/*.png"
    ]).pipe(gulp.dest(dist.img));

  return merge(css, img).pipe(browserSync.stream());
});

gulp.task('compileIMG', ['clean-img'], () => {
  var img = gulp.src([
    srcPath.img + "/*.png",
    srcPath.img + "/*.jpg",
    srcPath.img + "/*.gif",
    srcPath.img + "/!(icons|icons-2x)/*.png"
  ]).pipe(imagemin({
    verbose: true
  })).pipe(gulp.dest(dist.img));

  return merge(img);
});

// Jade
gulp.task('jade', ['clean-html'], () => {
  return gulp.src(srcPath.jade)
    .pipe(plumber({
      errorHandler(err) {
        console.log(err.message);
        this.emit('end')
      }
    }))
    .pipe(jade({
        pretty: true
      })
      .on('error', (err) => {}))
    .pipe(gulp.dest(dist.html))
    .pipe(browserSync.stream());
});

// Concat CSS Library
gulp.task('concatCSSLib', () => {
  return gulp.src(cssPath)
    .pipe(concat('lib.css'))
    .pipe(gulp.dest(dist.style));
});

// Concat JS library
gulp.task('concatJSLib', () => {
  return gulp.src(scriptsPath)
    .pipe(concat('lib.js'))
    .pipe(gulp.dest(dist.js));
});

// Static server
gulp.task('server', ['jade', 'compileCSS', 'compileJS'], () => {
  browserSync.init({
    server: {
      baseDir: "./dist"
    }
  });

  watch("./src/js/**/*.js", function () {
    runSequence('compileJS')
  });
  watch([
    srcPath.jade,
    srcPath.partials
  ], function () {
    runSequence('jade')
  });
  watch([
    srcPath.sass + "/**/*.sass",
    srcPath.img + "/*"
  ], function () {
    runSequence('compileCSS')
  });

});


gulp.task('archive', () => {
  runSequence('archive:create_archive_dir', 'archive:zip');
});

// If project need separate library css and js, you can use 'concatCSSLib', 'concatJSLib'
gulp.task('default', () => {
  runSequence('jade', 'compileCSS', 'copy-font', 'concatJSLib', 'compileJS');
});

gulp.task('watch', () => {
  runSequence('server', 'jade', 'compileCSS', 'copy-font', 'concatJSLib', 'compileJS');
});

gulp.task('production', () => {
  runSequence('jade', 'compileCSS', 'compileIMG', 'copy-font', 'concatJSLib', 'compileJS', 'minifyJS');
});