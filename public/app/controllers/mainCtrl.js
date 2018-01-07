angular.module('mainControllers', ['authServices'])
.controller('mainCtrl', function (Auth,$timeout,$location,$scope,$rootScope,$interval,$window,User) {
    var app = this;
    app.busy = false;
    var allTalkData = [];
    var step = 2;
    var page = 0;
    var length = 0;
    app.loadingContent = false; //don't show html part of angular until it finish loading data
    //this will help preventing user to see any content that surrounding data of angular syntax like {{..}}

    // app.checkSession = function () {
    //     if(Auth.isLoggedIn()){
    //         app.checkingSession = true;
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
    // app.checkSession(); // call for check token/session when user refresh.

    // so this $routeProvider will check with any variable when user request to a new route to make sure
    //the data will be refresh from the same status;
    $rootScope.$on('$routeChangeStart', function () {
        // if(!app.checkingSession){
        //     app.checkSession(); //call to check for this when user change the route
        // }
        //check if the user have been login
        if(Auth.isLoggedIn()){
            app.isLoggedIn = true; //use to hide login tab when we are in login
            Auth.getUserInfo().then(function (data) {
                app.username = data.data.username;
                app.useremail = data.data.email;
                User.getPermission().then(function (data) {
                    if(data.data.permission === 'admin' || data.data.permission === 'moderator'){
                        app.authorized = true;
                        app.loadingContent = true;
                    } else {

                        app.loadingContent = true;
                    }
                })
                app.loadingContent = true;
            });
            // console.log("User is on login");
        } else {
            app.isLoggedIn = false;//use to show login tab when we are in login
            app.username = '';
            app.loadingContent = true;
        }
        if($location.hash()==='_=_') $location.hash(null);
    })

    this.facebook = function(){
      app.disabled = true;
      $window.location = $window.location.protocol+'//'+$window.location.host+'/auth/facebook';
    }

        //do function doLogin
    this.doLogin = function (loginData) {
        app.loading = true;
        app.errorMsg = false;
        app.successMsg = false;
        app.expired = false;
        app.disabled = false;
        Auth.login(this.loginData)
            .then(function (data) {
                if(data.data.success){
                    app.loading = false;
                    // app.checkSession(); //check for session start when user login. token or session just the same way
                    app.successMsg = data.data.message+' ... Redirecting to home page';
                    $timeout(function () {
                       // app.loginData = '';
                        $location.path('/home');
                    },10)
                } else {
                    if(data.data.expired){
                        app.disabled = true;
                        app.expired = true;
                        app.loading = false;
                        app.errorMsg = data.data.message;
                    } else {
                        app.loading = false;
                        app.errorMsg = data.data.message;
                    }
                }
            })
    };
    this.isLogout = function () {
        Auth.isLogout();
        $location.path('/logout');
        $timeout(function () {
            $location.path('/');
        },1)
    }

  //  pull all status to show on index.html

  User.getAllStatus().then(function(data){
    if(data.data.success){
      // length = data.data.status.length;
      // allTalkData = data.data.status;
      // app.nextPage = function(){
      //   if(app.busy){
      //     console.log("out of DAta1")
      //     return;
      //   }
      //   // app.busy = true;
      //   for(var i=0;i<length;i++){
          app.allStatus = data.data.status
      //     app.allStatus.push(allTalkData[i])
      //   }
      //   page++;
      //   app.busy = true;;
      // };

    } else {
      app.errorMsg = data.data.message;
    }
  })

  // app.nextPage = function(){
  //   if(!app.busy){
  //     return;
  //   }
  //   app.busy = true;
  //   app.allStatus = app.allTalkData.concat(app.allTalkData.splice(page*step, step))
  //   console.log('this is app. ', app.allStatus)
  //   page++;
  //   app.busy = false;
  //   if(length === 0){
  //     app.noMoreData = true;
  //     console.log("out of DAta")
  //   }
  // }

  // User.getTagsShowOnHomePage().then(function(data){
  //   if(data.data.success){
  //     app.tags = data.data.tags;
  //   } else {
  //     app.errorMsg = data.data.message;
  //   }
  // })

});
