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

    /** Add the new user to users' collection */
    users.create(user, function(err, response){
        if(err){
            return res.send(400);
        } else {
            res.send(200);
        }
   });
};

/** Callback to get a specific user */
module.exports.getUser = function(req, res, next){
    var email = req.param('email'); /** l'email funge da ID */
    
    users.findOne({"email": email}, {"_id":0}, function(err, user) {
        if(user == null) {
            res.send(404);
        } else if (err) {
            res.send(400);
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
            res.send(400);
        } else {
            res.send(200);
        }
    });
};
