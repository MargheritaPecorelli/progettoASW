
var express = require('express');
var router = express.Router();

var sensorDataController = require ('../controllers/sensorDataController');


router.get('/sensors/', sensorDataController.testGETapi);

router.get('/sensors/:sensor_id', sensorDataController.testGETapi);
router.post('/sensors/', sensorDataController.testPOSTapi);
router.put('/sensors/:sensor_id', sensorDataController.testPUTapi);
router.delete('/sensors/:sensor_id', sensorDataController.testDELETEapi);

router.get('/sensors/:sensor_id/data/', sensorDataController.testGETapi);

// ...

module.exports = router;
