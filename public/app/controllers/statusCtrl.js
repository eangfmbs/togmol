angular.module('statusController',['userServices','authServices'])
.controller('askCtrl', function(User, $scope, $timeout, $location){
  var app = this;
  app.arrTag = [];
  var postStatusObject = {};

  function grapAllShowTags(){ //is to show a tag for poster selecting when post a content
    User.showAllTag().then(function(data){
      console.log(data)
      if(data.data.success){
        app.AllTag = data.data.tags;
        app.AllTag.forEach(function(tag){
          app.arrTag.push(tag.tagname);
        })
        console.log('hello TAG', app.arrTag.join());
      } else {
        console.log('no tag to show!')
      }
    })
  }
  grapAllShowTags();

  app.disabled = undefined;
  app.searchEnabled = undefined;

  app.setInputFocus = function (){
    $scope.$broadcast('UiSelectDemo1');
  };

  app.enable = function() {
    app.disabled = false;
  };

  app.disable = function() {
    app.disabled = true;
  };

  app.enableSearch = function() {
    app.searchEnabled = true;
  };

  app.disableSearch = function() {
    app.searchEnabled = false;
  };

  app.clear = function() {
    app.person.selected = undefined;
    app.address.selected = undefined;
    app.country.selected = undefined;
  };

  app.someGroupFn = function (item){

    if (item.name[0] >= 'A' && item.name[0] <= 'M')
        return 'From A - M';

    if (item.name[0] >= 'N' && item.name[0] <= 'Z')
        return 'From N - Z';

  };

  app.firstLetterGroupFn = function (item){
      return item.name[0];
  };

  app.reverseOrderFilterFn = function(groups) {
    return groups.reverse();
  };

  app.personAsync = {selected : "wladimir@email.com"};
  app.peopleAsync = [];
  app.peopleObj = {
    '1' : { name: 'Adam',      email: 'adam@email.com',      age: 12, country: 'United States' },
    '2' : { name: 'Amalie',    email: 'amalie@email.com',    age: 12, country: 'Argentina' },
    '3' : { name: 'Estefanía', email: 'estefania@email.com', age: 21, country: 'Argentina' },
    '4' : { name: 'Adrian',    email: 'adrian@email.com',    age: 21, country: 'Ecuador' },
    '5' : { name: 'Wladimir',  email: 'wladimir@email.com',  age: 30, country: 'Ecuador' },
    '6' : { name: 'Samantha',  email: 'samantha@email.com',  age: 30, country: 'United States' },
    '7' : { name: 'Nicole',    email: 'nicole@email.com',    age: 43, country: 'Colombia' },
    '8' : { name: 'Natasha',   email: 'natasha@email.com',   age: 54, country: 'Ecuador' },
    '9' : { name: 'Michael',   email: 'michael@email.com',   age: 15, country: 'Colombia' },
    '10' : { name: 'Nicolás',   email: 'nicolas@email.com',    age: 43, country: 'Colombia' }
  };

  app.person = {};

  app.person.selectedValue = app.peopleObj[3];
  app.person.selectedSingle = 'Samantha';
  app.person.selectedSingleKey = '5';
  // To run the demos with a preselected person object, uncomment the line below.
  //app.person.selected = app.person.selectedValue;

  app.people = [
    { name: 'Adam',      email: 'adam@email.com',      age: 12, country: 'United States' },
    { name: 'Amalie',    email: 'amalie@email.com',    age: 12, country: 'Argentina' },
    { name: 'Estefanía', email: 'estefania@email.com', age: 21, country: 'Argentina' },
    { name: 'Adrian',    email: 'adrian@email.com',    age: 21, country: 'Ecuador' },
    { name: 'Wladimir',  email: 'wladimir@email.com',  age: 30, country: 'Ecuador' },
    { name: 'Samantha',  email: 'samantha@email.com',  age: 30, country: 'United States' },
    { name: 'Nicole',    email: 'nicole@email.com',    age: 43, country: 'Colombia' },
    { name: 'Natasha',   email: 'natasha@email.com',   age: 54, country: 'Ecuador' },
    { name: 'Michael',   email: 'michael@email.com',   age: 15, country: 'Colombia' },
    { name: 'Nicolás',   email: 'nicolas@email.com',    age: 43, country: 'Colombia' }
  ];

  app.availableColors = app.arrTag;

  app.singleDemo = {};
  app.singleDemo.color = '';
  app.multipleDemo = {};
  app.multipleDemo.colors = [];
  app.multipleDemo.colors2 = ['Blue','Red'];
  app.multipleDemo.selectedPeople = [app.people[5], app.people[4]];
  app.multipleDemo.selectedPeople2 = app.multipleDemo.selectedPeople;
  app.multipleDemo.selectedPeopleWithGroupBy = [app.people[8], app.people[6]];
  app.multipleDemo.selectedPeopleSimple = ['samantha@email.com','wladimir@email.com'];
  app.multipleDemo.removeSelectIsFalse = [app.people[2], app.people[0]];

  //post a status
  app.askQuestion = function(askData){
    console.log('askData: ', app.askData)
    User.postStatus(app.askData).then(function(data){
      if(data.data.success){
        // postStatusObject.statusid = data.data.statusid
        // postStatusObject.tags = app.askData.colors;
        // console.log('this is postStatusObject: ', postStatusObject);
        // User.insertTagsWhenPostQuestion(postStatusObject).then(function(data){
        //   if(data.data.success){
        //     console.log(data.data.message);
        //   } else {
        //     console.log(data.data.message)
        //   }
        // })

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

.controller('profileCtrl', function($scope, User, $mdToast, ImageService, $timeout, $location){
  var app = this;
  User.getProfileStatus().then(function(data){
    if(data.data.success){
      console.log(data.data.profile)
      app.allStatus = data.data.profile;
    } else {
      app.errorMsg = data.data.message;
    }
  })

  // upload image

  $scope.loading = false;
  $scope.uploadPhoto = null;
  $scope.croppedPhoto = null;

  $scope.readFileImg = function(files){
  $scope.uploadPhoto = null;
  $scope.croppedPhoto = null;
  $scope.photo = null;

  if (files && files.length) { //this part is just pass a file and update a scope with a new file
    var readImgCallback = function(err, img){
      $scope.loading = false;
      if(err) return Toaster.toastErrorMessage($scope, err);

      $scope.$apply(function(){ //function to update the scope with new file when something change
        $scope.uploadPhoto = img;
      });
    };
    $scope.loading = true;

    ImageService.readImageFile(files[0], readImgCallback);
  }
};

$scope.upload = function () {
  if ($scope.croppedPhoto) {
    $scope.myphoto=$scope.croppedPhoto;
    $scope.photo=$scope.croppedPhoto;
    var objectCrop = {};
    objectCrop.profile = $scope.croppedPhoto;
    $scope.loading = true;
    console.log("the file is:", $scope.files.name)
    User.updateProfilePhoto(objectCrop).then(function(data){
      if(data.data.success){
        var toast = $mdToast.simple()
                .textContent('Photo saved')
                .action('OK')
                .highlightAction(true)
                .position('left');
                $mdToast.show(toast);
// or use the toast bellow
               //  $mdToast.show (
               //    $mdToast.simple()
               //    .textContent('Hello World!')
               //    .hideDelay(3000)
               // );
      } else {
        Toaster.toastErrorMessage($scope, 'Error saving photo.');
      }
    })
  }
  else {
    $scope.loading = false;
  }
};


//crop image
    // $scope.myImage='';
    // $scope.myCroppedImage='';
    //
    // var handleFileSelect=function(evt) {
    //   var file=evt.currentTarget.files[0];
    //   var reader = new FileReader();
    //   reader.onload = function (evt) {
    //     $scope.$apply(function($scope){
    //       $scope.myImage=evt.target.result;
    //     });
    //   };
    //   reader.readAsDataURL(file);
    // };
    // angular.element(document.querySelector('#fileInput')).on('change',handleFileSelect);

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
