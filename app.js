var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');
var mongoose = require('mongoose');
var logger = require('morgan');
var bodyparser = require('body-parser');
var passport = require('passport');

var indexRouter = require('./routes/index');
var apiRouter =   require('./routes/api_router');

require('./database');
require('./configs/passport');

var app = express();
var port = 3000;

app.use(bodyparser.json());

app.use(logger('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


// We are telling express server public folder is the place to look for the static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/libs', express.static(__dirname + '/libs'));


app.use(cors());

app.use(passport.initialize());

app.use('/api', apiRouter);
app.use('*', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send('error found : ' + err);
});

//Listen to port 3000

app.listen(process.env.PORT || port, () => {
    console.log(`Starting the server at port ${port}`);
})

module.exports = app;
