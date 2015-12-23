
module.exports =function (obj,callback){
    var date3 = new Date().getTime() - obj.time;
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
    console.log('> '+colors.grey('Time: '+dateformat(new Date(), 'yyyy-mm-dd HH:MM:ss TT'))+'\t'+colors.yellow('压缩前图片大小：' + (obj.in_len/ 1048576).toFixed(2) + "M" + "  压缩后图片大小：" + (obj.out_len / 1048576).toFixed(2) + "M" + " 压缩比：" + ((1 - obj.out_len / obj.in_len) * 100).toFixed(2) + "%"));
    console.log('> '+colors.grey('Time: '+dateformat(new Date(), 'yyyy-mm-dd HH:MM:ss TT'))+'\t'+colors.yellow('所用时间：' + minutes + " 分钟" + seconds + " 秒"));
    // console.log('> '+colors.grey('Time: '+dateformat(new Date(), 'yyyy-mm-dd HH:MM:ss TT'))+'\t'+colors.yellow('OSS返回：%s'), JSON.stringify(obj.oss_return));
    
    var compress = new Object();
    compress.error = "ok";
    compress.before = (obj.in_len / 1048576).toFixed(2) + "M";
    compress.after = (obj.out_len / 1048576).toFixed(2) + "M";
    compress.rate = ((1 - obj.out_len / obj.in_len) * 100).toFixed(2) + "%";
    compress.time = minutes + "mm" + seconds + "ss";
    callback(compress);
}