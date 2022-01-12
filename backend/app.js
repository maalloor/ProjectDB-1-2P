var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();
const cors = require('cors');

//Instanciando Google Spanner y el Router
const googleSpanner = require('./controller/spanner.controller')
var crudRouter = require('./routes/crudRoutes');
var bookingRouter = require('./routes/bookingRoutes');
var passengerRouter = require('./routes/passengerRoutes');
var bookingdetailsRouter = require('./routes/bookingdetailsRoutes');
var bookingPassengerRouter = require('./routes/bookingPassengerRoutes');
var seatRouter = require('./routes/seatRoutes');
var seatflightRouter = require('./routes/seatflightRoutes');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

//Estableciendo las Rutas
app.use('/crud', crudRouter);
app.use('/booking',bookingRouter);
app.use('/passenger',passengerRouter);
app.use('/bookingdetails',bookingdetailsRouter);
app.use('/bookingpassenger',bookingPassengerRouter);
app.use('/seat',seatRouter);
app.use('/seatflight',seatflightRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.set("Access-Control-Allow-Credentials", "true");
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
  next();

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
