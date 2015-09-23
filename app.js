/******** reference modules ***********/
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var dateformat = require('console-stamp/node_modules/dateformat');
var multer = require('multer');

/********** modules config *************/
var app = express();
var upload = require('./routes/upload');
var split = require('./routes/split');
var screenshot = require('./routes/screenshot');
/****** Global variable ************/
url = 'http://172.28.3.51:3002';
path = require('path');
colors = require('colors');
fs = require("fs");
colors = require('colors');
colors.setTheme({
    silly: 'rainbow',
    input: 'grey',
    verbose: 'cyan',
    prompt: 'grey',
    info: 'green',
    data: 'grey',
    help: 'cyan',
    warn: 'yellow',
    debug: 'blue',
    error: 'red'
});

/*** view engine setup ****/
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set("view options", {
    layout: false
});
app.set('views', path.join(__dirname, 'views'));
app.settings.env === 'dev';
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

/***** Log area *****/
morgan.token('date', function gedate(req) {
    var date = new Date();
    return dateformat(date, 'dd/mm/yyyy HH:MM:ss TT');
})
app.use(morgan(':remote-addr - :remote-user :date :method :url :status :res[content-length] ":referrer" ":user-agent'));

/**** cookie ****/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(multer({
	dest: './uploads/fullsize/'
}));

/********* routers ******************/
app.use(express.static('public'));
app.use('/', upload);
app.use('/', split);
app.use('/', screenshot);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
app.use(function(err, req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    res.status(404);
    res.jsonp({
        message: err.message,
        error: '404'
    });
});

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    if (err.code === 'ENOENT') {
        next();
    } else {
        res.status(500);
        res.jsonp({
            message: err.message,
            error: '500'
        });
        console.error(colors.error(err.stack));
    }
});


/************* set port *******************/
app.set('port', process.env.PORT || 3002);

module.exports = app;
