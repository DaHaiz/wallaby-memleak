var argv = require('yargs').argv;
var gulp = require('gulp');
var version = require('./package.json').version;

/**
 *  Default configuration for local development
 */
var appBase = '';
var apiHost = argv.api || ''; // default host
var appBuild = 'local';

/**
 * Override configuration for packaged builds to run in application server
 */
var mavenTasks = ['maven-deploy', 'maven-install'];
var gulpTasks = argv['_'];
for (var i = 0; i < mavenTasks.length; i++) {
  if (gulpTasks.indexOf(mavenTasks[i]) > -1) {
    appBase = '${context.path}';
    appBuild = '${build.number}';
    apiHost = 'api'
  }
}

/**
 * Configuration for ngConstant
 */
var ngConstant = {
  ENV: {
    name: 'local',
    api: apiHost
  }
};

/**
 * Configuration to create maven artifact from distribution and deplo it to nexus server
 */
var mavenConfig = {
  groupId: 'de.example',
  artifactId: 'Seed',
  buildDir: 'dist/',
  type: 'zip'
};
var nexusRepos = [
  {
    id: 'nexus',
    url: 'http://nexus.example.de:8080/nexus/content/repositories/releases/'
  }
];


var config = {

  /***** General *****/

  //// task `build` executes the following tasks (if activated): `index`, `images`, `statics`
  build: {
    //  dest: 'dist/', // point to the distribution folder
    //  bowerjson: 'bower.json', // path to the bower.json file
    babel: true, //uses babel to transpile ES6/ES2015 to ES5, you have to add a preset
    uglify: false, // minifies and compresses generated files
    //  rev: false, // append random revision postfixes to generated files
    //  bowerDebug: false, // prints gulp pipes from included bower files
    //  sourceMapPath: '.', // default (relative) path to place sourcemaps
    //  index: 'app/index.html'
    transformJS: function (filepath) {
      return '<script src="' + filepath + '?v=' + version + '"></script>';
    },
    transformCSS: function (filepath) {
      return '<link rel="stylesheet" href="' + filepath + '?v=' + version + '">';
    }
  },

  preprocess: {
    // apply: {
    //   index: true,
    //   html: false,
    //   scripts: false,
    //   styles: false
    // },
    context: {
      VERSION: version, // version number
      APP: 'angularSeed', // angular app name (can be used using <!-- @echo APP -->)
      BASE: appBase, // base tag for html5mode
      BUILD: appBuild
    }
  },

  //// task [`clean`] provides removal of build artifacts
  clean: {
  //  dest: 'dist/' // glob pointing to all build artifacts
  },

  /***** Management and Processing of Dependencies *****/

  //// [`bower`] registers tasks `bower:install` and `bower:prune` for package management by bower
  bower: null,

  //// task [`bowerFonts`] collects fonts from bower dependencies and stores them in a dedicated distribution folder
  bowerFonts: {
    dest: 'dist/css/' // destination of the font files
  },

  //// task [`bowerScripts`] collects scripts from bower dependencies stores them in a dedicated distribution folder
  bowerScripts: {
  //  dest: 'dist/js/' // destination of the concat file `vendor.js` (and associated sourcemaps file)
  },

  //// task [`bowerStyles`] collects styles from bower dependencies and stores them in a dedicated distribution folder
  bowerStyles: {
  //  dest: 'dist/css/' // destination of the concat file `vendor.css` (and associated sourcemaps file)
  },

  /***** Processing of User Space *****/

  //// task [`statics`] collects all "static" files and stores them in a dedicated distribution folder
  statics: {
  //  src: ['app/.htaccess', 'app/favicon.ico', 'app/robots.txt'], // glob that points to all static files
  //  dest: 'dist/' // destination of the static files
  },

  //// task [`images`] collects, flattens and minifies graphics
  images: {
  //  src: 'app/components/**/*.{png,jpg,jpeg,gif,svg,ico}', // glob that points to all images
  //  dest: 'dist/images/' // destination of the image files
  },

  //// task [`fonts`] collects fonts and stores them in a dedicated distribution folder
  fonts: {
  //  src: 'app/fonts/**/*.{otf,eot,svg,ttf,woff}', // glob that points to all fonts
  //  dest: 'dist/fonts/' // destination of the font files
  },

  //// task [`scripts`] collects scripts, runs several transformations and concatenates everything
  scripts: {
    src: ['app/app.js', 'app/components/**/*.js', '!app/components/**/*.spec.js', '!app/components/**/*.mock.js', 'app/components/testing/*'], // glob that points to all scripts (except tests)
    dest: 'dist/js/', // destination of the concat file `scripts.js` (and associated sourcemaps file)
    ng2html: { // adds ng2html and saves all html partials right into the AngularJS $templateCache
      src: 'app/components/**/*.html', // glob that points to all partials
      prefix: 'components/', // prefix of the URL path
      name: 'angularSeed.templates' // the module name that contains the partials
    },
    ngConstant: { // adds ngConstant to dynamically add variables to your AngularJS app
      constants: ngConstant, // the object that contains the variables
      name: 'angularSeed.config' // the module name that contains the variables
    }
  },

  //// task [`styles`] collects styles (.scss), runs several transformations and concatenates everything
  styles: {
  //  src: 'app/style.scss', // root SCSS file (imports are inside)
  //  files: 'app/**/*.scss', // all SCSS files that have to be watched for changes
  //  dest: 'dist/css/' // destination of the concat file `style.css` (and associated sourcemaps file)
  },

  /***** Serving *****/

  //// [`serve`] registers tasks `browserSync` to serve the app and `watch` to reload the app on detected file changes
  serve: {
  //  root: 'dist/', // the root of the local server
  //  port: 3000, // the port of the local server
  //  proxy: undefined, // host of locally served app that should be proxied to allow livereload
  //  watch: true // deactivates watches and automatic browser reloading
  },

  /***** Deployment *****/

  //// task [`gitDeploy`] deploys to a specific branch in your git repository
  //gitDeploy: {
  //  src: 'dist/', // the local root of the deploy repo
  //  branch: undefined // specifies git repository branch to deploy to
  //},

  //// task [`mavenInstall`] allows to install maven packages locally
  mavenInstall: {
    //src: '.', // root of the maven package
    config: mavenConfig // the maven package config
  },

  //// task [`mavenDeploy`] allows to add maven packages to a remote server
  mavenDeploy: {
    //src: '.', // root of the maven package
    config: mavenConfig, // the maven package config
    repo: nexusRepos // the remove maven package repository
  },

  /***** Testing *****/

  //// task [`jshint`] lints code with respect to your `.jshintrc` files
  jshint: {
    src: 'app/components/**/*.js' // glob specifying what to lint
  },

  karma: {
    src: __dirname + '/karma.conf.js',
    browsers: ['PhantomJS'] // 'Firefox', 'Chrome'
  }
};

export default config
