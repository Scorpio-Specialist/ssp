var createError = require('http-errors');
require("dotenv").config();
const connect=require("./config/Mongo");
var express = require('express');
const cors=require("cors")
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
connect()


var usersRouter = require('./routes/users');
var ProductRouter = require("./routes/product");
var CartRouter = require("./routes/Cart");

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/users', usersRouter);
app.use("/product",ProductRouter)
app.use("/cart",CartRouter)


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
