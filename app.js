/**
 * Encapsulated functionality
 */
var config = require('./config.js');
var database = require('./models/database.js');
var DBCookie = require('./models/database-cookie.js').instance;
var gcm = require('./models/google-cloud-messaging.js');

var Q = require('q');

// MQTT
var mqtt = require('mqtt');
var client  = mqtt.connect(config.MQTTHost);

// -----------------------------------------------------------------
// REST API
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
module.exports.io = io;

var bodyParser = require('body-parser');
var basicAuth = require('basic-auth-connect');

// Form Data
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({extended: true})); // for parsing application/x-www-form-urlencoded

// Static files:
app.use(express.static(__dirname + '/public'));

// View engine
app.set('views', __dirname+'/views');
app.set('view engine', 'jade');

var DeviceHandling  = require('./controllers/device-handling').DeviceHandling;
var RecipeHandling  = require('./controllers/recipe-handling').RecipeHandling;
var OrderHandling   = require('./controllers/order-handling').OrderHandling;
var FeedbackHandling= require('./controllers/feedback-handling').FeedbackHandling;
var VoucherHandling = require('./controllers/voucher-handling').VoucherHandling;
var MachineDataHandling = require('./controllers/machine-data-handling').MachineDataHandling;
var CloudlinkHandling = require('./controllers/cloudlink-handling'); //other structure than other ctrls, better syntax highliting
var CookieHandling = require('./controllers/cookie-handling').CookieHandling;

// Routes: No authentification
app.get('/helloWorld', function (req, res) {
    console.log('Hello World!');
    res.send('Hello World!');
});

app.get('/CookieLevel', CookieHandling.getLastCookieLevel);
app.get('/CookieLevelHistory', CookieHandling.getCookieLevelHistory);

// placeOrder without authentification
app.get('/QR/:identifier/:humanReadable', OrderHandling.placeOrderQR);

// Basic authentification
// !!Every route below this line requires authentification then !!
app.use(basicAuth(config.basicAuthUser, config.basicAuthPW));

// Device Handling
app.post('/register', DeviceHandling.register);
app.get('/getRegIds', DeviceHandling.getRegIds);
app.post('/pushMessage', DeviceHandling.pushMessage);

// Recipes
app.get('/getRecipes', RecipeHandling.getRecipes);
app.post('/manageRecipe', RecipeHandling.manageRecipe);
app.get('/deleteAllRecipes', RecipeHandling.deleteAllRecipes); //deactivate later maybe
app.get('/loadDefaultRecipes', RecipeHandling.loadDefaultRecipes); // Debug function

// Orders
app.get('/order', OrderHandling.browseOrders);
app.get('/getLastOrder', OrderHandling.getLastOrder);
app.get('/getOrders', OrderHandling.getOrders);
app.post('/saveOrder', OrderHandling.saveOrder);
app.post('/placeOrder', OrderHandling.placeOrder);
app.get('/placeOrder/:recipeId/:parameters/:marketPlaceId', OrderHandling.placeOrderGet);
app.post('/getOrderById', OrderHandling.getOrderById);
app.post('/setBarcode', OrderHandling.setBarcode);
app.post('/getOrderIdByBarcode', OrderHandling.getOrderIdByBarcode);
app.post('/getCocktailDataByOrderId', OrderHandling.getCocktailDataByOrderId);
app.post('/getOrdersByStatus', OrderHandling.getOrdersByStatus);
app.post('/updateOrderStatus', OrderHandling.updateOrderStatus);
app.get('/getActiveOrders', OrderHandling.getActiveOrders);
app.post('/getOrdersSince', OrderHandling.getOrdersSince);
app.post('/getOrdersUpdatedSince', OrderHandling.getOrdersUpdatedSince);
app.post('/getOrdersFiltered', OrderHandling.getOrdersFiltered);
app.post('/updateOrder', OrderHandling.updateOrder);

// Vouchers
app.get('/getVouchers', VoucherHandling.getVouchers);
app.get('/deleteAllVouchers', VoucherHandling.deleteAllVouchers);
app.post('/saveVoucher', VoucherHandling.saveVoucher);
app.post('/updateVoucher', VoucherHandling.updateVoucher);
app.post('/getVoucherById', VoucherHandling.getVoucherById);
app.post('/getVouchersForRecipeId', VoucherHandling.getVouchersForRecipeId);
app.get('/validateAllVouchers', VoucherHandling.validateAllVouchers);

// Feedback
app.post('/giveFeedback', FeedbackHandling.giveFeedback);
app.post('/giveRecommendation', FeedbackHandling.giveRecommendation);
app.get('/getFeedbacks', FeedbackHandling.getFeedbacks);

// Machine Status
app.get('/hasStandstill', MachineDataHandling.hasStandstill);
app.post('/reportMachineStatus', MachineDataHandling.reportMachineStatus);

// Cloudlink Handling, logs, etc.
app.get('/clh-showlog', CloudlinkHandling.showLog);

// Start web-server
server.listen(config.HTTPPort);

// -----------------------------------------------------------------
// -----------------------------------------------------------------


// -----------------------------------------------------------------
// -----------------------------------------------------------------
// MQTT

var mi5ServerPush = '/mi5/server/push';
client.subscribe(mi5ServerPush);
var mi5ServerUpstream = '/mi5/server/upstream';
client.subscribe(mi5ServerUpstream);

// Cocktail Scenario - only pushExample Message
var mi5ShowcaseCocktailUserFeedback = '/mi5/showcase/cocktail/user/feedback';
client.subscribe(mi5ShowcaseCocktailUserFeedback);

// Cookie example
var mi5CookieCount = '/mi5/showcase/cookie/quantity';
client.subscribe(mi5CookieCount);

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


   // Handle cookie data
    if(mi5CookieCount == topic){
      console.log('received info from the cookie module');
      var count = JSON.parse(message);
      count = parseInt(count, 10);
      DBCookie.recordCookieLevel(count);
    }



    // End Listen ---------------------------------
    //client.end();
});
