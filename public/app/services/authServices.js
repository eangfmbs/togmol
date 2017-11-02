angular.module('authServices',[])
    .factory('Auth', function ($http, AuthToken) {
        var mytoken;
        var authFactory = {};
        authFactory.login = function (loginData) {
            return $http.post('/api/authenticate', loginData).then(function (data) {
                AuthToken.setToken(data.data.token);
                mytoken=data.data.token;
                return data;
            })
        };

        //custom function to tell that is user login?? by calling this function use Auth.isLogin
        authFactory.isLoggedIn = function () {
            if(AuthToken.getToken()){
                return true;
            } else {
                return false;
            }
        };
        
        //get info about decrypt token from user
        authFactory.getUserInfo = function () {
            if(AuthToken.getToken()){
                return $http.post('/api/me');
            } else {
                $q.reject({message: 'User has no token'}); //.reject is angular stuff
            }
        }

        //make user logout by calling Auth.isLogout
        authFactory.isLogout = function () {
            AuthToken.setToken();
        }
        return authFactory;
    })
    //create factory custom function to set token to the browser
    .factory('AuthToken', function ($window) {
        var authTokenFactory = {};
        authTokenFactory.setToken = function (token) {
            if(token){
                $window.localStorage.setItem('token', token); //this is an angular library to set token store in web browser
            }
            else {
                $window.localStorage.removeItem('token');
            }
        };

        authTokenFactory.getToken = function () {
            return $window.localStorage.getItem('token');
        };
        return authTokenFactory;
})
    //this factory is gonna make every request is attach with token in the header
.factory('AuthInterceptors', function (AuthToken) {
    var authInterceptorsFactory = {};
    authInterceptorsFactory.request = function (config) {
        var token = AuthToken.getToken();
        if(token){
            config.headers['x-access-token'] = token;
        }
        return config;
    }
    return authInterceptorsFactory;
})