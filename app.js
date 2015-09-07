/**
 * Encapsulated functionality
 */
var config = require('./config.js');
var database = require('./models/database.js');
var mi5Database = require('./models/mi5Database').instance;
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
    var regId = req.body.regid;

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

// Mi5 Watchout new REST API
app.get('/getRecipes', function(req, res){
    mi5Database.getRecipes()
      .then(function(recipes){
          console.log(recipes);
          res.json(recipes);
      })
      .catch(function(err){
          res.json({err: err});
          console.log(err);
      });
});

app.get('/getLastOrder', function(req,res){
    mi5Database.getLastOrder()
      .then(function(order){
          console.log('getlastorder', order);
          res.json(order);
      })
      .catch(function(err){
          res.json({err: err});
          console.log(err);
      })
});

app.get('/getOrders', function(req,res){
    mi5Database.getOrders()
      .then(function(orders){
          console.log('getOrders', orders);
          res.json(orders);
      })
      .catch(function(err){
          res.json({err: err});
          console.log(err);
      });
});

app.post('/getOrderById', function(req,res){
    var id = parseInt(req.body.id, 10);

    mi5Database.getOrder(id)
      .then(function(order){
          console.log('getlastorder', order);
          res.json(order);
      })
      .catch(function(err){
          res.json({err: err});
          console.log(err);
      })
});

// Start web-server
app.listen(config.HTTPPort);
// -----------------------------------------------------------------


// -----------------------------------------------------------------
// MQTT
var mqtt = require('mqtt');
var client  = mqtt.connect(config.MQTTHost);

var mi5ServerPush = '/mi5/server/push';
client.subscribe(mi5ServerPush);
var mi5ServerUpstream = '/mi5/server/upstream';
client.subscribe(mi5ServerUpstream);

// Cocktail Scenario - only pushExample Message
var mi5ShowcaseCocktailUserFeedback = '/mi5/showcase/cocktail/user/feedback';
client.subscribe(mi5ShowcaseCocktailUserFeedback);


client.on('message', function (topic, message) {
    // message is Buffer
    message = message.toString();
    console.log('incoming message on topic:', topic);

    // Listen on topic: ----------------------------
    if(mi5ServerPush == topic){
        console.log('send a push message:',message);
        database.getRegIdsQ()
            .then(function(regIds){
                return gcm.pushMessage(message,regIds);
            })
            .then(database.cleanRegIdsQ)
            .done();
    }

    if(mi5ServerUpstream == topic){
        console.log('received an upstream message:');
        //console.log(message);
        message = JSON.parse(message);
	console.log(message);

        // Check if it is a upstream-demo-message
        if(typeof message.data.watchout != 'undefined'){
            // Upstream-Demo sends the payload as JSON (gcm is JSON, and payload is JSON again)
            var payload = JSON.parse(message.data.watchout);
            console.log('payload:', payload);
            if(typeof payload.recommendation != 'undefined'){
                console.log('message is a recommendation');
                // cannot send JSON-object directly!
                client.publish('/mi5/showcase/cocktail/operator/recommendation', JSON.stringify(payload));
            }
        }
    }

    // Forward the Feedback from the HMI
    if(mi5ShowcaseCocktailUserFeedback == topic){
        console.log('user feedback');
        //var payload = JSON.parse(message);
        database.getRegIdsQ()
            .then(function(regIds){
                return gcm.pushMessage(message,regIds);
            })
            .then(database.cleanRegIdsQ)
            .done();
    }


    // End Listen ---------------------------------
    //client.end();
});
