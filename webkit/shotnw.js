// When an error occurs, log it and exit
process.on('uncaughtException', function handleErr(err) {
    throw err;
});

// Load in dependencies
var assert = require('assert');
var fs = require('fs');
var gui = require('nw.gui');
var cssControls = require('css-controls');
var async = require('async');
var $ = require('jquery');


// var ALY = require('aliyun-sdk');
// var config = require('../lib/config');
//
// var oss = new ALY.OSS({
//     accessKeyId: "gXc1BHNhQmRXkgHz",
//     secretAccessKey: "FGWOvCgwFxH1lPxR42eQnqDUwXYKun",
//     endpoint: config.ali_endpoint,
//     apiVersion: '2013-10-15'
// });

// Grab the arguments

var filename = gui.App.argv[0];
var url = gui.App.argv[1];
var width = gui.App.argv[2] / 1;
var height = gui.App.argv[3] / 1;
var uuname = gui.App.argv[4];

// Navigate to a website in a new window
// DEV: Otherwise, we lose our script after navigating

var win = gui.Window.open(url, {
    width: width,
    height: height,
    toolbar: false,
    show: false,
    frame: false
});
win.resizeTo(width, height);

// When all the assets load (e.g. images, CSS, JS)
win.on('loaded', function handleLoad() {
    var window = win.window;
    var document = window.document;
    //
    var viewportWidth = Math.max(
        win.window.document.documentElement.clientWidth,
        win.window.innerWidth || 0);

    // console.log('height: '+win.window.document.body.scrollHeight+ ' || params height: '+height)

    // Wait for resize to take effect
    async.until(function() {
            // return $('body', document).width() == width;
            return win.width == width;
        },
        function(cb) {
            //setTimeout(cb, 10);
            console.log('height: ' + win.window.document.body.scrollHeight + ' || params height: ' + height + ' || win height: ' + win.height + ' || params width: ' + width + ' || body width: ' + $('body', document).width() + ' || win width: ' + win.width + ' || ' + win.window.document.body.scrollWidth + ' || ' + win.window.document.documentElement.clientWidth + ' || ' + win.window.innerWidth + ' || ');
            // if(height==0){
            // 				// win.resizeTo(width, $('body', document).height());
            // 				win.width = width;

            // win.height = win.window.document.body.scrollHeight;
            // 			}else 
            win.resizeTo(width, win.height);
        },
        function(err) {
            setTimeout(
                function waitForStabilization() {
                    win.capturePage(function(data) {
                        fs.writeFile(filename, data, function(err) {
                            // if (!err) {
                            //     setTimeout(
                            //         function upload() {
                            //             oss.putObject({
                            //                     Bucket: config.ali_bucket,
                            //                     Key: uuname, // 注意, Key 的值不能以 / 开头, 否则会返回错误.
                            //                     Body: data,
                            //                     AccessControlAllowOrigin: '',
                            //                     ContentType: 'image/jpeg',
                            //                     CacheControl: 'no-cache', // 参考: http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.9
                            //                     ContentDisposition: '', // 参考: http://www.w3.org/Protocols/rfc2616/rfc2616-sec19.html#sec19.5.1
                            //                     ContentEncoding: 'utf-8', // 参考: http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.11
                            //                     ServerSideEncryption: 'AES256',
                            //                     Expires: null // 参考: http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.21
                            //                 },
                            //                 function(err, data) {
                            //                     if (err) {
                            //                         console.log(colors.red('error: %s'), err);
                            //                     } else {
                            //                         console.log(colors.yellow(JSON.stringify(data)))
                            //                         win.close();
                            //                         process.exit();
                            //                     }
                            //
                            //                 });
                            //         }, 2000);
                            // } else {
                                // console.log(colors.red('capturePage found err. ' + err));
                                win.close();
                                process.exit();
                            // }
                        });
                    }, {
                        format: 'jpeg',
                        datatype: 'buffer'
                    });
                }, 2000);
        });
});
