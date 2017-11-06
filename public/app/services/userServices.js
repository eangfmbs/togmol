angular.module('userServices',[])
.factory('User', function ($http) {
    userFactory= {};
    // call to custom function name "User.create(regData)" in userCtrl.js this userFactory is called service
    userFactory.create = function (regData) {
        return $http.post('/api/users',regData);
    };
    //User.checkUsername(regData)
    userFactory.checkUsername = function (regData) {
        return $http.post('/api/checkusername', regData)
    };
    //User.checkEmail(regData)
    userFactory.checkEmail = function (regData) {
        return $http.post('/api/checkemail', regData)
    };
    //User.activateAccount(token)
    userFactory.activateAccount = function (token) {
        return $http.put('/api/activate/'+token)
    }
    return userFactory;
});