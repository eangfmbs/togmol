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
      app.enabledEdit = data.data.enabledEdit;
      app.status = data.data.talk;
    } else {
      app.enabledEdit = data.data.enabledEdit;
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
        console.log("Load all the time! fuck!!!")
        app.allComments = data.data.comments;
      }
    })
  }
  loadComment();
})
.controller('updateTalkCtrl', function(User,$scope,$routeParams){
  var app = this;
  User.getData2UpdateStatusTalk($routeParams.id).then(function(data){
    if(data.data.success){
      $scope.talkTitle = data.data.talk.title;
      $scope.talkContent = data.data.talk.content;
    } else {
      app.errorMsg = data.data.message;
    }
  })

  app.updateTalk = function(talkTitle, talkContent){
    var objectUpdate4Talk = {};
    objectUpdate4Talk = talkTitle;
    objectUpdate4Talk = talkContent;
    //need id toooo
    console.log("Test for update talk variable send: ", objectUpdate4Talk);
  }

})
