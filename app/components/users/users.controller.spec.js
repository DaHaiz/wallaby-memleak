// start with Prefix:
describe('Controller usersController:', function () {
  let vm, $rootScope, lodash, $scope, $q, $mdDialog, $timeout, UsersService, LoggerService;

  const mockUsers = [
    {
      id: 1,
      name: 'John Doe',
      isAdmin: false,
    },
    {
      id: 2,
      name: 'Simon Hilz',
      isAdmin: false,
    },
  ];

  beforeEach(() => {
    module('angularSeed');
  });

  // inject dependencies
  beforeEach(inject(function (_$rootScope_, _$mdDialog_, $controller, _lodash_, _$timeout_, _$q_, _UsersService_, _LoggerService_) {
    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();
    UsersService = _UsersService_;
    lodash = _lodash_;
    $q = _$q_;
    $mdDialog = _$mdDialog_;
    LoggerService = _LoggerService_;
    // $timeout = jasmine.createSpy('$timeout');
    $timeout = _$timeout_;

    vm = $controller('UsersController', { $scope, $timeout });
    $scope.vm = vm;
  }));

  // setup spies
  beforeEach(() => {
    spyOn(UsersService, 'findAll');
    spyOn(UsersService, 'update');

    spyOn($mdDialog, 'show');

    spyOn(LoggerService, 'success');
    spyOn(LoggerService, 'error');
  });

  // test initial state
  describe('on initialization:', () => {
    // at first check for properties
    describe('property', () => {

      describe('${vm.users}', () => {
        it('should exist', () => {
          expect(vm.users).toBeDefined();
        });
        it ('should default to empty array', () => {
          expect(vm.users).toEqual([]);
        })
      });

    });

    // second check for angular interface methods that should be there
    describe('angular interface method', () => {
      // $ functions should be first, order: $postLink, $onInit, $onChanges (if applicable)
      describe('vm.$onInit()', () => {
        it('should be a function', () => {
          expect(vm.$onInit).toEqual(jasmine.any(Function));
        });
      });
    });

    // third check for other methods the tested service/controller exposes
    describe('app method', () => {
      describe('vm.editUser()', () => {
        it('should be a function', () => {
          expect(vm.editUser).toEqual(jasmine.any(Function));
        })
      });

      describe('vm.triggerLongRunning()', () => {
        it('should be a function', () => {
          expect(vm.triggerLongRunning).toEqual(jasmine.any(Function));
        })
      });

      describe('vm.notYetImplemented()', () => {
        it('should be a function', () => {
          expect(vm.notYetImplemented).toEqual(jasmine.any(Function));
        })
      });
    });

    describe('vm.onInit()', () => {
      it('should load all users', () => {
        // arrange
        UsersService.findAll.and.returnValue($q.resolve(mockUsers));

        // act
        vm.$onInit();
        $scope.$digest();

        // assert
        expect(UsersService.findAll).toHaveBeenCalled();
        expect(vm.users).toEqual(mockUsers);
      })
    });
  });

  describe('after initialization:', () => {

    beforeEach(function () {
      UsersService.findAll.and.returnValue($q.resolve(mockUsers));
      vm.$onInit();
      $scope.$digest();
    });

    describe('watcher on', () => {
      describe('vm.isLongRunningActive', () => {
        it('should log the changes', () => {
          vm.isLongRunningActive = true;
          $scope.$digest();

          expect(LoggerService.success).toHaveBeenCalledWith('true => false');
        })
      })
    });

    describe('vm.editUser()', () => {
      // common mock data
      const mockUser = {
        id: 1,
        name: 'John Doe',
        isAdmin: false,
      };
      const mockUserChanged = {
        id: 1,
        name: 'John Doeee',
        isAdmin: false,
      };

      it('should show dialog with given user', () => {
        // arrange
        const expectedDialogOptions = {
          controller: 'olUserEditDialog',
          controllerAs: 'vm',
          bindToController: true,
          locals: {
            user: mockUser,
          },
          templateUrl: 'components/users/userEditDialog/userEditDialog.html',
        };
        $mdDialog.show.and.returnValue($q.resolve(mockUserChanged));

        // act
        vm.editUser(mockUser);
        $scope.$digest();

        // assert
        expect($mdDialog.show).toHaveBeenCalledWith(expectedDialogOptions);
      });

      it('should update the user after dialog is resolved', () => {
        // arrange
        $mdDialog.show.and.returnValue($q.resolve(mockUserChanged));

        // act
        vm.editUser(mockUser);
        $scope.$digest();

        // assert
        expect(UsersService.update).toHaveBeenCalledWith(mockUserChanged);
        expect(LoggerService.success).toHaveBeenCalled()
      });

      it('should log error if dialog is cancelled and dont update', () => {
        // arrange
        $mdDialog.show.and.returnValue($q.reject());

        // act
        vm.editUser(mockUser);
        $scope.$digest();

        // assert
        expect(UsersService.update).not.toHaveBeenCalledWith(mockUserChanged);
        expect(LoggerService.error).toHaveBeenCalled()
      });
    });

    describe('vm.triggerLongRunning()', () => {
      it('should not initialize long running task if already in progress', () => {
        // arrange
        vm.isLongRunningActive = true;

        // act
        const result = vm.triggerLongRunning();

        // assert
        expect(result).toBe(false);
      });

      it('should initialize long running task', () => {
        // act
        vm.triggerLongRunning();

        // assert
        expect(vm.isLongRunningActive).toBe(true);
      });

      it('should finish long running task correctly', () => {
        // arrange
        vm.triggerLongRunning();
        $timeout.flush();

        // assert
        expect(LoggerService.success).toHaveBeenCalled();
        expect(vm.isLongRunningActive).toBe(false);
      })
    });

    // alternative implementation
    xdescribe('vm.triggerLongRunning()', () => {
      it('should not initialize long running task if already in progress', () => {
        // arrange
        vm.isLongRunningActive = true;

        // act
        vm.triggerLongRunning();

        // assert
        expect($timeout).not.toHaveBeenCalledWith(jasmine.any(Function));
      });

      it('should initialize long running task', () => {
        // act
        vm.triggerLongRunning();

        // assert
        expect(vm.isLongRunningActive).toBe(true);
        expect($timeout).toHaveBeenCalledWith(jasmine.any(Function));
      });

      it('should finish long running task correctly', () => {
        // arrange
        vm.triggerLongRunning();
        const longRunningTask = $timeout.calls.first().args[0];

        // act
        longRunningTask();

        // assert
        expect(LoggerService.success).toHaveBeenCalled();
        expect(vm.isLongRunningActive).toBe(false);
      })
    })

    describe('vm.notYetImplemented()', () => {
      it('should throw an error on call', () => {
        // assert
        expect(vm.notYetImplemented).toThrow(new Error('not implemented'));
      });
    });
  })
});
