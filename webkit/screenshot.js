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
// var url = gui.App.argv[0];
var url = 'http://baidu.com/'
// var imgDest = gui.App.argv[1];
var imgDest = process.cwd() + '/123.png';

// Assert against url and image destination
assert(url, 'No url was specified.');
assert(imgDest, 'No img destination was specified.');

// Navigate to a website in a new window
// DEV: Otherwise, we lose our script after navigating
var guiWidth = 800;
var guiHeight = 600;
// var win = gui.Window.open('http://google.com/', {
var win = gui.Window.open(url, {
	width: guiWidth,
	height: guiHeight,
	toolbar: false,
	show:true,
	frame: false
});

// var window = win.window;
// var document = window.document;

// When all the assets load (e.g. images, CSS, JS)
win.on('loaded', function handleLoad() {
	var window = win.window;
	var document = window.document; 
	
	// Calculate how of the much window dimensions are padding
	var viewportWidth = Math.max(
		win.window.document.documentElement.clientWidth,
		win.window.innerWidth || 0);
	var viewportHeight = Math.max(
		win.window.document.documentElement.clientHeight,
		win.window.innerHeight || 0);
	var paddingWidth = guiWidth - viewportWidth;
	var paddingHeight = guiHeight - viewportHeight;

	// Resize to full content height/width
	win.resizeTo(
		win.window.document.body.scrollWidth + paddingWidth,
		win.window.document.body.scrollHeight + paddingHeight);

	// Wait for resize to take effect
	// TODO: Place me on an async loop `async.until`
	async.until(function() {
			return viewportHeight / viewportWidth == 0.75
		},
		function(cb) {
			win.resizeTo(
				win.window.document.body.scrollWidth + paddingWidth,
				win.window.document.body.scrollHeight + paddingHeight);
			setTimeout(cb, 200);
		},
		function(err) {
			var div = document.createElement("div"); 
			div.innerHTML = "网页教学网：http://www.ffasp.com/"; 
			document.body.appendChild(div); 
			console.log(process.cwd());
			console.log('paddingWidth: ' + paddingWidth + ' paddingHeight: ' + paddingHeight+ ' scrollWidth: '+win.window.document.body.scrollWidth+' scrollHeight: '+win.window.document.body.scrollHeight);
			// Hide all <canvas> elements
			// DEV: develop-faster has timer based draws so there can be issues
			// http://www.quirksmode.org/dom/w3c_css.html
			// var sheet = cssControls.createStyleSheet();
			// cssControls.addRule(sheet, 'canvas', 'display: none;');
			// Wait for page to stabilize/load elements
			setTimeout(function waitForStabilization() {
				// Render and exit
				win.capturePage(function handleScreenshot(buff) {
					// Write our our image and leave
					fs.writeFile(imgDest, buff, function handleSave(err) {
						win.close();
						process.exit();
					});
				}, {
					format: 'png',
					datatype: 'buffer'
				});
			}, 1000);
		});

});
