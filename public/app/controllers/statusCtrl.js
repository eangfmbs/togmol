angular.module('statusController',['userServices'])
.controller('askCtrl', function(User, $timeout, $location){
  var app = this;
  //post a status
  app.askQuestion = function(askData){
    User.postStatus(app.askData).then(function(data){
      if(data.data.success){
        $timeout(function(){
          $location.path('/');
        },0)
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
.controller('talkCtrl', function(User, $timeout, $location, $routeParams){
  var app = this;
  app.errorMsg = false
  User.getDiscussion($routeParams.id).then(function(data){
    if(data.data.success){
      app.status = data.data.talk;
    } else {
      app.errorMsg = true;
      app.errorMsg = data.data.message;
    }
  });

  app.postComment = function(commentData){
    var objectComment = $routeParams.id;
    //objectComment = app.commentData;
    console.log('this comment Data: ', app.commentData)
    User.postComment(objectComment, app.commentData).then(function(data){
      if(data.data.success){
        loadComment();
      } else {
        app.errorMsg = data.data.message;
      }
    })
  }

  function loadComment(){
    User.getAllCommetInCurrentStatus($routeParams.id).then(function(data){
      if(data.data.success){
        app.allComments = data.data.comments;
      }
    })
  }

  loadComment();

})
