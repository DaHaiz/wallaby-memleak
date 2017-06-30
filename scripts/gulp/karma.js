// @flow

import gulp from 'gulp'
import {Server} from 'karma'
import runSequence from 'run-sequence'

import {config} from './config'

const configFile = (config.karma && config.karma.src) || './karma.conf.js'
const browsers = (config.karma && config.karma.browsers) ? 
  config.karma.browsers : ['PhantomJS', 'Chrome']

gulp.task('karma', function (done) {
  new Server({
    configFile: configFile,
    singleRun: true
  }, done()).start()
})

gulp.task('karma:watch', function (done) {
  new Server({
    configFile: configFile,
    singleRun: false,
    autoWatch: true
  }, done()).start()
})

gulp.task('karma:all', function (done) {
  new Server({
    configFile: configFile,
    browsers: browsers,
    singleRun: true
  }, done()).start()
})

gulp.task('test', function () {
  runSequence('build', 'karma')
})

gulp.task('test:all', function () {
  runSequence('build', 'karma:all')
})

gulp.task('test:watch', function () {
  runSequence('build', 'karma:watch')
})
