var express = require('express');
var router = express.Router();
var gm = require("gm");
var cheerio = require('cheerio');


/* split results display page. */
router.get('/split/:id',function(req, res) {
	res.render("splithtml/"+req.params.id);
});
/* split image for 3 pices. */
router.route('/split/:id').get(function(req, res, next) {

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
                                        var crop_nm = file + '_crop_' + i + '.' + gm_format;
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

module.exports = router;
