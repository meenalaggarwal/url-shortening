var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var hbs = require('hbs');

var indexRouter = require('./routes/index');
var linksRouter = require('./routes/links');

var API = require('./API/index');

var config = require('./config');

var dbClient;

require('./DAO/dbConnection.js')(config.db)
.then(function(response) {
	dbClient = response;
}).catch(function(err) {
	throw 'Unable to connect to DB';
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views/layouts'));
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/v1', indexRouter);
app.use('/v1/links', linksRouter);

app.use('/', API);

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
  res.render('error');
});

module.exports = app;
