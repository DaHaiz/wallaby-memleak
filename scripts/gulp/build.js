// @flow

import _ from 'lodash'
import gulp from 'gulp'
import del from 'del'
import gulpif from 'gulp-if'
import rev from 'gulp-rev'
import ghPages from 'gulp-gh-pages'
import gutil from 'gulp-util'
import sourceMaps from 'gulp-sourcemaps'
import ngAnnotate from 'gulp-ng-annotate'
import ngFilesort from 'gulp-angular-filesort'
import ngConstant from 'gulp-ng-constant'
import minifyHtml from 'gulp-minify-html'
import ngHtml2Js from 'gulp-ng-html2js'
import concat from 'gulp-concat'
import uglify from 'gulp-uglify'
import plumber from 'gulp-plumber'
import iife from 'gulp-iife'
import babel from 'gulp-babel'
import preprocess from 'gulp-preprocess'
import mergeStream from 'merge-stream'
import extend from 'extend'
import gulpInject from 'gulp-inject'
import minifyInline from 'gulp-minify-inline'

import {config, browserSync} from './config'

var scriptsFile = 'scripts.js';

gulp.task('build', ['index', 'images', 'statics']);

// clean.js
// remove build (erase dist folder and other generated assets recursively)
gulp.task('clean', !config.clean ? _.noop : function() {
  return del(config.clean.dest);
});

gulp.task('fonts', !config.fonts ? _.noop : function () {
  return gulp.src(config.fonts.src)
    .pipe(gulpif(config.build.rev, rev()))
    .pipe(gulp.dest(config.fonts.dest))
    .pipe(gulpif(config.build.rev, rev.manifest()))
    .pipe(gulpif(config.build.rev, gulp.dest(config.fonts.dest)));
});

// scripts.js
gulp.task('scripts', !config.scripts ? _.noop : function() {

  var scripts = gulp.src(config.scripts.src)
    .pipe(gulpif(config.preprocess && config.preprocess.apply.scripts, preprocess(config.preprocess)));

  // optionally add configScripts
   if (config.scripts.ngConstant) {
     var configScripts = ngConstant({
       constants: config.scripts.ngConstant.constants,
       name: config.scripts.ngConstant.name,
       stream: true
     });

     scripts = mergeStream(scripts, configScripts);
   }


  // optionally add partials
  if (config.scripts.ng2html) {
    var partials = gulp.src(config.scripts.ng2html.src)
      .pipe(gulpif(config.preprocess && config.preprocess.apply.html, preprocess(config.preprocess)))
      .pipe(minifyHtml({
        empty: true,
        spare: true,
        quotes: true
      }))
      .pipe(ngHtml2Js({
        moduleName: config.scripts.ng2html.name,
        prefix: config.scripts.ng2html.prefix
      }));

    scripts = mergeStream(scripts, partials);
  }

  return scripts
    .pipe(plumber())
    .pipe(sourceMaps.init())
    .pipe(gulpif(config.build.babel, babel()))
    .pipe(gulpif(!config.build.babel, iife()))
    .pipe(ngAnnotate())
    .pipe(ngFilesort())
    .pipe(concat(scriptsFile))
    .pipe(gulpif(config.build.uglify, uglify()))
    .pipe(gulpif(config.build.rev, rev()))
    .pipe(sourceMaps.write(config.build.sourceMapPath))
    .pipe(gulp.dest(config.scripts.dest))
    .pipe(gulpif(config.build.rev, rev.manifest({cwd: config.statics.dest, merge: true})))
    .pipe(gulpif(config.build.rev, gulp.dest(config.statics.dest)));
});


gulp.task('git-deploy', ['build'], function() {
  if (config.gitDeploy.branch) {
    return gulp.src(config.gitDeploy.src + '/**/*')
      .pipe(ghPages({
        branch: config.gitDeploy.branch
      }));
  } else {
    gutil.log('No deploy branch defined', gutil.colors.magenta('Did not deploy!'));
    return false;
  }
});

// index.js
function injectIndex() {
  // don't read, just insert paths
  var srcOptions = {
    cwd: config.build.dest,
    read: false
  };

  var jsFiles = ['js/vendor*.js', 'js/scripts*.js'];
  var cssFiles = ['css/vendor*.css', 'css/style*.css'];

  // use relative paths with dist as base; remove the prepended '../dist' in the path
  var injectOptions = {
    relative: true,
    ignorePath: '../' + config.build.dest,
    addPrefix: config.build.cdn
  };

  var injectOptionsCSS = extend({}, injectOptions);
  var injectOptionsJS = extend({}, injectOptions);

  if (config.build.transformCSS) {
    injectOptionsCSS.transform = config.build.transformCSS;
  }
  if (config.build.transformJS) {
    injectOptionsJS.transform = config.build.transformJS;
  }

  return gulp.src(config.build.index)
    .pipe(gulpInject(gulp.src(cssFiles, srcOptions), injectOptionsCSS))
    .pipe(gulpInject(gulp.src(jsFiles, srcOptions), injectOptionsJS))
    .pipe(gulpif(config.preprocess && config.preprocess.apply.index, preprocess(config.preprocess)))
    .pipe(minifyInline())
    .pipe(minifyHtml({
      empty: true,
      spare: true,
      quotes: true
    }))
    .pipe(gulp.dest(config.build.dest));
}

// use this for watch
gulp.task('justIndex', injectIndex);

// use this initial building
gulp.task('index', ['scripts', 'bowerScripts', 'styles', 'bowerStyles', 'bowerFonts'], injectIndex);

// default.js: can also be 'watch'
gulp.task('default', ['serve'])
