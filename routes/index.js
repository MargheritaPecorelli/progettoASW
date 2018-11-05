var express = require('express');
const path = require('path');
var router = express.Router();

/* GET home page. 
router.get('/', function(req, res) {
   res.send("Invalid page");
  //res.render('index', { title: 'Express' });
});

*/
router.get('*', function (req, res) {
  var p = path.resolve('./public/index.html');
  res.sendFile(p);
});

module.exports = router;
