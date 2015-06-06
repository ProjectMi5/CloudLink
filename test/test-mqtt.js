/**
 * Created by Thomas on 01.06.2015.
 */
var config = require('./../config.js');
var mqtt = require('mqtt');
//var assert = require('chai').assert;
var expect = require('chai').expect;

describe('MQTT Connection test', function(){
    describe('config.MQTTHost should be defined through config.js', function(){
       it('should be a string and start with mqtt://', function(){
           expect(config.MQTTHost).to.be.a('string');
           expect(config.MQTTHost).to.contain('mqtt://');
       });
    });

    describe('Connect to the MQTT-Broker', function(){
        var topic = 'testTopic';
        var message = 'testMessage';

        var client  = mqtt.connect(config.MQTTHost);

        //it.skip('wait 1000ms for connectiong', function(done){
        //    setTimeout(done, 1000);
        //});

        it('should subscribe to '+topic, function(){
           client.subscribe(topic);
        });

        it('should receive the '+topic+' and the message '+message, function(done){
           client.on('message', function (_topic, _message) {
               expect(_topic).to.be.equal(topic);
               expect(_message.toString()).to.be.equal(message);
               done();
           });
           client.publish(topic,message);
        });
    });

    describe('Test Receiving Upstream Messages', function(){
        // Exapmle message
        // {"category":"com.centigrade.dominicgottwalles.androidupstreamdemo","data":{"my_message":"have to be in. what the hack."},"time_to_live":0,"message_id":"101","from":"REGID-d2T0gA1-gs3NvoxBBxL"}
    })

});