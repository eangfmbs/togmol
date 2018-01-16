var User        = require('../models/user');
var Status      = require('../models/status');
var Comment     = require('../models/comment');
var Vote        = require('../models/vote');
var Like        = require('../models/like');
var Tag         = require('../models/tag');
var TagType     = require('../models/tagtype');
var imageHelper = require('../imagehelper/imagehelper');
var jwt         = require('jsonwebtoken');
var nodemailer  = require('nodemailer');
var sgTransport = require('nodemailer-sendgrid-transport');
var secret      = 'intelligent'; //whatever it just a secret
var countComment = 0;
var currentTotal = 0;
var countLike    = 0;
var currentLike  = 0;
var countView    = 0;
var currentView  = 0;
var countVote    = 0;
var currentVote  = 0;
// to family and friend i would give what i have. to person i love i would give what don't have it

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
    //User REGISTRATION ROUTE
    router.post('/users', function (req, res) {
        var user = new User();
        user.username = req.body.username;
        user.password = req.body.password;
        user.email    = req.body.email;
        user.temporarytoken = jwt.sign({username: user.username, email: user.email},secret, {expiresIn:'24h'});
        if(user.username=='' ||user.password=='' ||user.email=='' || user.username==undefined ||user.password==undefined ||user.email==undefined){
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
                user.save(function (err) {
                    if(err){
                        return handleError(err);
                    } else {
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
                            }
                        });

                        return res.json({success: true, message: 'Now you can go to your email and request for new password'})
                    }
                })

            }
        })
    });

    //Route set new password that receive from the email
    router.get('/forgetpassword/:token', function (req, res) {

        User.findOne({resettoken: req.params.token}).select().exec(function (err, user) {
            if(err) {
                return handleError(err);
            }
            var token = req.params.token;
            jwt.verify(token,secret,function (err, decoded) {
                if(err) {
                    return res.json({success:false, message: "Your token is not validated or have been remove from the system after 24h mean that it is expired"})
                } else {
                    console.log("The user token is: ",token);
                    if(!user){
                        return res.json({success: false, message: 'Your token is expired'})
                    } else {
                    res.json({success: true, user:user})
                    }
                }
            });
            // return res.json({success: true, message: "Please enter your new password!"})
        })
    });

    //Route save password after reset for new password
    router.put('/savenewpassword', function (req, res) {
        User.findOne({username: req.body.username}).select('username password email').exec(function (err, user) {
            if(err){
                handleError(err);
            }
            if(req.body.password!=undefined || req.body.password != ''){
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
                    req.decoded = decoded; //make it accessible in '/me' route as well as all other route below this middleware
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

    //create a route to get what permission that user has
    router.get('/permission', function (req, res) {
        User.findOne({username: req.decoded.username}, function (err, user) {
            if(err) handleError(err);
            return res.json({success: true, permission: user.permission})
        })
    });

    //a route to fetch all data for management control.
    router.get('/management', function (req, res) {
        User.find({}, function (err, users) {
            if(err){
                return handleError(err);
            }
            User.findOne({username: req.decoded.username}, function (err, mainUser) { //to verify that user have permission to pull data out or not
                if(err){
                    handleError(err);
                }
                if(mainUser.permission === 'admin' || mainUser.permission === 'moderator'){
                    return res.json({success: true, users: users, permission: mainUser.permission})
                } else {
                    return res.json({success: false, message: "You do not have the permission to control on this management!"})
                }
            })
        })
    });

    //route on click to delete user
    router.delete('/management/:username', function(req, res){
      var deleteUser = req.params.username;
      User.findOne({username: req.decoded.username}, function(err, mainUser){
        if(err){
          return handleError(err);
        }
        if(mainUser.permission !== 'admin'){
          return res.json({success: false, message: 'Insuficient Permission!'});
        } else {
          User.findOneAndRemove({username: deleteUser}, function(err, user){
            if(err){
              handleError(err);
            } else {
              return res.json({success: true, message: 'User is deleted from DB'});
            }
          })
        }
      })
    })

    //route to catch _id from url when admin or moderator updata updateData
    router.get('/editusername/:id', function(req, res){
      var editUsernameId = req.params.id;
      User.findOne({username: req.decoded.username}, function(err, mainUser){
        if(err){
          return handleError(err);
        }
        if(mainUser.permission === 'admin' || mainUser.permission === 'moderator'){
          User.findOne({_id: editUsernameId}, function(err, user){
            if(err){
              return handleError(err);
            } else {
              res.json({success: true, user:user})
            }
          })
        } else {
          return res.json({success: false, message: 'You are Insufficience Permission'})
        }
      })
    })

    //route reponsible for update/edit all data in Mangaement such as username, email, permission
    router.put('/editmanagement', function(req, res){
      var editUser = req.body._id;
      if(req.body.username) var newUsername = req.body.username; //if username is provided and so on for other ifs
      if(req.body.email) var newEmail = req.body.email;
      if(req.body.permission) var newPermission = req.body.permission;
      User.findOne({username: req.decoded.username}, function(err, mainUser){ //check for mainUser bec this is the user that update data of other
        if(err){
          return handleError(err);
        }
        //check if new username is provided
        if(newUsername){
          if(mainUser.permission === 'admin' || 'moderator'){
            User.findOne({_id: editUser}, function(err, user){ //check this user is the user that has been update by main user
              if(err){
                return handleError(err);
              } else {
                user.username = newUsername;
                user.save(function(err){
                  if(err){
                    handleError(err);
                  } else {
                    return res.json({success: true, message: 'Your new username have been update in our database :)'})
                  }
                })
              }
            })
          } else {
          return res.json({success: false, message: 'Your are Insufficience Permission!'})
          }
        }
        //check if new email is provided
        if(newEmail){
          if(mainUser.permission === 'admin' || mainUser.permission === 'moderator'){
            User.findOne({_id: editUser}, function(err, user){
              if(err){
                return handleError(err);
              } else {
                user.email = newEmail;
                user.save(function(err){
                  if(err){
                    return handleError(err);
                  } else {
                    return res.json({success: true, message: 'Your new E-mail have been update in our database :)'})
                  }
                })
              }
            })
          } else {
            return res.json({success: false, message: 'Your are Insufficience Permission!'})
          }
        }

        //check if new permission is provided
        if(newPermission){
          if(mainUser.permission === 'admin' || mainUser.permission === 'moderator'){
            User.findOne({_id: editUser}, function(err, user){
                if(err){
                  return handleError(err);
                }
                else{
                      if(newPermission === 'user'){
                        if(user.permission === 'admin'){
                          if(mainUser.permission !== 'admin'){
                            return res.json({success: false, message: '1 Your are not an admin so you just can not downgrade '+user.username+' who is an admin! at least you neet to be in the same range.'})
                          } else {
                            user.permission = newPermission;
                            user.save(function(err){
                              if(err){
                                return handleError(err);
                              } else {
                                return res.json({success: true, message: '1 Oh! You are the admin and you just downgrade '+user.username+' who was an admin last moment to the user range'})
                              }
                            })
                          }
                        } else {
                          user.permission = newPermission;
                          user.save(function(err){
                            if(err){
                              console.log("Hello")
                              return handleError(err);
                            } else {
                               res.json({success: true, message: '1 You just downgrade '+user.username+' to be a USER in this project'})
                          }
                        })
                      }
                    }

                    if(newPermission === 'moderator'){
                      if(user.permission === 'admin'){
                        if(mainUser.permission !== 'admin'){
                          return res.json({success: false, message: '2 Your are not an admin so you just can not downgrade '+user.username+' who is an admin! at least you neet to be in the same range.'})
                        } else {
                          user.permission = newPermission;
                          user.save(function(err){
                            if(err){
                              return handleError(err);
                            } else {
                              return res.json({success: true, message: 'Oh! You are the admin and you just downgrade '+user.username+' who was an admin last moment to the MODERATOR range'})
                            }
                          })
                        }
                      } else {
                        user.permission = newPermission;
                        user.save(function(err){
                          if(err){
                            return handleError(err);
                          } else {
                            return res.json({success: true, message: '2 You just modify '+user.username+'  to be a MODERATOR in this project'})
                        }
                      })
                    }
                  }

                  if(newPermission === 'admin'){
                    console.log('mainUser here: ', mainUser.permission)
                    if(mainUser.permission !== 'admin') {
                      return res.json({success: false, message: '3 Your are not an admin so you just can not downgrade '+user.username+' who is an admin! at least you neet to be in the same range.'})
                    }else {
                      user.permission = newPermission;
                      user.save(function(err){
                        if(err){
                          return handleError(err);
                        } else {
                          return res.json({success: true, message: 'Oh! You are the admin and you just modify '+user.username+' account to be an ADMIN'})
                        }
                      })
                    }
                }
              }
            })
          }
        }
      })
    })

    //Adding tag route.
    router.post('/tagtypedata', function(req, res){
      var tagtype = new TagType();
      tagtype.tagname = req.body.tagname;
      if(tagtype.tagname == '' || tagtype.tagname == undefined){
        res.json({success: false, message: "You hasn't enter any tag"})
      } else {
        tagtype.save(function(err){
          if(err){
            return handleError(err);
          } else {
            res.json({success: true, message: 'Tag has been saved to the DB'});
          }
        })
      }
    })
    //list All tags
    router.get('/listalltags', function(req, res){
      TagType.find({}, function(err, tags){
        if(err){
          return handleError(err);
        }
        if(!tags){
          return res.json({success: false, message:'There is no tag yet'});
        }
         else {
          return res.json({success: true, tags: tags});
        }
      })
    })

    //create Status table
    router.post('/status', function (req, res) {
        var status = new Status();
        status.title = req.body.title;
        status.content = req.body.content;
        status.username = req.decoded.username;
        status.tags = req.body.colors;
        if(status.title=='' || status.title==undefined){
            res.json({success:false, message:'Please make sure title box is filled'})
        } if(status.tags==undefined){
          res.json({success:false, message:'Please select at least one tag'})
        }
         else {
            status.save(function (err, post) {
                if(err){
                    console.log(err);
                } else {
                    res.json({success:true, message:'You post a status!', statusid:post._id})
                }
            });
        }
    });

    //insertTagsWhenPostQuestion
    // router.post('/inserttagswhenpostquestion', function(req, res){
    //   var tag = new Tag();
    //   tag.tagtypeid = req.body.tags;
    //   tag.statusid = req.body.statusid;
    //   console.log('post status tag is tagtaype name:', tag.tagtypeid) //its a string because the tag's db is we defined as string so we need to change it to arr first
    //   console.log('hrr is tagtaype statusid:', tag.statusid)
    //   console.log('post tag name:', req.body.tags) //its a string because the tag's db is we defined as string so we need to change it to arr first
    //   if(tag.tagtypeid=='' || tag.tagtypeid == undefined || tag.statusid=='' || tag.statusid == undefined){
    //     return res.json({success:false, message: 'Please make sure you have already selected at least one tag'})
    //   } else {
    //       tag.save(function(err){
    //         if(err){
    //           return handleError(err);
    //         } else {
    //           res.json({success: true, message:'Successfully insert tags'})
    //         }
    //       })
    //   }
    // })

    //get data from status collection to show on index.html
    router.get('/status', function(req, res){
      Status.find({}, function(err, status){
        if(err){
          return handleError(err);
        }
        if(!status){
          return res.json({success: false, message: "Your token is expired please login again to see!"})
        }
        return res.json({success: true, status: status})
      })
    })

    //get Status for owner profile user
    router.get('/profile', function(req, res){
      Status.find({username: req.decoded.username}, function(err, profile){
        if(err){
          return handleError(err);
        }
        if(!profile){
          return res.json({success: false, message: "Your token is expired please login again to see it!"})
        }
        return res.json({success: true, profile: profile})
      })
    })

    //Show detail on one status for user discussion in talk.html
    router.get('/talk/:id', function(req, res){
      var talkID = req.params.id;
      Status.findOne({_id: talkID}, function(err, talk){
        if(err){
          handleError(err);
        } else {
            if (talk.username === req.decoded.username){
              res.json({success: true, talk: talk, like: talk.totallike, enabledEdit: true})
            } else {
              currentView = talk.statusview;
              countView = currentView+1;

              Status.findOneAndUpdate({_id:talkID}, {statusview:countView}, {new:true}, function(err, updateView){
                if(err){
                  throw err;
                } else {
                  countView: updateView.statusview;
                }
              })
              console.log('the views number is: ', countView)
              res.json({success: true, talk: talk, like: talk.totallike, enabledEdit: false, views: countView})
            }
          }
      })
    })

    //Post a comment by user in the talk page
    router.post('/comment/:id', function(req, res){
      var comment = new Comment();
      // var status = new Status();
      comment.statusid = req.params.id;
      comment.username = req.decoded.username;
      comment.comment  = req.body.comment;
      console.log('comment.comment', comment.comment)
      if(comment.comment === undefined || comment.comment === ''){
        return res.json({success: false, message: 'Fill needed in the comment box'});
      } else {
        Status.findOne({_id: req.params.id}, function(err, status){
          if(err) throw err;
          else {
            currentTotal = status.totalcomment;
            countComment= currentTotal+1;
            console.log("currentTotal comment should: ", currentTotal)
            console.log("countComment should increase: ", countComment)
            Status.findOneAndUpdate({_id: req.params.id}, {totalcomment:countComment}, {new:true}, function(err, count){
              if(err) throw err;
              // else {
              //   console.log("what is count object: ", count)
              //   console.log("what is total comment now: ", count.totalcomment);
              // }
            })
          }
        })
        comment.save(function(err){
          if(err){
            return handleError(err);
          }
          return res.json({success: true, message: 'You post a comment!', numberOfComment: countComment});
        })
      }
    })

    //route to get data of the comment on talk page back after comment and show it instantly
    router.get('/comment/:id', function(req, res){
      var idOfStatus = req.params.id;
      Comment.find({statusid: idOfStatus}, function(err, comments){ //statusid is the id of the status in comment document
        if(err){
          return handleError(err);
        } else {
            Vote.find({statusid: idOfStatus}, function(err, votes){ //statusid is the id of the status in comment document
              if(err){
                return handleError(err);
              } else {
                  return res.json({success: true,comments: comments, votes: votes, ownuserandcmm: req.decoded.username});
              }
            })

            // return res.json({success: true, comments: comments, ownuserandcmm: req.decoded.username, votestatus: 'Vote'});
        }
      })
    })

    //route to get data for update talk
    router.get('/updatetalk/:id', function(req, res){
      var talkID = req.params.id;
      Status.findOne({_id: talkID}, function(err, talk){
        if(err){
          return handleError(err);
        } else {
              if(talk.username === req.decoded.username){
                return res.json({success: true, talk: talk});
              } else {
                return res.json({success: false, message: "You are not the owner of this talk content!"})
              }
        }
      })
    })

    //route to update talk status
    router.put('/updatetalk', function(req, res){
      var talkID = req.body._id;
      Status.findOne({_id: talkID}, function(err, status){
        if(err){
          return handleError(err);
        } else {
          if(req.decoded.username === status.username){
            if(req.body.title !== undefined || req.body.title !== '' || req.body.title !== null){
              status.title = req.body.title;
              status.content = req.body.content;
              status.save(function(err){
                if(err){
                  return handleError(err);
                } else {
                  return res.json({success: true, message: 'Your new status is updated!'})
                }
              })
            } else {
              return res.json({success: false, message: 'Title of the content need to be filled'})
            }
          } else {
            return res.json({success: false, message: 'You are not authorized to be update this talk'})
          }
        }
      })
    })

    //Delete talk status
    router.delete('/deletetalk/:id', function(req, res){
      var deleteTalkID = req.params.id;
      var tokenUsername = req.decoded.username;
      Status.findOne({username: tokenUsername}, function(err, user){
        if(err){
          return handleError(err);
        } else {
              if(user.username === tokenUsername){
                Status.findOneAndRemove({_id: deleteTalkID}, function(err, status){
                  if(err){
                    return handleError(err);
                  } else {
                    return res.json({success: true, message: 'Status has been delete'})
                  }
                })
              }
              else return res.json({success: false, message: 'You are not the owner of this status'})
        }
      })

    })

    //Delete commnent in talk
    router.delete('/deleteCommnet/:id', function(req, res){
      var deleteID = req.params.id;
      console.log("Hello user null22222")

      Comment.findOne({username: req.decoded.username}, function(err, user){
        if(err){
          return handleError(err);
        } else {
          if(user){
            Comment.findOneAndRemove({_id: deleteID}, function(err, cmm){
              if(err){
                return handleError(err);
              } else {
                return res.json({success: true, message:'Message has been deleted'})
              }
            })
          }
          else {
            return res.json({success: false, message: 'You are not the owner of this comment'})
          }
        }
      })
    })

    //check if the user like talk status already yet?. in fact we need to geet all like number of comment and share in status collection "JUST ADD LATER :)"
    router.get('/checkiflike/:id', function(req, res){
      var like = new Like();
      Like.findOne({username: req.decoded.username, statusid: req.params.id}, function(err, isLike){
        if(err){
          return handleError(err);
        } else {
            if(!isLike){
              console.log('We cannot found record and this is the id')
              return res.json({isLike: false, symbol: 'Like'})
            } else {
              console.log('found like record')
              return res.json({isLike: true, symbol: 'Unlike'})
            }
        }
      })
    })

    //Like talk content and save that user to like document
    router.post('/peopleliketalkcontent/:id', function(req, res){
      var like = new Like();
       like.statusid = req.params.id;
       like.username = req.decoded.username;
       Status.findOne({_id: req.params.id}, function(err, status){
         if(err){
           return handleError(err);
         } else {
           currentLike = status.totallike;
           countLike = currentLike + 1;
           Status.findOneAndUpdate({_id: req.params.id}, {totallike: countLike}, {new: true}, function(err, like){
             if(err){
               return handleError(err);
             } else {
               countLike=like.totallike;
               console.log('this is count like: ', countLike)
             }
           })
         }
       })
         like.save(function(err){
         if(err){
         return res.json({success: false, message: 'You are already like this talk'})
         } else {
       return res.json({success: true, like:countLike, symbol: 'Unlike'})
     }
   })
})

//this one will delete like user from DB if the user change their mind to unlike talk status
router.delete('/peopleUnlikecontent/:id', function(req, res){
  var statusid = req.params.id;
  var likeuser = req.decoded.username;
  Status.findOne({_id: statusid}, function(err, status){
    if(err){
      return handleError(err);
    } else {
      currentLike = status.totallike;
      countLike = currentLike - 1;
      Status.findOneAndUpdate({_id: statusid},{totallike: countLike},{new: true}, function(err,like){
        if(err){
          return handleError(err);
        } else{
          countLike = like.totallike;
          console.log('now the count like decrease to: ', countLike)
        }
      })
    }
  })
  Like.findOneAndRemove({username: likeuser, statusid: statusid}, function(err, unlike){
    if(err){
      return handleError(err);
    } else {
      return res.json({success: true, unlike: countLike, symbol: 'Like'})
    }
  })
})

//this part is for vote comment section
//check vote first
router.get('/checkifvotecomment/:id', function(req, res){
  var vote = new Vote();
  Vote.findOne({username: req.decoded.username, commentid: req.params.id}, function(err, isVoteComment){
    if(err){
      return handleError(err);
    } else {
        if(!isVoteComment){
          console.log('We cannot found record and this is the id')
          return res.json({isVoteComment: false, symbol: 'Vote'})
        } else {
          console.log('found vote record')
          return res.json({isVoteComment: true, symbol: 'Unvote'})
        }
    }
  })
})
//route to get data of the comment on talk page back after comment and show it instantly
// router.get('/comment/:id', function(req, res){
//   var idOfStatus = req.params.id;
  // Vote.find({}, function(err, votes){ //statusid is the id of the status in comment document
  //   if(err){
  //     return handleError(err);
  //   } else {
  //          if(vote.username === req.decoded.username){
  //            return res.json({success: true, votes: votes, ownuserandcmm: req.decoded.username, votestatus: 'Unvote'});
  //          } else {
  //            return res.json({success: true, votes: votes, ownuserandcmm: req.decoded.username, votestatus: 'Vote'});
  //          }
  //   }
  // })
// })






//router forvotecomment
router.post('/peoplevotetalkcomment', function(req, res){
    var vote = new Vote();
     vote.commentid = req.body.commentid;
     vote.statusid = req.body.statusid;
     vote.username = req.decoded.username;
     console.log('this Test Vote: ', req.body.testVote)
     console.log('this is status ID: ', vote.statusid)
     Comment.findOne({_id: vote.commentid}, function(err, comment){
       if(err){
         return handleError(err);
       } else {
         currentVote = comment.vote;
         countVote = currentVote + 1;
         Comment.findOneAndUpdate({_id: vote.commentid}, {vote: countVote}, {new: true}, function(err, vote){
           if(err){
             return handleError(err);
           } else {
             countVote=vote.vote;
             console.log('this is count vote: ', countVote)
           }
         })
       }
     })
       vote.save(function(err){
       if(err){
       return res.json({success: false, message: 'You are already vote this talk'})
       } else {
     return res.json({success: true, vote:countVote, symbol: 'Unvote'})
   }
  })
})

//this one will delete vote user from DB if the user change their mind to unvote talk comment status
router.delete('/peopleunvotetalkcomment/:id', function(req, res){
  var commentid = req.params.id;
  var voteuser = req.decoded.username;
  Comment.findOne({_id: commentid}, function(err, comment){
    if(err){
      return handleError(err);
    } else {
      currentVote = comment.vote;
      countVote = currentVote - 1;
      Comment.findOneAndUpdate({_id: commentid},{vote: countVote},{new: true}, function(err,vote){
        if(err){
          return handleError(err);
        } else{
          countVote = vote.vote;
          console.log('now the count vote decrease to: ', countVote)
        }
      })
    }
  })
  Vote.findOneAndRemove({username: voteuser, commentid: commentid}, function(err, unvote){
    if(err){
      return handleError(err);
    } else {
      return res.json({success: true, unvote: countVote, symbol: 'Vote'})
    }
  })
})

router.post('/updateProfilePhoto', function(req, res){
  User.findOne({username: req.decoded.username}, function(err, user){
    if(req.body.profile && user){
      imageHelper.uploadBase64Image('./tmp/' +user.username + '_profile.jpg', req.body.profile, function(err, result){
          if(err) res.send(400, err);
          else{
            user.profile = String(result.url);
            user.save(function(err) {
              if(err) return validationError(res, err);
              return res.json({success: true})
            });
          }
        });
    }
  })
})

// //check for all vote comment: the status of each one of vote in each comments
// router.get('/checkeachstatusvoteintalkcomment:id', function(req, res){ // the id of status
//   Comment.find({_id:req.params.id}, function(err, votestatus){
//     if(err){
//       return handleError(err);
//     } else {
//
//     }
//   })
// })

    return router;
};
