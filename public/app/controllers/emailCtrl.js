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