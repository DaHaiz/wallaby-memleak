// @flow

import gulp from 'gulp'
import sass from 'gulp-sass'
import sourceMaps from 'gulp-sourcemaps'
import autoPrefixer from 'gulp-autoprefixer'
import gulpif from 'gulp-if'
import rev from 'gulp-rev'
import revReplace from 'gulp-rev-replace'
import nodeSassGlobbing from 'node-sass-globbing'
import preprocess from 'gulp-preprocess'
import _ from 'lodash'
import newer from 'gulp-newer'
import imagemin from 'gulp-imagemin'
import flatten from 'gulp-flatten'

import {config, browserSync} from './config'

// images.js
gulp.task('images', !config.images ? _.noop : function() {
  return gulp.src(config.images.src)
    .pipe(newer(config.images.dest))
    .pipe(imagemin())
    .pipe(flatten())
    .pipe(gulp.dest(config.images.dest))
})

gulp.task('statics', !config.statics ? _.noop : function() {
  return gulp.src(config.statics.src)
    .pipe(gulp.dest(config.statics.dest))
})

gulp.task('styles', ['fonts'], function () {
  var optionsSass = {
    outputStyle: 'compressed',
    importer: nodeSassGlobbing
  }

  if (config.build.rev && config.fonts) {
    var optionsRev = {
      manifest: gulp.src('./' + config.fonts.dest + 'rev-manifest.json')
    }
  }

  return gulp.src(config.styles.src)
    .pipe(sourceMaps.init())
    .pipe(gulpif(config.preprocess && config.preprocess.apply.styles, preprocess(config.preprocess)))
    .pipe(sass(optionsSass).on('error', sass.logError))
    .pipe(autoPrefixer(config.styles.prefixer))
    .pipe(gulpif(config.build.rev && config.fonts, revReplace(optionsRev)))
    .pipe(gulpif(config.build.rev, rev()))
    .pipe(sourceMaps.write(config.build.sourceMapPath))
    .pipe(gulp.dest(config.styles.dest))
    .pipe(browserSync.stream({match: '**/*.css'}))
    .pipe(gulpif(config.build.rev, rev.manifest({cwd: config.statics.dest, merge: true})))
    .pipe(gulpif(config.build.rev, gulp.dest(config.statics.dest)))
})
