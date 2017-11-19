angular.module('statusController',['userServices'])
.controller('askCtrl', function(User, $timeout, $location){
  var app = this;
  //post a status
  app.askQuestion = function(askData){
    User.postStatus(app.askData).then(function(data){
      if(data.data.success){
        $timeout(function(){
          $location.path('/');
        },1000)
        app.successMsg = data.data.message;
      } else {
        app.errorMsg = data.data.message;
      }
    })
  }

})

.controller('homeCtrl', function(User, $timeout, $location){
  var app = this;
  User.getAllStatus().then(function(data){
    if(data.data.success){
      app.allStatus = data.data.status;
    } else {
      app.errorMsg = data.data.message;
    }
  })
})

.controller('profileCtrl', function(User, $timeout, $location){
  var app = this;
  User.getProfileStatus().then(function(data){
    if(data.data.success){
      app.allStatus = data.data.profile;
    } else {
      app.errorMsg = data.data.message;
    }
  })
})
