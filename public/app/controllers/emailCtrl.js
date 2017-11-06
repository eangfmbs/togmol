angular.module('emailController',['userServices'])
.controller('emailCtrl', function ($routeParams, User) {
    app = this;
    User.activateAccount($routeParams.token).then(function (data) {
        app.successMsg = false;
        app.errorMsg = false;

        if(data.data.success) {
            app.successMsg = data.data.message;
        } else {
            app.errorMsg = data.data.message;
        }
    })
});