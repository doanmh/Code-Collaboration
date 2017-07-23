var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var http = require('http');

var mongoose = require('mongoose');
var passport = require('passport');
var session = require('express-session');

var indexController = require('./controllers/index');
var contactController = require('./controllers/contact');
var authController = require('./controllers/auth');
var taskController = require('./controllers/task');

require('./config/passport');
var config = require('./config/config.js');

mongoose.connect(config.dbConnString);
global.User = require('./models/user');
global.Task = require('./models/task');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(cookieParser());
app.use(session({
  secret: config.sessionKey,
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
  if (req.isAuthenticated()) {
    res.locals.user = req.user;
  }
  next();
});

/**
 * ROUTING
 */
app.get('/', indexController.getIndex);
app.get('/contact', contactController.getContact);
app.post('/contact', contactController.postContact);
app.get('/login', authController.getLogin);
app.post('/login', authController.postLogin);
app.get('/register', authController.getRegister);
app.post('/register', authController.postRegister);
app.get('/logout', authController.getLogout);
app.post('/', taskController.createTask);
app.get('/task/:id', taskController.getTask);
app.get('/about', indexController.getAbout)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

var port = process.env.PORT || 3000;
app.set('port', port);
var server = http.createServer(app);
require('./socket-server')(server);
server.listen(port);

module.exports = app;
