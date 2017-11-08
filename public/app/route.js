var app = angular.module('appRoutes', ['ngRoute'])
.config(function ($routeProvider, $locationProvider) {
    $routeProvider
        .when('/', {
            templateUrl: '/app/views/pages/home.html'
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
        .when('/about', {
            templateUrl: '/app/views/pages/about.html'
        })
        .when('/profile', {
            templateUrl: '/app/views/pages/user/profile.html',
            authenticated: true
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
        .otherwise({redirectTo: '/'});
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    })
});

app.run(['$rootScope', 'Auth', '$location', function ($rootScope, Auth, $location) {
    $rootScope.$on('$routeChangeStart', function (event, next, current) {
        if(next.$$route.authenticated == true){
            if(!Auth.isLoggedIn()){
                event.preventDefault();
                $location.path('/');
            }
        } else if(next.$$route.authenticated == false){
            if(Auth.isLoggedIn()){
                event.preventDefault();
                $location.path('/');
            }
        }
    })
}]);