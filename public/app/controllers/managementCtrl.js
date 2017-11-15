angular.module('managementController', [])
.controller('managementCtrl', function (User, $scope) {
     //when the page first load we gonna play with two variable especially is "this" remember when we use 4
    // the console.log all when we tested it. 'this' will allow us tu use variable on the front page of the management.html
     var app = this;
     app.loading = true;
     app.accessDenied = true; //hide everything until we check that the person is had permission
     app.errorMsg = false;
     app.editAccess = false;
     app.deleteAccess = false;
     app.limit = 20;
     User.getAllUsers4Management().then(function (data) {
          if(data.data.success){
               if(data.data.permission === 'admin'  || data.data.permission === 'moderator'){
                    app.loading = false;
                    app.accessDenied = false; //allow the accessDenied to show content
                    app.users = data.data.users;
                    if(data.data.permission === 'admin'){
                        app.editAccess = true;
                        app.deleteAccess = true;
                    } else if(data.data.permission === 'moderator'){
                         app.editAccess = true;
                    }
               } else {
                   app.loading = false;
                   app.errorMsg = "You do not have permission to access this management controller!"
               }
          } else {
              app.errorMsg = true;
              app.loading = false;
              app.errorMsg = data.data.message;
          }
     })
    
    app.showMoreRecord = function (number) {
          app.showRecordError = false;
          if(number>0){
              app.limit = number;
          } else {
               app.showRecordError = "Please enter a valid number";
          }
    }
    
    app.showAllRecord = function () {
        app.limit = undefined;
        app.showRecordError = false;
        $scope.number = undefined; //$scope let us pass a value in diff function in angular code
    }
});