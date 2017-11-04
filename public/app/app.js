angular.module('userApp', ['appRoutes','userControllers','userServices','ngAnimate','mainControllers','authServices'])
    .config(function ($httpProvider) { //this will keep track all the route that has changed
        $httpProvider.interceptors.push('AuthInterceptors');
    })

