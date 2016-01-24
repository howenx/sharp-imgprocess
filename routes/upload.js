var express = require('express');
var router = express.Router();
var util = require("util");
var my = require("../lib/filter");
var gm = require("gm");
var fs = require("fs");
var exec = require('child_process').exec;
var multer = require('multer');
var uuid = require('uuid');
var aliutil = require('../lib/aliutil');
var async = require('async');
// var upload = multer({ dest: 'uploads/fullsize/' });
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/fullsize/')
    },
    limits: {
        fileSize: 1024 * 1024 * 200
    },
    filename: function(req, file, cb) {
        // console.log(req);
        var getFileExt = function(fileName) {
            var fileExt = "";
            if (fileName.match(/^(.*)(\.)(.{1,8})$/)[3].toLowerCase() != null && fileName.match(/^(.*)(\.)(.{1,8})$/)[3].toLowerCase() != 'undefined') {
                fileExt = fileName.match(/^(.*)(\.)(.{1,8})$/)[3].toLowerCase();;
            }
            return fileExt;
        }
        //32 bit uuid code+current Milliseconds
        cb(null, uuid.v4().replace(/-/g, '') + Date.now() + '.' + getFileExt(file.originalname))
    }
})
var upload = multer({
    storage: storage
})
/* GET home page. */
router.get('/', function(req, res, next) {
    if (req.protocol === 'https') url = urls;
    res.render("upload.html", {
        title: 'Upload images',
        url: url
    });
});

/* Post Upload File listing. */
router.post('/upload', upload.single('photo'), function(req, res, next) {
    if (req.protocol === 'https') url = urls;
    var mimetype = req.file.mimetype;
    var imageName = req.file.filename;
    var imageSize = req.file.size;
    var path = req.file.path;
    var minify_flag = req.body.params;
    try {
        if (minify_flag != 'undefined' && req.body.params) {
            //check the post file type (jpeg,gif,webp,png).
            if (mimetype === 'image/png' || mimetype === 'image/jpeg' || mimetype === 'image/gif' || mimetype === 'image/webp') {
                fs.readFile(path, function(err, data) {
                    if (!imageName) {
                        console.log('> ' + colors.grey('Time: ' + dateformat(new Date(), 'yyyy-mm-dd HH:MM:ss TT')) + '\t' + colors.gray("The image file transfer has an error."));
                        res.status(500).jsonp({
                            error: '444',
                            message: 'The image file transfer has an error.'
                        });
                    } else {
                        var minifyPath = process.cwd() + "/uploads/minify/" + imageName;
                        var compress = {
                            error: 'ok',
                            before: (imageSize / 1048576).toFixed(2) + "M",
                            after: (imageSize / 1048576).toFixed(2) + "M",
                            rate: '0%',
                            time: '0mm0ss'
                        };
                        if (mimetype === 'image/png' || mimetype === 'image/jpeg') {
                            //when image size more than 1M,Compress it. or copy it to minify.
                            if (minify_flag === 'minify') {
                                //If the image type is png or jpeg, minify it.
                                my({
                                    mime_type: mimetype,
                                    input_dic: process.cwd() + "/uploads/fullsize/",
                                    input_nm: imageName,
                                    output_dic: process.cwd() + "/uploads/minify",
                                    output_nm: imageName
                                }, function(compress) {
                                    res.status(200).jsonp({
                                        error: '000',
                                        message: 'Image Uploaded.',
                                        imgid: imageName,
                                        compress: compress,
                                        path: '/uploads/minify/' + imageName,
                                        minify_url: url + '/uploads/minify/' + imageName,
                                        oss_prefix: ALI_PREFIX,
                                        oss_url: imageName
                                    });
                                    // });
                                });
                            } else if (minify_flag == 'unminify') {
                                async.waterfall([
                                    async.apply(fs.writeFile, minifyPath, data),
                                    function(next) {
                                        aliutil.putImage({
                                            data: data,
                                            file_nm: imageName,
                                            mime_type: mimetype
                                        }, function(data){
                                            next(null,data)
                                        });
                                    },
                                    async.asyncify(JSON.stringify),
                                    function(data, next) {
                                        console.log(colors.blue('ali return data: '+data));
                                        next(null, 'done');
                                    }
                                ], function(err, result) {
                                    console.log('> ' + colors.grey('Time: ' + dateformat(new Date(), 'yyyy-mm-dd HH:MM:ss TT')) + '\t' + colors.gray('Unminify upload images success.'));
                                    res.status(200).jsonp({
                                        error: '000',
                                        message: "Unminify upload images success.",
                                        imgid: imageName,
                                        compress: compress,
                                        path: '/uploads/minify/' + imageName,
                                        minify_url: url + '/uploads/minify/' + imageName,
                                        oss_prefix: ALI_PREFIX,
                                        oss_url: imageName
                                    });
                                });
                                
                            }
                        } else {
                            console.log('> ' + colors.grey('Time: ' + dateformat(new Date(), 'yyyy-mm-dd HH:MM:ss TT')) + '\t' + colors.gray("Image Uploaded, But No Compression.The image type can't be compressed."));
                            async.waterfall([
                                function(next) {
                                    aliutil.putImage({
                                        data: data,
                                        file_nm: imageName,
                                        mime_type: mimetype
                                    }, function(data){
                                        next(null,data)
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
                                    message: "Image Uploaded, But the image type can't be compressed.",
                                    imgid: imageName,
                                    compress: compress,
                                    path: '/uploads/minify/' + imageName,
                                    minify_url: url + '/uploads/fullsize/' + imageName,
                                    oss_prefix: ALI_PREFIX,
                                    oss_url: imageName
                                });
                            });
                        }
                    }
                });
            } else {
                console.log('> ' + colors.grey('Time: ' + dateformat(new Date(), 'yyyy-mm-dd HH:MM:ss TT')) + '\t' + colors.gray("Image type mismatch."));
                res.status(400).jsonp({
                    error: '445',
                    message: 'Image type mismatch.'
                });
            }
        } else {
            console.log('> ' + colors.grey('Time: ' + dateformat(new Date(), 'yyyy-mm-dd HH:MM:ss TT')) + '\t' + colors.gray("No minify flag parameter."));
            res.status(400).jsonp({
                error: '445',
                message: 'No minify flag parameter.'
            });
        }
    } catch (e) {
        next(e);
    }
});

module.exports = router;
