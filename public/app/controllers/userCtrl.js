angular.module('userControllers',['userServices'])
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
                      appMsg.successMsg = data.data.message+' ... Redirecting to home page';
                      $timeout(function () {
                          $location.path('/');
                      },500)
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

});
