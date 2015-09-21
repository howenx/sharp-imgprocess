var express = require('express');
var router = express.Router();
var cheerio = require('cheerio');
var fs = require("fs");
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;
var util = require("util");

/* screenshot page*/
router.get('/screenshot', function(req, res, next) {
  res.render('screenshot.html');
});

/* screenshot shell */
router.post('/nw',function(req, res) {
	if (req.body.data) {
		var pngreplace='';
		var png = '';
        fs.readFile(process.cwd() + "/webkit/index.html",function(err,index){
            $ = cheerio.load(index);
    		$('body').empty();
    		$('body').html(req.body.data);
			$('#unpack_img').css({
			                    background: 'url('+ process.cwd() + '/uploads/thumb/' + req.body.imgsrc+')'
			                });
			$('#unpack_vertical_line').css({
								background: 'url('+ process.cwd() + '/public/images/vertical-line.png)'
							});
    		$('img').attr('src', process.cwd() + '/uploads/thumb/' + req.body.imgsrc);
            fs.writeFile(process.cwd() + "/webkit/index.html", $.html(), function(err){
        		var nw = spawn(process.cwd() +'/node_modules/nw/bin/nw', [process.cwd() + '/webkit/']);
        		nw.stdout.on('data', function(data){
        		    console.log('stdout:'+data);
        			png =data+'';
        			if(png.match(/[|][|].*[|][|]/g)!=null && png.match(/[|][|].*[|][|]/g)!=''){
        				pngreplace = png.match(/[|][|].*[|][|]/g).toString().replace(/[|]/gi, '') + '';
        				//console.log('this is canvas image:'+pngreplace);
        				if(pngreplace!=null && pngreplace!='' && typeof pngreplace!='undefined'){
        					res.jsonp({
        						error: 'Canvas success.',
        						png: pngreplace
        					});
        					nw.kill();
        				}
        			}
        		});
            });
        });
	} else {
		//
		var body = '',
			jsonStr;
		req.on('data', function(chunk) {
			body += chunk; //
		});
		req.on('end', function() {
			//
			try {
				jsonStr = JSON.parse(body);
			} catch (err) {
				jsonStr = null;
			}
			console.log(jsonStr);
			//jsonStr ? res.send({"status":"success", "name": jsonStr.data.name, "age": jsonStr.data.age}) : res.send({"status":"error"});
			res.jsonp({
				error: 'Canvas success.'
			});
		});
	}
});
module.exports = router;
