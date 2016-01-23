var express = require('express');
var router = express.Router();
var util = require("util");
var fs = require("fs");

/* get File listing. */
router.get(['/uploads/shot/:image', '/uploads/minify/:image', '/uploads/split/:image', '/uploads/fullsize/:image', '/uploads/thumb/:image'], function(req, res, next) {
    if(req.protocol==='https') url = urls;
    try {
        var file = req.params.image;
        var file_match = file.match(/[^\/]+(\.(jpg|jpeg|JPG|JPEG|png|PNG|gif|GIF|webp|WEBP))$/g);
        //check param image.
        if (file_match != null && typeof file_match != 'undefined') {
            //grab the request path.
            var match = req.path.match(/\/split|shot|fullsize|crop|minify|thumb\//);
            if (match != null && typeof match != 'undefined') {
                var reqpath = match.toString().replace(/\//, '');
                var localpath = process.cwd() + '/uploads/' + reqpath + '/' + file;
                //check the loacl file exist.
                fs.lstat(localpath, function(err, stats) {
                    //if not exist,404.
                    if (err) {
                        console.log('> ' + colors.grey('Time: ' + dateformat(new Date(), 'yyyy-mm-dd HH:MM:ss TT')) + '\t' + colors.gray('the request file not found.'));
                        res.status(404);
                        next();
                    } else {
                        res.status(200).sendFile(localpath);
                    }
                });
            } else {
                console.log('> ' + colors.grey('Time: ' + dateformat(new Date(), 'yyyy-mm-dd HH:MM:ss TT')) + '\t' + colors.gray('Not match the request path.'));
                res.status(404);
                next();
            }
        } else {
            console.log('> ' + colors.grey('Time: ' + dateformat(new Date(), 'yyyy-mm-dd HH:MM:ss TT')) + '\t' + colors.gray('File type not match.'));
            res.status(404);
            next();
        }
    } catch (e) {
        console.log('> ' + colors.grey('Time: ' + dateformat(new Date(), 'yyyy-mm-dd HH:MM:ss TT')) + '\t' + colors.gray('catch exception:' + e));
        res.status(500);
        next(e);
    }
});
module.exports = router;