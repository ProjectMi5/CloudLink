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
       var client  = mqtt.connect(config.MQTTHost);

       var topic = 'testTopic';
       var message = 'testMessage';

       it('should connect, subscribe and publish', function(done){
           client.on('connect', function () {
               client.subscribe(topic);
               client.publish(topic, message);
               //done();
           });
       });

       it('should receive the '+topic+' and the message '+message, function(done){
           client.on('message', function (_topic, _message) {
               expect(_topic).to.be.equal(topic);
               expect(_message).to.be.equal(message);
               done();
           });
       });
   });
});