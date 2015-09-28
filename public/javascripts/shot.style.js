$(function() {
	var imgname;
	var imgwidth;
	var imgheight;
	//request for thumb image name.
	var thumb;
	//preview flag for firstly click preview button when choose a radio button.
	var preflag = false;
	$('#upbn').on("click", function() {
		$('#fileinput').click();
	});

	function upload(file, imguid) {
		//console.info(file);
		var formdata = new FormData();
		formdata.append("displayImage", file);
		//console.info(formdata);
		$.ajax({
			url: '/upload', //Server script to process data
			type: 'POST',
			data: formdata,
			processData: false,
			contentType: false,
			success: function(data) {
				// console.log(data);
				alert(data.error);
				if (typeof data.compress != 'undefined' && data.compress != null) {
					$('#gpicnm').append('<span style="display:block;margin:10px;width:100%;">第' + ($('#gallery-ch').children().length) + '张图片名称：<b>' + data.imgid + '</b><br><b>压缩前大小:' + data.compress.before + ' 压缩后大小:' + data.compress.after + ' 用时:' + data.compress.time + ' 压缩率:' + data.compress.rate + '</b></span>');
				}
				$('#' + imguid).prop('src', '/uploads/minify/' + data.imgid);
			}
		});
	}


	function previewImage(file) {

		var imageType = /image.*/;

		if (!file.type.match(imageType)) {
			throw "File Type must be an image";
		}

		var img = new Image;
		img.file = file;
		var imguid = Math.uuidCompact();
		// Using FileReader to display the image content
		var reader = new FileReader();
		reader.onload = (function(aImg) {
			return function(e) {
				$('#gallery-ch').append("<div class='thumbnail' style='position: relative;'>" +
					"<img class='thumb-roll-image' id='" + imguid + "' src='" + e.target.result + "'>" +
					"</div>");
			};
		})(img);
		reader.readAsDataURL(file);
		upload(file, imguid);
	}

	var uploadfiles = document.querySelector('#fileinput');
	uploadfiles.addEventListener('change', function() {
		var files = this.files;
		for (var i = 0; i < files.length; i++) {
			previewImage(this.files[i]);
		}
	}, false);

	$(':radio[name=setMain]').on("click", function() {
		if ($(this).prop('checked')) {
			$('.li-dv').hide();
			$('#' + $(this).attr('data-xr')).parent().css('display', 'table');
			if ($(this).attr('data-xr') === 'shop_unpack') {
				$('#' + $(this).attr('data-xr')).parent().css('display', 'block');
			}
		}
	});

	$(document).ajaxStart(function() {
		$('#mask').show();
	});
	$(document).ajaxStop(function() {
		$('#mask').hide();
	});

	$('#submit').on("click", function() {
		$check = $('input[name=setMain]:checked');
		if ($check.length === 1) {
			$.ajax({
				url: '/nw', //Server script to process data
				type: 'POST',
				data: {
					tempid: '' + $check.attr('data-xr'),
					xr_width: $('#' + $check.attr('data-xr')).parent().width(),
					xr_height: $('#' + $check.attr('data-xr')).parent().height()
				},
				success: function(data) {
					$('#mask').hide();
					alert(data.error + ' ' + data.message + ' ' + data.fileurl);
					$check.prop('checked', false);
					window.open(data.fileurl);
					return false;
				}
			})
		} else {
			alert('Please check the templates.');
		}
	});

	$('#price_default_wh').bind("click", function() {
		if ($(this).prop("checked")) {
			$('#price_custom_h').prop("disabled", "disabled");
			$('#price_custom_w').prop("disabled", "disabled");
			imgwidth = 180;
			imgheight = 254;

		} else {
			$('#price_custom_h').removeAttr("disabled");
			$('#price_custom_w').removeAttr("disabled");
		}
	});

	$('#pre_price_bt').on("click", function() {
		imgwidth = '';
		imgheight = '';

		$('#shop_price').css({
			width: 'auto'
		});
		$('#shop_price').css({
			height: 'auto'
		});

		$('#pre_price_bt').parent().find('input').each(function(index, element) {

			if (index === 0) {
				if ($(element).val() != '') {
					$('#price_title').text($(element).val());
				} else {
					alert('The title must be input');
					return false;
				}
			}
			if (index === 1) {
				if ($(element).val() != '')
					$('#price_current_price').text('￥' + $(element).val());
				else {
					alert('The current price must be input');
					return false;
				}
			}
			if (index === 2) {
				if ($(element).val() != '')
					$('#price_origin_price').text('￥' + $(element).val());
				else {
					alert('The origin price must be input');
					return false;
				}
			}
			if (index === 3) {
				if ($(element).val() != '')
					$('#price_discount').text($(element).val() + '折');
				else {
					alert('The discount must be input');
					return false;
				}
			}
			if (index === 4) {
				if ($(element).val() != '')
					imgname = $(element).val();
				else {
					alert('The image name must be input');
					return false;
				}
			}
			if (index === 5) {
				if ($(element).val() != '' && $(element).prop("disabled") != 'disabled')
					imgwidth = $(element).val();
				else {
					alert('The image width must be input');
					return false;
				}
			}
			if (index === 6) {
				if ($(element).val() != '' && $(element).prop("disabled") != 'disabled')
					imgheight = $(element).val();
				else {
					alert('The image height must be input');
					return false;
				}
			}
		});
		getimg('price_img');
	});

	$('#pre_gray_bt').on("click", function() {
		imgwidth = '';
		imgheight = '';

		$('#shop_gray').css({
			width: 'auto'
		});
		$('#shop_gray').css({
			height: 'auto'
		});

		$('#pre_gray_bt').parent().find('input').each(function(index, element) {

			if (index === 0) {
				if ($(element).val() != '') {
					$('#gray_title').text($(element).val());
				} else {
					alert('The title must be input');
					return false;
				}
			}

			if (index === 1) {
				if ($(element).val() != '')
					imgname = $(element).val();
				else {
					alert('The image name must be input');
					return false;
				}
			}
			if (index === 2) {
				if ($(element).val() != '' && $(element).prop("disabled") != 'disabled')
					imgwidth = $(element).val();
				else {
					alert('The image width must be input');
					return false;
				}
			}
			if (index === 3) {
				if ($(element).val() != '' && $(element).prop("disabled") != 'disabled')
					imgheight = $(element).val();
				else {
					alert('The image height must be input');
					return false;
				}
			}
		});
		getimg('gray_img');
	});

	$('#pre_poster_bt').on("click", function() {
		imgwidth = '';
		imgheight = '';

		$('#shop_poster').css({
			width: 'auto'
		});
		$('#shop_poster').css({
			height: 'auto'
		});

		$('#pre_poster_bt').parent().find('input').each(function(index, element) {

			if (index === 0) {
				if ($(element).val() != '') {
					$('#poster_title').text($(element).val());
				} else {
					alert('The title must be input');
					return false;
				}
			}
			if (index === 1) {
				if ($(element).val() != '')
					$('#poster_price').text('￥' + $(element).val());
				else {
					alert('The price must be input');
					return false;
				}
			}
			if (index === 2) {
				if ($(element).val() != '')
					$('#poster_sale_num').text($(element).val());
				else {
					alert('The sale num must be input');
					return false;
				}
			}
			if (index === 3) {
				if ($(element).val() != '')
					$('#poster_like_num').text($(element).val());
				else {
					alert('The like num must be input');
					return false;
				}
			}
			if (index === 4) {
				if ($(element).val() != '')
					imgname = $(element).val();
				else {
					alert('The image name must be input');
					return false;
				}
			}
			if (index === 5) {
				if ($(element).val() != '' && $(element).prop("disabled") != 'disabled')
					imgwidth = $(element).val();
				else {
					alert('The image width must be input');
					return false;
				}
			}
			if (index === 6) {
				if ($(element).val() != '' && $(element).prop("disabled") != 'disabled')
					imgheight = $(element).val();
				else {
					alert('The image height must be input');
					return false;
				}
			}
		});
		getimg('poster_img');

	});

	$('#pre_unpack_bt').on("click", function() {
		imgwidth = '';
		imgheight = '';

		$('#shop_unpack').css({
			width: 'auto'
		});
		$('#shop_unpack').css({
			height: 'auto'
		});
		var re_flag = true;
		$('#pre_unpack_bt').parent().find('input').each(function(index, element) {

			if (index === 0) {
				if ($(element).val() != '') {
					$('#unpack_discount').text($(element).val());
				} else {
					re_flag = false;
					alert('The unpack discount must be input');
					return false;
				}
			}
			if (index === 1) {
				if ($(element).val() != '')
					$('#unpack_price_origin').text('￥' + $(element).val());
				else {
					re_flag = false;
					alert('The original price must be input');
					return false;
				}
			}
			if (index === 2) {
				if ($(element).val() != '')
					$('#unpack_price_current').text('￥' + $(element).val());
				else {
					re_flag = false;
					alert('The current price num must be input');
					return false;
				}
			}
			if (index === 3) {
				if ($(element).val() != '')
					$('#unpack_price_unpack').text('￥' + $(element).val());
				else {
					re_flag = false;
					alert('The unpack price num must be input');
					return false;
				}
			}
			if (index === 4) {
				if ($(element).val() != '')
					$('#unpack_title').css({
						width: $(element).val() + '%'
					});
				else {
					re_flag = false;
					alert('The unpack title width percent num must be input');
					return false;
				}
			}
			if (index === 5) {
				if ($(element).val() != '')
					$('#unpack_title').css({
						left: $(element).val() + '%'
					});
				else {
					re_flag = false;
					alert('The unpack title left percent num must be input');
					return false;
				}
			}
			if (index === 6) {
				if ($(element).val() != '')
					imgname = $(element).val();
				else {
					re_flag = false;
					alert('The image name must be input');
					return false;
				}
			}
			if (index === 7) {
				if ($(element).val() != '' && $(element).prop("disabled") != 'disabled')
					imgwidth = $(element).val();
				else {
					re_flag = false;
					alert('The image width must be input');
					return false;
				}
			}
			if (index === 8) {
				if ($(element).val() != '' && $(element).prop("disabled") != 'disabled')
					imgheight = $(element).val();
				else {
					re_flag = false;
					alert('The image height must be input');
					return false;
				}
			}
		});
		if (re_flag) {
			background_img('unpack_img');
		}
	});

	function background_img(id) {
		if (imgwidth != null && imgname != null && imgheight != null) {
			if (imgname.match(/^(.*)(\.)(.{1,8})$/) != null) {
				thumb = imgname + '_' + imgwidth + '×' + imgheight + '.' + imgname.match(/^(.*)(\.)(.{1,8})$/)[3].toLowerCase();
				$('#' + id).empty();
				$('#' + id).css({
					width: imgwidth + 'px'
				});
				$('#' + id).css({
					height: imgheight + 'px'
				});
				// 
				//set preview flag.
				$.ajax({
					url: '/thumb/' + thumb, //Server script to process data
					type: 'get',
					success: function(data) {
						alert(data.error);
						if (typeof data.thumb_url != 'undefined' && data.thumb_url != null) {
							// $('#' + id).append('<img src="' + data.thumb_url + '">');
							$('#' + id).css({
								background: 'url(' + data.thumb_url + ')'
							});
						}
					}
				});
				preflag = true;
			} else {
				alert('Image type is not matched.');
				return;
			}
		} else {
			alert('No refer to the image width and height.');
			return;
		}
	}

	function getimg(id) {
		if (imgwidth != null && imgname != null && imgheight != null) {
			if (imgname.match(/^(.*)(\.)(.{1,8})$/) != null) {
				thumb = imgname + '_' + imgwidth + '×' + imgheight + '.' + imgname.match(/^(.*)(\.)(.{1,8})$/)[3].toLowerCase();
				$('#' + id).empty();
				$('#' + id).css({
					width: 'auto'
				});
				$('#' + id).css({
					height: 'auto'
				});
				$('#' + id).next().css({
					width: '100%'
				});
				// 
				//set preview flag.
				$.ajax({
					url: '/thumb/' + thumb, //Server script to process data
					type: 'get',
					success: function(data) {
						alert(data.error);
						if (typeof data.thumb_url != 'undefined' && data.thumb_url != null) {
							$('#' + id).append('<img src="' + data.thumb_url + '">');
						}
					}
				});
				preflag = true;
			} else {
				alert('Image type is not matched.');
				return;
			}
		} else {
			alert('No refer to the image width and height.');
			return;
		}
	}
});
