/** Model scheme of collections */
var sensors = require('../models/sensors');
var connection = require('../database');


/** Callback to add a new sensor and create a new collection related to this specific sensor */
module.exports.addNewSensor = function(req, res, next){
    var idSensor = req.param('idSensor');
    var name = req.param('name');
    var measurements = req.param('measurements'); //{type: temperature, u.o.m.: celsius}; {type: pressure, u.o.m.: Pa}
    var position = req.param('position'); //{"latitude": 3, "longitude": 4, "elevetion": 5, "idLocation": "prova"}

    var positionJSON = JSON.parse(position);
    // console.log(positionJSON);
    // console.log(positionJSON.latitude);

    var measurementsArray = measurements.split(";");
    
    var sensor = {
        "idSensor": idSensor,
        "name" : name,
        "measurements": measurementsArray,
        "position": positionJSON
    };

    /** Add the new sensor to sensors' collection and create a new collection related to this specific sensor */
    sensors.create(sensor, function(err, response){
        if(err){
            return res.sendStatus(400);
        } else {
            /** create a new collection related to this specific sensor */
            connection.createCollection(idSensor+"."+name);
            res.send(200);
        }
   });
};

/** Callback to get all sensors' name */
module.exports.getAllSensors = function(req, res, next){
    sensors.find({}, {'_id':0, 'name':1}, function(err, value){
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

    sensors.findOne({"idSensor": idSensor}, {"_id":0}, function(err, sensor) {
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
module.exports.deleteSensor = function(req, res, next){
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
    
    sensors.findOne({"idSensor":idSensor,"measurement": measurement}, function(err, response){
        if(response == null) {
            console.log("measurement added");
            sensors.update({"idSensor": idSensor},{ $push: { "measurement": [measurement] }},function(err, sensor){
                if(err){
                    res.send(500);
                }
                res.send(200);
            });
        } else {
            console.log("already present");
            res.send(200);
        }
    });
};

// module.exports.prova = function(req, res, next){
//     console.log("prova riuscita");
//     res.send(200);
// };