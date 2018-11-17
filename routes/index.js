var express = require('express');
const path = require('path');
var router = express.Router();

/* GET angular home page on every request different from API */
router.get('*', function (req, res) {
  var p = path.resolve('./public/index.html');
  res.sendFile(p);
});

module.exports = router;
