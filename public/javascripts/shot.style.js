$(function() {
	
	var data_array = [];
	
	$('#upbn').on("click", function() {
		$('#fileinput').click();
	});

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

	$(document).on("change", "input[name='origin_wh']", function() {
		if ($(this).is(':checked')) {
			$(this).parent().prev().children().first().val('');
			$(this).parent().prev().children().first().prop('disabled', true);
			$(this).parent().prev().children().first().parent().prev().children().first().val('');
			$(this).parent().prev().children().first().parent().prev().children().first().prop('disabled', true);
		} else {
			$(this).parent().prev().children().first().val('');
			$(this).parent().prev().children().first().prop('disabled', false);
			$(this).parent().prev().children().first().parent().prev().children().first().val('');
			$(this).parent().prev().children().first().parent().prev().children().first().prop('disabled', false);
		}
	})
	$(document).on("click", "a[name='pre_unpack_bt']", function() {
		data_array.length = 0;
		/** u_youjipin ***/
		if ($(this).parent().prev().attr('id') == 'u_youjipin') {

			$(this).parent().find(".input").each(function(index, element) {
				if (index === 0) {
					$(this).parent().parent().prev().find("[data-index='" + index + "']").text($(this).val());
					data_array.push($(this).val());
				} else if (index === 1) {
					$(this).parent().parent().prev().find("[data-index='" + index + "']").text($(this).val());
					data_array.push($(this).val());
				} else if (index === 2) {
					$(this).parent().parent().prev().find("[data-index='" + index + "']").text($(this).val());
					data_array.push($(this).val());
				} else if (index === 3) {
					$(this).parent().parent().prev().find("[data-index='" + index + "']").text($(this).val());
					data_array.push($(this).val());
				} else if (index === 4) {
					if ($(this).parent().parent().find("input[name='origin_wh']").is(':checked')) {
						$(this).parent().parent().prev().find("[data-index='" + index + "']").attr('src', $(this).val());
						data_array.push($(this).val());
					} else {
						var imgname = $(this).val().match(/[^\/]+\.(jpg|jpeg|JPG|JPEG|png|PNG|gif|GIF|webp|WEBP)/gi).toString();
						var imgwidth = $(this).parent().parent().find('input[name="custom_w"]').val();
						var imgheight = $(this).parent().parent().find('input[name="custom_h"]').val();
						$imginput = $(this);
						if (imgname.match(/^(.*)(\.)(.{1,8})$/) != null) {
							thumb = imgname + '_' + imgwidth + '×' + imgheight + '.' + imgname.match(/^(.*)(\.)(.{1,8})$/)[3].toLowerCase();
							$.ajax({
								url: 'http://172.28.3.51:3008/thumb/' + thumb, //Server script to process data
								type: 'get',
								success: function(data) {
									if (typeof data.thumb_url != 'undefined' && data.thumb_url != null) {
										$imginput.parent().parent().prev().find("[data-index='" + index + "']").attr('src', data.thumb_url);
										data_array.push(data.thumb_url);
									}
								},
								error: function(data, error, errorThrown) {
									if (data.status && data.status >= 400) {
										alert(data.responseText);
									} else {
										alert("Something went wrong");
									}
								}
							});
						} else {
							alert('Image type is not matched.');
							return false;
						}
					}
				}
			})
		}
	})

	$('#submit').on("click", function() {
		$check = $('input[name=setMain]:checked');
		// console.log(JSON.stringify(data_array));
		// return false;
		if ($check.length === 1) {
			$.ajax({
				url: '/nw', //Server script to process data
				type: 'POST',
				data: {
					tempid: '' + $check.attr('data-xr'),
					xr_width: $('#' + $check.attr('data-xr')).parent().width(),
					xr_height: $('#' + $check.attr('data-xr')).parent().height(),
					array:JSON.stringify(data_array)
				},
				success: function(data) {
					$('#mask').hide();
					alert(data.error + ' ' + data.message + ' ' + data.shot_url);
					$check.prop('checked', false);
					window.open(data.shot_url);
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
