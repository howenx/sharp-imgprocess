/******** reference modules ***********/
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var dateformat = require('console-stamp/node_modules/dateformat');
var multer = require('multer');
var ip = require('ip');
var app = express();
var methodOverride = require('method-override');
var session = require('express-session');
var errorHandler = require('errorhandler');

/********** modules config *************/
var upload = require('./routes/upload');
var split = require('./routes/split');
var screenshot = require('./routes/screenshot');

/****** Global variable ************/
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
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(methodOverride());

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
app.use(function(err, req, res, next) {
	console.log(colors.blue(err.message));
	if(err.status !== 404) {
	    return next();
	}
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

var server = app.listen(app.get('port'), function() {
  console.log('Express server listening on ' + ip.address()+':'+server.address().port);
});
url = 'http://'+ip.address()+':'+server.address().port;
// console.log(colors.red(JSON.stringify(server.address())));
// module.exports = app;
