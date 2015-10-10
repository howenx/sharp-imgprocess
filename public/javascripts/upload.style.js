  var drag = '<div class="dragon-contained">' +
  	"<div class='dragon-graph'>" +
  	"<div class='dragon-circle'>" +
  	"<div class='dragon-circle-inner'></div>" +
  	'</div>' +
  	"<div class='dragon-rectangle'>" +
  	"<div class='dragon-trangle'></div>" +
  	"<div class='dragon-text'>" +
  	"<p class='dragon-p'>CDKIODU</p>" +
  	'</div>' +
  	'</div>' +
  	"<div class='dragon-close'>" +
  	'</div>' +
  	'</div>' +
  	'</div>';
  var mark_image_nm;
  $(function() {

  	$(document).on("click", "p.dragon-p", function() {
  		console.log('1');
  		//if the icon-circle-close exists,then remove it
  		if ($(this).parent().parent().next().has('div.icon-circle-close').length === 0) {
  			$(this).parent().parent().next().empty();
  			var left_close = $(this).parent().parent().parent().width();
  			$(this).parent().parent().next().css({
  				'left': left_close + 'px'
  			});
  			$(this).parent().parent().next().append('<div class="icon-circle-close"></div>');
  		} else {
  			$(this).parent().parent().next().empty();
  		}
  	});
  	/*If the element is dynamic append.You should the following method.*/
  	$(document).on("click", "div.icon-circle-close", function() {
  		$(this).parent().parent().parent().remove();
  	});
  	$('#mark-bt').click(function() {
  		var radio_flag = false;
  		var rotate = '';
  		$(':radio[name=mark-deg]').each(function(index, element) {
  			if ($(this).prop('checked')) {
  				radio_flag = true;
  				rotate = $(this).val();
  			}
  		});
  		//check length
  		if ($('#mark-nm').val() != '' && $('#mark-nm').val().length != 0 && $('#mark-nm').val().replace(/[^\x00-\xff]/ig, "aa").length < 24) {
  			//check rotate degree just for number			
  			// if ($('#mark-rotate').val != '' && $('#mark-rotate').val().match(/[\d]/ig)) {
  			if (radio_flag && rotate != '') {
  				var ch_drag = $(drag).find('p').eq(0).text($('#mark-nm').val());
  				//if the rotate for 180 or 135,first rotate the p tag text 180.
  				if (rotate === '180' || rotate === '135') {
  					var ch_drag_p = ch_drag.parent().css({
  						'transform': 'rotate(180deg)',
  						'-ms-transform': 'rotate(180deg)',
  						'-webkit-transform': 'rotate(180deg)',
  						'-o-transform': 'rotate(180deg)',
  						'-moz-transform': 'rotate(180deg)',
  						'left': '0px'
  					});
  					var ch_graph = ch_drag_p.parent().parent().css({
  						'transform': 'rotate(' + rotate + 'deg)',
  						'-ms-transform': 'rotate(' + rotate + 'deg)',
  						'-webkit-transform': 'rotate(' + rotate + 'deg)',
  						'-o-transform': 'rotate(' + rotate + 'deg)',
  						'-moz-transform': 'rotate(' + rotate + 'deg)'
  					});
  					$('#dragon-container').append(ch_graph.parent());
  					$('div.dragon-contained').draggable({
  						containment: "parent"
  					});
  				} else if (rotate === '0' || rotate === '45') {
  					var ch_graph = ch_drag.parent().parent().parent().css({
  						'transform': 'rotate(' + rotate + 'deg)',
  						'-ms-transform': 'rotate(' + rotate + 'deg)',
  						'-webkit-transform': 'rotate(' + rotate + 'deg)',
  						'-o-transform': 'rotate(' + rotate + 'deg)',
  						'-moz-transform': 'rotate(' + rotate + 'deg)'
  					});
  					$('#dragon-container').append(ch_graph.parent());
  					$('div.dragon-contained').draggable({
  						containment: "parent"
  					});
  				} else {
  					alert('Please do not modify rotate degree.');
  				}
  			} else {
  				alert('Please choose correct rotate degree.');
  			}
  		} else alert('Please input the length less than 24 characters and more than 1 character.');
  	});
  	//thumb modules
  	$('#upbn').on("click", function() {
  		var params = '';

  		$(':radio[name=select-minify]').each(function(index, element) {
  			if ($(this).prop('checked')) {
  				params = $(this).attr('data-xf');
  			}
  		})
  		if (params != '') {
  			$('#fileinput').click();
  		} else {
  			alert('Please select minify radio.');
  			return false;
  		}
  	});
  	$('#submit').on("click", function() {
  		var imgname = $('#imgname').val();
  		var imgwidth = $('#imgwidth').val();
  		var imgheight = $('#imgheight').val();
  		var thumb;
  		if (imgname != null && imgwidth != null && imgheight != null) {
  			if (imgname.match(/[^\/]+(\.(jpg|jpeg|JPG|JPEG|png|PNG|gif|GIF|webp|WEBP))$/) != null && typeof imgname.match(/[^\/]+(\.(jpg|jpeg|JPG|JPEG|png|PNG|gif|GIF|webp|WEBP))$/) != 'undefined') {
  				var type = imgname.match(/(\.(jpg|jpeg|JPG|JPEG|png|PNG|gif|GIF|webp|WEBP))$/g).toString().replace(/\./gi, '').toLowerCase();
  				thumb = imgname + '_' + imgwidth + '×' + imgheight + '.' + type;
  				$.ajax({
  					url: 'http://172.28.3.18:3008/thumb/' + thumb, //Server script to process data
  					type: 'get',
  					success: function(data) {
  						alert(data.error);
  						if (typeof data.thumb_url != 'undefined' && data.thumb_url != null) {
  							// $('#divthumbsubmit').append('<div style="display:block;width:100%;margin-bottom:25px;">缩略图名称：<b>' + thumb + '</b></div>');
  							// $('.thumb').append('<div style="margin:10px;float:left;border: 1px solid #343131;padding:5px;"><img style="-webkit-user-select: none; cursor: zoom-in;" src="' + data.thumb_url + '"></div>');
  							var img = new Image;
  							/** Set the img src property using the data URL. **/
  							img.onload = function() {
  								mark_image_nm = img.src;
  								// console.log($(img));
  								$('#dragon-container').css({
  									'background': 'url(' + data.thumb_url + ') no-repeat',
  									'background-size': 'cover',
  									'width': img.width,
  									'height': img.height
  								});
  							};
  							img.src = data.thumb_url;
  						}
  					}
  				});
  			} else {
  				alert('The input image type mismatch');
  			}
  		} else {
  			alert('Please input the image name,width,height.');
  		}
  	});

  	function upload(thumb, file) {
  		var params = '';
  		$(':radio[name=select-minify]').each(function(index, element) {
  			if ($(this).prop('checked')) {
  				params = $(this).attr('data-xf');
  			}
  		})
  		if (params != '' && file != null) {
  			var formdata = new FormData();
  			formdata.append("photo", file);
  			formdata.append("params", params);
  			//console.info(formdata);
  			// $.ajax({
  			//   				url: 'http://172.28.3.18:3008/upload', //Server script to process data
  			//   				type: 'POST',
  			//   				data: formdata,
  			//             	// mimeType:"multipart/form-data",
  			//             	contentType: false,
  			//             	// cache: false,
  			//             	processData:false,
  			// 				dataType: "jsonp",
  			//   				success: function(data) {
  			//   					console.log(data.message);
  			//   					alert(data.message);
  			//   					if (typeof data.compress != 'undefined' && data.compress != null) {
  			//   						$('#gpicnm').append('<span style="display:block;margin:10px;width:100%;">第' + ($('#gallery').children().length) + '张图片名称：<b>' + data.imgid + '</b><br><b>压缩前大小:' + data.compress.before + ' 压缩后大小:' + data.compress.after + ' 用时:' + data.compress.time + ' 压缩率:' + data.compress.rate + '</b></span>');
  			//   					}
  			//   					$(':radio[name=select-minify]').each(function(index, element) {
  			//   						$(this).prop('checked', false);
  			//   					})
  			//   				}
  			//   			});
  			var http = new XMLHttpRequest();
  			var url = "http://172.28.3.18:3008/upload";
  			http.open("POST", url, true);
  			http.onreadystatechange = function() {
  				if (http.readyState == 4 && http.status == 200) {
  					var data = JSON.parse(http.responseText);
  					alert(data.message);
  					if (typeof data.compress != 'undefined' && data.compress != null) {
  						$('#gpicnm').append('<span style="display:block;margin:10px;width:100%;">第' + ($('#gallery').children().length) + '张图片名称：<b>' + data.imgid + '</b><br><b>压缩前大小:' + data.compress.before + ' 压缩后大小:' + data.compress.after + ' 用时:' + data.compress.time + ' 压缩率:' + data.compress.rate + '</b></span>');
  					}
  					$(':radio[name=select-minify]').each(function(index, element) {
  						$(this).prop('checked', false);
  					})
  				}
  			}
  			http.send(formdata);
  		} else {
  			alert('Please select minify radio.');
  			return false;
  		}
  	}


  	function previewImage(file) {
  		var galleryId = "gallery";

  		var gallery = document.getElementById(galleryId);
  		var imageType = /image.*/;

  		if (!file.type.match(imageType)) {
  			throw "File Type must be an image";
  		}

  		var thumb = document.createElement("div");
  		thumb.classList.add('thumbnail');

  		var img = document.createElement("img");
  		img.file = file;
  		thumb.appendChild(img);
  		gallery.appendChild(thumb);

  		// Using FileReader to display the image content
  		var reader = new FileReader();
  		reader.onload = (function(aImg) {
  			return function(e) {
  				aImg.src = e.target.result;
  			};
  		})(img);
  		reader.readAsDataURL(file);
  		upload(thumb, file);
  	}

  	var uploadfiles = document.querySelector('#fileinput');
  	uploadfiles.addEventListener('change', function() {
  		var files = this.files;
  		for (var i = 0; i < files.length; i++) {
  			previewImage(this.files[i]);
  			//upload(this.files[i]);
  		}

  	}, false);

  	/*Push the mark info by json.*/
  	$('#push').click(function() {
  		var container_off = $(this).prev().offset();
  		// var obj = $.parseJSON ( '{ "image_nm": "'+mark_image_nm+'",{}}' );
  		var json = '{ "image_nm": "' + mark_image_nm + '","mark":[';
  		$('.dragon-contained').each(function(index, element) {
  			var contained_off = $(this).offset();
  			var dot_off = $(this).find('div.dragon-circle').first().offset();
  			var dot_position_top = dot_off.top - container_off.top;
  			var dot_postion_left = dot_off.left - container_off.left;
  			var drag_position_top = contained_off.top - container_off.top;
  			var drag_position_left = contained_off.left - container_off.left;
  			if (index === 0) {
  				json += '{"dot_postion_top":"' + dot_position_top + '","dot_postion_left":"' + dot_postion_left + '","drag_position_top":"' + drag_position_top + '","drag_position_left":"' + drag_position_left + '","rotate":"' + matrix2deg($(this).children().eq(0).css('transform')) + '","text":"' + $(this).find('p').eq(0).text() + '"}';
  			} else {
  				json += ',{"dot_postion_top":"' + dot_position_top + '","dot_postion_left":"' + dot_postion_left + '","drag_position_top":"' + drag_position_top + '","drag_position_left":"' + drag_position_left + '","rotate":"' + matrix2deg($(this).children().eq(0).css('transform')) + '","text":"' + $(this).find('p').eq(0).text() + '"}';
  			}
  		});
  		json += ']}';
  		var obj = $.parseJSON(json);
  		console.log(obj);
  	});

  	/** rotation matrix - http://en.wikipedia.org/wiki/Rotation_matrix **/
  	var matrix2deg = function(matrix) {
  		var values = matrix.split('(')[1].split(')')[0].split(',');
  		var a = values[0];
  		var b = values[1];
  		var c = values[2];
  		var d = values[3];

  		var scale = Math.sqrt(a * a + b * b);

  		// arc sin, convert from radians to degrees, round
  		var sin = b / scale;
  		// next line works for 30deg but not 130deg (returns 50);
  		// var angle = Math.round(Math.asin(sin) * (180/Math.PI));
  		var angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));

  		// console.log('Rotate: ' + angle + 'deg');
  		return angle;
  	}
  });
