var minify = require("./minify")

module.exports = function(obj, callback) {
    var compress = new Object();
    compress.error = "ok";
    var before = new Date().getTime();
    var ext = obj.input_nm.match(/^(.*)(\.)(.{1,8})$/)[3].toLowerCase();

    var hash = {
        'png': 1,
        'jpeg': 2,
        'jpg': 3,
        'gif': 4
    }
    try {
        if (hash[ext]) {
            console.log('> ' + colors.grey('Time: ' + dateformat(new Date(), 'yyyy-mm-dd HH:MM:ss TT')) + '\t' + colors.yellow('压缩文件名：' + obj.input_nm));
            fs.readFile(obj.input_dic + obj.input_nm, function(err, data) {
                if (err) throw err;
                else {
                    if (hash[ext] == 1) {
                        minify.png_minify({
                            time: before,
                            data: data,
                            output_dic: obj.output_dic,
                            output_nm: obj.output_nm
                        }, callback);
                    } else if (hash[ext] == 2 || hash[ext] == 3) {
                        //jpg_minify(input,output_dic,output_nm);
                        minify.mozjpg_minify({
                            time: before,
                            data: data,
                            output_dic: obj.output_dic,
                            output_nm: obj.output_nm
                        }, callback);
                    } else if (hash[ext] == 4) {
                        //jpg_minify(input,output_dic,output_nm,callback);
                        minify.gif_minify({
                            time: before,
                            data: data,
                            output_dic: obj.output_dic,
                            output_nm: obj.output_nm
                        }, callback);
                    } else {
                        console.log(colors.magenta('It has error.'));
                        compress.error = 'It has error.';
                        callback(compress);
                    }
                }
            });
        } else {
            compress.error = 'File type is not match.';
            console.log(colors.magenta('File type is not match.'));
            callback(compress);
        }
    } catch (e) {
        compress.error = 'Minify internal exception.';
        console.log(colors.magenta('Minify internal exception.'));
        callback(compress);
    }
}
