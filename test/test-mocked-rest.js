var assert = require('chai').assert;
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

describe('Test REST api', function() {

  // Mock-Data
  var recipePOST = {
    userparameters:
      [ { Default: 200,
        Description: 'Gives the total fluid amount in the glass',
        Dummy: false,
        MaxValue: 200,
        MinValue: 10,
        Name: 'Total Liquid Amount',
        Step: 0,
        Unit: 'ml' },
        { Default: 50,
          Description: 'Maracuja Juice',
          Dummy: false,
          MaxValue: 100,
          MinValue: 1,
          Name: 'Maracuja Juice',
          Step: 0,
          Unit: 'ml' },
        { Default: 35,
          Description: 'Orange Juice',
          Dummy: false,
          MaxValue: 100,
          MinValue: 1,
          Name: 'Orange Juice',
          Step: 0,
          Unit: 'ml' },
        { Default: 15,
          Description: 'Grenadine Syrup',
          Dummy: false,
          MaxValue: 50,
          MinValue: 1,
          Name: 'Grenadine Syrup',
          Step: 0,
          Unit: 'ml' } ],
    Description: 'Sweet cocktail combining the sourness of maracuja and orange juice with the sweetness of grenadine syrup',
    Dummy: false,
    Name: 'Free Passion',
    RecipeID: 10051 };
  var recipeParsed = { recipeId: 10051,
    name: 'Free Passion',
    description: 'Sweet cocktail combining the sourness of maracuja and orange juice with the sweetness of grenadine syrup',
    dummy: false,
    userparameters:
      [ { Default: 200,
        Description: 'Gives the total fluid amount in the glass',
        Dummy: false,
        MaxValue: 200,
        MinValue: 10,
        Name: 'Total Liquid Amount',
        Step: 0,
        Unit: 'ml' },
        { Default: 50,
          Description: 'Maracuja Juice',
          Dummy: false,
          MaxValue: 100,
          MinValue: 1,
          Name: 'Maracuja Juice',
          Step: 0,
          Unit: 'ml' },
        { Default: 35,
          Description: 'Orange Juice',
          Dummy: false,
          MaxValue: 100,
          MinValue: 1,
          Name: 'Orange Juice',
          Step: 0,
          Unit: 'ml' },
        { Default: 15,
          Description: 'Grenadine Syrup',
          Dummy: false,
          MaxValue: 50,
          MinValue: 1,
          Name: 'Grenadine Syrup',
          Step: 0,
          Unit: 'ml' } ] };
  var mockFeedback = {"productId":4242,"like":false,"feedback":"Too sweet"};
  var mockOrder = {"orderId":2, "recipeId":10051, "parameters":[100,27,34,25]};

  before(function(){
    var config = require('./../config');
    // Prepare the database
    var RecipeDB = require('./../models/database-recipe').instance;
    var OrderDB = require('./../models/database-order').instance;
    RecipeDB.deleteAllRecipes();
    RecipeDB.saveRecipe(recipeParsed);
    OrderDB.deleteAllOrders();

    // Start webserver
    var express = require('express');
    var app = express();
    var bodyParser = require('body-parser');
    app.use(bodyParser.urlencoded({extended: true})); // for parsing application/x-www-form-urlencoded
    var basicAuth = require('basic-auth-connect');
    app.use(basicAuth(config.basicAuthUser, config.basicAuthPW));

    var RecipeHandling  = require('./../controllers/recipe-handling').RecipeHandling;
    var OrderHandling = require('./../controllers/order-handling').OrderHandling;

    // Recipes&Orders
    app.get('/getRecipes', RecipeHandling.getRecipes);
    app.post('/saveOrder', OrderHandling.saveOrder);
    app.post('/placeOrder', OrderHandling.placeOrder);
    app.post('/getOrderById', OrderHandling.getOrderById);
    app.get('/QR/:voucher/:humanReadable', OrderHandling.placeOrderQR);
    app.post('/setBarcode', OrderHandling.setBarcode);
    app.post('/getOrderIdByBarcode', OrderHandling.getOrderIdByBarcode);
    app.post('/getCocktailDataByOrderId', OrderHandling.getCocktailDataByOrderId);
    app.post('/manageRecipe', RecipeHandling.manageRecipe);

    // Start web-server
    app.listen(config.HTTPPort);
  });

  after(function(){
    // clean up database
    require('./../models/database-recipe').instance.deleteAllRecipes();
    require('./../models/database-order').instance.deleteAllOrders();
  });

  describe('Test Mocked REST', function(){
    var config = require('./../config');
    var request = require('request');

    it('/getRecipes', function(done){
      var options = {
        url:  'http://localhost:'+config.HTTPPort+'/getRecipes',
        auth: {
          'user': config.basicAuthUser,
          'password':   config.basicAuthPW
        }
      };

      request.get(options, function(err, res, body){
        assert.isNull(err);

        body = JSON.parse(body);
        assert.equal(body[0].recipeId, 10051);
        done();
      });
    });


    it('/manageRecipe', function(done){
      var options = {
        url:  'http://localhost:'+config.HTTPPort+'/manageRecipe',
        form: {recipe: JSON.stringify(recipePOST)},
        auth: {
          'user': config.basicAuthUser,
          'password':   config.basicAuthPW
        }
      };

      request.post(options, function(err, res, body){
        assert.isNull(err);

        body = JSON.parse(body);
        assert.equal(body.status, 'ok');

        done();
      });
    });

    it.skip('/saveOrder', function(done){
      var options = {
          url:  'http://localhost:'+config.HTTPPort+'/saveOrder',
          form: {order: JSON.stringify(mockOrder)},
          auth: {
              'user': config.basicAuthUser,
              'password':   config.basicAuthPW
          }
      };

      request.post(options, function(err, res, body){
          assert.isNull(err);
          body = JSON.parse(body);
          assert.equal(body.status, 'ok');
          done();
      });
    });

    it('/placeOrder', function(done){
      var options = {
        url:  'http://localhost:'+config.HTTPPort+'/placeOrder',
        form: {order: JSON.stringify(mockOrder)},
        auth: {
          'user': config.basicAuthUser,
          'password':   config.basicAuthPW
        }
      };

      request.post(options, function(err, res, body){
        assert.isNull(err);

        body = JSON.parse(body);
        assert.equal(body.status, 'ok');

        done();
      });
    });

    it.skip('/QR/id123/hello', function(done){
      var options = {
        url:  'http://localhost:'+config.HTTPPort+'/QR/id123/hello',
        auth: {
          'user': config.basicAuthUser,
          'password':   config.basicAuthPW
        }
      };

      request.get(options, function(err, res, body){
        assert.isNull(err);

        body = JSON.parse(body);
        assert.equal(body.status, 'ok');

        done();
      });
    });

    it('/getOrderById', function(done){
      var options = {
        url:  'http://localhost:'+config.HTTPPort+'/getOrderById',
        form: {"id": 1},
        auth: {
          'user': config.basicAuthUser,
          'password':   config.basicAuthPW
        }
      };

      request.post(options, function(err, res, body){
        assert.isNull(err);
        assert.isDefined(body, 'body is defined');
        body = JSON.parse(body);
        assert.equal(body.status, 'pending');

        done();
      });
    });

    it('/setBarcode', function(done){
      var options = {
        url:  'http://localhost:'+config.HTTPPort+'/setBarcode',
        form: {"id": 1, "barcode":12345678},
        auth: {
          'user': config.basicAuthUser,
          'password':   config.basicAuthPW
        }
      };

      request.post(options, function(err, res, body){
        assert.isNull(err);
        assert.isDefined(body, 'body is defined');
        body = JSON.parse(body);
        assert.equal(body.status, 'ok');

        done();
      });
    });

    it('/getOrderIdByBarcode', function(done){
      var options = {
        url:  'http://localhost:'+config.HTTPPort+'/getOrderIdByBarcode',
        form: {"barcode":12345678},
        auth: {
          'user': config.basicAuthUser,
          'password':   config.basicAuthPW
        }
      };

      request.post(options, function(err, res, body){
        assert.isNull(err);
        assert.isDefined(body, 'body is defined');
        body = JSON.parse(body);
        assert.equal(body.orderId, '1');

        done();
      });
    });

    it('/getCocktailDataByOrderId', function(done){
      var options = {
        url:  'http://localhost:'+config.HTTPPort+'/getCocktailDataByOrderId',
        form: {"id":1},
        auth: {
          'user': config.basicAuthUser,
          'password':   config.basicAuthPW
        }
      };

      request.post(options, function(err, res, body){
        assert.isNull(err);
        assert.isDefined(body, 'body is defined');
        body = JSON.parse(body);
        //assert.equal(body.orderId, '1'); // TODO a pending order does not have an orderID!

        done();
      });
    });
  });
});