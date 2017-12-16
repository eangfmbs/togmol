angular.module('userControllers',['userServices'])
.controller('facebookCtrl', function($routeParams, Auth, $location, $window){
  var appMsg = this;
  appMsg.errorMsg = false;
  appMsg.expired = false;
  appMsg.disabled = true;
  if($window.location.pathname == '/facebookerror'){
    appMsg.errorMsg = 'Facebook email is not found in database';
  } else if($window.location.pathname == '/facebook/inactivate/error') {
    appMsg.expired = true;
    appMsg.errorMsg = 'Account is not activated yet please go to your email to activate the account first';
  }
  else {
    Auth.facebook($routeParams.token);
    $location.path('/');
  }
})
.controller('regCtrl',function($http,User,$location,$timeout) {
    var appMsg = this;
    this.regUser = function (regData, valid) {
        appMsg.loading = true;
        appMsg.errorMsg = false;
        appMsg.successMsg = false;
        if(valid){
          User.create(this.regData)
              .then(function (data) {
                  if(data.data.success){
                      appMsg.loading = false;
                      appMsg.successMsg = data.data.message+' ... Redirecting to login page';
                      console.log('showdata', data)
                      $timeout(function () {
                          $location.path('/');
                      },50)
                  } else {
                      appMsg.loading = false;
                      appMsg.errorMsg = data.data.message;
                  }
              })
        }
        else{
          appMsg.loading = false;
          appMsg.errorMsg = "Please make sure the form is properly filled";
        }
    };

    this.checkForUsername = function (regData) {
        appMsg.checkingUsername = true;
        appMsg.usernameMsg = false;
        appMsg.usernameInvalid = false;
        User.checkUsername(appMsg.regData).then(function (data) {
            if(data.data.success){
                appMsg.checkingUsername =false;
                appMsg.usernameInvalid = false;
                appMsg.usernameMsg = data.data.message;
            } else {
                appMsg.checkingUsername = true;
                appMsg.usernameInvalid = true;
                appMsg.usernameMsg = data.data.message;
            }
        })
    };

    this.checkForEmail = function (regData) {
        appMsg.checkingEmail = true;
        appMsg.emailMsg = false;
        appMsg.emailInvalid = false;
        User.checkEmail(appMsg.regData).then(function (data) {
            if(data.data.success){
                appMsg.checkingEmail =false;
                appMsg.emailInvalid = false;
                appMsg.emailMsg = data.data.message;
            } else {
                appMsg.checkingEamil = true;
                appMsg.emailInvalid = true;
                appMsg.emailMsg = data.data.message;
            }
        })
    }


})
    .directive('match',function () {
        return {
            restrict: 'A',
            controller: function ($scope) {
                $scope.confirmed = false;
                $scope.doConfirm = function (value) {
                    value.forEach(function (ele) {
                        if($scope.confirmMainPassword == ele){
                            $scope.confirmed = true;
                        } else {
                            $scope.confirmed = false;
                        }
                    })
                }
            },
            link: function (scope, element, attrs) {
                attrs.$observe('match', function () { //match is call attribute
                    scope.matches = JSON.parse(attrs.match);
                    scope.doConfirm(scope.matches);
                });
                scope.$watch('confirmMainPassword', function () {
                    scope.matches = JSON.parse(attrs.match);
                    scope.doConfirm(scope.matches);
                })
            }
        }
    })
