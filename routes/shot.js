var express = require('express');
var router = express.Router();
var cheerio = require('cheerio');
var fs = require("fs");
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;
var util = require("util");
var aliutil = require('../lib/aliutil');
var uuid = require('uuid');
var async = require('async');


/* shot page*/
router.get('/shot', function(req, res, next) {
    res.render("shot.html");
});

/* shot  test page*/
router.get('/shottest', function(req, res, next) {
    res.render("shottest.html");
});

router.post('/cut', function(req, res, next) {
	var prefix = '';
	if (req.body.prefix != "undefined" && req.body.prefix) {
		prefix = req.body.prefix;
	}
    // console.log(req.body.html);
    if (req.protocol === 'https') url = urls;
    if (req.body.html) {

        fs.readFile(process.cwd() + "/views/shot.html", function(err, shothtml) {
            $ = cheerio.load(shothtml);
            $('body').empty();
            $('body').append('<div class="li-dv" style="display: block;">' + req.body.html + '</div>');

            fs.writeFile(process.cwd() + "/views/shot.html", $.html(), function(err) {
                if (err) next(err);
                else {
                    var uu_name = uuid.v4().replace(/-/g, '');
                    var filename = process.cwd() + '/uploads/shot/' + uu_name + '.jpg';

                    var nw = spawn(process.cwd() + '/node_modules/nw/bin/nw', [process.cwd() + '/webkit/',
                        filename,
                        url + '/shot',
                        req.body.width,
                        req.body.height,
                        uu_name + '.jpg'
                    ]);
                    nw.stdout.on('data', function(data) {
                        console.log('stdout: ' + data);
                    });

                    nw.stderr.on('data', function(data) {
                        console.log('stderr: ' + data);
                    });

                    nw.on('exit', function(code) {
                        console.log('child process exited with code ' + code);
                        async.waterfall([
                            async.apply(fs.readFile, filename),
                            function(contents,callback) {
                                aliutil.putImage({
                                    data: contents,
                                    file_nm: uu_name + '.jpg',
                                    mime_type: 'image/jpeg',
									prefix:prefix
                                }, function(data){
                                    callback(null,data)
                                });
                            },
                            async.asyncify(JSON.stringify),
                            function(data, next) {
                                console.log(colors.blue('ali return data: '+data));
                                next(null, 'done');
                            }
                        ], function(err, result) {
                            res.status(200).jsonp({
                                error: '000',
                                message: "ok.",
                                shot_id: uu_name + '.jpg',
                                path: '/uploads/shot/' + uu_name + '.jpg',
                                shot_url: url + '/uploads/shot/' + uu_name + '.jpg',
                                oss_url: uu_name + '.jpg',
								oss_prefix: ALI_PREFIX+prefix
                            });
                        });
                    });
                }
            });
        })
    }
});

function deal(){
	
}

module.exports = router;
