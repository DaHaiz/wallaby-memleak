// @flow

import _ from 'lodash'
import gulp from 'gulp'
import bower from 'gulp-bower'
import bowerFiles from 'main-bower-files'
import gulpif from 'gulp-if'
import rev from 'gulp-rev'
import debug from 'gulp-debug'
import sourceMaps from 'gulp-sourcemaps'
import newer from 'gulp-newer'
import concat from 'gulp-concat'
import cleanCSS from 'gulp-clean-css'
import history from 'connect-history-api-fallback'
import uglify from 'gulp-uglify'

import {config, browserSync} from './config'

var fontsFilter = {
  filter: /\.(otf|eot|svg|ttf|woff|woff2)/i
}

var isFirstRun = true
var jsFilter = {
  filter: /\.js$/i
}

var cssFilter = {
  filter: /\.css$/i
}

// bower.js
gulp.task('bower:prune', !config.bower ? _.noop : function() {
  return bower({cmd: 'prune'})
})

gulp.task('bower:install', !config.bower ? _.noop : function() {
  return bower()
})

// bowerFonts.js
gulp.task('bowerFonts', ['bower:install', 'bower:prune'], !config.bowerFonts ? _.noop : function() {
  return gulp.src(bowerFiles(fontsFilter))
    .pipe(gulpif(config.build.bowerDebug, debug()))
    .pipe(gulpif(config.build.rev, rev()))
    .pipe(gulp.dest(config.bowerFonts.dest))
    .pipe(gulpif(config.build.rev, rev.manifest()))
    .pipe(gulpif(config.build.rev, gulp.dest(config.bowerFonts.dest)))
})

// bowerScripts.js
gulp.task('bowerScripts', ['bower:install', 'bower:prune'], !config.bowerScripts ? _.noop : function() {
  var vendorFile = 'vendor.js'
  var result = gulp.src(bowerFiles(jsFilter))
    .pipe(gulpif(config.build.bowerDebug, debug()))
    .pipe(sourceMaps.init())
    .pipe(gulpif(isFirstRun, newer(config.bowerScripts.dest + vendorFile)))
    .pipe(concat(vendorFile))
    .pipe(gulpif(config.build.uglify, uglify()))
    .pipe(gulpif(config.build.rev, rev()))
    .pipe(sourceMaps.write(config.build.sourceMapPath))
    .pipe(gulp.dest(config.bowerScripts.dest))
    .pipe(gulpif(config.build.rev, rev.manifest({cwd: config.statics.dest, merge: true})))
    .pipe(gulpif(config.build.rev, gulp.dest(config.statics.dest)))

  isFirstRun = false
  return result
})

// bowerStyles.js
gulp.task('bowerStyles', ['bower:install', 'bower:prune'], !config.bowerStyles ? _.noop : function(done) {
  var vendorFile = 'vendor.css'
  gulp.src(bowerFiles(cssFilter))
    .pipe(gulpif(config.build.bowerDebug, debug()))
    .pipe(sourceMaps.init())
    .pipe(gulpif(isFirstRun, newer(config.bowerStyles.dest + vendorFile)))
    .pipe(concat(vendorFile))
    .pipe(cleanCSS())
    .pipe(gulpif(config.build.rev, rev()))
    .pipe(sourceMaps.write(config.build.sourceMapPath))
    .pipe(gulp.dest(config.bowerStyles.dest))
    .pipe(gulpif(config.build.rev, rev.manifest({merge: true})))
    .pipe(gulpif(config.build.rev, gulp.dest(config.statics.dest)))

  isFirstRun = false

  done()
})

// browserSync.js
gulp.task('browserSync', ['build'], !config.serve ? _.noop : function() {
  if (config.serve.proxy) {
    browserSync.init({
      proxy: config.serve.proxy,
      port: config.serve.port
    })
  } else {
    browserSync.init({
      server: {
        baseDir: config.serve.root
      },
      port: config.serve.port,
      middleware: [history()]
    })
  }
})
