angular.module('userApp', ['appRoutes','userControllers','userServices','ngAnimate','mainControllers','authServices'])
    .config(function ($httpProvider) {
        $httpProvider.interceptors.push('AuthInterceptors');
    })

