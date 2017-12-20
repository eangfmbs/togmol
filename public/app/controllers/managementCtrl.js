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
     function getUserForReload(){
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
     }

     getUserForReload();

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

    app.deleteUserInManagementg = function(username){
      User.deleteUserInManagement(username).then(function(data){
        if(data.data.success){
          getUserForReload();
        } else {
          app.showRecordError = data.data.message;
        }
      })
    }
})

.controller('editManagementCtrl', function(User, $location, $scope, $routeParams, $timeout){
  var app = this;
  app.phase1 = true;
  $scope.usernameTab = 'active';

  User.getOneUserInDB($routeParams.id).then(function(data){
    if(data.data.success){
      $scope.newUsername = data.data.user.username; //$scope.newUsername the newUsername is the ng-model in editmag file
      $scope.newEmail = data.data.user.email;
      $scope.newPermission = data.data.user.permission;
      $scope.currentUseID = data.data.user._id; //use in the edit management function
    } else {
      app.errorMsg = data.data.message;
    }
  })

  app.usernamePhase = function(){
    app.errorMsg = false;
    $scope.usernameTab = 'active';
    $scope.emailTab = 'default';
    $scope.permissionTab = 'default';
    app.phase1 = true;
    app.phase2 = false;
    app.phase3 = false;

  }

  app.emailPhase = function(){
    app.errorMsg = false;
    $scope.usernameTab = 'default';
    $scope.emailTab = 'active';
    $scope.permissionTab = 'default';
    app.phase1 = false;
    app.phase2 = true;
    app.phase3 = false;

  }

  app.permissionPhase = function(){
    app.errorMsg = false;
    $scope.usernameTab = 'default';
    $scope.emailTab = 'default';
    $scope.permissionTab = 'active';
    app.phase1 = false;
    app.phase2 = false;
    app.phase3 = true;
    app.disableUser = false;
    app.disableModerator = false;
    app.disableAdmin = false;
    if($scope.newPermission === 'user'){
      app.disableUser = true;
    }
    if($scope.newPermission === 'moderator'){
      app.disableModerator = true;
    }
    if($scope.newPermission === 'admin'){
      app.disableAdmin = true;
    }

  }

app.updateUsername = function(newUsername, valid){
  app.errorMsg = false;
  app.disable = true;
  var userObject = {};
  if(valid){
    userObject.username = $scope.newUsername;
    userObject._id = $scope.currentUseID;
    console.log('This your object:',userObject)

    User.editManagement(userObject).then(function(data){
      console.log('This your data:',newUsername)
      if(data.data.success){
        app.successMsg = data.data.message;
        $timeout(function(){
          // app.usernameForm.username.$setPristine();
          // app.usernameForm.username.$setUntouched();
          // app.disable = false;
          // app.successMsg = false;
          // all above we can use;
          $location.path('/management')
        },10)
      } else {
        app.errorMsg = data.data.message;
        app.disable = false;
      }
    })
  } else{
    app.disable = false;
    app.errorMsg = "Please make sure your username is enter properly"
  }
};

app.updateEmail = function(newEmail, valid){
  app.errorMsg = false;
  app.disable = true;
  var userObject = {};
  if(valid){
    userObject.email = $scope.newEmail;
    userObject._id = $scope.currentUseID;
    User.editManagement(userObject).then(function(data){
      if(data.data.success){
        app.successMsg = data.data.message;
        $timeout(function(){
          // app.usernameForm.username.$setPristine();
          // app.usernameForm.username.$setUntouched();
          // app.disable = false;
          // app.successMsg = false;
          // all above we can use;
          $location.path('/management')
        },10)
      } else {
        app.errorMsg = data.data.message;
        app.disable = false;
      }
    })
  } else{
    app.disable = false;
    app.errorMsg = "Please make sure your email is enter properly"
  }
}

app.updatePermission = function(newPermission){
  app.errorMsg = false;
  app.disable = true;
  app.successMsg = false;
  var userObject = {};
    userObject.permission = newPermission;
    userObject._id = $scope.currentUseID;
    console.log('here is userobject: ',userObject)
    User.editManagement(userObject).then(function(data){
      if(data.data.success){
          if(newPermission === 'user'){
            $scope.newPermission = 'user';
            app.disableUser = true;
            app.disableModerator = false;
            app.disableAdmin = false;
          }
          if(newPermission === 'moderator'){
            $scope.newPermission = 'moderator';
            app.disableModerator = true;
            app.disableUser = false;
            app.disableAdmin = false;
          }
          if(newPermission === 'admin'){
            $scope.newPermission = 'admin';
            app.disableAdmin = true;
            app.disableUser = false;
            app.disableModerator = false;
          }
          app.successMsg = data.data.message;
      } else {
        app.errorMsg = data.data.message;
        app.disable = false;
      }
    })
}

})
.controller('tagCtrl', function(User, $scope){
  var app = this;
  app.addingTag = function(tagData){
    console.log('Tag data is: ', app.tagData);
    User.addingTag(app.tagData).then(function(data){
      if(data.data.success){
        app.tagData.tagname = undefined;
        console.log('Tag has been saved!')
        grapAllShowTags();
      } else {
        console.log('Fail to save tag')
      }
    })
  }

  function grapAllShowTags(){
    User.showAllTag().then(function(data){
      if(data.data.success){
        app.AllTag = data.data.tags;
        console.log(app.AllTag);
      } else {
        console.log('no tag to show!')
      }
    })
  }
  grapAllShowTags();



})
