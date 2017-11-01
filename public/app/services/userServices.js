angular.module('userServices',[])
.factory('User', function ($http) {
    userFactory= {};
    // call to custom function name "User.create(regData)" in userCtrl.js
    userFactory.create = function (regData) {
        return $http.post('/api/users',regData);
    };
    return userFactory;
});