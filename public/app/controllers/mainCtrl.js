angular.module('mainControllers', ['authServices'])
.controller('mainCtrl', function (Auth,$timeout,$location) {
    var appMsg = this;
    this.doLogin = function (loginData) {
        appMsg.loading = true;
        appMsg.errorMsg = false;
        appMsg.successMsg = false;
        Auth.login(this.loginData)
            .then(function (data) {
                if(data.data.success){
                    appMsg.loading = false;
                    appMsg.successMsg = data.data.message+' ... Redirecting to home page';
                    $timeout(function () {
                        $location.path('/about');
                    },2000)
                } else {
                    appMsg.loading = false;
                    appMsg.errorMsg = data.data.message;
                }
            })
    }
});
