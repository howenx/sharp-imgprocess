/******** reference modules ***********/
var express = require('express');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

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
var alioss = require('./routes/alioss');
var view = require('./routes/view');
var thumb = require('./routes/thumb');
var shot = require('./routes/shot');

/****** Global variable ************/
ALI_PREFIX = 'http://hmm-images.oss-cn-beijing.aliyuncs.com/';
ALI_PREFIX_S = 'https://hmm-images.oss-cn-beijing.aliyuncs.com/';
global.END_POINT = 'http://oss-cn-beijing.aliyuncs.com';
global.END_POINT_S = 'https://oss-cn-beijing.aliyuncs.com';
END_POINTS_IN = 'https://oss-cn-beijing-internal.aliyuncs.com';
https = require('https');
http = require('http');

dateformat = require('dateformat');
path = require('path');
colors = require('colors');
fs = require("fs");
colors = require('colors');
cors = require('cors');
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


var whitelist = ['https://admin.hanmimei.com', 'http://172.28.3', 'http://127.0.0.1', 'http://172.28.5'];

corsOptionsDelegate = function(req, callback){
  var corsOptions;
  if((new RegExp( '\\b' + whitelist.join('\\b|\\b') + '\\b')).test(req.header('Origin'))){
	  	console.log(req.header('Origin')+" --->match");
    	corsOptions = { origin: true };
	    if(req.protocol==='https') {
	  	  ALI_PREFIX = ALI_PREFIX_S;
	  	  global.END_POINT =global.END_POINT_S;
	  	  url = urls;
	    }
  }else{
    	corsOptions = { origin: false };
		console.log(req.header('Origin')+" --->not match");
  }
  callback(null, corsOptions);
};

app.use(cors(corsOptionsDelegate));

var privateKey  = fs.readFileSync('ssl/hanmimei.key', 'utf8');
var certificate = fs.readFileSync('ssl/hanmimei.crt', 'utf8');
var credentials = {key: privateKey, cert: certificate};

app.set('port', process.env.PORT || 3008);
app.set('httpsport', process.env.HTTPSPORT ||3010);


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

/********* routers ******************/


// app.use("/",function (req, res, next) {
//     if((new RegExp( '\\b' + whitelist.join('\\b|\\b') + '\\b')).test(req.header('Origin'))){
//   	  	console.log(req.header('Origin')+" --->match");
//       	corsOptions = { origin: true };
//   	    if(req.protocol==='https') {
//   	  	  ALI_PREFIX = ALI_PREFIX_S;
//   	  	  global.END_POINT =global.END_POINT_S;
//   	  	  url = urls;
//   	    }
// 		next();
//     }else{
//       	corsOptions = { origin: false };
//   		console.log(req.header('Origin')+" --->not match");
// 		res.status(404);
// 		res.jsonp({
// 			message: err.message,
// 			error: '404'
// 		});
//     }
//   console.log('日你妈－－－－》《');
//
// });

app.use(express.static('public'));
app.use('/', upload);
app.use('/', split);
app.use('/', screenshot);
app.use('/', alioss);
app.use('/', view);
app.use('/', thumb);
app.use('/', shot);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handlers
app.use(function(err, req, res, next) {
	console.log(colors.blue(err.message));
	if (err.status !== 404) {
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

/************* Listen Server *******************/
// var server = app.listen(app.get('port'), function() {
//     console.log('> ' + colors.grey('Time: ' + dateformat(new Date(), 'yyyy-mm-dd HH:MM:ss TT')) + colors.gray('\tNodejs server listening on ') + colors.magenta(ip.address() + ':' + server.address().port));
//     console.log(colors.cyan('\n····························style-imgprocess server started····························\n'));
// });
//


var httpsServer = https.createServer(credentials, app).listen(app.get('httpsport'),function(){
	console.log('> ' + colors.grey('Time: ' + dateformat(new Date(), 'yyyy-mm-dd HH:MM:ss TT')) + colors.gray('\tNodejs server listening on ') + colors.magenta(ip.address() + ':' + httpsServer.address().port));
	console.log(colors.cyan('\n····························style-imgprocess server started····························\n'));
});
var httpServer = http.createServer(app).listen(app.get('port'),function(){
	console.log('> ' + colors.grey('Time: ' + dateformat(new Date(), 'yyyy-mm-dd HH:MM:ss TT')) + colors.gray('\tNodejs server listening on ') + colors.magenta(ip.address() + ':' + httpServer.address().port));
	console.log(colors.cyan('\n····························style-imgprocess server started····························\n'));
});

url = 'http://' + ip.address() + ':' + httpServer.address().port;
urls = 'https://' + ip.address() + ':' + httpsServer.address().port;

fs.lstat('uploads', function(err, stats) {
	if (err) {
		fs.mkdirSync("uploads", 0777);
	}
	fs.lstat('uploads/fullsize', function(err, stats) {
		if (err) {
			fs.mkdirSync('uploads/fullsize', 0777);
		}
	})
	fs.lstat('uploads/minify', function(err, stats) {
		if (err) {
			fs.mkdirSync('uploads/minify', 0777);
		}
	})
	fs.lstat('uploads/shot', function(err, stats) {
		if (err) {
			fs.mkdirSync('uploads/shot', 0777);
		}
	})
	fs.lstat('uploads/split', function(err, stats) {
		if (err) {
			fs.mkdirSync('uploads/split', 0777);
		}
	})
	fs.lstat('uploads/thumb', function(err, stats) {
		if (err) {
			fs.mkdirSync('uploads/thumb', 0777);
		}
	})
});
