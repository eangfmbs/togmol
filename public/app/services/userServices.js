angular.module('userServices',[])
.factory('User', function ($http) {
    userFactory= {};
    // call to custom function name "User.create(regData)" in userCtrl.js this userFactory is called service
    userFactory.create = function (regData) {
        return $http.post('/api/users',regData);
    };
    //User.checkUsername(regData)
    userFactory.checkUsername = function (regData) {
        return $http.post('/api/checkusername', regData);
    };
    //User.checkEmail(regData)
    userFactory.checkEmail = function (regData) {
        return $http.post('/api/checkemail', regData);
    };
    //User.activateAccount(token)
    userFactory.activateAccount = function (token) {
        return $http.put('/api/activate/'+token);
    };
    //User.resendActivateCredential(resendData)
    userFactory.resendActivateCredential = function (resendData) {
        return $http.post('/api/resend', resendData);
    };
    //User.resendLink4ActivationCredentialAgain(resendData)
    userFactory.resendLink4ActivationCredentialAgain = function (username) {
        return $http.put('/api/resend', username);
    };
    //User.forgotUsername(emailData)
    userFactory.forgetUsername = function (emailData) {
        return $http.get('/api/forgetusername/'+emailData);
    };
    //User.forgetPassword(resetData)
    userFactory.forgetPassword = function (resetData) {
        return $http.put('/api/forgetpassword', resetData);
    };
    //User.setNewPassword(token)
    userFactory.resetNewPassword = function (token) {
        return $http.get('/api/forgetpassword/'+token);
    };
    //User.savePassword(passwordData)
    userFactory.savePassword = function (passwordData) {
        return $http.put('/api/savenewpassword', passwordData);
    };
    //User.getPermission()
    userFactory.getPermission = function () {
        return $http.get('/api/permission');
    };
    //User.getAllUsersForManagement()
    userFactory.getAllUsers4Management = function () {
        return $http.get('/api/management');
    };
    //User.getOneUserInDB(id)
    userFactory.getOneUserInDB = function(id){
      return $http.get('/api/editusername/'+id);
    }
    //User.editManagement()
    userFactory.editManagement = function(id){
      return $http.put('/api/editmanagement', id);
    }
    //User.deleteUserInManagement(username)
    userFactory.deleteUserInManagement = function(username){
      return $http.delete('/api/management/'+username);
    };
    //User.addingTag()
    userFactory.addingTag = function(tagData){
      console.log('in user service tag: ', tagData);
      return $http.post('/api/tagtypedata', tagData);
    }
    //User.showAllTag()
    userFactory.showAllTag = function(){
      return $http.get('/api/listalltags'); //list all tags for poster selecting when post a content
    }
    //User.insertTagsWhenPostQuestion()
    // userFactory.insertTagsWhenPostQuestion = function(tags){
    //   console.log('userServices tag: ', tags)
    //   return $http.post('/api/inserttagswhenpostquestion', tags);
    // }


    //From this route is the route for status when user post a content
    //User.postStatus(askData)
    userFactory.postStatus = function(askData){
      return $http.post('/api/status', askData);
    };
    //User.getAllStatus()
    userFactory.getAllStatus = function(){
      return $http.get('/api/status');
    };
    //User.getProfileStatus()
    userFactory.getProfileStatus = function(){
      return $http.get('/api/profile');
    };
    //User.getDiscussion(id)
    userFactory.getDiscussion = function(id){
      return $http.get('/api/talk/'+id);
    };

    //This part is about all comment section
    //User.postComment(id)
    userFactory.postComment = function(id, commentData){
      return $http.post('/api/comment/'+id, commentData);
    };
    //User.getAllCommentforThatStatusInTalkPage(id)
    userFactory.getAllCommetInCurrentStatus = function(id){
      return $http.get('/api/comment/'+id);
    };
    //User.getData2UpdateStatusTalk(id)
    userFactory.getData2UpdateStatusTalk = function(id){
      return $http.get('/api/updatetalk/'+id);
    };
    //User.updateNewStatus(updateStatusData)
    userFactory.updateNewStatusTalk = function(updateData){
      return $http.put('/api/updatetalk', updateData);
    };
    //User.deleteTalkStatus(id)
    userFactory.deleteTalkStatus = function(id){
      return $http.delete('/api/deletetalk/'+id);
    };
    //User.deleteComment
    userFactory.deleteComment = function(objectCmt){
      console.log("This is the object of ID Coment: ", objectCmt._id)
      return $http.delete('/api/deleteCommnet/'+objectCmt);
    }
    //User.getComment()
    userFactory.getComment = function(){
      return $http.get('/api/getCommntToUpdate');
    }
    //User.updateComment
    userFactory.updateComment = function(){
      return $http.put('/api/updateCommnent');
    }

    //this is the part of like
    //User.checkLike(id)
    userFactory.checkLike = function(id){
      return $http.get('/api/checkiflike/'+id)
    }
    //User.likeTalk(id)
    userFactory.likeTalk = function(id){
      return $http.post('/api/peopleliketalkcontent/'+id);
    };
    //User.unlikeTalk(id)
    userFactory.unlikeTalk = function(id){
      return $http.delete('/api/peopleUnlikecontent/'+id);
    };

    //this is the part of vote
    //User.checkLikeComment
    userFactory.checkVoteComment = function(id){
      return $http.get('api/checkifvotecomment/'+id);
    };
    //User.likeTalkComment(commentid)
    userFactory.voteTalkComment = function(voteTalkComment){
      return $http.post('/api/peoplevotetalkcomment' ,voteTalkComment);
    };
    //User.unlikeTalkComment(commentid)
    userFactory.unvoteTalkComment = function(id){
      return $http.delete('/api/peopleunvotetalkcomment/'+id);
    };
    //User.updateProfilePhoto(imageCrop)
    userFactory.updateProfilePhoto = function(croppedPhoto){
      var fd = new FormData();
      // var imgBlob = dataURItoBlob($scope.uploadme);
      fd.append('file', croppedPhoto);
      console.log('the love: ', croppedPhoto);
      return $http.post('/api/updateProfilePhoto', croppedPhoto
      ,fd,
      {
        transformRequest: angular.identity,
        headers: {
              'Content-Type': undefined
            }
      }
    );
    };

    return userFactory;
});
