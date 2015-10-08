/**
 * Sample Configuration
 */
var config = {};

config.GoogleAPI = '';
config.HTTPPort = 3001;
config.MQTTHost = 'mqtt://localhost';
config.MongoDBHost = 'mongodb://localhost/test';
config.basicAuthUser = 'foo';
config.basicAuthPW = 'bar';

config.OrderHandling = {}; //stays empty
config.OrderHandling.withoutApproval = []; //array of marketPlaceIds
config.OrderHandling.prioritySettings = {
    standard    : 3,
};

module.exports = config;