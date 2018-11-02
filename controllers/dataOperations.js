/** Model scheme of collections */
var data = require('../models/data');
var connection = require('../database');
var sensors = require('../models/sensors');


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

    collection.find({
        $and: [{"timestamp": { $gte: startDate, $lt: endDate}
    }, {"measurementType": measurementType}]}, {"_id":0, "__v":0, "measurementType":0}, function(err, value){
        if(err){
            res.send(500);
        } else {
            res.json(value);
        }
    });
};

/** Callback to get all sensors' values of a specific measurement in a determined range of time */
module.exports.getAllValuesOfMeasurement = function(req, res, next){
    var measurementType = req.param('measurementType');
    var start = req.param('start');
    var end = req.param('end');

    var endDate = new Date(end);
    var startDate = new Date(start);

    var sensorsList = [];

    sensors.find({
        measurements: {
            $elemMatch: {
                "measurementType": measurementType
           }
        }
    }, {"_id":0, '__v': 0, 'name':0, 'measurements': 0, 'position': 0}, function(err, sensorsL) {
        if(sensorsL == null) {
            res.send(404);
        } else if (err) {
            res.send(400);
        } else {
            sensorsList = sensorsL;

            var dataList = [];
            sensorsList.forEach(elem => {
                var idSens = elem.idSensor;
                var collection = _getCollection(idSens);
        
                collection.find({
                    $and: [{
                        "timestamp": { $gte: startDate, $lt: endDate}
                    }, {"measurementType": measurementType}]}, {"_id":0, "__v":0, "measurementType":0}, function(err, value){
                        if(err){
                            return res.sendStatus(500);
                        } else {
                            var val = JSON.stringify(value);
                            var str2 = '{\"id\": \"' + idSens + '\", \"data\": ' + val + '}';
                            dataList.push(JSON.parse(str2));
                            if(dataList.length == sensorsList.length) {
                                // console.log(dataList);
                                // console.log(dataList[0].id);
                                // console.log(dataList[0].data[0].timestamp);
                                res.status(200);
                                res.json(dataList);
                            }
                        }
                });
            });
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