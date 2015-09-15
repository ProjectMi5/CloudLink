/**
 * Created by Thomas on 28.05.2015.
 */
var config = require('./../config.js');
var gcm = require('node-gcm');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

// Create the Mongo Schema
var deviceSchema = mongoose.Schema({
    regId     : String
    , date      : { type: Date, default: Date.now }
});
var Device = mongoose.model('Device', deviceSchema);

// Connect
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

// TODO: Transform MongoDB Connection to a model so that DB and Server run parallel
db.once('open', function (callback) {
    // -----------------------------------------------------------------
    // REST API
    var express = require('express');
    var app = express();
    var bodyParser = require('body-parser');

    // app.use(bodyParser.json()); // for parsing application/json
    app.use(bodyParser.urlencoded({extended: true})); // for parsing application/x-www-form-urlencoded

    app.get('/helloWorld', function (req, res) {
        console.log('Hello World!');
        res.send('Hello World!');
    });

    app.post('/register', function (req, res) {
        var regId = req.body.regId;

        if (undefined === regId) {
            // Error
            res.json({status: "BAD", msg: "No regId-parameter given"});
        } else {
            var NewDevice = new Device({regId: regId});

            NewDevice.save(function (err) {
                if (err) return console.error(err);
                console.log('saved');
                res.json({status: "OK", msg: "Your regId: " + regId}); //TODO: scope compatibility?
            });
        }
    });

    app.get('/getRegIds', function (req, res) {
        // get all devices
        var regIds = [];
        Device.find({}, function(err, devices){
            devices.forEach(function(device,i,arr){
                regIds.push(device.regId);
                console.log(device.regId);
            });
            console.log(regIds);
            res.json(JSON.stringify(regIds));
        });
    });

    app.post('/pushMessage', function (req, res) {
        var data = req.body.data;

        if (undefined === data) {
            // Error
            res.json({status: "BAD", msg: "No data to push"});
        } else {
            // node-gcm Message
            var message = new gcm.Message({
                collapseKey: 'collapseKey',
                delayWhileIdle: true,
                timeToLive: 3,
                data: {
                    mi5: data
                }
            });

            var sender = new gcm.Sender(config.GoogleAPI);

            var regIds = [];
            Device.find({}, function(err, devices){
                devices.forEach(function(device,i,arr){
                    regIds.push(device.regId);
                    console.log(device.regId);
                });
                //console.log(regIds);

		// GCM Send
                sender.sendNoRetry(message, regIds, function(err, result) {
                    if(err) {
                        console.error(err);
                        res.json(err);
                    } else {
                        // Handle GCM result and remove obsolet regIds
                        cleanRegIds(regIds, result.results);
                        function cleanRegIds(regIds, results){
                           results.forEach(function(result, key){
                              //console.log('Pair:', result, regIds[key]);
                               if('InvalidRegistration' == result.error){
                                   console.log('found error');
                                   deleteRegId(regIds[key]);
                               }

                           });
                        }
                        function deleteRegId(regId){
                            Device.findOneAndRemove({regId: regId}, function(err, result){
                                console.log('err',err,' -- removed result:',result);
                            });
                        }

                        res.json(result);
                    }
                });
            });
        }
    });

    // Start web-server
    app.listen(config.HTTPPort);
    // -----------------------------------------------------------------


    // -----------------------------------------------------------------
    // MQTT
    var mqtt = require('mqtt');
    var client  = mqtt.connect(config.MQTTHost);

    var topicCocktailTaste = 'Mi5/User/Cocktail/Taste';
    client.subscribe(topicCocktailTaste);

    client.on('message', function (topic, message) {
        // message is Buffer
        message = message.toString();
        console.log('Message:', message, 'Topic:', topic);

        // Prototyp listen on:
        if(topic == topicCocktailTaste){
            console.log('send a push message:',message);
        }
        //client.end();
    });

    // -----------------------------------------------------------------
});
