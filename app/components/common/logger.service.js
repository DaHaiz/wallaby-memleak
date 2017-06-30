angular
  .module('angularSeed')
  .factory('LoggerService', LoggerService);

function LoggerService() {

  return {
    success,
    error,
  };

  function success(message) {
    console.log(message);
  }

  function error(message) {
    console.error(message);
  }
}
