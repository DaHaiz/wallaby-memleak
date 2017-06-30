angular
  .module('angularSeed')
  .factory('UsersService', UsersService);

function UsersService($q, lodash) {

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
    {
      id: 3,
      name: 'Florian Stegmaier',
      isAdmin: false,
    },
    {
      id: 4,
      name: 'Adrian Berndl',
      isAdmin: true,
    }
  ];

  return {
    findAll,
    create,
    update,
    destroy
  };

  function findAll() {
    return $q.resolve(mockUsers);
  }

  function create(user) {
    user.id = mockUsers.length;
    mockUsers.push(user);
  }

  function update(user) {
    lodash.extend(lodash.find(mockUsers, ['id', user.id]), user);
  }

  function destroy(user) {
    lodash.remove(mockUsers, user);
  }
}
