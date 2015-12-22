var express = require('express');
var router = express.Router();
var util = require("util");
var my = require("../lib/filter");
var gm = require("gm");
var fs = require("fs");
var uuid = require('uuid');
var aliutil = require('../lib/aliutil');
/* Thumb Image */
router.get(['/thumb/file/:id/', '/thumb/:id'], function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    try {
        var file = req.params.id;
        var match = req.path.match(/\/file\//);

        if (file.match(/[^\/]+(\.(jpg|jpeg|JPG|JPEG|png|PNG|gif|GIF|webp|WEBP))$/) != null && typeof file.match(/[^\/]+(\.(jpg|jpeg|JPG|JPEG|png|PNG|gif|GIF|webp|WEBP))$/) != 'undefined') {
            var type = file.match(/(\.(jpg|jpeg|JPG|JPEG|png|PNG|gif|GIF|webp|WEBP))$/g).toString().replace(/\./gi, '').toLowerCase();
            
            var mime_type = '';
            if (type === 'png') mime_type = 'image/png';
            else mime_type = 'image/jpeg';
            
            // console.log(colors.yellow(type));
            //check whether the width and the height is be posted.
            if (file.match(/[\d]+×[\d]+/g) != null && typeof file.match(/[\d]+×[\d]+/g) != 'undefined') {
                var lwth = file.match(/[\d]+×[\d]+/g)[0].split('×');
                var width = lwth[0];
                var height = lwth[1];
                var file_nm;
                // console.log(colors.red(width+' '+height));
                //get the original image name.
                if (file.match(/[a-zA-Z0-9]+\.(jpg|jpeg|JPG|JPEG|png|PNG|gif|GIF|webp|WEBP)/) != null && typeof file.match(/[a-zA-Z0-9]+\.(jpg|jpeg|JPG|JPEG|png|PNG|gif|GIF|webp|WEBP)/) != 'undefined') {
                    file_nm = file.match(/[^_][a-zA-Z0-9]+\.(jpg|jpeg|JPG|JPEG|png|PNG|gif|GIF|webp|WEBP)/)[0].toString().toLowerCase();
                    //check original image type.
                    if (file_nm.match(/(\.(jpg|jpeg|JPG|JPEG|png|PNG|gif|GIF|webp|WEBP))$/) != null && file_nm.match(/(.(jpg|jpeg|JPG|JPEG|png|PNG|gif|GIF|webp|WEBP))$/) != 'undefined') {
                        var type_origin = file_nm.match(/(\.(jpg|jpeg|JPG|JPEG|png|PNG|gif|GIF|webp|WEBP))$/g).toString().replace(/\./gi, '').toLowerCase();
                        // console.log(colors.red(type_origin));
                        if (type_origin === 'jpg' || type_origin === 'jpeg' || type_origin === 'png') {

                            //First check thumb image exists，if exist return it,otherwise gm it and return it.
                            fs.lstat(process.cwd() + "/uploads/thumb/" + file, function(err, stats) {
                                if (err) {
                                    fs.lstat(process.cwd() + "/uploads/minify/" + file_nm, function(err, stats) {
                                        if (err) {
                                            console.log('> ' + colors.grey('Time: ' + dateformat(new Date(), 'yyyy-mm-dd HH:MM:ss TT')) + '\t' + colors.gray("Please minify the image firstly."));
                                            fs.lstat(process.cwd() + "/uploads/fullsize/" + file_nm, function(err, stats) {
                                                if (!err) {
                                                    if (match != null && typeof match != 'undefined') {
                                                        res.status(400).jsonp({
                                                            error: '445',
                                                            message: 'Please minify the image firstly.',
                                                            thumb_id: file_nm,
                                                            path: '/uploads/fullsize/' + file_nm,
                                                            thumb_url: url + '/uploads/fullsize/' + file_nm,
                                                            oss_url: file_nm,
                                                            oss_prefix: ALI_PREFIX
                                                        });
                                                    } else {
                                                        res.status(400).sendFile(process.cwd() + '/uploads/fullsize/' + file_nm);
                                                    }
                                                } else next();
                                            })
                                        } else {
                                            //resize the image with the width and the height.
                                            gm(process.cwd() + "/uploads/minify/" + file_nm)
                                                .gravity('Center')
                                                .resize(width, height, '^')
                                                .quality(100)
                                                .autoOrient()
                                                .write(process.cwd() + "/uploads/thumb/" + file, function(err) {
                                                    if (err) {
                                                        console.log(colors.gray(err));
                                                        if (match != null && typeof match != 'undefined') {
                                                            res.status(403).jsonp({
                                                                error: "445",
                                                                message: err
                                                            });
                                                        } else {
                                                            res.status(403).sendFile(process.cwd() + '/uploads/fullsize/' + file_nm);
                                                        }
                                                    } else {
                                                        if (match != null && typeof match != 'undefined') {
                                                            aliutil.putObject({
                                                                path: process.cwd() + "/uploads/thumb/" + file,
                                                                bucket: 'hmm-images',
                                                                file_nm: file,
                                                                mime_type: mime_type
                                                            }, function(data) {
                                                                res.status(200).jsonp({
                                                                    error: "000",
                                                                    message: "ok.",
                                                                    thumb_id: file,
                                                                    path: '/uploads/thumb/' + file_nm,
                                                                    thumb_url: url + '/uploads/thumb/' + file,
                                                                    oss_url: file,
                                                                    oss_prefix: ALI_PREFIX
                                                                });
                                                            });
                                                        } else {
                                                            res.status(200).sendFile(process.cwd() + '/uploads/thumb/' + file);
                                                        }
                                                    }
                                                });
                                        }
                                    });
                                } else {
                                    if (match != null && typeof match != 'undefined') {
                                        res.status(200).jsonp({
                                            error: "000",
                                            message: 'ok.',
                                            thumb_id: file,
                                            path: '/uploads/thumb/' + file_nm,
                                            thumb_url: url + '/uploads/thumb/' + file,
                                            oss_url: file,
                                            oss_prefix: ALI_PREFIX
                                        });
                                    } else {
                                        res.sendFile(process.cwd() + '/uploads/thumb/' + file);
                                    }
                                }
                            });
                        } else {
                            console.log('> ' + colors.grey('Time: ' + dateformat(new Date(), 'yyyy-mm-dd HH:MM:ss TT')) + '\t' + colors.gray("The original file can't be thumb because of the type."));
                            if (match != null && typeof match != 'undefined') {
                                res.status(400).jsonp({
                                    error: "445",
                                    message: "The original file can't be thumb because of the type.",
                                    thumb_id: file_nm,
                                    path: '/uploads/fullsize/' + file_nm,
                                    thumb_url: url + '/uploads/fullsize/' + file_nm,
                                    oss_url: file_nm,
                                    oss_prefix: ALI_PREFIX
                                });
                            } else {
                                res.status(400).sendFile(process.cwd() + '/uploads/fullsize/' + file_nm);
                            }
                        }
                    } else {
                        console.log('> ' + colors.grey('Time: ' + dateformat(new Date(), 'yyyy-mm-dd HH:MM:ss TT')) + '\t' + colors.gray("The original image type not match the require."));
                        if (match != null && typeof match != 'undefined') {
                            res.status(400).jsonp({
                                error: "445",
                                message: 'The original image type not match the require.'
                            });
                        } else {
                            res.status(400).sendFile(process.cwd() + '/uploads/fullsize/' + file_nm);
                        }
                    }
                } else {
                    console.log('> ' + colors.grey('Time: ' + dateformat(new Date(), 'yyyy-mm-dd HH:MM:ss TT')) + '\t' + colors.gray("The thumbnail namme not match the require."));
                    if (match != null && typeof match != 'undefined') {
                        res.status(400).jsonp({
                            error: "445",
                            message: 'The thumbnail namme not match the require.'
                        });
                    } else {
                        res.status(400).sendFile(process.cwd() + '/uploads/fullsize/' + file_nm);
                    }
                }
            } else {
                console.log('> ' + colors.grey('Time: ' + dateformat(new Date(), 'yyyy-mm-dd HH:MM:ss TT')) + '\t' + colors.gray("Please assign the width and height."));
                if (match != null && typeof match != 'undefined') {
                    res.status(400).jsonp({
                        error: "445",
                        message: 'Please assign the width and height.'
                    });
                } else {
                    res.status(400).sendFile(process.cwd() + '/uploads/fullsize/' + file_nm);
                }
            }
        } else {
            console.log('> ' + colors.grey('Time: ' + dateformat(new Date(), 'yyyy-mm-dd HH:MM:ss TT')) + '\t' + colors.gray("Thumb image type mismatch."));
            if (match != null && typeof match != 'undefined') {
                res.status(400).jsonp({
                    error: '445',
                    message: 'Thumb Image type mismatch.'
                });
            } else {
                res.status(400).sendFile(process.cwd() + '/uploads/fullsize/' + file_nm);
            }
        };
    } catch (e) {
        next(e);
    }
});
module.exports = router;