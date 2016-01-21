var express = require('express');
var router = express.Router();
var cheerio = require('cheerio');
var fs = require("fs");
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;
var util = require("util");
var aliutil = require('../lib/aliutil');
var uuid = require('uuid');


/* shot page*/
router.get('/shot', function(req, res, next) {
	res.render("shot.html");
});

/* shot  test page*/
router.get('/shottest', function(req, res, next) {
	res.render("shottest.html");
});

router.post('/cut', function(req, res, next) {
	// console.log(req.body.html);
	res.setHeader('Access-Control-Allow-Origin', '*');	
	
	if (req.body.html) {

		fs.readFile(process.cwd() + "/views/shot.html", function(err, shothtml) {
			$ = cheerio.load(shothtml);
			$('body').empty();
			$('body').append('<div class="li-dv" style="display: block;">'+req.body.html+'</div>');

			fs.writeFile(process.cwd() + "/views/shot.html", $.html(), function(err) {
				if (err) next(err);
				else {
					var uu_name = uuid.v4().replace(/-/g, '');
					var filename = process.cwd() + '/uploads/shot/' + uu_name + '.jpg';

					var nw = spawn(process.cwd() + '/node_modules/nw/bin/nw', [process.cwd() + '/webkit/',
						filename,
						url + '/shot',
						req.body.width,
						req.body.height
					]);
					nw.stdout.on('data', function(data) {
						console.log('stdout: ' + data);
					});

					nw.stderr.on('data', function(data) {
						console.log('stderr: ' + data);
					});

					nw.on('exit', function(code) {
						console.log('child process exited with code ' + code);
						// setTimeout(
							// aliutil.putObject({
// 								path: filename,
// 								bucket: 'hmm-images',
// 								file_nm: uu_name + '.jpg',
// 								mime_type: 'image/jpeg'
// 							}, function(data) {
// 								res.jsonp({
// 									error: '000',
// 									message: "ok.",
// 									shot_id: uu_name + '.jpg',
// 									path: '/uploads/shot/' + uu_name + '.jpg',
// 									shot_url: url + '/uploads/shot/' + uu_name + '.jpg',
// 									oss_url: uu_name + '.jpg',
// 									oss_prefix: ALI_PREFIX
// 								});
// 							})
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
						// ,2000);
					});
				}
			});
		})
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
