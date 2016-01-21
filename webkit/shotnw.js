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
// Grab the arguments

var filename = gui.App.argv[0];
var url = gui.App.argv[1];
var width = gui.App.argv[2] / 1;
var height = gui.App.argv[3] / 1;

// Navigate to a website in a new window
// DEV: Otherwise, we lose our script after navigating

var win = gui.Window.open(url, {
	width:width,
	height:height,
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
			console.log('height: '+win.window.document.body.scrollHeight + ' || params height: '+height + ' || win height: ' + win.height + ' || params width: '+width + ' || body width: ' +$('body', document).width() + ' || win width: ' + win.width + ' || ' + win.window.document.body.scrollWidth + ' || ' + win.window.document.documentElement.clientWidth + ' || ' + win.window.innerWidth + ' || ');
			// if(height==0){
// 				// win.resizeTo(width, $('body', document).height());
// 				win.width = width;
				
				// win.height = win.window.document.body.scrollHeight;
// 			}else 
			win.resizeTo(width, win.height);
		},
		function(err) {
			setTimeout(function waitForStabilization() {
				// Render and exit
				win.capturePage(function handleScreenshot(buff) {
					// Write our our image and leave
					fs.writeFile(filename, buff, function handleSave(err) {
						win.close();
						process.exit();
					});
				}, {
					format: 'jpeg',
					datatype: 'buffer'
				});
			}, 2000);
		});
});
