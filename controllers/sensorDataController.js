
var jsonUtils = require('../jsonUtilities');


module.exports.testGETapi = function (req, res) { 

  jsonUtils.sendJsonResponse(res, 200, {"status" : "success"});

};

module.exports.testPOSTapi = function (req, res) {

  jsonUtils.sendJsonResponse(res, 201, {"status" : "success"});

};

module.exports.testPUTapi = function (req, res) {

  jsonUtils.sendJsonResponse(res, 200, {"status" : "success"});

};

module.exports.testDELETEapi = function (req, res) {

  jsonUtils.sendJsonResponse(res, 204, {"status" : "success"});

};
