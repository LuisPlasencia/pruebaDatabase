var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config();


var { createSessionMiddleware } = require('./middleware/sessionSetup');
var { loadCurrentUser } = require('./middleware/currentUser');
var { exposeFlash } = require('./middleware/flashMessages');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var tareasRouter = require('./routes/tareas');
var authRouter = require('./routes/auth');
var perfilRouter = require('./routes/perfil');
var routersRouter = require('./routes/routers');
var adminRouter = require('./routes/admin');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// Render serves the app behind an HTTPS proxy; this lets secure session cookies work there
app.set('trust proxy', 1);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(createSessionMiddleware());
app.use(loadCurrentUser);
app.use(exposeFlash);

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/tareas', tareasRouter);
app.use('/', authRouter);
app.use('/perfil', perfilRouter);
app.use('/routers', routersRouter);
app.use('/admin', adminRouter);

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