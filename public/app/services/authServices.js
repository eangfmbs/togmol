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

        // Auth.facebook(token) //to save it in the client storage to keep user login
        authFactory.facebook = function(token){
          AuthToken.setToken(token);
        }

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

// factory utilities for reading the image file (using an HTML5 FileReader), and uploading it to the server (using my Auth factory)
.factory('ImageService', function ImageService() {
    return {
      readImageFile: function(file, cb){
        if(window.FileReader){
          if(file.size > 4000000){
            return cb('Error, photo exceeds max size limit.');
          }
          if(!file.type.match('image.*')){
           return cb('Error, file must be a photo.');
          }

          var reader = new FileReader();
          reader.onloadend = function (event) {
            if(event.target.error != null){
              return cb('Error, please try another photo.');
            }
            else {
              return cb(null,reader.result);
            }
          };
          reader.readAsDataURL(file);
        }
        else {
          return cb("Sorry, this browser doesn't support photo uploads.");
        }
      }
    };
  })

 //  .factory('Auth', function Auth($location, $rootScope, $http, User, $cookieStore, $q) {
 //    var currentUser = {};
 //    if($cookieStore.get('token')) {
 //      currentUser = User.get();
 //    }
 //
 //      /**
 //       * Update large profile photo
 //       */
 //       // we should include this function into the Auth function above**********
 //      updateProfilePhoto: function(photo, callback){
 //        var cb = callback || angular.noop;
 //
 //        return User.updateProfilePhoto({id : currentUser._id}, {
 //          photo: photo
 //        }, function(user) {
 //          currentUser = User.get();
 //          return cb(currentUser);
 //        }, function(err) {
 //          currentUser = User.get();
 //          return cb(err);
 //        }).$promise;
 //      }
 //    };
 //  })
 //
 //  .factory('User', function ($resource) {
 //    return $resource('/api/users/:id/:controller', {
 //      id: '@_id'
 //    },
 //    {
 //      get: {
 //        method: 'GET',
 //        params: {
 //          id:'me'
 //        }
 //      },
 //      updateProfilePhoto: {
 //        method: 'PUT',
 //          params: {
 //            controller: 'profilePhoto'
 //          }
 //      }
 //   });
 // })
