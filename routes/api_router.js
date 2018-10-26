/** setting express */
var express = require('express');
var router = express.Router();

/** files .js that include the callback of request*/
var sensorDataController = require ('../controllers/sensorDataController');

var sensorsOperations = require ('../controllers/sensorsOperations');
var usersOperations = require ('../controllers/usersOperations');
var locationsOperations = require ('../controllers/locationsOperations');
var dataOperations = require ('../controllers/dataOperations');
var measurementOperations = require ('../controllers/measurementOperations');

/** Connect Mongo DB */
require('../database');


//router.get('/sensors/', sensorDataController.testGETapi);
//router.get('/sensors/:sensor_id', sensorDataController.testGETapi);
//router.post('/sensors/', sensorDataController.testPOSTapi);
//router.put('/sensors/:sensor_id', sensorDataController.testPUTapi);
//router.delete('/sensors/:sensor_id', sensorDataController.testDELETEapi);
//router.get('/sensors/:sensor_id/data/', sensorDataController.testGETapi);


/** SENSORS */

/** POST request to add a new sensor and create a related collection to save all sensor's values */
router.post('/sensors', sensorsOperations.addNewSensor);

/** GET request to get all sensors' name */
router.get('/sensors', sensorsOperations.getAllSensors);

/** DELETE request to delete a specific sensor from the collection */
router.delete('/sensors', sensorsOperations.deleteSensor);

/** PUT request to add a new measurement to a specific sensor */
router.put('/sensors', sensorsOperations.addNewMeasurement);

/** SENSOR */

/** GET request to get a specific sensor */
router.get('/sensor', sensorsOperations.getSpecificSensor);

/** PUT request to change a specific sensor'position */
router.put('/sensor/position', sensorsOperations.changePosition);


/** USERS */

/** POST request to add a new user */
router.post('/users', usersOperations.addNewUser);

/** GET request to get a specific user */
router.get('/users', usersOperations.getUser);

/** DELETE request to delete a specific user */
router.delete('/users', usersOperations.deleteUser);


/** LOCATIONS */

/** POST request to add a new location */
router.post('/location', locationsOperations.addNewLocation);

/** GET request to get a specific location */
router.get('/location', locationsOperations.getLocation);

/** DELETE request to delete a specific location */
router.delete('/location', locationsOperations.deleteLocation);


/** SENSORS' DATA */

/** POST request to add a new sensor's value */
router.post('/sensor/data', dataOperations.addNewValue);

/** GET request to get all values of a specific sensor in a determined range of time */
router.get('/sensor/data', dataOperations.getSensorValues);

/** GET request to get all values of a specific sensor related to a specific measurement in a determined range of time */
router.get('/sensor/:measurement/data', dataOperations.getValuesOfSensorMeasurement);

/** lo vogliamo fare ?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????? */
/** DELETE request to delete a specific sensor's value */
//router.delete('/sensor/data', dataOperations.deleteValue);


/** MEASUREMENTS */

/** POST request to add a new measurement */
router.post('/measurements', measurementOperations.addNewMeasurement);

/** GET request to get all the measurements */
router.get('/measurements', measurementOperations.getAllMeasurements);

/** GET request to get a specific measurement */
router.get('/measurement', measurementOperations.getSpecificMeasurement);

/** lo vogliamo fare ?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????? */
/** DELETE request to delete a specific measurement */
//router.delete('/measurements', measurementOperations.deleteMeasurement);





module.exports = router;
