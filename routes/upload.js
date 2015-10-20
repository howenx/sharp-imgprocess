var express = require('express');
var router = express.Router();
var util = require("util");
var my = require("../lib/minify");
var gm = require("gm");
var fs = require("fs");
var exec = require('child_process').exec;
var multer = require('multer');
var uuid = require('uuid');
// var upload = multer({ dest: 'uploads/fullsize/' });
var storage = multer.diskStorage({
	destination: function(req, file, cb) {
		cb(null, 'uploads/fullsize/')
	},
	limits: {
		fileSize: 1024 * 1024 * 200
	},
	filename: function(req, file, cb) {
		var getFileExt = function(fileName) {
			var fileExt = "";
			if (fileName.match(/(\.(jpg|jpeg|JPG|JPEG|png|PNG|gif|GIF|webp|WEBP))$/) != null && fileName.match(/(.(jpg|jpeg|JPG|JPEG|png|PNG|gif|GIF|webp|WEBP))$/) != 'undefined') {
				fileExt = fileName.match(/(\.(jpg|jpeg|JPG|JPEG|png|PNG|gif|GIF|webp|WEBP))$/g).toString().replace(/\./gi, '').toLowerCase();
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
	res.render("upload.html", {
		title: 'Upload images'
	});
});

/* Post Upload File listing. */
router.post('/upload', upload.single('photo'), function(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	var mimetype = req.file.mimetype;
	var imageName = req.file.filename;
	var imageSize = req.file.size;
	var path = req.file.path;
	/** minify:'minify',unminify:'unminify' **/
	// console.log(colors.red(JSON.stringify(req.file)));
	// return false;
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
						if (mimetype === 'image/png' || mimetype === 'image/jpeg') {
							//when image size more than 1M,Compress it. or copy it to minify.
							if (imageSize >= 1048576 && minify_flag === 'minify') {
								//If the image type is png or jpeg, minify it.
								process.nextTick(function() {
									my.minify(process.cwd() + "/uploads/fullsize/", imageName, process.cwd() + "/uploads/minify", imageName, function(compress) {
										res.status(200).jsonp({
											error: '000',
											message: 'Image Uploaded.',
											imgid: imageName,
											compress: compress,
											minify_url: url + '/uploads/minify/' + imageName
										});
									});
								});
							} else if (imageSize < 1048576 && minify_flag === 'minify') {
								//less than 1M copy it to minify directory.
								fs.writeFile(minifyPath, data, function(err) {
									if (err) {
										console.log('> ' + colors.grey('Time: ' + dateformat(new Date(), 'yyyy-mm-dd HH:MM:ss TT')) + '\t' + colors.gray("Copy minify image found an error."));
										res.status(500).jsonp({
											error: '445',
											message: 'Copy minify image found an error.'
										});
									} else {

										console.log('> ' + colors.grey('Time: ' + dateformat(new Date(), 'yyyy-mm-dd HH:MM:ss TT')) + '\t' + colors.gray("Image Uploaded, But it's size less than 1M and no compression."));
										var compress = {
											error: 'ok',
											before: (imageSize / 1048576).toFixed(2) + "M",
											after: (imageSize / 1048576).toFixed(2) + "M",
											rate: '0%',
											time: '0mm0ss'
										};
										res.status(200).jsonp({
											error: '000',
											message: "Image Uploaded, But it's size less than 1M and no compression.",
											imgid: imageName,
											compress: compress,
											minify_url: url + '/uploads/minify/' + imageName
										});
									}
								});
							} else if (minify_flag == 'unminify') {
								//unminify copy to minify directory.
								fs.writeFile(minifyPath, data, function(err) {
									if (err) {
										console.log('> ' + colors.grey('Time: ' + dateformat(new Date(), 'yyyy-mm-dd HH:MM:ss TT')) + '\t' + colors.gray("Unminify upload images found an error."));
										res.status(500).jsonp({
											error: '445',
											message: 'Unminify upload images found an error.'
										});
									} else {

										console.log('> ' + colors.grey('Time: ' + dateformat(new Date(), 'yyyy-mm-dd HH:MM:ss TT')) + '\t' + colors.gray('Unminify upload images success.'));
										var compress = {
											error: 'ok',
											before: (imageSize / 1048576).toFixed(2) + "M",
											after: (imageSize / 1048576).toFixed(2) + "M",
											rate: '0%',
											time: '0mm0ss'
										};
										res.status(200).jsonp({
											error: '000',
											message: "Unminify upload images success.",
											imgid: imageName,
											compress: compress,
											minify_url: url + '/uploads/minify/' + imageName
										});
									}
								});
							}
						} else {
							console.log('> ' + colors.grey('Time: ' + dateformat(new Date(), 'yyyy-mm-dd HH:MM:ss TT')) + '\t' + colors.gray("Image Uploaded, But No Compression.The image type can't be compressed."));
							var compress = {
								error: 'ok',
								before: (imageSize / 1048576).toFixed(2) + "M",
								after: (imageSize / 1048576).toFixed(2) + "M",
								rate: '0%',
								time: '0mm0ss'
							};
							res.status(200).jsonp({
								error: '000',
								message: "Image Uploaded, But the image type can't be compressed.",
								imgid: imageName,
								compress: compress,
								minify_url: url + '/uploads/fullsize/' + imageName
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

/* Thumb Image */
router.get(['/thumb/file/:id/', '/thumb/:id'], function(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	try {
		var file = req.params.id;
		var match = req.path.match(/\/file\//);

		if (file.match(/[^\/]+(\.(jpg|jpeg|JPG|JPEG|png|PNG|gif|GIF|webp|WEBP))$/) != null && typeof file.match(/[^\/]+(\.(jpg|jpeg|JPG|JPEG|png|PNG|gif|GIF|webp|WEBP))$/) != 'undefined') {
			var type = file.match(/(\.(jpg|jpeg|JPG|JPEG|png|PNG|gif|GIF|webp|WEBP))$/g).toString().replace(/\./gi, '').toLowerCase();
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
														res.status(400).sendFile(process.cwd() + '/uploads/fullsize/' + file_nm);
													} else {
														res.status(400).jsonp({
															error: '445',
															message: 'Please minify the image firstly.',
															thumb_url: url + '/uploads/fullsize/' + file_nm
														});
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
															res.status(403).sendFile(process.cwd() + '/uploads/fullsize/' + file_nm);
														} else {
															res.status(403).jsonp({
																error: "445",
																message: err
															});
														}
													} else {
														if (match != null && typeof match != 'undefined') {
															res.status(200).sendFile(process.cwd() + '/uploads/thumb/' + file);
														} else {
															res.status(200).jsonp({
																error: "000",
																message: "ok.",
																thumb_url: url + '/uploads/thumb/' + file
															});
														}
													}
												});
										}
									});
								} else {
									if (match != null && typeof match != 'undefined') {
										res.sendFile(process.cwd() + '/uploads/thumb/' + file);
									} else {
										res.status(200).jsonp({
											error: "000",
											message: 'ok.',
											thumb_url: url + '/uploads/thumb/' + file
										});
									}
								}
							});
						} else {
							console.log('> ' + colors.grey('Time: ' + dateformat(new Date(), 'yyyy-mm-dd HH:MM:ss TT')) + '\t' + colors.gray("The original file can't be thumb because of the type."));
							if (match != null && typeof match != 'undefined') {
								res.status(400).sendFile(process.cwd() + '/uploads/fullsize/' + file_nm);
							} else {
								res.status(400).jsonp({
									error: "445",
									message: "The original file can't be thumb because of the type.",
									thumb_url: url + '/uploads/fullsize/' + file_nm
								});
							}
						}
					} else {
						console.log('> ' + colors.grey('Time: ' + dateformat(new Date(), 'yyyy-mm-dd HH:MM:ss TT')) + '\t' + colors.gray("The original image type not match the require."));
						if (match != null && typeof match != 'undefined') {
							res.status(400).sendFile(process.cwd() + '/uploads/fullsize/' + file_nm);
						} else {
							res.status(400).jsonp({
								error: "445",
								message: 'The original image type not match the require.'
							});
						}
					}
				} else {
					console.log('> ' + colors.grey('Time: ' + dateformat(new Date(), 'yyyy-mm-dd HH:MM:ss TT')) + '\t' + colors.gray("The thumbnail namme not match the require."));
					if (match != null && typeof match != 'undefined') {
						res.status(400).sendFile(process.cwd() + '/uploads/fullsize/' + file_nm);
					} else {
						res.status(400).jsonp({
							error: "445",
							message: 'The thumbnail namme not match the require.'
						});
					}
				}
			} else {
				console.log('> ' + colors.grey('Time: ' + dateformat(new Date(), 'yyyy-mm-dd HH:MM:ss TT')) + '\t' + colors.gray("Please assign the width and height."));
				if (match != null && typeof match != 'undefined') {
					res.status(400).sendFile(process.cwd() + '/uploads/fullsize/' + file_nm);
				} else {
					res.status(400).jsonp({
						error: "445",
						message: 'Please assign the width and height.'
					});
				}
			}
		} else {
			console.log('> ' + colors.grey('Time: ' + dateformat(new Date(), 'yyyy-mm-dd HH:MM:ss TT')) + '\t' + colors.gray("Thumb image type mismatch."));
			if (match != null && typeof match != 'undefined') {
				res.status(400).sendFile(process.cwd() + '/uploads/fullsize/' + file_nm);
			} else {
				res.status(400).jsonp({
					error: '445',
					message: 'Thumb Image type mismatch.'
				});
			}
		};
	} catch (e) {
		next(e);
	}
});

/* get File listing. */
router.get(['/uploads/shot/:image', '/uploads/minify/:image', '/uploads/split/:image', '/uploads/fullsize/:image', '/uploads/thumb/:image'], function(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*'); //设置跨域访问 
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
