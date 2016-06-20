/**
 * Sample Configuration
 */
var config = {};

// Secure config
config.basicAuthUser = 'foo';
config.basicAuthPW = 'bar';
config.GoogleAPI = '';

// more public config
config.HTTPPort = 3001;
config.MQTTHost = 'mqtt://mi5.itq.de';
config.MongoDBHost = 'mongodb://localhost/test';

config.OrderHandling = {};
config.OrderHandling.withoutApproval = ['mi5', 'EU'];
config.OrderHandling.prioritySettings = {
    standard    : 3,
    EU          : 1
};
config.Cocktails = [10051,10053,10055,10060,10061,10062,10063,10065,10066,10067,10070,10071,10072,10056,10057];
config.Cookies = [10017,10018,10019];

// Override some configuration for local tests
if(process.env.TEST){
    // Secure config
    config.basicAuthUser = 'foo';
    config.basicAuthPW = 'bar';
    config.GoogleAPI = '';

    // more public config
    config.HTTPPort = 3001;
    config.MQTTHost = 'mqtt://localhost';

    config.MongoDBPath = '"C:\\Program Files\\MongoDB\\Server\\3.0\\bin\\mongod.exe" --dbpath C:\\Thomas\\mi5\\mongodb';
    // Start Mongo DB
    var exec = require('child_process').exec;
    console.log('starting mongoDB', config.MongoDBPath);
    exec(config.MongoDBPath, function(error, stdout, stderr){
        console.log('ChildProcess'.red, 'stdout:', stdout, 'stderr:', stderr);
        if (error !== null) {
            console.log('ChildProcess'.red, 'exec error: ' + error);
        }
    });
    config.MongoDBHost = 'mongodb://localhost/test';
}

module.exports = config;