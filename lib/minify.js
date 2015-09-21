var Imagemin = require('imagemin');
var imageminJpegRecompress = require('imagemin-jpeg-recompress');
var imageminPngquant = require('imagemin-pngquant');
var fs = require('fs');
var path = require('path');
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

function png_minify(input, output_dic, output_nm,callback) {
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
        //for(var i=0;i<10;i++){
        //	minify()
        //}
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
        console.log(colors.yellow('压缩前图片大小：' + (input.length / 1048576).toFixed(2) + "M" + "  压缩后图片大小：" + (files[0].contents.length / 1048576).toFixed(2) + "M" + " 压缩比：" + ((1 - files[0].contents.length / input.length) * 100).toFixed(2) + "%"));
        console.log(colors.yellow('所用时间：' + minutes + " 分钟" + seconds + " 秒"));
        compress.before = (input.length / 1048576).toFixed(2) + "M";
        compress.after = (files[0].contents.length / 1048576).toFixed(2) + "M";
        compress.rate = ((1 - files[0].contents.length / input.length) * 100).toFixed(2) + "%";
        compress.time = minutes + "mm" + seconds + "ss";
        callback(compress);
    });
}

function jpg_minify(input, output_dic, output_nm,callback) {
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
            console.log(colors.yellow('压缩前图片大小：' + (input.length / 1048576).toFixed(2) + "M" + "  压缩后图片大小：" + (files[0].contents.length / 1048576).toFixed(2) + "M" + " 压缩比：" + ((1 - files[0].contents.length / input.length) * 100).toFixed(2) + "%"));
            console.log(colors.yellow('所用时间：' + minutes + " 分钟" + seconds + " 秒"));
            compress.before = (input.length / 1048576).toFixed(2) + "M";
            compress.after = (files[0].contents.length / 1048576).toFixed(2) + "M";
            compress.rate = ((1 - files[0].contents.length / input.length) * 100).toFixed(2) + "%";
            compress.time = minutes + "mm" + seconds + "ss";
            callback(compress);
        });

}

function mozjpg_minify(input, output_dic, output_nm, callback) {
    var image = new Imagemin()
        .src(input)
        .dest(output_dic)
        .use(imageminMozjpeg({
            quality: 75,
            fastcrush: true
        }))
        .use(rename(output_nm))
        .run(function(err, files) {

            var date3 = new Date().getTime() - before;
            // console.log('进入：'+date3);
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
            compress.before = (input.length / 1048576).toFixed(2) + "M";
            compress.after = (files[0].contents.length / 1048576).toFixed(2) + "M";
            compress.rate = ((1 - files[0].contents.length / input.length) * 100).toFixed(2) + "%";
            compress.time = minutes + "mm" + seconds + "ss";
            console.log(colors.yellow('压缩前图片大小：' + (input.length / 1048576).toFixed(2) + "M" + "  压缩后图片大小：" + (files[0].contents.length / 1048576).toFixed(2) + "M" + " 压缩比：" + ((1 - files[0].contents.length / input.length) * 100).toFixed(2) + "%"));
            console.log(colors.yellow('所用时间：' + minutes + " 分钟" + seconds + " 秒"));
            // console.log(colors.red(compress.before));
            //setTimeout(function(){
            callback(compress);
                //},2000);
        });
}

function gif_minify(input, output_dic, output_nm,callback) {

    var image = new Imagemin()
        .src(input)
        .dest(output_dic)
        .use(imageminGifsicle())
        .use(rename(output_nm))
        .run(function(err, files) {

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
            console.log(colors.yellow('压缩前图片大小：' + (input.length / 1048576).toFixed(2) + "M" + "  压缩后图片大小：" + (files[0].contents.length / 1048576).toFixed(2) + "M" + " 压缩比：" + ((1 - files[0].contents.length / input.length) * 100).toFixed(2) + "%"));
            console.log(colors.yellow('所用时间：' + minutes + " 分钟" + seconds + " 秒"));
            compress.before = (input.length / 1048576).toFixed(2) + "M";
            compress.after = (files[0].contents.length / 1048576).toFixed(2) + "M";
            compress.rate = ((1 - files[0].contents.length / input.length) * 100).toFixed(2) + "%";
            compress.time = minutes + "mm" + seconds + "ss";
            callback(compress);
        });
}
exports.minify = function(directory, file, output_dic, output_nm,callback) {
    // var directory='../../Desktop/';
    // var file='baf3e76449.gif';
    //
    // var output_dic='src'
    // var output_nm='baf3e76449.gif'
    before = new Date().getTime();
    var ext = file.match(/^(.*)(\.)(.{1,8})$/)[3].toLowerCase();
    //console.log(ext);
    var hash = {
        'png': 1,
        'jpeg': 2,
        'jpg': 3,
        'gif': 4
    }
    try {
        if (hash[ext]) {
            console.log(colors.yellow('压缩文件名：' + file));
            fs.readFile(directory + file, function (err, input) {
              if (err) throw err;
              else{
                  if (hash[ext] == 1) {
                      png_minify(input, output_dic, output_nm,callback);
                  } else if (hash[ext] == 2 || hash[ext] == 3) {
                      //jpg_minify(input,output_dic,output_nm);
                      mozjpg_minify(input, output_dic, output_nm,callback);
                  } else if (hash[ext] == 4) {
                      //jpg_minify(input,output_dic,output_nm,callback);
                      gif_minify(input, output_dic, output_nm,callback);
                  } else {
                      console.log(colors.magenta('It has error.'));
                      compress.error = 'It has error.';
                      callback(compress);
                  }
                  console.log(colors.gray(compress));
              }
            });
            //var input = fs.readFileSync(directory + file);
            
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
// minify();
