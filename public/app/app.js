angular.module('userApp', ['appRoutes','ui.select','ngAria','infinite-scroll','ngMaterial','720kb.socialshare','angular-web-notification','ngFileUpload','ngImgCrop','statusController','managementController','userControllers','userServices','ngAnimate','mainControllers','authServices','emailController'])
    .config(function ($httpProvider) { //this will keep track all the route that has changed
        $httpProvider.interceptors.push('AuthInterceptors');
    })

//test for meterial template of angular
// .controller('AppCtrl', function($scope) {
//   $scope.imagePath = 'img/washedout.png';
// })
// .config(function($mdThemingProvider) {
//   $mdThemingProvider.theme('dark-grey').backgroundPalette('grey').dark();
//   $mdThemingProvider.theme('dark-orange').backgroundPalette('orange').dark();
//   $mdThemingProvider.theme('dark-purple').backgroundPalette('deep-purple').dark();
//   $mdThemingProvider.theme('dark-blue').backgroundPalette('blue').dark();
// });
