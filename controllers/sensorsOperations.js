/** Model scheme of collections */
var sensors = require('../models/sensors');
var connection = require('../database');
var measurementsTypes = require('../models/measurements');
var location = require('../models/location');

/** Callback to add a new sensor and create a new collection related to this specific sensor */
module.exports.addNewSensor = function(req, res, next){
    var idSensor = req.param('idSensor');
    var name = req.param('name');
    var measurements = req.param('measurements'); //{"measurementType": "temperature", "uom": "C"}; {"measurementType": "pressure", "uom": "Pa"}
    var position = req.param('position'); //{"latitude": 3, "longitude": 4, "elevetion": 5, "idLocation": "L1"}

    var positionJSON = JSON.parse(position);

    var measurementsArray = measurements.split(";");
    var measArr = [];

    /** Checks if this location is present in the DB */
    var loc = positionJSON.idLocation;
    location.findOne({"idLocation": loc}, function(err, response){
        if(err){
            console.log("position Error");
            return res.send(500);
        } else if(response == null) {
            return res.send(400, "this idLocation is not present. Please, add it to the DB before continuing or pick one already present!");
        } else {
            for(var j = 0; j < measurementsArray.length; j++) {
                var el = JSON.parse(measurementsArray[j]);     
                measArr.push(el);
            }
            /** Checks if this types of measurements are present in the DB */
            _checkMeasurementsAndCreateSensor(measArr, 0, res, idSensor, name, positionJSON);
        }
    });
};

/** Checks if this types of measurements are present in the DB and, if every things is all right, create the new sensor */
function _checkMeasurementsAndCreateSensor(measArr, i, res, idSensor, name, positionJSON){
    if(i == measArr.length){
        return _createSensorAndItsCollection(idSensor, name, measArr, positionJSON, res)
    }
    measurementsTypes.findOne({"measurementType": measArr[i].measurementType}, function(err, response){
        if(err){
            console.log("measurements Error");
            return res.send(500);
        } else if(response == null) {
            return res.send(400, "this type of measurement is not present. Please, add it to the DB before continuing!");
        } else {
            _checkMeasurementsAndCreateSensor(measArr, i+1, res, idSensor, name, positionJSON);
        }
    });
};

/** Creates the new sensor and its collection in the DB */
function _createSensorAndItsCollection(idSensor, name, measArr, positionJSON, res){
    var sensor = {
        "idSensor": idSensor,
        "name" : name,
        "measurements": measArr,
        "position": positionJSON
    };

    sensors.findOne({"idSensor":idSensor}, function(err, response){
        if(err){
            console.log("sensor Error");
            return res.send(500);
        } else if(response == null) {
            /** Add the new sensor to sensors' collection and create a new collection related to this specific sensor */
            sensors.create(sensor, function(err, response){
                if(err){
                    return res.sendStatus(400);
                } else {
                    /** create a new collection related to this specific sensor */
                    connection.createCollection(idSensor);
                    res.send(200, "sensor added and collection created");
                }
            });
        } else {
            res.send(400, "this idSensor is been already used!");
        }
    });   
};

/** Callback to get all sensors' name */
module.exports.getAllSensors = function(req, res, next){
    sensors.find({}, {'_id':0, '__v': 0}, function(err, value){
        if(err){
            res.send(500);
        } else {
            res.json(value);
        }
    });
};

/** Callback to get a specific sensor */
module.exports.getSpecificSensor = function(req, res, next){
    var idSensor = req.param('idSensor');

    sensors.findOne({"idSensor": idSensor}, {"_id":0, '__v': 0}, function(err, sensor) {
        if(sensor == null) {
            res.send(404);
        } else if (err) {
            res.send(400);
        } else {
            res.json(sensor); 
        }
    });
    
};

/** Callback to delete a specific sensor from the collection */
module.exports.deleteSpecificSensor = function(req, res, next){
    var idSensor = req.param('idSensor');
    
    sensors.findOneAndRemove({"idSensor": idSensor}, function(err, sensor) {
        if(sensor == null) {
            res.send(404);
        } else if (err) {
            res.send(400);
        } else {
            res.send(200);
        }
    });
};

/** Callback to add a new measurement to a specific sensor */
module.exports.addNewMeasurement = function(req, res, next){
    var idSensor = req.param('idSensor');
    var measurement = req.param('measurement');

    var measurementJSON = JSON.parse(measurement);
    
    /** Checks if this type of measurement is present in the DB */
    _checkMeasurements(measurementJSON, res, idSensor);
};

/** Checks if this type of measurement is present in the DB */
function _checkMeasurements(measurementJSON, res, idSensor){
    // if(i == measArr.length){
    //     return _addMeasurements(idSensor, name, measArr, positionJSON, res)
    // }
    measurementsTypes.findOne({"measurementType": measurementJSON.measurementType}, function(err, response){
        if(err){
            console.log("measurements Error");
            return res.send(500);
        } else if(response == null) {
            return res.send(400, "this type of measurement is not present. Please, add it to the DB before continuing!");
        } else {
            return _addMeasurements(idSensor, measurementJSON, res);
        }
    });
};

/** Adds the measurements to the specific sensor */
function _addMeasurements(idSensor, measurementJSON, res){
    sensors.findOne({"idSensor":idSensor}, function(err, response){
        if(response == null) {
            return res.send(404, "sensor not found!");
        } else {
            for(var i = 0; i < response.measurements.length; i++) {
                if(measurementJSON.measurementType == response.measurements[i].measurementType) {
                    return res.send(200, "measurement already present in this sensor");
                }
            }
            sensors.update({"idSensor": idSensor},{ $push: { "measurements": [measurementJSON] }}, function(err, resp){
                if(err){
                    res.send(500);
                }
                res.send(200, "measurement added");
            });
        }
    });
};

/** Returns the minimum value between first and second */
function _getMin(first, second){
    return first <= second ? first : second;
};

/** Callback to change a specific sensor'position */
module.exports.changePosition = function(req, res, next){
    var idSensor = req.param('idSensor');
    var position = req.param('position'); //{"latitude": 3, "longitude": 4, "elevetion": 5, "idLocation": "prova"}
    
    var positionJSON = JSON.parse(position);

    sensors.findOne({"idSensor":idSensor}, function(err, response){
        if(err){
            return res.send(500);
        } else if(response == null) {
            console.log("this sensor doesn't exist");
            res.send(404);
        } else {
            sensors.update({"idSensor": idSensor},{ $set: { "position": positionJSON }},function(err, sensor){
                if(err){
                    return res.send(500);
                }
                console.log("position changed");
                res.send(200);
            });
        }
    });
};
