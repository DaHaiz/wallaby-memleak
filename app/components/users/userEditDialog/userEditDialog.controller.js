angular
  .module('angularSeed')
  .controller('UserEditDialog', UserEditDialog);

function UserEditDialog($mdDialog) {

  const vm = this;

  lodash.assign(vm, {
    okCallback,
    cancelCallback,
  });

  function okCallback() {
    $mdDialog.hide(vm.user);
  }

  function cancelCallback() {
    $mdDialog.cancel();
  }
}
