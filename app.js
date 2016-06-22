/**
 * Encapsulated functionality
 */
/**
 * This class requires the modules {@link module:./config.js}
 * @requires module:./config.js
 */
var config = require('./config.js');
/** @requires module:./models/database.js*/
var database = require('./models/database.js');
/** @requires module:./models/database-feedback.js*/
var databaseFeedback = require('./models/database-feedback.js').instance;
/** @requires module:./models/google-cloud-messaging.js*/
var gcm = require('./models/google-cloud-messaging.js');
/** @requires module:q*/
var Q = require('q');


/**
 * MQTT and get client
 * @requires module:mqtt
 */
var mqtt = require('mqtt');
/**
 * set client by {@link module:mqtt}
 * @param {} config.MQTTHost
 */
var client  = mqtt.connect(config.MQTTHost);

// -----------------------------------------------------------------
// REST API
/** @requires module:express*/
var express = require('express');
/** = express()
 *  @param {} express
 */
var app = express();
/** @requires module:http*/
var server = require('http').Server(app);
/** @requires module:socket.io*/
var io = require('socket.io')(server);
module.exports.io = io;
/** @requires module:body-parser*/
var bodyParser = require('body-parser');
/** @requires module:basic-auth-connect*/
var basicAuth = require('basic-auth-connect');

/*
 *Form Data
 *parsing application/json
 */
app.use(bodyParser.json());
/*
 * parsing application/x-www-form-urlencoded
 */
app.use(bodyParser.urlencoded({extended: true}));

/*
 * Static files:
 */
app.use(express.static(__dirname + '/public'));

/*
 * View engine
 */
app.set('views', __dirname+'/views');
app.set('view engine', 'jade');
/*
 * Load Controlers
 */
/*
 * @requires module:./controllers/device-handling
 */
var DeviceHandling  = require('./controllers/device-handling').DeviceHandling;
/** @requires module:./controllers/recipe-handling*/
var RecipeHandling  = require('./controllers/recipe-handling').RecipeHandling;
/** @requires module:./controllers/order-handling*/
var OrderHandling   = require('./controllers/order-handling').OrderHandling;
/** @requires module:./controllers/feedback-handling*/
var FeedbackHandling= require('./controllers/feedback-handling').FeedbackHandling;
/** @requires module:./controllers/voucher-handling*/
var VoucherHandling = require('./controllers/voucher-handling').VoucherHandling;
/** @requires module:./controllers/machine-data-handling*/
var MachineDataHandling = require('./controllers/machine-data-handling').MachineDataHandling;
/**
 * other structure than other ctrls, better syntax highliting
 *  @requires module:./controllers/cloudlink-handling
 */
var CloudlinkHandling = require('./controllers/cloudlink-handling');

/*
Routes: No authentification
 */
app.get('/helloWorld', function (req, res) {
    console.log('Hello World!');
    res.send('Hello World!');
});

/* placeOrder without authentification
 * @param {String} =/QR/:identifier/:humanReadable
 * @param {} = OrderHandling.placeOrderQR
 */
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
app.get('/deleteAllOrders', OrderHandling.deleteAllOrders);
app.get('/getLastOrder', OrderHandling.getLastOrder);
app.get('/getOrders', OrderHandling.getOrders);
app.post('/saveOrder', OrderHandling.saveOrder);
app.post('/deleteOrder', OrderHandling.deleteOrder);
app.post('/placeOrder', OrderHandling.placeOrder);
app.get('/placeOrder/:recipeId/:parameters/:marketPlaceId', OrderHandling.placeOrderGet);
app.post('/getOrderById', OrderHandling.getOrderById);
app.post('/setBarcode', OrderHandling.setBarcode);
app.post('/resetBarcode', OrderHandling.resetBarcode);
app.get('/resetBarcodes',OrderHandling.resetBarcodes);
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
app.get('/getRecommendations', FeedbackHandling.getRecommendations);
app.get('/getLastRecommendation', FeedbackHandling.getLastRecommendation);


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
/**
 * ServerPush path
 * @const mi5ServerPush
  */
var mi5ServerPush = '/mi5/server/push';
client.subscribe(mi5ServerPush);
/**
 * ServerUpstream path
 * @const mi5ServerUpstream
 */
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

        /*Check if it is a upstream-demo-message*/
        if(typeof message.data.watchout != 'undefined'){
            /* Upstream-Demo sends the payload as JSON (gcm is JSON, and payload is JSON again)*/
            var payload = JSON.parse(message.data.watchout);
            console.log('payload:', payload);
            if(typeof payload.recommendation != 'undefined'){
                console.log('message is a recommendation');
                console.log(payload.recommendation);
                /*cannot send JSON-object directly!*/
                client.publish('/mi5/showcase/cocktail/operator/recommendation', JSON.stringify(payload));
                databaseFeedback.saveRecommendation(payload.recommendation);

            }
        }
    }

    /* Forward the Feedback from the HMI*/
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
