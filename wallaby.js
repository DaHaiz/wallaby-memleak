var babel = require('babel-core');

module.exports = function(wallaby) {
  return {

    testFramework: 'jasmine@2.5.2',
    files: [
			{pattern: 'dist/js/vendor.js', instrument: false},
			{pattern: 'app/bower_components/angular-mocks/angular-mocks.js', instrument: false},
			{pattern: 'dist/js/scripts.js', instrument: false},
      'app/app.js',
      'app/components/**/*.js',
      '!app/**/*.spec.js'
    ],
    tests: [
      'app/components/**/*.spec.js'
    ],
    preprocessors: {
      'app/components/**/*.js': file => babel
        .transform(file.content, {sourceMap: true, filename: file.path})
    }
  };
};
