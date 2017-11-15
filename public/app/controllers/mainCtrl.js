angular.module('mainControllers', ['authServices'])
.controller('mainCtrl', function (Auth,$timeout,$location,$rootScope,$interval,$window,User) {
    var appMsg = this;
    appMsg.loadingContent = false; //don't show html part of angular until it finish loading data
    //this will help preventing user to see any content that surrounding data of angular syntax like {{..}}

    // appMsg.checkSession = function () {
    //     if(Auth.isLoggedIn()){
    //         appMsg.checkingSession = true;
    //         var interval = $interval(function () {
    //             var token = $window.localStorage.getItem('token');
    //                 if(token === null){
    //                     $interval.cancel(interval)
    //                 } else {
    //                     //grab that token and convert into timestamp so we can dertermine how much time user less. so after we convert we cancompare to local time
    //                     self.parseJwt = function (token) {
    //                         var base64Url = token.split('.')[1];
    //                         var base64 = base64 = base64Url.replace('-', '+').replace('_','/');
    //                         return jSON.parse($window.atob(base64));
    //                     }
    //                     var expireTime = self.parseJwt(token);
    //                     var timeStamp = Math.floor(Date.now()/1000);
    //                     console.log(expireTime.exp);
    //                     console.log(timeStamp);
    //                     var timeCheck = expireTime.exp - timeStamp
    //                     console.log('timecheck: '+timeCheck);
    //                     if(timeCheck <= 0) {
    //                         console.log('token has expired!');
    //                         $interval.cancel(interval);
    //                     } else {
    //                         console.log('token are active!')
    //                     }
    //                 }
    //         },1000)
    //     }
    // };
    //
    // appMsg.checkSession(); // call for check token/session when user refresh.

    // so this $routeProvider will check with any variable when user request to a new route to make sure
    //the data will be refresh from the same status;
    $rootScope.$on('$routeChangeStart', function () {
        // if(!appMsg.checkingSession){
        //     appMsg.checkSession(); //call to check for this when user change the route
        // }

        //check if the user have been login
        if(Auth.isLoggedIn()){
            appMsg.isLoggedIn = true; //use to hide login tab when we are in login
            Auth.getUserInfo().then(function (data) {
                appMsg.username = data.data.username;
                appMsg.useremail = data.data.email;
                User.getPermission().then(function (data) {
                    if(data.data.permission === 'admin' || data.data.permission === 'moderator'){
                        appMsg.authorized = true;
                        appMsg.loadingContent = true;
                    } else {

                        appMsg.loadingContent = true;
                    }
                })
                appMsg.loadingContent = true;
            });
            // console.log("User is on login");
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
        appMsg.expired = false;
        appMsg.disabled = false;
        Auth.login(this.loginData)
            .then(function (data) {
                if(data.data.success){
                    appMsg.loading = false;
                    // appMsg.checkSession(); //check for session start when user login. token or session just the same way
                    appMsg.successMsg = data.data.message+' ... Redirecting to home page';
                    $timeout(function () {
                       // appMsg.loginData = '';
                        $location.path('/home');
                    },10)
                } else {
                    if(data.data.expired){
                        appMsg.disabled = true;
                        appMsg.expired = true;
                        appMsg.loading = false;
                        appMsg.errorMsg = data.data.message;
                    } else {
                        appMsg.loading = false;
                        appMsg.errorMsg = data.data.message;
                    }
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
