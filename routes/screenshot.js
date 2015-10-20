var express = require('express');
var router = express.Router();
var cheerio = require('cheerio');
var fs = require("fs");
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;
var util = require("util");
var uuid = require('uuid');
var atob = require('atob');
var btoa = require('btoa');
var crypto = require('crypto');

/* screenshot page*/
router.get('/screenshot', function(req, res, next) {
	res.render("screenshot.html", {
		url: url
	});
});
function utf8_to_b64(str) {
    return btoa(unescape(encodeURIComponent(str)));
}

function b64_to_utf8(str) {
    return decodeURIComponent(escape(atob(str)));
}
/**********screen shot cut *******************/
router.get('/shotcut/:tempid/:xr_width/:xr_height/:array', function(req, res, next) {
	if (req.params.tempid) {
		
		console.log(colors.cyan(b64_to_utf8(b64_to_utf8(req.params.array+'=='))));
		var parsed = JSON.parse(b64_to_utf8(b64_to_utf8(req.params.array+'==')));
		
		console.log(JSON.parse(b64_to_utf8(b64_to_utf8(req.params.array+'=='))));
		
		var arr = [];

		for(var x in parsed){
			console.log(parsed[x]);
		  	arr.push(parsed[x]);
		}
		
		console.log(colors.red(JSON.stringify(arr)));
		
		res.render("shotcut.html", {
			tempid: req.params.tempid,
			xr_width:req.params.xr_width,
			xr_height:req.params.xr_height,
			array:arr
		});
	} else {
		var notFound = new Error('not found tempid.');
		notFound.status = 404;
		return next(notFound);
	}
})


/* screenshot shell */
router.post('/nw', function(req, res) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	console.log(colors.red(JSON.stringify(req.body)));
	console.log(colors.red(req.body.array));
	
	console.log(colors.blue(utf8_to_b64(utf8_to_b64(req.body.array)).replace(/=/g,'')));
	console.log(colors.green(utf8_to_b64(utf8_to_b64(req.body.array)).toString('hex')));
	console.log(colors.yellow(b64_to_utf8(b64_to_utf8(utf8_to_b64(utf8_to_b64(req.body.array))))));
	
	
	if (req.body.tempid) {
		var uu_name =uuid.v4().replace(/-/g, '');
		var filename = process.cwd() +'/uploads/shot/'+uu_name+'.png';
		console.log(colors.red(process.cwd() + '/webkit/'+' || '+ filename+' || '+  url+' || '+ '/shotcut/'+req.body.tempid+' || '+  req.body.xr_width+' || '+  req.body.xr_height));
		var nw = spawn(process.cwd() + '/node_modules/nw/bin/nw', [process.cwd() + '/webkit/', filename, url+'/shotcut/'+req.body.tempid+'/'+req.body.xr_width+'/'+req.body.xr_height+'/'+utf8_to_b64(utf8_to_b64(req.body.array)), req.body.xr_width, req.body.xr_height]);
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
