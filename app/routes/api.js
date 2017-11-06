var User        = require('../models/user');
var jwt         = require('jsonwebtoken');
var nodemailer  = require('nodemailer');
var sgTransport = require('nodemailer-sendgrid-transport');
var secret      = 'intelligent'; //whatever it just a secret

//create new user route (http://localhost:8080/api/users)
module.exports = function (router) {

    //email configuration
    var options = {
        auth: {
            //this api is all the account that we use to login sendgrid account
            api_user:'eangfmbs',
            api_key:'fmbsloynas1'
        }
    }


// using SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
//     const sgMail = require('@sendgrid/mail');
//     sgMail.setApiKey(process.env.SENDGRID_API_KEY);
//     const msg = {
//         to: 'test@example.com',
//         from: 'test@example.com',
//         subject: 'Sending with SendGrid is Fun',
//         text: 'and easy to do anywhere, even with Node.js',
//         html: '<strong>and easy to do anywhere, even with Node.js</strong>',
//     };
//     sgMail.send(msg);
//
//



    var client = nodemailer.createTransport(sgTransport(options));

    //http://localhost:8080/api/users
    //User registration route
    router.post('/users', function (req, res) {
        var user = new User();
        user.username = req.body.username;
        user.password = req.body.password;
        user.email    = req.body.email;
        user.temporarytoken = jwt.sign({username: user.username, email: user.email},secret, {expiresIn:'24h'});
        if(user.username=='' ||user.password=='' ||user.email=='' || user.username==null ||user.password==null ||user.email==null){
            res.json({success:false, message:'Please make sure all box is filled'})
        } else {
            user.save(function (err) {
                if(err){
                    if(err.errors!=null){
                        if(err.errors.email){
                            return res.json({success: false, message: err.errors.email.message});
                        } else if(err.errors.username){
                            return res.json({success: false, message: err.errors.username.message});
                        } else if(err.errors.password){
                            return res.json({success: false, message: err.errors.password.message});
                        } else {
                            return res.json({success:false, message: err})
                        }
                    } else if(err){
                        if(err.code == 11000){
                            if(err.errmsg[61]=='e'){
                                return res.json({success:false, message: 'Email address is already taken'})
                            } else if(err.errmsg[61]=='u'){
                                return res.json({success: false, message: 'Username is already taken'})
                            }
                        }
                        else{
                            return res.json({success:false, message: err})
                        }
                    }
                } else {
                    //email part
                    var email = {
                        from: 'staff@localhost.com',
                        to: user.email,
                        subject: 'Activation your togmol link',
                        text: 'Hello '+user.username+ 'this is your activation link for activation togmol account please click on the link below to' +
                        ' complete your activation http://localhost:8080/activate/'+user.temporarytoken,
                        html: '<b>Hello </b><strong>user.username</strong> this is your activation link for activation togmol account please click on the link below to' +
                        ' complete your activation <br>' +
                        '<a href="http://localhost:8080/activate/'+user.temporarytoken+'">http://localhost:8080/activate/</a>'
                    };

                    client.sendMail(email, function (err, info) {
                        if(err) {
                            console.log("This is error from sendMail", err);
                        } else {
                            console.log('Msg Send: ', info.response);
                        }
                    });
                    //end email part

                    res.json({success:true, message:'Congratulation! User has been created. Please check your email for activation link'})
                }
            });
        }
    });
//check for username while login
    router.post('/checkusername', function (req, res) {
        User.findOne({username: req.body.username}).select('username').exec(function (err, user) {
            if(err) return handleError(err);
            if(user){
                res.json({success: false, message: 'username is already exist'})
            } else {
                res.json({success: true, message: 'your username is good to go'})
            }
        })
    });

    //check for password while login
    router.post('/checkemail', function (req, res) {
        User.findOne({email: req.body.email}).select('email').exec(function (err, user) {
            if(err) return handleError(err);
            if(user){
                res.json({success: false, message: 'email is already exist'})
            } else {
                res.json({success: true, message: 'your email is good to go'})
            }
        })
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

    //get token from email
    router.put('/activate/:token', function (req, res) {
        User.findOne({temporarytoken: req.params.token}, function (err, user) {
            if(err) {
                throw err;
            }
            var token = req.params.token;
            jwt.verify(token,secret,function (err, decoded) {
                if(err) {
                    res.json({success:false, message: "Activation link has expired"})
                }else if(!user) {
                    res.json({success:false, message: "Activation link has expired"})
                }
                else {
                    //clear some variable and update data in DB
                    user.temporarytoken = false;
                    user.activate = true;
                    user.save(function (err) {
                        if(err) {
                            console.log("Error from email token: ", err)
                        } else {
                            var email = {
                                from: 'togmol.com',
                                to: user.email,
                                subject: 'Congrats from togmol activation account',
                                text: 'Hello '+user.username+ '. Your account is now successfully activated' +
                                ' complete your activation http://localhost:8080/activate/'+user.temporarytoken,
                                html: '<b>Hello </b><strong>user.username</strong> . Your account is now successfully activated'
                            };

                            client.sendMail(email, function (err, info) {
                                if(err) {
                                    console.log(error);
                                } else {
                                    console.log('Msg Send: ', info.response);
                                }
                            });

                            res.json({success:true, message: "togmol account is successfully activated"})
                        }
                    })
                }
            })


        })
    })
    
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

    //route to get the current user whose login
    router.post('/me', function (req, res) {
        res.send(req.decoded)
    });
    return router;
}