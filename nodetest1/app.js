var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

// passport init
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

// mongodb init
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/nodetest1');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// standard middleware ish
app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// make db acessible to webapp
// todo: is this needed?
app.use(function(req, res, next) {
    req.db = db;
    next();
});

// session setup
app.use(session({
    secret: 'mynig',
    cookie: {maxAge: 600000}
}));

// passport authentication
app.use(passport.initialize());

// auth strategy
passport.use(new LocalStrategy(
    function(username, password, done) {
        var users = db.get('usercollection');
        users.findOne({ username : username }, function(err, user) {
            if (err) { return done(err); }
            if (!user) {
                return done(null, false);
            }
            if (user.password !== password) {
                return done(null, false);
            }
            return done(null, user);
        });
    })
);

// session serialization/deserialization
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

// routing
app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
