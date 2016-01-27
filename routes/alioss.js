var express = require('express');
var router = express.Router();
var util = require("util");
var my = require("../lib/minify");
var gm = require("gm");
var fs = require("fs");
var exec = require('child_process').exec;
var multer = require('multer');
var uuid = require('uuid');
var aliutil = require('../lib/aliutil');

router.get('/oss/list', function(req, res) {
	// aliutil.putObject({
	// 	path: process.cwd() + '/uploads/fullsize/0aad40e2bcf346979bc2259afe970a611453440761087.jpg',
	// 	bucket: 'hmm-images',
	// 	file_nm: '2.jpg',
	// 	mime_type: 'image/jpeg',
	// 	prefix:'test/'
	// }, function(data) {
	// 	res.send(data);
	// });
    aliutil.listObject('hmm-images', function(data) {
        // aliutil.signedUrl('hmm-images','195c62925c5d4fc18c02d5bea4ba42721450590775056.jpg', function(data) {
    res.send(data);
        // })
    });
});



module.exports = router;
