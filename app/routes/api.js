var User    = require('../models/user');
var jwt     = require('jsonwebtoken');
var secret  = 'intelligent'; //where ever it just a secret

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
    //create new LOGIN route (http://localhost:8080/api/authenticate) with providing token to the user with a secret and keep them login in 24h
    router.post('/authenticate', function (req, res) {
        User.findOne({username: req.body.username}).select('username password email').exec(function (err, user) {
                if(err) return handleError(err);
                if(!user){
                    res.json({success:false, message: "Can not authenticate. Maybe your username isn't correct!"})
                } else if(user) {
                    if(req.body.password){
                        var validPassword = user.comparePassword(req.body.password);
                    } else {
                        res.json({success:false, message: "No password provided"})
                    }
                    if(!validPassword){
                        res.json({success:false, message: "Your password is doesn't correct!"})
                    } else {
                        var token = jwt.sign({username: user.username, email: user.email},secret, {expiresIn:'24h'});
                        res.json({success:true, message: "Authenticate Successfully", token: token});
                    }
                }
            })
    });
    
    //use middleware to decrypt the token
    router.use(function (req, res, next) {
        var token = req.body.token||req.body.query||req.headers['x-access-token'];
        if(token){
            //valid token
            jwt.verify(token,secret,function (err, decoded) {
                if(err) {
                    res.json({success:false, message: "Your token is not validated or have been remove from the system after 24h"})
                } else {
                    req.decoded = decoded; //make it accessible in '/me' route
                    next();
                }
            })
        } else {
            res.json({success: false, message: "No token provided!"})
        }
    });

    //route to get the current user
    router.post('/me', function (req, res) {
        res.send(req.decoded)
    });
    return router;
}