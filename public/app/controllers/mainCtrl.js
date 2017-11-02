angular.module('mainControllers', ['authServices'])
.controller('mainCtrl', function (Auth,$timeout,$location,$rootScope) {
    var appMsg = this;
    appMsg.loadingContent = false; //don't show html part of angular until it finish loading data
    //this will help preventing user to see any content that surrounding data of angular syntax like {{..}}

    // so this $routeProvider will check with any variable when user request to a new route to make sure
    //the data will be refresh from the same status;
    $rootScope.$on('$routeChangeStart', function () {
        //check if the user have been login
        if(Auth.isLoggedIn()){
            appMsg.isLoggedIn = true; //use to hide login tab when we are in login
            Auth.getUserInfo().then(function (data) {
                appMsg.username = data.data.username;
                appMsg.useremail = data.data.email;
                appMsg.loadingContent = true;
            });
            console.log("User is on login");
        } else {
            appMsg.isLoggedIn = false;//use to show login tab when we are in login
            appMsg.username = '';
            appMsg.loadingContent = true;
        }
    })

        //do function doLogin
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
                       // appMsg.loginData = '';
                        $location.path('/home');
                    },10)
                } else {
                    appMsg.loading = false;
                    appMsg.errorMsg = data.data.message;
                }
            })
    };
    this.isLogout = function () {
        Auth.isLogout();
        $location.path('/logout');
        $timeout(function () {
            $location.path('/');
        },10)
    }
});
