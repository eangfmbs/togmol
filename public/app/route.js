var app = angular.module('appRoutes', ['ngRoute'])
.config(function ($routeProvider, $locationProvider) {
    $routeProvider
        .when('/', {
            templateUrl: '/app/views/pages/home.html',
            controller: 'mainCtrl',
            controllerAs: 'main'
        })

        .when('/register', {
            templateUrl: '/app/views/pages/user/register.html',
            controller: 'regCtrl',
            controllerAs: 'register',
            authenticated: false //people that already login cannot access this page
        })
        .when('/login', {
            templateUrl: '/app/views/pages/user/login.html',
            authenticated: false
        })
        .when('/logout', {
            templateUrl: '/app/views/pages/user/logout.html',
            authenticated: true
        })
        .when('/profile', {
            templateUrl: '/app/views/pages/profile.html',
            controller: 'profileCtrl',
            controllerAs: 'profile',
            authenticated: true
        })
        .when('/facebook/:token', {
            templateUrl: '/app/views/pages/user/social/social.html',
            controller: 'facebookCtrl',
            controllerAs: 'facebook',
            authenticated: false
        })
        .when('/facebookerror', {
            templateUrl: '/app/view/pages/user/login.html',
            controller: 'facebookCtrl',
            controllerAs: 'facebook',
            authenticated: false
        })
        .when('/facebook/inactivate/error', {
            templateUrl: '/app/view/pages/user/login.html',
            controller: 'facebookCtrl',
            controllerAs: 'facebook',
            authenticated: false
        })
        .when('/activate/:token', {
            templateUrl: '/app/views/pages/user/activation/activate.html',
            controller: 'emailCtrl',
            controllerAs: 'email'
        })
        .when('/resend', {
            templateUrl: '/app/views/pages/user/activation/resend.html',
            controller: 'resendCtrl',
            controllerAs: 'resend',
            authenticated: false
        })
        .when('/forgetusername', {
            templateUrl: '/app/views/pages/user/reset/username.html',
            controller: 'usernameCtrl',
            controllerAs: 'username',
            authenticated: false
        })
        .when('/forgetpassword', {
            templateUrl: '/app/views/pages/user/reset/forgetpassword.html',
            controller: 'passwordCtrl',
            controllerAs: 'password',
            authenticated: false,
        })
        .when('/resetpassword/:token', {
            templateUrl: '/app/views/pages/user/reset/resetpassword.html',
            controller: 'resetPasswordCtrl',
            controllerAs: 'reset',
            authenticated: false
        })
        .when('/management', {
            templateUrl: '/app/views/pages/management/management.html',
            controller: 'managementCtrl',
            controllerAs: 'manage',
            authenticated: true,
            permission: ['admin','moderator']
        })
        .when('/editmag/:id', {
          templateUrl: '/app/views/pages/management/editmag.html',
          controller: 'editManagementCtrl',
          controllerAs: 'edit',
          authenticated: true,
          permission: ['admin','moderator']
        })
        .when('/managetag',{
          templateUrl: '/app/views/pages/management/managetag.html',
          controller: 'tagCtrl',
          controllerAs: 'tag',
          authenticated: true,
          permission: ['admin','moderator']
        })
        .when('/sharequestion',{
          templateUrl: '/app/views/pages/sharequestion.html',
          controller: 'askCtrl',
          controllerAs: 'ask',
          authenticated: true
        })
        .when('/talk/:id', {
          templateUrl: '/app/views/pages/talk.html',
          controller: 'talkCtrl',
          controllerAs: 'talk',
          authenticated: true
        })
        .when('/updatetalk/:id', {
            templateUrl: '/app/views/pages/updatetalk.html',
            controller: 'updateTalkCtrl',
            controllerAs: 'update',
            authenticated: true
        })
        .otherwise({redirectTo: '/'});
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    })
});

// add some code to check the role on each route

app.run(['$rootScope', 'Auth', '$location', 'User', function ($rootScope, Auth, $location, User) {
    $rootScope.$on('$routeChangeStart', function (event, next, current) {
        if(next.$$route.authenticated == true){
            if(!Auth.isLoggedIn()){
                event.preventDefault();
                $location.path('/');
            } else if(next.$$route.permission){
                //create an endpoint to get the user permission
                User.getPermission().then(function (data) {
                    if(next.$$route.permission[0] !== data.data.permission){
                        if(next.$$route.permission[1] !== data.data.permission){
                            event.preventDefault();
                            $location.path('/');
                        }
                    }
                })
            }
        } else if(next.$$route.authenticated == false){
            if(Auth.isLoggedIn()){
                event.preventDefault();
                $location.path('/');
            }
        }
    })
}]);
