angular.module('userServices',[])
.factory('User', function ($http) {
    userFactory= {};
    // call to custom function name "User.create(regData)" in userCtrl.js this userFactory is called service
    userFactory.create = function (regData) {
        return $http.post('/api/users',regData);
    };
    //User.checkUsername(regData)
    userFactory.checkUsername = function (regData) {
        return $http.post('/api/checkusername', regData)
    };
    //User.checkEmail(regData)
    userFactory.checkEmail = function (regData) {
        return $http.post('/api/checkemail', regData)
    };
    //User.activateAccount(token)
    userFactory.activateAccount = function (token) {
        return $http.put('/api/activate/'+token)
    };
    //User.resendActivateCredential(resendData)
    userFactory.resendActivateCredential = function (resendData) {
        return $http.post('/api/resend', resendData)
    };
    //User.resendLink4ActivationCredentialAgain(resendData)
    userFactory.resendLink4ActivationCredentialAgain = function (username) {
        return $http.put('/api/resend', username)
    };
    //User.forgotUsername(emailData)
    userFactory.forgetUsername = function (emailData) {
        return $http.get('/api/forgetusername/'+emailData);
    };
    //User.forgetPassword(resetData)
    userFactory.forgetPassword = function (resetData) {
        return $http.put('/api/forgetpassword', resetData)
    };
    //User.setNewPassword(token)
    userFactory.resetNewPassword = function (token) {
        return $http.get('/api/forgetpassword/'+token)
    };
    //User.savePassword(passwordData)
    userFactory.savePassword = function (passwordData) {
        return $http.put('/api/savenewpassword', passwordData)
    }
    return userFactory;
});