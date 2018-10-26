/** Model scheme of collections */
var data = require('../models/data');
var connection = require('../database');


/** Callback to add a new sensor's value */
module.exports.addNewValue = function(req, res, next){
    var idSensor = req.param('idSensor');
    var value = req.param('value');
    var measurementType = req.param('measurementType');
    var timestamp = req.param('timestamp');

    var value = {
        "value" : value,
        "measurementType" : measurementType,
        "timestamp" : timestamp
    };

    var collection = _getCollection(idSensor);

    /** Add the new data to sensor's collection */
    collection.create(value, function(err, response){
        if(err){
            return res.send(400);
        } else {
            res.send(200);
        }
   });
};

/** Callback to get all values of a specific sensor in a determined range of time */
module.exports.getSensorValues = function(req, res, next){
    var idSensor = req.param('idSensor');
    //var sensorName = req.param('sensorName');
    var start = req.param('start');
    var end = req.param('end');

    var collection = _getCollection(idSensor);
    
    var endDate = new Date(end);
    var startDate = new Date(start);

    collection.find({ "timestamp": { $gte: startDate, $lt: endDate}},{"_id":0, "__v":0},function(err, value){
        if(err){
            res.send(500);
        } else {
            res.json(value);
        }
    });
};

/** Callback to get all values of a specific sensor related to a specific measurement in a determined range of time */
module.exports.getValuesOfSensorMeasurement = function(req, res, next){
    var idSensor = req.param('idSensor');
    //var sensorName = req.param('sensorName');
    var measurementType = req.param('measurementType');
    var start = req.param('start');
    var end = req.param('end');

    var collection = _getCollection(idSensor);
    
    var endDate = new Date(end);
    var startDate = new Date(start);

    collection.find( {$and: [{"timestamp": { $gte: startDate, $lt: endDate}}, {"measurementType": measurementType}]}, {"_id":0, "__v":0, "measurementType":0}, function(err, value){
        if(err){
            res.send(500);
        } else {
            res.json(value);
        }
    });
};

/** Finds the right collection from which to take sensor's data */
function _getCollection(idSensor){
    var mongoose = require('mongoose');
    var nameCollection= ""+idSensor+"";
    var Schema = require('../models/data');
    return mongoose.model(idSensor, Schema, nameCollection);   
};