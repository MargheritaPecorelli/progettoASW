/** Model scheme of collections */
var users = require('../models/users');
var connection = require('../database');


/** Callback to add a new user */
module.exports.addNewUser = function(req, res, next){
    var email = req.param('email');
    var name = req.param('name');
    var surname = req.param('surname');
    var admin = req.param('admin');

    var user = {
        "email": email,
        "name" : name,
        "surname": surname,
        "admin": admin
    };

    users.findOne({"email":email}, function(err, response){
        if(err){
            return res.send(500);
        } else if(response == null) {
           /** Add the new user to users' collection */
            users.create(user, function(error, resp){
                if(error){
                    return res.send(500);
                } else {
                    res.send(200);
                }
            });
        } else {
            console.log("this mail is already registered!");
            res.send(400);
        }
    });
};

/** Callback to add a new user with also salt and hash of the password */
module.exports.addNewUserWithPsw = function(req, res, next){
    var email = req.param('email');
    var name = req.param('name');
    var surname = req.param('surname');
    var admin = req.param('admin');
    var salt = req.param('salt');
    var hash = req.param('hash');

    var user = {
        "email": email,
        "name" : name,
        "surname": surname,
        "admin": admin,
        "salt": salt,
        "hash": hash
    };

    users.findOne({"email":email}, function(err, response){
        if(err){
            return res.send(500);
        } else if(response == null) {
           /** Add the new user to users' collection */
            users.create(user, function(error, resp){
                if(error){
                    return res.send(500);
                } else {
                    res.send(200);
                }
            });
        } else {
            console.log("this mail is already registered!");
            res.send(400);
        }
    });
};

/** Callback to get all users */
module.exports.getAllUsers = function(req, res, next){
    users.find({}, {"_id":0, '__v': 0}, function(err, value) {
        if (err) {
            res.send(500);
        } else {
            res.json(value); 
        }
    });
};

/** Callback to get a specific user */
module.exports.getUser = function(req, res, next){
    var email = req.param('email'); /** l'email funge da ID */
    
    users.findOne({"email": email}, {"_id":0, '__v': 0}, function(err, user) {
        if(user == null) {
            res.json(user);
            res.status(404);
        } else if (err) {
            res.send(500);
        } else {
            res.json(user); 
        }
    });
};

/** Callback to delete a specific user */
module.exports.deleteUser = function(req, res, next){
    var email = req.param('email'); /** l'email funge da ID */
    
    users.findOneAndRemove({"email": email}, function(err, user) {
        if(user == null) {
            res.send(404);
        } else if (err) {
            res.send(500);
        } else {
            res.send(200);
        }
    });
};
