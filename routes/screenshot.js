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
var aliutil = require('../lib/aliutil');

/* screenshot page*/
router.get('/screenshot', function(req, res, next) {
    if(req.protocol==='https') url = urls;
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
router.get('/shotcut/:tempid/:img_width/:img_height/:xr_width/:xr_height/:array', function(req, res, next) {
    if(req.protocol==='https') url = urls;
	if (req.params.tempid) {
		
		var parsed = JSON.parse(b64_to_utf8(b64_to_utf8(req.params.array+'==')));
		
		console.log(colors.red(parsed));
		
		var arr = [];

		for(var x in parsed){
		  	arr.push(parsed[x]);
		}
		
		res.render("shotcut.html", {
			tempid: req.params.tempid,
			xr_width:req.params.xr_width,
			xr_height:req.params.xr_height,
			img_width:req.params.img_width,
			img_height:req.params.img_height,
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
	if(req.protocol==='https') url = urls;
	if (req.body.tempid) {
		var uu_name =uuid.v4().replace(/-/g, '');
		var filename = process.cwd() +'/uploads/shot/'+uu_name+'.jpg';
		console.log(colors.red(process.cwd() + '/webkit/'+' || '+ filename+' || '+  url+'/shotcut/'+req.body.tempid+'/'+req.body.img_width+'/'+req.body.img_height+'/'+req.body.xr_width+'/'+req.body.xr_height+'/'+utf8_to_b64(utf8_to_b64(req.body.array))+' || '+ '/shotcut/'+req.body.tempid+' || '+  req.body.xr_width+' || '+  req.body.xr_height));
		var nw = spawn(process.cwd() + '/node_modules/nw/bin/nw', [process.cwd() + '/webkit/', filename, url+'/shotcut/'+req.body.tempid+'/'+req.body.img_width+'/'+req.body.img_height+'/'+req.body.xr_width+'/'+req.body.xr_height+'/'+utf8_to_b64(utf8_to_b64(req.body.array)), req.body.xr_width, req.body.xr_height]);
		nw.stdout.on('data', function(data) {
			console.log('stdout: ' + data);
		});

		nw.stderr.on('data', function(data) {
			console.log('stderr: ' + data);
		});

		nw.on('exit', function(code) {
			console.log('child process exited with code ' + code);
			aliPut({
				path: filename+'',
				file_nm: uu_name+'.jpg',
				mime_type: 'image/jpeg'
			}, function(data) {
				console.log(colors.yellow(JSON.stringify(data)))
                res.jsonp({
                    error:'000',
                    message: "ok.",
    				shot_id:uu_name+'.jpg',
    				path:'/uploads/shot/'+uu_name+'.jpg',
                    shot_url: url+'/uploads/shot/'+uu_name+'.jpg',
                    oss_url:uu_name+'.jpg'
                });
			})           
		});
	} else {
		var notFound = new Error('not found tempid.');
		notFound.status = 404;
		return next(notFound);
	}
});

function aliPut(obj, callback) {
	fs.lstat(obj.path, function(err, stats) {
		if (!err) {
			aliutil.putObject({
				path: obj.path + '',
				bucket: 'hmm-images',
				file_nm: obj.file_nm + '',
				mime_type: obj.mime_type
			}, function(data) {
				callback(data);
			});
		} else {
			console.log(colors.red('error'));
		}
	});
}
module.exports = router;
