var FacebookStrategy = require('passport-facebook').Strategy;
var User         = require('../models/user');
var session      = require('express-session');
var jwt         = require('jsonwebtoken');
var secret      = 'intelligent'; //whatever it just a secret

module.exports = function(app, passport){

  app.use(passport.initialize());
  app.use(passport.session());
  app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))

  passport.serializeUser(function(user, done) {
    if(user.activate){
      token = jwt.sign({username: user.username, email: user.email},secret, {expiresIn:'24h'});
    } else {
      token = 'inactivate/error'
    }
  done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
    });
  });

  passport.use(new FacebookStrategy({
    clientID: '134786117183074',
    clientSecret: 'd7d8ef4b75c1bb385451597c4870c6be',
    callbackURL: "http://localhost:8080/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'photos', 'email']
  },
  function(accessToken, refreshToken, profile, done) {
    // console.log('this is profile of facebook data: ', profile)
    User.findOne({email: profile._json.email}).select('username activate password email').exec(function(err, user){
      if(err){
        done(err);
      }
      if(user && user!==null){
        // console.log("this is user data: ", user)
        done(null, user);
      } else {
        done(err);
      }
    })
    // done(null, profile); //if we return this it will take the profile from facebook. but in fact we want to return data from the db
  }
 ));

 app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/facebookerror' }), function(req, res){
   res.redirect('/facebook/'+token);
 });
 app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' })
);

 return passport;
}
