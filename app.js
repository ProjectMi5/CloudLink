/**
 * Encapsulated functionality
 */
var config = require('./config.js');
var database = require('./models/database.js');
var gcm = require('./models/google-cloud-messaging.js');

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

    if (undefined === regId || regId == '') {
        // Error
        res.json({status: "BAD", msg: "No regId-parameter given"});
    } else {
        database.registerNewDeviceQ(regId)
            .then(function(result){
                console.log('saved');
                res.json({status: "OK", msg: "Your regId: " + regId, result: result});
            });
    }
});

app.get('/getRegIds', function (req, res) {
    database.getRegIdsQ()
        .then(function(regIds){
            res.json(JSON.stringify(regIds));
        });
});

app.post('/pushMessage', function (req, res) {
    var data = req.body.data;

    if (undefined === data) {
        // Error
        res.json({status: "BAD", msg: "No data to push"});
    } else {
        // Push message via gcm
        database.getRegIdsQ()
            .then(function(regIds){
                return gcm.pushMessage(data,regIds);
            })
            .then(database.cleanRegIdsQ)
            .done();
            res.json({"status:":"OK"});
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
    console.log('Incoming message on topic:', topic);

    // Prototyp listen on:
    if(topic == topicCocktailTaste){
        console.log('send a push message:',message);
        database.getRegIdsQ()
            .then(function(regIds){
                return gcm.pushMessage(message,regIds);
            })
            .then(database.cleanRegIdsQ)
            .done();
    }
    //client.end();
});

// -----------------------------------------------------------------

