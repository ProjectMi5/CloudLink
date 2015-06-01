/**
 * Created by Thomas on 28.05.2015.
 */
var config = require('./../../config.js');
var mqtt = require('mqtt');

var client  = mqtt.connect(config.MQTTHost);

client.on('connect', function () {
    client.subscribe('presence');
    client.publish('presence', 'Hello mqtt');
});

client.on('message', function (topic, message) {
    // message is Buffer
    console.log('Message:', message.toString(), 'Topic:', topic);
    //client.end();
});