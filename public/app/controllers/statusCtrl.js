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

  function grapAllShowTags(){
    User.showAllTag().then(function(data){
      console.log(data)
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

// .controller('homeCtrl', function(User, $timeout, $location){
//   var app = this;
  // User.getAllStatus().then(function(data){
  //   if(data.data.success){
  //     app.allStatus = data.data.status;
  //   } else {
  //     app.errorMsg = data.data.message;
  //   }
  // })
// })

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
.controller('updateTalkCtrl', function(User,$scope,$routeParams,$timeout,$location){
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
    objectUpdate4Talk.title = talkTitle;
    objectUpdate4Talk.content = talkContent;
    objectUpdate4Talk._id = $routeParams.id;
    User.updateNewStatusTalk(objectUpdate4Talk).then(function(data){
      if(data.data.success){
        $timeout(function(){
          $location.path('/talk/'+$routeParams.id);
        },0)
      } else {
        app.errorMsg = data.data.message;
      }
    })
  }


})
// .controller('talkCtrl', ['Socialshare', function testController(Socialshare) {
//
//     Socialshare.share({
//       'provider': 'facebook',
//       'attrs': {
//         'socialshareUrl': 'http://720kb.net'
//       }
//     })
.controller('talkCtrl', function(User, $scope, $timeout, $location, $routeParams){
  var app = this;
  app.title = "Hello Eang";
  app.text = "Some content goes here!";
  app.errorMsg = false
  User.getDiscussion($routeParams.id).then(function(data){
    if(data.data.success){
      app.enabledEdit = data.data.enabledEdit;
      app.status = data.data.talk;
      console.log('this talk view is: ', data.data.views)
      app.totallike = data.data.like;
      //check for comment vote when start up the page
        User.checkLike($routeParams.id).then(function(data){//check fo get initial value of like or unlike
          if(!data.data.isLike){
            app.likeSymbol = data.data.symbol;
            console.log("what is symbol now: ", data.data.symbol)
          } else {
            console.log("what is symbol now: ", data.data.symbol)
            app.likeSymbol = data.data.symbol;
          }
        });
        //check for comment vote when start up the page
        // User.checkVoteComment()
    } else {
      app.enabledEdit = data.data.enabledEdit;
      app.errorMsg = true;
      app.errorMsg = data.data.message;
    }
  });

  app.postComment = function(commentData){
    var objectComment = $routeParams.id;
    User.postComment(objectComment, app.commentData).then(function(data){
      if(data.data.success){
        console.log('this comment Data: ', data.data)
        loadComment();
      } else {
        app.errorMsg = data.data.message;
      }
    })
  }

  function loadComment(){
    app.arrVote = [];
    app.arrUnvote = [];
    app.freshcomment = false;
    User.getAllCommetInCurrentStatus($routeParams.id).then(function(data){
      if(data.data.success){
        app.allvotes = data.data.votes;
        app.allComments = data.data.comments;
        app.userDecode = data.data.ownuserandcmm;
        app.allComments.forEach(function(comment){
          app.allvotes.forEach(function(vote){
            if(vote.username === app.userDecode && vote.commentid === comment._id){
              app.arrVote.push(vote);
              app.voteSymbol = "Unvote";
              // console.log("Vote in foreach Data that has the same decoded of eangfmbs: ", app.arrVote)
            }
            // if(vote._id !==app.arrUnvote._id){
            //   app.arrUnvote.push(vote);
            //   app.voteSymbol = "Unvote";
            // }
          })
        })
        console.log("Vote in foreach Data that has the same decoded of eangfmbs: ", app.arrVote)
        // console.log("Vote in foreach Data that has'nt the same decoded: ", app.arrUnvote)

        // app.voteSymbol = "Vote";
        console.log("This is Symbol: ", app.voteSymbol)
        console.log("Comment Data: ", app.allComments)
        console.log("Vote Data: ", app.allvotes)
      }
    })
  }
  loadComment();

//like talk topic
    app.likeClick = function () {
      var hasLiked = false; //initial that user haven't like yet
      // check if the user has been click like yet
      User.checkLike($routeParams.id).then(function(data){
        if(!data.data.isLike){
          User.likeTalk($routeParams.id).then(function(data){
            if(data.data.success){
              hasLiked = true;
              app.likeSymbol = data.data.symbol;
              app.totallike = data.data.like; //likeCount
              console.log(data.data.like)
            }
          })
        } else {
          User.unlikeTalk($routeParams.id).then(function(data){
            if(data.data.success){
              hasLiked = false;
              app.likeSymbol = data.data.symbol;
              app.totallike = data.data.unlike; //likeCount
            }
          })
        }
      })
    }

    //like comment status
    app.clickVoteComment = function(commentID){
      // app.hasVoted = false;
      var objectComment = {};
      objectComment.statusid = $routeParams.id;
      objectComment.commentid = commentID;
      User.checkVoteComment(commentID).then(function(data){
        if(!data.data.isVoteComment){
          User.voteTalkComment(objectComment).then(function(data){
            if(data.data.success){
              // hasVoted = true;
              app.voteSymbol = data.data.symbol;
              app.totalvote = data.data.vote; //voteCount
              console.log('this is vote: ',data.data.vote)
            }
          })
        } else {
          User.unvoteTalkComment(commentID).then(function(data){
            if(data.data.success){
              // hasVoted = false;
              app.voteSymbol = data.data.symbol;
              app.totalvote = data.data.unvote; //voteCount
            }
          })
        }
      })

    }


    // app.likeTalk = function(){
    //   User.likeTalk($routeParams.id).then(function(data){
    //     if(data.data.success){
    //       console.log(data.data.message)
    //     } else {
    //       console.log(data.data.message)
    //     }
    //   })
    // }
//for delete topic of talk
    app.deleteTalk = function(){
      app.errorMsg = false;
      User.deleteTalkStatus($routeParams.id).then(function(data){
        if(data.data.success){
          $timeout(function () {
            $location.path('/profile')
          }, 0);
        } else {
          app.errorMsg = data.data.message;
        }
      })
    }

    //delete comment
    app.deleteCommnet = function(commentID){
      app.errorMsg = false;
      User.deleteComment(commentID).then(function(data){
        if(data.data.success){
          $timeout(function(){
            $location.path('/profile')
          }, 0)
        } else {
          app.errorMsg = data.data.message;
        }
      })
    }


})
.directive('showButton', ['webNotification', function (webNotification) {
    'use strict';

    return {
        restrict: 'C',
        scope: {
            notificationTitle: '=',
            notificationText: '='
        },
        link: function (scope, element) {
            element.on('click', function onClick() {
                webNotification.showNotification(scope.notificationTitle, {
                    body: scope.notificationText,
                    icon: 'https://tracker.moodle.org/secure/useravatar?size=small&avatarId=17380',
                    onClick: function onNotificationClicked() {
                        console.log('Notification clicked.');
                    },
                    autoClose: 4000 //auto close the notification after 4 seconds (you can manually close it via hide function)
                }, function onShow(error, hide) {
                    if (error) {
                        window.alert('Unable to show notification: ' + error.message);
                    } else {
                        console.log('Notification Shown.');

                        setTimeout(function hideNotification() {
                            console.log('Hiding notification....');
                            hide(); //manually close the notification (you can skip this if you use the autoClose option)
                        }, 5000);
                    }
                });
            });
        }
    };
}])
