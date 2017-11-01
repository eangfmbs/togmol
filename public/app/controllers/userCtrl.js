angular.module('userControllers',['userServices'])
.controller('regCtrl',function($http,User,$location,$timeout) {
    var appMsg = this;
    this.regUser = function (regData) {
        appMsg.loading = true;
        appMsg.errorMsg = false;
        appMsg.successMsg = false;
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
});