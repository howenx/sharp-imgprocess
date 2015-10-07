var express = require('express');
var router = express.Router();
var cheerio = require('cheerio');
var fs = require("fs");
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;
var util = require("util");
var uuid = require('uuid');

/* screenshot page*/
router.get('/screenshot', function(req, res, next) {
	res.render('screenshot.html');
});

/**********screen shot cut *******************/
router.get('/shotcut/:tempid', function(req, res, next) {
	if (req.params.tempid) {
		res.render("shotcut.html", {
			tempid: req.params.tempid
		});
	} else {
		var notFound = new Error('not found tempid.');
		notFound.status = 404;
		return next(notFound);
	}
})

/* screenshot shell */
router.post('/nw', function(req, res) {
	
	if (req.body.tempid) {
		var uu_name =uuid.v4().replace(/-/g, '');
		var filename = process.cwd() +'/uploads/shot/'+uu_name+'.png';
		console.log(colors.red(process.cwd() + '/webkit/'+' || '+ filename+' || '+  url+' || '+ '/shotcut/'+req.body.tempid+' || '+  req.body.xr_width+' || '+  req.body.xr_height));
		var nw = spawn(process.cwd() + '/node_modules/nw/bin/nw', [process.cwd() + '/webkit/', filename, url+'/shotcut/'+req.body.tempid, req.body.xr_width, req.body.xr_height]);
		nw.stdout.on('data', function(data) {
			console.log('stdout: ' + data);
		});

		nw.stderr.on('data', function(data) {
			console.log('stderr: ' + data);
		});

		nw.on('exit', function(code) {
			console.log('child process exited with code ' + code);
            res.jsonp({
                error:'000',
                message: "ok.",
                shot_url: url+'/uploads/shot/'+uu_name+'.png'
            });
		});
	} else {
		var notFound = new Error('not found tempid.');
		notFound.status = 404;
		return next(notFound);
	}
});
module.exports = router;
