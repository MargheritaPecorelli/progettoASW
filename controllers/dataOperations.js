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

    _checkMeasurementAndAddValue(res, idSensor, measurementType, value);
};

/** Checks if this type of measurement is one of those of the sensor */
function _checkMeasurementAndAddValue(res, idSensor, measurementType, value) {
    sensors.findOne({"idSensor": idSensor},  function(err, response) {
        for(var i = 0; i < response.measurements.length; i++){
            if(measurementType == response.measurements[i].measurementType) {
                return _addValue(res, idSensor, value);
            }
        }
        return res.send(400, "This sensor hasn't this type of measurement. Please, add it to the sensor before continuing!");
    });
};

/** Checks if this type of measurement is present in the DB */
function _addValue(res, idSensor, value){
    var collection = _getCollection(idSensor);
    
    /** Add the new data to sensor's collection */
    collection.create(value, function(err, response){
        if(err){
            return res.send(500);
        } else {
            res.send(200, "Value added!");
        }
    });
};

/** Callback to get all values of a specific sensor in a determined range of time */
module.exports.getSensorValues = function(req, res, next){
    var idSensor = req.param('idSensor');
    var start = req.param('start');
    var end = req.param('end');

    var now = new Date();
    var endDate = new Date(end);
    var startDate = new Date(start);

    if(endDate.getTime() > now.getTime()) {
        return res.send(500, "The \"end\" date is in the future, please choose a valid date");
    } else if(endDate.getTime() <= startDate.getTime()){
        return res.send(500, "The \"end\" date is before the \"start\" date, please choose a valid date");
    }

    var collection = _getCollection(idSensor);
    
    collection.find({ "timestamp": { $gte: start, $lt: end}},{"_id":0, "__v":0},function(err, value){
        if(err){
            res.send(500);
        } else if(value.length == 0) {
            res.send(404, "In this specific range of time, there are no values that match to this sensor");
        } else {
            res.json(value);
        }
    });
};

/** Callback to get all values of a specific sensor related to a specific measurement in a determined range of time */
module.exports.getSomeValuesOfSpecificSensorMeasurement = function(req, res, next){
    var idSensor = req.param('idSensor');
    var measurementType = req.param('measurementType');
    var start = req.param('start');
    var end = req.param('end');
    
    var now = new Date();
    var endDate = new Date(end);
    var startDate = new Date(start);

    if(endDate.getTime() > now.getTime()) {
        return res.send(500, "The \"end\" date is in the future, please choose a valid date");
    } else if(endDate.getTime() <= startDate.getTime()){
        return res.send(500, "The \"end\" date is before the \"start\" date, please choose a valid date");
    }

    _checkMeasurementAndFindValues(res, idSensor, start, end, measurementType)  
};

/** Checks if this type of measurement is one of those of the sensor */
function _checkMeasurementAndFindValues(res, idSensor, start, end, measurementType) {
    sensors.findOne({"idSensor": idSensor},  function(err, response) {
        var found = false;
        for(var i = 0; i < response.measurements.length; i++){
            if(measurementType == response.measurements[i].measurementType) {
                found = true;
                return _findValues(res, idSensor, start, end, measurementType);
            } else if((i == (response.measurements.length -1)) && !found) {
                return res.send(404, "This sensor hasn't this type of measurement. Please, choose one of the measurements already present in this sensor!");        
            }
        }
    });
};

/** Finds values of this specific sensor in that timestamp */
function _findValues(res, idSensor, start, end, measurementType) {
    var collection = _getCollection(idSensor);
    collection.find({
        $and: [{"timestamp": { $gte: start, $lt: end}
    }, {"measurementType": measurementType}]}, {"_id":0, "__v":0, "measurementType":0}, function(err, value){
        if(err){
            res.send(500);
        } else if(value.length == 0) {
            res.send(404, "In this specific range of time, there are no values that match to this measurement and this sensor");
        } else {
            var resultsList = [];
            var val = JSON.stringify(value);
            var str = '{\"id\": \"' + idSensor + '\", \"data\": ' + val + '}';
            resultsList.push(JSON.parse(str));
            res.status(200);
            res.json(resultsList);
        }
    });
};

/** Callback to get all values of a specific sensors' list related to a specific measurement in a determined range of time */
module.exports.getValuesOfSomeSensorsMeasurement = function(req, res, next){
    var idSensors = req.param('idSensors');
    var measurementType = req.param('measurementType');
    var start = req.param('start');
    var end = req.param('end');

    var sensorsList = idSensors.split(",");
    
    var now = new Date();
    var endDate = new Date(end);
    var startDate = new Date(start);

    if(endDate.getTime() > now.getTime()) {
        return res.send(500, "The \"end\" date is in the future, please choose a valid date");
    } else if(endDate.getTime() <= startDate.getTime()){
        return res.send(500, "The \"end\" date is before the \"start\" date, please choose a valid date");
    }

    _checkMeasurementAndFindAllSensorsValues(res, sensorsList, start, end, measurementType, 0, []);
};
    

/** Checks if this type of measurement is one of those of the sensor */
function _checkMeasurementAndFindAllSensorsValues(res, sensorsList, start, end, measurementType, index, resultsList) {
    var idSensor = sensorsList[index];
    sensors.findOne({"idSensor": idSensor},  function(err, response) {
        for(var i = 0; i < response.measurements.length; i++){
            if(measurementType == response.measurements[i].measurementType) {
                _findAllValues(res, idSensor, start, end, measurementType, sensorsList, index, resultsList);
            }
        }
    });
};

/** Finds values of this specific sensor in that timestamp */
function _findAllValues(res, idSensor, start, end, measurementType, sensorsList, index, resultsList) {
    var collection = _getCollection(idSensor);
    collection.find({
        $and: [{"timestamp": { $gte: start, $lt: end}
    }, {"measurementType": measurementType}]}, {"_id":0, "__v":0, "measurementType":0}, function(err, value){
        if(err){
            return res.send(500);
        } else if(value.length == 0) {
            console.log("In this specific range of time, there are no values that match to this measurement and this sensor");
            // return res.send(404, "In this specific range of time, there are no values that match to this measurement and this sensor");
        } else {
            var val = JSON.stringify(value);
            var str = '{\"id\": \"' + idSensor + '\", \"data\": ' + val + '}';
            resultsList.push(JSON.parse(str));
            if(index == (sensorsList.length - 1)) {
                res.status(200);
                res.json(resultsList);
            } else {
                _checkMeasurementAndFindAllSensorsValues(res, sensorsList, start, end, measurementType, (index+1), resultsList);
            }           
        }
    });
};


/** Callback to get all sensors' values of a specific measurement in a determined range of time */
module.exports.getSomeValuesOfSpecificMeasurement = function(req, res, next){
    var measurementType = req.param('measurementType');
    var start = req.param('start');
    var end = req.param('end');

    var now = new Date();
    var endDate = new Date(end);
    var startDate = new Date(start);

    if(endDate.getTime() > now.getTime()) {
        return res.send(500, "The \"end\" date is in the future, please choose a valid date");
    } else if(endDate.getTime() <= startDate.getTime()){
        return res.send(500, "The \"end\" date is before the \"start\" date, please choose a valid date");
    }

    sensors.find({
        measurements: {
            $elemMatch: {
                "measurementType": measurementType
           }
        }
    }, {"_id":0, '__v': 0, 'name':0, 'measurements': 0, 'position': 0}, function(err, sensorsList) {
        if(sensorsList.length == 0) {
            res.send(404, "No values found. Please check if the measurement and the range of time are correct!");
        } else if (err) {
            res.send(500);
        } else {
            var dataList = [];
            sensorsList.forEach(elem => {
                var collection = _getCollection(elem.idSensor);
        
                collection.find({
                    $and: [{
                        "timestamp": { $gte: startDate, $lt: endDate}
                    }, {"measurementType": measurementType}]}, {"_id":0, "__v":0, "measurementType":0}, function(err, value){
                        if(err){
                            return res.send(500);
                        } else {
                            var val = JSON.stringify(value);
                            var str2 = '{\"id\": \"' + elem.idSensor + '\", \"data\": ' + val + '}';
                            dataList.push(JSON.parse(str2));
                            if(dataList.length == sensorsList.length) {
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