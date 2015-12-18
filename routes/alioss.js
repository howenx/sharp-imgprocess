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

/* split results display page. */
router.get('/oss/list', function(req, res) {

    aliutil.listObject('hmm-images', function(data) {
        res.send(data);
    });
    // aliutil.putObject({
//             path: process.cwd() + "/uploads/minify/" + "8fccbf40402810fdee2d8b84b2e7b56d.jpg",
//             bucket: 'hmm-images',
//             file_nm: '8fccbf40402810fdee2d8b84b2e7b56d.jpg',
//             filt_type: 'image/jpeg'
//         },
//         function(data) {
//             res.send(data);
//         }
//     );
});



module.exports = router;
