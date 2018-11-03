var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('users');

module.exports.register = function(req, res) {

    console.log("Try to register new User ! ");
    var user = new User();

    user.email = req.body.email;
    user.name = req.body.name;
    user.surname = "Test";
    user.admin = false;

    console.log("Try to register User: ", user.name);
    console.log("Try to register with mail: ", user.email);
    console.log("Try to register with password: ", req.body.password);

    user.setPassword(req.body.password);

    user.save(function(err) {
            var token;
            token = user.generateJwt();
            res.status(200);
            res.json({
            "token" : token
        });
    });
};

module.exports.login = function(req, res) {

    passport.authenticate('local', function(err, user, info){
        var token;

        // If Passport throws/catches an error
        if (err) {
            res.status(404).json(err);
            return;
        }

        // If a user is found
        if(user){
            token = user.generateJwt();
            res.status(200);
            res.json({
                "token" : token
        });

        } else {
            // If user is not found
            res.status(401).json(info);
        }
    })(req, res);

};

module.exports.getUser = function(req, res) {

    User.findOne({"email": req.params.mail}, function(err, value){
        if(err){
            res.send(500);
        } else {
            res.json(value);
        }
    });

}