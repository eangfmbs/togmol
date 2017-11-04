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
            authenticated: false
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
        .when('/profile',{
            templateUrl: '/app/views/pages/user/profile.html'
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