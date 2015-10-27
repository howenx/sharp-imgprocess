$(function() {
	/*** template params array.****/
	var data_array = [];
	
	/***** replace file click event. *****/
	$('#upbn').on("click", function() {
		if($(':radio[name=select-minify]').is(':checked')){
			$('#fileinput').click();
		}
		else {
  			alert('Please select minify radio.');
  			return false;
		}
	});

	/**** Template selected radio button click event. *****/
	$(':radio[name=setMain]').on("click", function() {
		if ($(this).prop('checked')) {
			$('.li-dv').hide();
			$('#' + $(this).attr('data-xr')).parent().css('display', 'table');
			if ($(this).attr('data-xr') === 'shop_unpack') {
				$('#' + $(this).attr('data-xr')).parent().css('display', 'block');
			}
		}
	});

	/***Loading..***/
	$(document).ajaxStart(function() {
		$('#mask').show();
	});
	$(document).ajaxStop(function() {
		$('#mask').hide();
	});

	/*** 默认宽度触发事件 ***/
	$(document).on("change", "input[name='origin_wh']", function() {
		if ($(this).is(':checked')) {
			$(this).parent().parent().next().children().last().children().first().val('');
			$(this).parent().parent().next().children().last().children().first().prop('disabled', true);
			$(this).parent().parent().next().next().children().last().children().first().first().val('');
			$(this).parent().parent().next().next().children().last().children().first().first().prop('disabled', true);
		} else {
			$(this).parent().parent().next().children().last().children().first().val('');
			$(this).parent().parent().next().children().last().children().first().prop('disabled', false);
			$(this).parent().parent().next().next().children().last().children().first().first().val('');
			$(this).parent().parent().next().next().children().last().children().first().first().prop('disabled', false);
		}
	})
	
	/**** preview the template event.. ****/
	$(document).on("click", "a[name='pre_unpack_bt']", function() {
		data_array.length = 0;
		/** u_youjipin ***/
		$temp_div = $(this).parent().parent().parent().parent().parent().prev();
		
		if ($temp_div.attr('id') == 'u_youjipin') {

			$(this).parent().parent().parent().find(".input-area").each(function(index, element) {
				
				var imgwidth = $(this).parent().parent().parent().find('input[name="custom_w"]').val();
				var imgheight = $(this).parent().parent().parent().find('input[name="custom_h"]').val();
				
				if (index === 0 && $(this).val()!=null && $(this).val()!='') {
					
					$temp_div.find("[data-index='" + index + "']").text($(this).val());
					data_array.push($(this).val());
					
				} else if (index === 1 && $(this).val()!=null && $(this).val()!='') {
					
					$temp_div.find("[data-index='" + index + "']").text($(this).val());
					data_array.push($(this).val());
					
				} else if (index === 2 && $(this).val()!=null && $(this).val()!='') {
					
					$temp_div.find("[data-index='" + index + "']").text($(this).val());
					data_array.push($(this).val());
					
				} else if (index === 3 && $(this).val()!=null && $(this).val()!='') {
					
					$temp_div.find("[data-index='" + index + "']").text($(this).val());
					data_array.push($(this).val());
					
				} else if (index === 4 && $(this).val()!=null && $(this).val()!='') {
					
					if ($(this).parent().parent().parent().find("input[name='origin_wh']").is(':checked')) {
						
						$temp_div.find("[data-index='" + index + "']").attr('src', $(this).val());
						data_array.push($(this).val());
						
					} else if(imgwidth!=null && imgwidth!='' &&  imgheight!=null && imgheight!=''){
						
						var imgname = $(this).val().match(/[^\/]+\.(jpg|jpeg|JPG|JPEG|png|PNG|gif|GIF|webp|WEBP)/gi).toString();
						$imginput = $(this);
						
						if (imgname.match(/^(.*)(\.)(.{1,8})$/) != null) {
							
							thumb = imgname + '_' + imgwidth + '×' + imgheight + '.' + imgname.match(/^(.*)(\.)(.{1,8})$/)[3].toLowerCase();
							
							$.ajax({
								url: window.url+'/thumb/' + thumb, //Server script to process data
								type: 'get',
								success: function(data) {
									if (typeof data.thumb_url != 'undefined' && data.thumb_url != null) {
										$temp_div.find("[data-index='" + index + "']").attr('src', data.thumb_url);
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
					} else {
						alert('Please check exists null value.')
						return false;
					}
				} else {
					alert('Please check exists null value.')
					return false;
				}
			})
		}
	})

	/** submit to nwjs shootscreen. **/
	$('#submit').on("click", function() {
		console.log(JSON.parse(JSON.stringify(data_array)));
		
		$check = $('input[name=setMain]:checked');
		if ($check.length === 1) {
			$.ajax({
				url: 'http://172.28.3.18:3008/nw',
				type: 'POST',
				data: {
					tempid: '' + $check.attr('data-xr'),
					xr_width: $('#' + $check.attr('data-xr')).width(),
					xr_height: $('#' + $check.attr('data-xr')).height(),
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

  	

	/***for mitilupload images foreach files for preview.****/
	$(document).on("change", "#fileinput", function() {
		
  		var files = $(this)[0].files;
  		for (var i = 0; i < files.length; i++) {
  			previewImage(this.files[i]);
  		}
	})
	
	/**** preview single image file.*****/
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
			
  			var http = new XMLHttpRequest();
  			var url = "http://172.28.3.18:3008/upload";
			
  			http.open("POST", url, true);
			
  			http.onreadystatechange = function() {
				
  				if (http.readyState == 4 && http.status == 200) {
					
  					var data = JSON.parse(http.responseText);
					
  					alert(data.message);
					
  					if (typeof data.compress != 'undefined' && data.compress != null) {
  						$('#gpicnm').append('<span style="display:block;margin:10px;width:100%;"><h4>第' + ($('#gallery').children().length) 
						+ '张</h4>图片名称: <b>' + data.imgid + '</b></br>图片路径:<b>' + data.path + '</b><br>图片URL: <b>'
						+data.minify_url+'</b><br>压缩数据: <b>压缩前大小 ' 
						+ data.compress.before + ', 压缩后大小 ' + data.compress.after + ', 用时 ' + data.compress.time + ', 压缩率 ' + data.compress.rate + '</b></span>');
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
	
});
