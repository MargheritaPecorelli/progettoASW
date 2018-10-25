/** Model scheme of collections */
var measurements = require('../models/measurements');
var connection = require('../database');


/** Callback to add a new measurement */
module.exports.addNewMeasurement = function(req, res, next){
    var measurementType = req.param('measurementType');
    var uom = req.param('uom');

    var measurement = {
        "measurementType" : measurementType,
        "uom" : uom
    };

    measurements.create(measurement, function(err, response){
        if(err){
            return res.send(400);
        } else {
            res.send(200);
        }
   });
};

/** Callback to get all the measurements */
module.exports.getAllMeasurements = function(req, res, next){
    measurements.find({}, {'_id':0}, function(err, value){
        if(err){
            res.send(500);
        } else {
            res.json(value);
        }
    });
};

/** Callback to get a specific measurement */
module.exports.getSpecificMeasurement = function(req, res, next){
    var measurementType = req.param('measurementType');

    measurements.findOne({"measurementType": measurementType}, {"_id":0}, function(err, measurement) {
        if(measurement == null) {
            res.send(404);
        } else if (err) {
            res.send(400);
        } else {
            res.json(measurement); 
        }
    });
    
};

/** Callback to delete a specific measurement */
module.exports.deleteMeasurement = function(req, res, next){
    var uom = req.param('uom');
    
    measurements.findOneAndRemove({"uom": uom}, function(err, measurement) {
        if(measurement == null) {
            res.send(404);
        } else if (err) {
            res.send(400);
        } else {
            res.send(200);
        }
    });
};
