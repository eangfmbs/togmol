var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var validate = require('mongoose-validator');
var passport = require('passport');
var Schema = mongoose.Schema;

var usernameValidator = [
    validate({
        validator: 'isAlphanumeric',
        message: 'Username must contain only alphabet and number only'
    }),
    validate({
        validator: 'isLength',
        arguments: [1, 35],
        message: 'Your username should has length btw {ARGS[0]} to {ARGS[1]}'
    })
];
var emailValidator = [
    validate({
        validator: 'isEmail',
        message: 'This is not a valid email address'
    }),
    validate({
        validator: 'isLength',
        arguments: [5, 50],
        message: 'Your email should has length btw {ARGS[0]} to {ARGS[1]}'
    })
];
var passwordValidator = [
  validate({
      validator: 'isLength',
      arguments: [5, 25],
      message: 'Your password should has length btw {ARGS[0]} to {ARGS[1]}'
  })
];

var userSchema = new Schema({
    username: {type: String, lowercase: true, required: true, unique: true, validate: usernameValidator},
    email: {type: String, lowercase: true, required: true, unique: true, validate: emailValidator},
    password: {type: String, required: true, validate: passwordValidator, select: false},
    profile: {type: String, required: true, default: 'dummyprofile.jpg'},
    activate: {type: Boolean, required: true, default: false},
    temporarytoken: {type: String, required: true},
    resettoken: {type: String, required: false},
    permission: {type: String, required: true, default: 'user'},
    date: { type: Date, required: true, default: Date.now },
});

userSchema.pre('save', function(next) {
    var user = this;
    //isModified here is to help while activate account and we no need to deal with password so it prevent from error
    if(!user.isModified('password')){
        return next();
    }
    bcrypt.hash(user.password, null, null, function(err, hash){
        if(err){
            return next(err);
        }else{
            user.password = hash;
            next();
        }
    })
});

userSchema.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

//Post Status table
// var statusSchema = new Schema({
//   statustitle: {type: String, required: true},
//   statuscontent: {type: String, required: false},
//   totallike: {type: String, required: false, default: '0'},
//   statusview: {type: String, required: false, default: '0'},
//   totalcomment: {type: String, required: false, default: '0'},
//   date: {type: Date, required: true, default: Date.now},
//   userid: {type: String, required: true}
// })

// Login with facebook
//     FacebookStrategy = require('passport-facebook').Strategy;
//
//     passport.use(new FacebookStrategy({
//         clientID: 125363151562234,
//         clientSecret: ff693bd4ddf45060b28a5de72d0c62b0,
//         callbackURL: "http://localhost:8080/auth/facebook/callback"
//     },
//     function(accessToken, refreshToken, profile, done) {
//         User.findOne({username:req.body.username}, function(err, user) {
//             if (err) { return done(err); }
//             done(null, user);
//         });
//     }
// ));

module.exports = mongoose.model('User', userSchema);
// module.exports = mongoose.model('Status', statusSchema);
