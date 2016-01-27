var Imagemin = require('imagemin');
var imageminJpegRecompress = require('imagemin-jpeg-recompress');
var imageminPngquant = require('imagemin-pngquant');
var rename = require('gulp-rename');
var imageminAdvpng = require('imagemin-advpng');
var imageminZopfli = require('imagemin-zopfli');
var imageminPngcrush = require('imagemin-pngcrush');
var imageminJpegRecompress = require('imagemin-jpeg-recompress');
var imageminMozjpeg = require('imagemin-mozjpeg');
var imageminGifsicle = require('imagemin-gifsicle');
var caltime = require("./caltime");
var aliutil = require("./aliutil");
var async = require('async');

var minify = module.exports = exports = {}

minify.png_minify = function(obj, callback) {
	async.waterfall([
		function(next) {
			new Imagemin()
				.src(obj.data)
				.dest(obj.output_dic)
			//.use(imageminJpegRecompress({loops: 3,quality:'low',min:5,target:0.999,progressive:true}))
			.use(imageminPngquant({
				floyd: 0,
				nofs: false,
				quality: '50-80',
				speed: 5,
				posterize: 1
			}))
				.use(rename(obj.output_nm))
			//.use(imageminPngcrush({reduce: true}))
			// .use(imageminZopfli({'8bit':true}))
			// .use(imageminAdvpng({optimizationLevel: 4}))
			.run(function(err, files) {
				if (err) next(err);
				next(null, files[0].contents);
			})
		},
		function(data, next) {
			aliutil.putImage({
				file_nm: obj.output_nm,
				data: data,
				mime_type: obj.mime_type,
				prefix: obj.prefix
			}, function(alidata) {
				next(null, {
					alidata: alidata,
					len: data.length
				});
			})
		},
		function(dl, next) {
			console.log(colors.blue('ali return data: ' + JSON.stringify(dl.alidata)));
			next(null, dl);
		}
	], function(err, result) {
		caltime({
			time: obj.time,
			in_len: obj.data.length,
			out_len: result.len,
			oss_return: result.alidata
		}, callback)
	});
}

minify.jpg_minify = function(obj, callback) {
	async.waterfall([
		function(next) {
			new Imagemin()
				.src(obj.data)
				.dest(obj.output_dic)
				.use(imageminJpegRecompress({
					loops: 3,
					quality: 'low',
					min: 5,
					target: 0.999
				}))
				.use(rename(obj.output_nm))
				.run(function(err, files) {
					if (err) next(err);
					next(null, files[0].contents);
				})
		},
		function(data, next) {
			aliutil.putImage({
				file_nm: obj.output_nm,
				data: data,
				mime_type: obj.mime_type,
				prefix: obj.prefix
			}, function(alidata) {
				next(null, {
					alidata: alidata,
					len: data.length
				});
			})
		},
		function(dl, next) {
			console.log(colors.blue('ali return data: ' + JSON.stringify(dl.alidata)));
			next(null, dl);
		}
	], function(err, result) {
		caltime({
			time: obj.time,
			in_len: obj.data.length,
			out_len: result.len,
			oss_return: result.alidata
		}, callback)
	});
}

minify.mozjpg_minify = function(obj, callback) {
	async.waterfall([
		function(next) {
			new Imagemin()
				.src(obj.data)
				.dest(obj.output_dic)
				.use(imageminMozjpeg({
					quality: 75,
					fastcrush: true
				}))
				.use(rename(obj.output_nm))
				.run(function(err, files) {
					if (err) next(err);
					next(null, files[0].contents);
				})
		},
		function(data, next) {
			aliutil.putImage({
				file_nm: obj.output_nm,
				data: data,
				mime_type: obj.mime_type,
				prefix: obj.prefix
			}, function(alidata) {
				next(null, {
					alidata: alidata,
					len: data.length
				});
			})
		},
		function(dl, next) {
			console.log(colors.blue('ali return data: ' + JSON.stringify(dl.alidata)));
			next(null, dl);
		}
	], function(err, result) {
		caltime({
			time: obj.time,
			in_len: obj.data.length,
			out_len: result.len,
			oss_return: result.alidata
		}, callback)
	});
}

minify.gif_minify = function(obj, callback) {

	async.waterfall([
		function(next) {
			new Imagemin()
				.src(obj.data)
				.dest(obj.output_dic)
				.use(imageminGifsicle())
				.use(rename(obj.output_nm))
				.run(function(err, files) {
					if (err) next(err);
					next(null, files[0].contents);
				})
		},
		function(data, next) {
			aliutil.putImage({
				file_nm: obj.output_nm,
				data: data,
				mime_type: obj.mime_type,
				prefix: obj.prefix
			}, function(alidata) {
				next(null, {
					alidata: alidata,
					len: data.length
				});
			})
		},
		function(dl, next) {
			console.log(colors.blue('ali return data: ' + JSON.stringify(dl.alidata)));
			next(null, dl);
		}
	], function(err, result) {
		caltime({
			time: obj.time,
			in_len: obj.data.length,
			out_len: result.len,
			oss_return: result.alidata
		}, callback)
	});
}
