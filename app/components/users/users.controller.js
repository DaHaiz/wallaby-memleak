angular
  .module('angularSeed')
  .controller('UsersController', UsersController);

function UsersController($scope, $mdDialog, $timeout, lodash, UsersService, LoggerService) {

  const vm = this;

  lodash.assign(vm, {
    $onInit,
    editUser,
    triggerLongRunning,
    notYetImplemented,
    users: [],
    isLongRunningActive: false,
  });

  function $onInit() {
    fetchUsers();
    $scope.$watch('vm.isLongRunningActive', isLongRunningActiveUpdated);
  }

  function isLongRunningActiveUpdated(newVal, oldVal) {
    if (newVal === oldVal) {
      return;
    }
    LoggerService.success(`${newVal} => ${oldVal}`);
  }

  function fetchUsers() {
    UsersService.findAll().then(users => vm.users = users);
  }

  function editUser(user) {
    $mdDialog.show({
      controller: 'olUserEditDialog',
      controllerAs: 'vm',
      bindToController: true,
      locals: {
        user: user,
      },
      templateUrl: 'components/users/userEditDialog/userEditDialog.html',
    }).then(changedUser => {
      UsersService.update(changedUser);
      LoggerService.success('user saved');
    }, () => {
      LoggerService.error('cancelled editing');
    });
  }

  function triggerLongRunning() {
    if (vm.isLongRunningActive) {
      return false;
    }

    vm.isLongRunningActive = true;
    $timeout(() => {
      // do some calculation stuff
      LoggerService.success('did the job');
      vm.isLongRunningActive = false;
    });

    return true;
  }

  function notYetImplemented() {
    throw new Error('not implemented');
  }
}
