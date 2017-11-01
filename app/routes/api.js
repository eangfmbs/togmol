var User    = require('../models/user');

//create new user route (http://localhost:8080/api/users)
module.exports = function (router) {
    router.post('/users', function (req, res) {
        var user = new User();
        user.username = req.body.username;
        user.password = req.body.password;
        user.email    = req.body.email;
        if(user.username=='' ||user.password=='' ||user.email=='' || user.username==null ||user.password==null ||user.email==null){
            res.json({success:false, message:'Please make sure all box is filled'})
        } else {
            user.save(function (err) {
                if(err){
                    res.json({success:false,message:'We are sorry! This username has been already taken. Please try another one.'})
                } else {
                    res.json({success:true, message:'Congratulation! User has been created'})
                }
            });
        }
    });

    // USER LOGIN ROUTE
    //create new LOGIN route (http://localhost:8080/api/authenticate)
    router.post('/authenticate', function (req, res) {
        User.findOne({username: req.body.username}).select('username password email').exec(function (err, user) {
                if(err) return handleError(err);
                if(!user){
                    res.json({success:false, message: 'Could not authenticate!'})
                } else if(user) {
                    console.log("This is username: ",req.body.username)
                    if(req.body.password){
                        console.log("The Password: " , req.body.password)
                        var validPassword = user.comparePassword(req.body.password);
                    } else {
                        res.json({success:false, message: "No password provided"})
                    }
                    if(!validPassword){
                        res.json({success:false, message: "Your password is doesn't correct!"})
                    } else {
                        res.json({success:true, message: "Authenticate Successfully"})
                    }
                }
            })
    })
    return router;
}