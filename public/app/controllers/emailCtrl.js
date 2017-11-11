angular.module('emailController',['userServices'])
.controller('emailCtrl', function ($routeParams, $location, $timeout, User) {
    app = this;
    User.activateAccount($routeParams.token).then(function (data) {
        app.successMsg = false;
        app.errorMsg = false;

        if(data.data.success) {
            app.successMsg = data.data.message;
            $timeout(function () {
                $location.path('/login')
            },3000)
        } else {
            app.errorMsg = data.data.message;
            $timeout(function () {
                $location.path('/login')
            },3000)
        }
    })
})
.controller('resendCtrl', function (User) {
    var app = this;
    app.doResend = function (resendData) {
        app.errorMsg = false;
        app.successMsg = false;
        app.disabled = true;
        User.resendActivateCredential(app.resendData).then(function (data) {
            if(data.data.success){
                User.resendLink4ActivationCredentialAgain(app.resendData).then(function (data) {
                    if(data.data.success){
                        app.successMsg = data.data.message;
                    }
                })
            } else {
                app.disabled = false;
                app.errorMsg = data.data.message;
            }
        })
    }
})
.controller('usernameCtrl', function (User) {
    var app = this;
    app.successMsg = false;
    app.errorMsg = false;
    app.disabled = false;
    app.loading = true;
    // appMsg.emailInvalid = false;
    app.getUsername = function (emailData, valid) {
        if(valid){
            User.forgetUsername(app.emailData.email).then(function (data) {
                if(data.data.success){
                    app.disabled = true;
                    app.errorMsg = false;
                    app.loading = false;
                    // appMsg.emailInvalid = false;
                    app.successMsg = data.data.message;
                } else {
                    // appMsg.errorMsg = true;
                    app.loading = false;
                    // appMsg.emailInvalid = true;
                    app.errorMsg = data.data.message;
                }
            })
        } else {
            app.loading = false;
            app.errorMsg = "Please make sure you are input properly email"
        }

    }
})
.controller('passwordCtrl', function (User) {
    var app = this;
    app.successMsg = false;
    app.errorMsg = false;
    app.disabled = false;
    app.loading = true;
    app.reqPassword = function (resetData, valid) {

        if(valid){
            User.forgetPassword(app.resetData).then(function (data) {
                if(data.data.success){
                    app.disabled = true;
                    app.errorMsg = false;
                    app.loading = false;
                    // appMsg.emailInvalid = false;
                    app.successMsg = data.data.message;
                } else {
                    // appMsg.errorMsg = true;
                    app.loading = false;
                    // appMsg.emailInvalid = true;
                    app.errorMsg = data.data.message;
                }
            })
        } else {
            app.loading = false;
            app.errorMsg = "Please make sure you are input properly email"
        }
    }
})
.controller('resetPasswordCtrl', function ($routeParams, User, $scope) {
    var app = this;
    app.hideFormIfExpired = true;
    User.resetNewPassword($routeParams.token).then(function (data) {
        if(data.data.success){
            app.hideFormIfExpired = false;
            app.successMsg = "Please enter your new password!";
            $scope.username = data.data.user.username;
        } else {
            app.errorMsg = data.data.message;
        }
        
    })

    app.resetPassword = function (passwordData, valid, confirmed) {
        app.successMsg = false;
        app.errorMsg = false;
        app.passwordData.username = $scope.username;
        if(valid && confirmed){
            User.savePassword(app.passwordData).then(function (data) {
                if(data.data.success){
                    app.successMsg = data.data.message;
                } else {
                    app.errorMsg = data.data.message;
                }
            })
        } else {
            app.errorMsg = "Please make sure your passwords are enter properly"
        }

    }
})