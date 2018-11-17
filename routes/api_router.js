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

var authenticationOperations = require('../controllers/authenticationController');


/** AUTHENTICATION */
router.post('/auth/login', authenticationOperations.login);

router.post('/auth/register', authenticationOperations.register);

router.get('/auth/profile/:mail', authenticationOperations.getUser);


/** SENSORS */

/** GET request to get all sensors' name */
router.get('/sensors', sensorsOperations.getAllSensors);

/** SENSOR */

/** POST request to add a new sensor and create a related collection to save all sensor's values */
router.post('/sensor', sensorsOperations.addNewSensor);

/** GET request to get a specific sensor */
router.get('/sensor', sensorsOperations.getSpecificSensor);

/** DELETE request to delete a specific sensor from the collection */
router.delete('/sensor', sensorsOperations.deleteSpecificSensor);

/** PUT request to change a specific sensor's position */
router.put('/sensor/position', sensorsOperations.changePosition);

/** PUT request to add a new measurement to a specific sensor */
router.put('/sensor/add/measurement', sensorsOperations.addNewMeasurement);

/** PUT request to romove a speific measurement from a specific sensor */
router.put('/sensor/remove/measurement', sensorsOperations.removeMeasurement);


/** USERS */

/** GET request to get all users */
router.get('/users', usersOperations.getAllUsers);


/** USER */

/** POST request to add a new user */
router.post('/user', usersOperations.addNewUser);

/** POST request to add a new user with also salt and hash of the password */
router.post('/userPsw', usersOperations.addNewUserWithPsw);

/** GET request to get a specific user */
router.get('/user', usersOperations.getUser);

/** DELETE request to delete a specific user */
router.delete('/user', usersOperations.deleteUser);


/** LOCATIONS */

/** GET request to get all locations */
router.get('/locations', locationsOperations.getAllLocations);

/** GET request to get all levels of a specific campus in a specific city */
router.get('/levels', locationsOperations.getLevels);

/** GET request to get all blocks present in a specific level of a specific campus in a specific city */
router.get('/blocks', locationsOperations.getBlocksOfALevel);

/** GET request to get all rooms in a specific block present in a specific level of a specific campus in a specific city */
router.get('/rooms', locationsOperations.getRoomsFromBlockAndLevel);

/** GET request to get all sensors in a specific room of a specific campus in a specific city */
router.get('/locations/sensors', locationsOperations.getSensorsOfARoom);


/** LOCATION */

/** POST request to add a new location */
router.post('/location', locationsOperations.addNewLocation);

/** GET request to get a specific location */
router.get('/location', locationsOperations.getLocation);

/** DELETE request to delete a specific location */
router.delete('/location', locationsOperations.deleteLocation);


/** SENSOR'S DATA */

/** POST request to add a new sensor's value */
router.post('/sensor/data', dataOperations.addNewValue);

/** GET request to get all values of a specific sensor in a determined range of time */
router.get('/sensor/data', dataOperations.getSensorValues);

/** GET request to get all values of a specific sensor related to a specific measurement in a determined range of time */
router.get('/sensor/measurement/data', dataOperations.getSomeValuesOfSpecificSensorMeasurement);


/** SENSORS' DATA */

/** GET request to get all values of a specific sensors' list related to a specific measurement in a determined range of time */
router.get('/sensors/list/measurement/data', dataOperations.getValuesOfSomeSensorsMeasurement);

/** GET request to get all sensors' values of a specific measurement in a determined range of time */
router.get('/sensors/measurement/data', dataOperations.getSomeValuesOfSpecificMeasurement);

/** Non la facciamo perché un valore registrato non può più essere cancellato */
/** DELETE request to delete a specific sensor's value */
//router.delete('/sensor/data', dataOperations.deleteValue);


/** MEASUREMENTS */

/** GET request to get all the measurements */
router.get('/measurements', measurementOperations.getAllMeasurements);

/** MEASUREMENT */

/** POST request to add a new measurement */
router.post('/measurement', measurementOperations.addNewMeasurement);

/** GET request to get a specific measurement */
router.get('/measurement', measurementOperations.getSpecificMeasurement);

/** Non la facciamo perché anche se non abbiamo più sensori che misurino tale grandezza fisica, in passato li avevamo e quindi ci sono valori di quel tipo nel DB */
/** DELETE request to delete a specific measurement */
//router.delete('/measurements', measurementOperations.deleteMeasurement);


module.exports = router;
