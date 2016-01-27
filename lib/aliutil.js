var ALY = require('aliyun-sdk');
var config = require('./config');

var oss = new ALY.OSS({
	accessKeyId: "gXc1BHNhQmRXkgHz",
	secretAccessKey: "FGWOvCgwFxH1lPxR42eQnqDUwXYKun",
	endpoint: config.ali_endpoint,
	apiVersion: '2013-10-15'
});

var aliutil = {

	listObject: function(bucket, callback) {
		oss.listObjects({
				Bucket: bucket,
				MaxKeys: '10',
				Prefix: 'test/',
				Marker: '',
				Delimiter: ''
			},
			function(err, data) {
				if (err) {
					console.log(colors.red('error: %s'), err);
					callback(err);
				}
				console.log('success:', data.CommonPrefixes);
				callback(data);
			});
	},

	listBuckets: function(callback) {
		oss.listBuckets(function(err, data) {
			if (err) {
				console.log(colors.red('error: %s'), err);
				callback(err);
			}
			callback(data);
		});
	},

	setBucketAcl: function(bucket, level, callback) {
		var acl = '';
		if (level == 1) acl = 'public-read-write';
		else if (level == 2) acl = 'public-read';
		else acl = 'private';
		oss.putBucketAcl({
			Bucket: bucket,
			ACL: acl // public-read-write || public-read || private
		}, function(err, data) {
			if (err) {
				console.log(colors.red('error: %s'), err);
				callback(err);
			}
			callback(data);
		});
	},

	signedUrl: function(bucket, key, callback) {
		var url = oss.getSignedUrl('getObject', {
			Bucket: bucket,
			Key: key,
			Expires: null
		});
		callback(url);
	},

	deleteObject: function(bucket, key, callback) {
		oss.deleteObject({
				Bucket: bucket,
				Key: key
			},
			function(err, data) {

				if (err) {
					console.log(colors.red('error: %s'), err);
					callback(err);
				}
				callback(data);
			});
	},

	putObject: function(obj, callback) {
		fs.readFile(obj.path, function(err, data) {
			if (err) {
				console.log(colors.red('error: %s'), err);
				callback(err);
			}
			oss.putObject({
					Bucket: config.ali_bucket,
					Key: obj.prefix + obj.file_nm, // 注意, Key 的值不能以 / 开头, 否则会返回错误.
					Body: data,
					AccessControlAllowOrigin: '',
					ContentType: obj.mime_type,
					CacheControl: 'no-cache', // 参考: http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.9
					ContentDisposition: '', // 参考: http://www.w3.org/Protocols/rfc2616/rfc2616-sec19.html#sec19.5.1
					ContentEncoding: 'utf-8', // 参考: http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.11
					ServerSideEncryption: 'AES256',
					Expires: null // 参考: http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.21
				},
				function(err, data) {
					if (err) {
						console.log(colors.red('error: %s'), err);
						callback(err);
					}
					callback(data);
				});
		});
	},

	putImage: function(obj, callback) {

		oss.putObject({
				Bucket: config.ali_bucket,
				Key: obj.prefix + obj.file_nm, // 注意, Key 的值不能以 / 开头, 否则会返回错误.
				Body: obj.data,
				AccessControlAllowOrigin: '',
				ContentType: obj.mime_type,
				CacheControl: 'no-cache', // 参考: http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.9
				ContentDisposition: '', // 参考: http://www.w3.org/Protocols/rfc2616/rfc2616-sec19.html#sec19.5.1
				ContentEncoding: 'utf-8', // 参考: http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.11
				ServerSideEncryption: 'AES256',
				Expires: null // 参考: http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.21
			},
			function(err, data) {
				if (err) {
					console.log(colors.red('error: %s'), err);
					callback(err);
				}
				callback(data);
			});
	}

};

module.exports = aliutil;
