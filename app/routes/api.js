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
                        from: 'togmol.com',
                        to: user.email,
                        subject: 'Activation your togmol link',
                        text: 'Hello '+ user.username + 'this is your activation link for activation togmol account please click on the link below to' +
                        ' complete your activation http://localhost:8080/activate/'+ user.temporarytoken,
                        html: '<b>Hello </b><strong>' + user.username +'</strong> this is your activation link for activation togmol account please click on the link below to' +
                        ' complete your activation <br>' +
                        '<a href="http://localhost:8080/activate/'+ user.temporarytoken +'">http://localhost:8080/activate/</a>'
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
        User.findOne({username: req.body.username}).select('username password email activate').exec(function (err, user) {
                if(err) return handleError(err);
                if(!user){
                    return res.json({success:false, message: "Can not authenticate. Maybe your username isn't correct!"})
                } else if(user) {
                    if(req.body.password){
                        var validPassword = user.comparePassword(req.body.password);
                    } else {
                        return res.json({success:false, message: "No password provided"})
                    }
                    if(!validPassword){
                        return res.json({success:false, message: "Your password is doesn't correct!"})
                    } else if(!user.activate){
                        return res.json({success: false, expired: true, message: "You haven't activate your account yet. Please go to you email and click activate account first or just click on this to get new link for activation"})
                    }
                    else {
                        var token = jwt.sign({username: user.username, email: user.email},secret, {expiresIn:'24h'});
                        return res.json({success:true, message: "Authenticate Successfully", token: token});
                    }
                }
            })
    });

    // USER Resend for activation account
    router.post('/resend', function (req, res) {
        User.findOne({username: req.body.username}).select('username password activate').exec(function (err, user) {
            if(err) return handleError(err);
            if(!user){
                return res.json({success:false, message: "Can not authenticate. Maybe your username isn't correct!"})
            } else if(user) {
                if(req.body.password){
                    var validPassword = user.comparePassword(req.body.password);
                } else {
                    return res.json({success:false, message: "No password provided"})
                }
                if(!validPassword){
                    return res.json({success:false, message: "Your password is doesn't correct!"})
                } else if(user.activate){
                    return res.json({success: true, message: "Your account is already activated"})
                }
                else {
                    return res.json({success: true, user: user});
                }
            }
        })
    });

    //route send to update resend activation of token
    router.put('/resend', function (req, res) {
        User.findOne({username: req.body.username}).select('username temporarytoken activate email').exec(function (err, user) {
            if(err){
                return handleError(err);
            } else {
                user.temporarytoken = jwt.sign({username: user.username, email: user.email},secret, {expiresIn:'24h'});
                user.save(function (err) {
                    if(err){
                        return handleError(err);
                    } else {
                        //email part
                        var email = {
                            from: 'togmol.com',
                            to: user.email,
                            subject: 'Request Activation Link',
                            text: 'Hello '+ user.username + 'you recently requested for activation togmol account please click on the link below to' +
                            ' complete your activation http://localhost:8080/activate/'+ user.temporarytoken,
                            html: '<b>Hello </b><strong>' + user.username +'</strong> you recently requested for activation togmol account please click on the link below to' +
                            ' complete your activation <br>' +
                            '<a href="http://localhost:8080/activate/'+ user.temporarytoken +'">http://localhost:8080/activate/</a>'
                        };

                        client.sendMail(email, function (err, info) {
                            if(err) {
                                console.log("This is error from sendMail", err);
                            } else {
                                console.log('Msg Send: ', info.response);
                            }
                        });
                        //end email part
                        return res.json({success:true, message: 'Activation link has been send to '+user.email+'!'})
                    }
                })
            }
        })
    })

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
                                text: 'Hello '+ user.username + '. Your account is now successfully activated' +
                                ' complete your activation http://localhost:8080/activate/'+ user.temporarytoken,
                                html: '<b>Hello </b><strong>'+user.username+'</strong> . Your account is now successfully activated'
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
    });

    //Route Forget username
    router.get('/forgetusername/:email', function (req, res) {
        User.findOne({email: req.params.email}).select('email username activate').exec(function (err, user) {
            if(err) {
                return handleError(err);
            } else {
                if(!req.params.email){
                    return res.json({success: false, message: "You haven't provided any email"})
                } else {
                    if(!user){
                        return res.json({success: false, message: 'E-mail was not found in db'})
                    } else if(!user.activate){
                        return res.json({success: false, message: "You haven't activated your account yet. We will allow to request to see your username unless your account has already activated"})
                    }
                    else {
                        var email = {
                            from: 'togmol.com',
                            to: user.email,
                            subject: 'Forget togmol username',
                            text: 'Hello! We found that you are recently requested for your username that you forgot' +
                            ' and here it is: '+ user.username,
                            html: '<b>Hello </b>Hello! We found that you are recently requested for your username that you forgot' +
                            ' and here it is: '+user.username
                        };

                        client.sendMail(email, function (err, info) {
                            if(err) {
                                console.log(error);
                            } else {
                                console.log('Msg Send: ', info.response);
                            }
                        });

                        return res.json({success: true, message: 'Your username has been send to '+user.email+' please go and check it'})
                    }
                }

            }
        })
    });

    //Route forget password and request to email to get new one
    router.put('/forgetpassword', function (req, res) {
        //we need a token to send to the user to get new token
        console.log("Hello :", req.body.password)
        User.findOne({email: req.body.password}).select('username email activate resettoken').exec(function (err, user) {
            if(err){
                return handleError(err);
            }
            if(!user){
                return res.json({success: false, message: 'Your email not found in our DB'})
            } else if(!user.activate){
                return res.json({success: false, message: "You haven't activated your account yet. We will allow to reset new password unless your account has already activated"})
            }
            else {
                //when user have token they are allow to set new password because token tell that this is ur valid account
                user.resettoken = jwt.sign({username: user.username, email: user.email},secret, {expiresIn:'24h'});
                var email = {
                    from: 'togmol.com',
                    to: user.email,
                    subject: 'Forget togmol password',
                    text: 'Hello! We found that you are recently requested for new password' +
                    ' please click on the link below to set new password:  http://localhost:8080/resetpassword/'+ user.resettoken,
                    html: '<b>Hello </b><strong>' + user.username +'</strong> you recently requested for new password please click on the link below to' +
                    ' set new password <br>' +
                    '<a href="http://localhost:8080/resetpassword/'+ user.resettoken +'">http://localhost:8080/resetpassword/</a>'
                };

                client.sendMail(email, function (err, info) {
                    if(err) {
                        console.log(error);
                    } else {
                        console.log('Msg Send: ', info.response);
                    }
                });

                return res.json({success: true, message: 'Now you can go to your email and request for new password'})
            }
        })
    });

    //Route set new password that receive from the email
    router.get('/forgetpassword/:token', function (req, res) {
        User.findOne({resettoken: req.params.token}).select('username email password').exec(function (err, user) {
            if(err) {
                return handleError(err);
            }
            var token = req.params.token;
            jwt.verify(token,secret,function (err, decoded) {
                if(err) {
                    return res.json({success:false, message: "Your token is not validated or have been remove from the system after 24h mean that it is expired"})
                } else {
                    // if(!user){
                    //     return res.json({success: false, message: 'Your token is expired'})
                    // } else {
                        return res.json({success: true, user:user})
                    //}
                }
            });
            // return res.json({success: true, message: "Please enter your new password!"})
        })
    });

    //Route save password after reset for new password
    router.put('/savenewpassword', function (req, res) {
        User.findOne({username: req.body.username}).select('username resettoken password email').exec(function (err, user) {
            if(err){
                handleError(err);
            }
            if(req.body.password!=null || req.body.password != ''){
                user.password = req.body.password;
                user.resettoken = false;
                user.save(function (err) {
                    if(err){
                        return res.json({success: false, message: err})
                    } else{
                        var email = {
                            from: 'togmol.com',
                            to: user.email,
                            subject: 'Successfully Reset Password',
                            text: 'Congratulation ' + user.username + 'your new password has been reset already. pleas go to togmol.com and try to login with your new password',
                            html: '<b>Congratulation </b><strong>' + user.username +'</strong> your new password has been reset already. pleas go to togmol.com and try to login with your new password'
                        };

                        client.sendMail(email, function (err, info) {
                            if(err) {
                                console.log(error);
                            } else {
                                console.log('Msg Send: ', info.response);
                            }
                        });
                        return res.json({success: true, message: "Password is reset successfully!"})
                    }
                })
            } else {
                return res.json({success: false, message: "Password has not provided yet"})
            }
        })
    })

    //use middleware to decrypt the token
    router.use(function (req, res, next) {
        var token = req.body.token||req.body.query||req.headers['x-access-token'];
        if(token){
            //verify that is that valid token
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
};