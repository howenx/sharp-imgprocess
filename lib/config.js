var config = {};


config.redis = {};

config.redis.uri = process.env.DUOSTACK_DB_REDIS;
config.redis.host = 'hostname';
config.redis.port = 6379;


config.ali_endpoint = 'https://oss-cn-beijing.aliyuncs.com';
config.ali_prefix = 'http://hmm-images.oss-cn-beijing.aliyuncs.com/';//'https://hmm-images.oss-cn-beijing.aliyuncs.com/';
config.ali_bucket = 'hmm-images';


module.exports = config;
