var express = require('express');
var router = express.Router();
var gm = require("gm");
var cheerio = require('cheerio');
var uuid = require('uuid');
var aliutil = require('../lib/aliutil');
var async = require('async');

/* split results display page. */
router.get('/splithtml/:id', function(req, res) {
    res.render("splithtml/" + req.params.id);
});
/* split image for 3 pices. */
router.get('/split/:id', function(req, res, next) {
    file = req.params.id;
    try {
        //load template crop_img.html
        if (file.match(/[^\/]+(\.(jpg|jpeg|JPG|JPEG|png|PNG|gif|GIF|webp|WEBP))$/g) != null && typeof file.match(/[^\/]+(\.(jpg|jpeg|JPG|JPEG|png|PNG|gif|GIF|webp|WEBP))$/g) != 'undefined') {
            var type = file.match(/(.(jpg|jpeg|JPG|JPEG|png|PNG|gif|GIF|webp|WEBP))$/g).toString().replace(/\./gi, '').toLowerCase();
            var path;
            if (type === 'jpg' || type === 'png' || type === 'jpeg') {
                path = process.cwd() + '/uploads/minify/' + file;
            } else {
                path = process.cwd() + '/uploads/fullsize/' + file;
            }
            fs.lstat(path, function(err, stats) {
                if (!err) {
                    var gm_format, gm_width, gm_height;

                    //load template.
                    fs.readFile(process.cwd() + "/views/splithtml/split_temp.html", function(err, html_img) {
                        $ = cheerio.load(html_img);
                        $('p').empty();
                        gm(path)
                            .identify(function(err, data) {
                                if (!err) {
                                    gm_format = (data.format + '').toLowerCase().replace(/e/, '');
                                    gm_width = data.size.width;
                                    gm_height = data.size.height;

                                    for (var i = 0; i < 3; i++) {
                                        var crop_path = process.cwd() + "/uploads/split/" + file + '_split_' + i + '.' + gm_format;
                                        var crop_nm = file + '_split_' + i + '.' + gm_format;
                                        gm(path)
                                            .crop(gm_width, gm_height / 3, 0, (gm_height / 3) * i)
                                            .quality(100)
                                            .write(crop_path, function(err) {
                                                if (!err) {
                                                    console.log(colors.gray('split success.'));
                                                } else next(err);
                                            });
                                        $('p').append('<img alt="' + crop_nm + '" src="' + url + '/uploads/split/' + crop_nm + '">');

                                        if (i === 2) {
                                            $('p').css('width', gm_width + 'px');
                                            var crophtml = file.split('.')[0] + '.html';
                                            fs.writeFile(process.cwd() + "/views/splithtml/" + crophtml, $.html(), function(err) {
                                                if (err) next(err);
                                                else res.redirect(url + '/splithtml/' + crophtml);
                                            });

                                        }
                                    }
                                } else next(err);
                            });
                    });
                } else next();
            });
        }
    } catch (e) {
        next(e);
    }
});
/* split image for 3 pices. */
router.get('/split/file/:id', function(req, res, next) {
    if (req.protocol === 'https') url = urls;
    file = req.params.id;
    try {
        //load template crop_img.html
        if (file.match(/[^\/]+(\.(jpg|jpeg|JPG|JPEG|png|PNG|gif|GIF|webp|WEBP))$/g) != null && typeof file.match(/[^\/]+(\.(jpg|jpeg|JPG|JPEG|png|PNG|gif|GIF|webp|WEBP))$/g) != 'undefined') {
            var type = file.match(/(.(jpg|jpeg|JPG|JPEG|png|PNG|gif|GIF|webp|WEBP))$/g).toString().replace(/\./gi, '').toLowerCase();
            var path;
            if (type === 'jpg' || type === 'png' || type === 'jpeg') {
                path = process.cwd() + '/uploads/minify/' + file;
            } else {
                path = process.cwd() + '/uploads/fullsize/' + file;
            }
            var mime_type = '';
            if (type === 'png' || type === 'jpeg') mime_type = 'image/png';
            else mime_type = 'image/jpeg';

            var sparry = new Array();
            var ossimages = new Array();
            var crop_path_array = new Array();
            fs.lstat(path, function(err, stats) {
                if (!err) {
                    var gm_format, gm_width, gm_height;

                    gm(path).identify(function(err, data) {
                        if (!err) {
                            gm_format = (data.format + '').toLowerCase().replace(/e/, '');
                            gm_width = data.size.width;
                            gm_height = data.size.height;
                            dealCrop({
                                path: path,
                                gm_width: gm_width,
                                gm_height: gm_height,
                                gm_format: gm_format,
                                num: 3
                            }, function(data) {
                                // console.log(data);
                                res.status(200).jsonp({
                                    error: "000",
                                    message: "ok.",
                                    split_url: JSON.stringify(data.localimages),
                                    oss_url: JSON.stringify(data.ossimages),
                                    oss_prefix: ALI_PREFIX
                                });
                            })
                        } else {
                            console.log(colors.gray(err));
                            res.jsonp({
                                error: "445",
                                message: err,
                            });
                        }
                    });
                } else {
                    console.log(colors.gray(err));
                    res.jsonp({
                        error: "445",
                        message: err,
                    });
                }
            });
        } else {
            console.log(colors.gray("Split image type mismatch."));
            res.jsonp({
                error: '445',
                message: 'Split Image type mismatch.'
            });
        }
    } catch (e) {
        next(e);
    }
});

function dealCrop(obj, cb) {

    var ossimages = new Array();
    var localimages = new Array();
    
    async.waterfall([
        function(callbackfirst) {
            var filenames={};
            for(var i=0;i<obj.num;i++){
                filenames['a'+i] = uuid.v4().replace(/-/g, '') + Date.now() + '.' + obj.gm_format;
                if(i===obj.num-1){
                    callbackfirst(null,filenames);
                }
            }
        },
        function(filenames, next) {
            //先遍历所有的生成的文件名的kv对象去分割图片
            async.forEachOf(filenames, function(value, key, callback) {
                gm(obj.path)
                    .crop(obj.gm_width, obj.gm_height / obj.num, 0, (obj.gm_height / obj.num) * (key.replace(/a/g, '') / 1))
                    .quality(100)
                    .write(process.cwd() + "/uploads/split/" + value, function(err) {
                        if (!err) {
                            // console.log(colors.gray('split success.'));
                            try {
                                ossimages.push(value);
                                localimages.push(url + '/uploads/split/'+value);
                                callback();
                            } catch (e) {
                                return callback(e);
                            }
                        } else {
                            console.log(colors.red(err));
                            return callback(err);
                        }
                    });
            }, function(err) {
                if (err) {
                    next(err, 'done');
                    console.error(err.message);
                }else{ 
                    //分割完成之后再去做图片的上传
                    async.each(ossimages, function(file, callback) {
                        async.waterfall([
                            async.apply(fs.readFile, process.cwd() + "/uploads/split/" + file),
                            function(contents, callback) {
                                aliutil.putImage({
                                    data: contents,
                                    file_nm: file,
                                    mime_type: obj.gm_format
                                }, function(data) {
                                    callback(null, data)
                                });
                            },
                            async.asyncify(JSON.stringify),
                            function(data, next) {
                                console.log(colors.blue('ali return data: ' + data));
                                next(null, 'done');
                            }
                        ], function(err, result) {
                            if (err) return callback(err);
                            callback()
                        });
                    }, function(err) {
                        if (err) console.error(err.message);
                        next(null, 'done');
                    })
                }
                
            });
        }
    ], function(err, result) {
        console.log(colors.green('split and upload aliyun are success.'));        
        cb({
            localimages: localimages,
            ossimages: ossimages
        });
    });
}


module.exports = router;
