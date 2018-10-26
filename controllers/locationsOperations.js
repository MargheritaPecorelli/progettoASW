/** Model scheme of collections */
var locations = require('../models/location');
var connection = require('../database');


/** Callback to add a new location */
module.exports.addNewLocation = function(req, res, next){
    var idLocation = req.param('idLocation');
    var name = req.param('name');
    var room = req.param('room');
    var block = req.param('block');
    var level = req.param('level');
    var campus = req.param('campus');
    var city = req.param('city');

    var location = {
        "idLocation": idLocation,
        "name" : name,
        "room" : room,
        "block" : block,
        "level" : level,
        "campus" : campus,
        "city" : city
    };

    locations.findOne({"idLocation":idLocation}, function(err, response){
        if(err){
            return res.send(500);
        } else if(response == null) {
            /** Add the new location to locations' collection */
            locations.create(location, function(err, response){
                if(err){
                    return res.send(400);
                } else {
                    res.send(200);
                }
            });
        } else {
            console.log("this idLocation is been already used!");
            res.send(400);
        }
    });
};

/** Callback to get all locations */
module.exports.getAllLocations = function(req, res, next){    
    locations.find({}, {"_id":0, '__v': 0}, function(err, value) {
        if (err) {
            res.send(500);
        } else {
            res.json(value); 
        }
    });
};

/** Callback to get a specific location */
module.exports.getLocation = function(req, res, next){
    var idLocation = req.param('idLocation');
    
    locations.findOne({"idLocation": idLocation}, {"_id":0, '__v': 0}, function(err, location) {
        if(location == null) {
            res.send(404);
        } else if (err) {
            res.send(400);
        } else {
            res.json(location); 
        }
    });
};

/** Callback to delete a specific location */
module.exports.deleteLocation = function(req, res, next){
    var idLocation = req.param('idLocation');
    
    locations.findOneAndRemove({"idLocation": idLocation}, function(err, location) {
        if(location == null) {
            res.send(404);
        } else if (err) {
            res.send(400);
        } else {
            res.send(200);
        }
    });
};
