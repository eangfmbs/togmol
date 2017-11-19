angular.module('userApp', ['appRoutes','statusController','managementController','userControllers','userServices','ngAnimate','mainControllers','authServices','emailController'])
    .config(function ($httpProvider) { //this will keep track all the route that has changed
        $httpProvider.interceptors.push('AuthInterceptors');
    })
