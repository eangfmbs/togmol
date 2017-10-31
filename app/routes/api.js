var User    = require('../models/user');

//create new user route (http://localhost:8080/users)
module.exports = function (router) {
    router.post('/users', function (req, res) {
        var user = new User();
        user.username = req.body.username;
        user.password = req.body.password;
        user.email    = req.body.email;
        if(user.username=='' ||user.password=='' ||user.email=='' || user.username==null ||user.password==null ||user.email==null){
            res.send("Every box need info");
        } else {
            user.save(function (err) {
                if(err){
                    res.send("We are sorry! This username has already taken. Please try another one.");
                } else {
                    res.send("User created!");
                }
            });
        }
    });
    return router;
}