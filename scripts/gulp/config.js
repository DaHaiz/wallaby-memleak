// @flow

import _ from 'lodash'
import browserSyncFactory from 'browser-sync'

import userConfig from '../../gulpfile.config'

const defaultConfig =  {
  build: {
    dest: 'dist/',
    bowerjson: 'bower.json',
    babel: false,
    uglify: true,
    rev: false,
    bowerDebug: false,
    sourceMapPath: '.',
    cdn: '',
    index: 'app/index.html',
    transformCSS: undefined,
    transformJS: undefined
  },
  preprocess: {
    apply: {
      index: true,
      html: false,
      scripts: false,
      styles: false
    },
    context: {
      APP: 'app',
      BASE: '/'
    }
  },
  clean: {
    dest: 'dist/'
  },
  bowerFonts: {
    dest: 'dist/fonts/'
  },
  bowerScripts: {
    dest: 'dist/js/'
  },
  bowerStyles: {
    dest: 'dist/css/'
  },
  statics: {
    src: ['app/favicon.ico', 'app/robots.txt'],
    dest: 'dist/'
  },
  images: {
    src: 'app/components/**/*.{png,jpg,jpeg,gif,svg,ico}',
    dest: 'dist/images/'
  },
  fonts: {
    src: 'app/fonts/**/*.{otf,eot,svg,ttf,woff,woff2}',
    dest: 'dist/fonts/'
  },
  scripts: {
    src: ['app/components/**/*.js', '!app/components/**/*.spec.js'],
    dest: 'dist/js/',
    ng2html: {
      src: 'app/components/**/*.html',
      prefix: 'components/',
      name: 'app.templates'
    },
    ngConstant: {
      constants: {},
      name: 'app.config'
    }
  },
  styles: {
    src: 'app/style.scss',
    files: 'app/**/*.scss',
    dest: 'dist/css/',
    prefixer: {
      browsers: ['last 2 versions'],
      cascade: false
    }
  },
  serve: {
    root: 'dist/',
    port: 3000,
    proxy: undefined,
    watch: true
  },
  gitDeploy: {
    src: 'dist/',
    branch: undefined
  },
  mavenInstall: {
    src: '.',
    config: {}
  },
  mavenDeploy: {
    src: '.',
    config: {},
    repo: {}
  },
  karma: {
    src: './karma.conf.js',
    browsers: undefined // default is defined in karma.js since merge will combine arrays
  }
}

export const config = _.merge({}, defaultConfig, userConfig)

export const browserSync = browserSyncFactory.create()
