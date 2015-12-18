var Imagemin = require('imagemin');
var imageminJpegRecompress = require('imagemin-jpeg-recompress');
var imageminPngquant = require('imagemin-pngquant');
var rename = require('gulp-rename');
var imageminAdvpng = require('imagemin-advpng');
var imageminZopfli = require('imagemin-zopfli');
var imageminPngcrush = require('imagemin-pngcrush');
var imageminJpegRecompress = require('imagemin-jpeg-recompress');
var imageminMozjpeg = require('imagemin-mozjpeg');
var imageminGifsicle = require('imagemin-gifsicle');

var before;

var compress = {
    error: 'ok',
    before: '',
    after: '',
    rate: '',
    time: ''
};

var png_minify = function(input, output_dic, output_nm,callback) {
    //var input = ;
    var image = new Imagemin()
        .src(input)
        .dest(output_dic)
    //.use(imageminJpegRecompress({loops: 3,quality:'low',min:5,target:0.999,progressive:true}))
    .use(imageminPngquant({
        floyd: 0,
        nofs: false,
        quality: '50-80',
        speed: 5,
        posterize: 1
    }))
        .use(rename(output_nm))
    //.use(imageminPngcrush({reduce: true}))
    // .use(imageminZopfli({'8bit':true}))
    // .use(imageminAdvpng({optimizationLevel: 4}))
    .run(function(err, files) {
        callback(calCompressTime());
    });
}

var jpg_minify =function (input, output_dic, output_nm,callback) {
    var image = new Imagemin()
        .src(input)
        .dest(output_dic)
        .use(imageminJpegRecompress({
            loops: 3,
            quality: 'low',
            min: 5,
            target: 0.999
        }))
        .use(rename(output_nm))
        .run(function(err, files) {
            calCompressTime(input.length,files[0].contents.length,callback);
        });

}

var mozjpg_minify = function (input, output_dic, output_nm, callback) {
    var image = new Imagemin()
        .src(input)
        .dest(output_dic)
        .use(imageminMozjpeg({
            quality: 75,
            fastcrush: true
        }))
        .use(rename(output_nm))
        .run(function(err, files) {
            calCompressTime(input.length,files[0].contents.length,callback);  
        });
}

var gif_minify =function (input, output_dic, output_nm,callback) {

    var image = new Imagemin()
        .src(input)
        .dest(output_dic)
        .use(imageminGifsicle())
        .use(rename(output_nm))
        .run(function(err, files) {
            calCompressTime(input.length,files[0].contents.length,callback);
        });
}

function calCompressTime(in_len,out_len,callback){
    var date3 = new Date().getTime() - before;
    //计算出相差天数
    var days = Math.floor(date3 / (24 * 3600 * 1000));
    //计算出小时数
    var leave1 = date3 % (24 * 3600 * 1000); //计算天数后剩余的毫秒数
    var hours = Math.floor(leave1 / (3600 * 1000));
    //计算相差分钟数
    var leave2 = leave1 % (3600 * 1000); //计算小时数后剩余的毫秒数
    var minutes = Math.floor(leave2 / (60 * 1000));
    //计算相差秒数
    var leave3 = leave2 % (60 * 1000); //计算分钟数后剩余的毫秒数
    var seconds = Math.round(leave3 / 1000);
    console.log('> '+colors.grey('Time: '+dateformat(new Date(), 'yyyy-mm-dd HH:MM:ss TT'))+'\t'+colors.yellow('压缩前图片大小：' + (in_len/ 1048576).toFixed(2) + "M" + "  压缩后图片大小：" + (out_len / 1048576).toFixed(2) + "M" + " 压缩比：" + ((1 - out_len / in_len) * 100).toFixed(2) + "%"));
    console.log('> '+colors.grey('Time: '+dateformat(new Date(), 'yyyy-mm-dd HH:MM:ss TT'))+'\t'+colors.yellow('所用时间：' + minutes + " 分钟" + seconds + " 秒"));
    compress.before = (in_len / 1048576).toFixed(2) + "M";
    compress.after = (out_len / 1048576).toFixed(2) + "M";
    compress.rate = ((1 - out_len / in_len) * 100).toFixed(2) + "%";
    compress.time = minutes + "mm" + seconds + "ss";
    callback(compress);
}

module.exports = function(obj, callback) {
    before = new Date().getTime();
    var ext = obj.input_nm.match(/^(.*)(\.)(.{1,8})$/)[3].toLowerCase();
    console.log(colors.red(ext));
    var hash = {
        'png': 1,
        'jpeg': 2,
        'jpg': 3,
        'gif': 4
    }
    try {
        if (hash[ext]) {
            console.log('> '+colors.grey('Time: '+dateformat(new Date(), 'yyyy-mm-dd HH:MM:ss TT'))+'\t'+colors.yellow('压缩文件名：' + obj.input_nm));
            fs.readFile(obj.input_dic + obj.input_nm, function (err, data) {
              if (err) throw err;
              else{
                  if (hash[ext] == 1) {
                      png_minify(odata, obj.output_dic, obj.output_nm, callback);
                  } else if (hash[ext] == 2 || hash[ext] == 3) {
                      //jpg_minify(input,output_dic,output_nm);
                      mozjpg_minify(data, obj.output_dic, obj.output_nm,callback);
                  } else if (hash[ext] == 4) {
                      //jpg_minify(input,output_dic,output_nm,callback);
                      gif_minify(data, obj.output_dic, obj.output_nm,callback);
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
