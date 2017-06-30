angular
  .module('angularSeed')
  .config(statesConfiguration);

function statesConfiguration($stateProvider, $locationProvider, $urlRouterProvider) {
  $stateProvider
    .state('404', {
      url: '/404',
      views: {
        site: {
          templateUrl: 'components/404/404.html',
          controller: angular.noop
        }
      }
    })
    .state('app', {
      url: '/',
      views: {
        site: {
          templateUrl: 'components/app/app.html',
          controller: angular.noop
        }
      }
    });

  $urlRouterProvider.otherwise(function($injector, $location) {

    // requesting unknown page unequal to '/'
    const path = $location.path();
    if (path !== '/') {
      return '/404';
    }

    return '/';
  });

  $locationProvider
    .html5Mode(true)
    .hashPrefix('!');
}
