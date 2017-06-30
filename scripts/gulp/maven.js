// @flow

import gulp from 'gulp'
import extend from 'extend'
import maven from 'gulp-maven-deploy'

import {config, browserSync} from './config'

gulp.task('maven-deploy', ['build'], !config.mavenDeploy ? _.noop : function() {
  gulp.src(config.mavenDeploy.src)
    .pipe(maven.deploy({
      config: extend({}, config.mavenDeploy.config, {repositories: config.mavenDeploy.repo})
    }))
})

gulp.task('maven-install', ['build'], !config.mavenInstall ? _.noop : function() {
  gulp.src(config.mavenInstall.src)
    .pipe(maven.install({
      config: config.mavenInstall.config
    }))
})
