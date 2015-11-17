var assert = require('chai').assert;
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);


describe.skip('Orders', function () {
  var OrderDB = require('./../models/database-order').instance;
  var RecipeDB = require('./../models/database-recipe').instance;

  var mockOrder = {
    orderId: 4243,
    recipeId: 10051,
    parameters: [40, 100, 80, 20]
  };

  var mockOrder2 = {
    recipeId: 10051,
    parameters: [40, 100, 80, 20],
    marketPlaceId: 'EU',
    customerName: 'Frau Fr�hlich',
    orderedTimeOfCompletion: '2015-09-07T09:21:14.382Z',
    barcode: '12345678'
  };

  var recipeParsed = {
    recipeId: 10051,
    name: 'Free Passion',
    description: 'Sweet cocktail combining the sourness of maracuja and orange juice with the sweetness of grenadine syrup',
    dummy: false,
    userparameters: [{
      Default: 200,
      Description: 'Gives the total fluid amount in the glass',
      Dummy: false,
      MaxValue: 200,
      MinValue: 10,
      Name: 'Total Liquid Amount',
      Step: 0,
      Unit: 'ml'
    },
      {
        Default: 50,
        Description: 'Maracuja Juice',
        Dummy: false,
        MaxValue: 100,
        MinValue: 1,
        Name: 'Maracuja Juice',
        Step: 0,
        Unit: 'ml'
      },
      {
        Default: 35,
        Description: 'Orange Juice',
        Dummy: false,
        MaxValue: 100,
        MinValue: 1,
        Name: 'Orange Juice',
        Step: 0,
        Unit: 'ml'
      },
      {
        Default: 15,
        Description: 'Grenadine Syrup',
        Dummy: false,
        MaxValue: 50,
        MinValue: 1,
        Name: 'Grenadine Syrup',
        Step: 0,
        Unit: 'ml'
      }]
  };

  // clean database
  before('Clean database: delete all orders', function () {
    return OrderDB.deleteAllOrders()
      .then(RecipeDB.deleteAllRecipes())
      .then(function () {
        RecipeDB.saveRecipe(recipeParsed)
      });
  });

  after('Clean database: delete all orders', function () {
    //return OrderDB.deleteAllOrders();
  });

  describe('Test Order Handling', function () {
    it('#saveOrder', function () {
      return OrderDB.checkOrderLite(mockOrder)
        .spread(OrderDB.saveOrderLite)
        .then(function (saved) {
          //console.log(saved);
          assert.equal(saved.__v, 0);
          assert.equal(saved.orderId, mockOrder.orderId);
          assert.equal(saved.recipeId, mockOrder.recipeId);
          //assert.equal(saved.parameters, mockOrder.parameters); // TODO: check fo an array comparison function
          assert.isDefined(saved._id);
        });
    });

    it('#placeOrder', function () {
      return OrderDB.checkOrder(mockOrder2)
        .then(OrderDB.prepareOrder)
        .then(OrderDB.saveOrder)
        .then(function (saved) {
          //console.log(saved);
          assert.equal(saved.__v, 0);
          assert.equal(saved.recipeId, mockOrder.recipeId);
          //assert.equal(saved.parameters, mockOrder.parameters); // TODO: check fo an array comparison function
          assert.isDefined(saved._id);
          var update = saved.lastUpdate;
          console.log('Documentation: {' +
            'orderId: ' + saved.orderId + ', ' +
            'recipeId: ' + saved.recipeId + ', ' +
            'parameters: ' + saved.parameters + ', ' +
            'date: ' + saved.date + ', ' +
            'marketPlaceId: ' + saved.marketPlaceId + ', ' +
            'customerName: ' + saved.customerName + ', ' +
            'priority: ' + saved.priority + ', ' +
            'status: ' + saved.status + ', ' +
            'reviewed: ' + saved.reviewed + ', ' +
            'estimatedTimeOfCompletion: ' + saved.estimatedTimeOfCompletion + ', ' +
            'orderedTimeOfCompletion: ' + saved.orderedTimeOfCompletion + ', ' +
            'barcode: ' + saved.barcode + ', ' +
            'lastUpdate: ' + update.getMinutes()+' '+update.getSeconds()+' '+update.getMilliseconds() + ', ' +
            '}');
        })
        .catch(function (err) {
        });
    });

    it('#getOrder', function () {
      return OrderDB.getOrder(mockOrder.orderId)
        .then(function (order) {
          assert.equal(order.orderId, mockOrder.orderId);
          assert.equal(order.recipeId, mockOrder.recipeId);
          //assert.equal(order.parameters, mockOrder.parameters); // TODO: check for an array comparison function
        });
    });

    it('#getOrders', function () {
      return OrderDB.getOrders()
          .then(function (orders) {
            console.log(orders);
            //assert.equal(order.parameters, mockOrder.parameters); // TODO: check for an array comparison function
          });
    });

    it('#setBarcode', function () {
      return OrderDB.setBarcode(mockOrder.orderId, mockOrder2.barcode)
        .then(function (feedback) {
          assert.equal(feedback.ok, 1);
        });
    });

    it('#getBarcode', function () {
      return OrderDB.getBarcode(mockOrder.orderId)
        .then(function (barcode) {
          assert.equal(barcode, mockOrder2.barcode);
        });
    });

    it('#getOrderIdByBarcode', function () {
      return OrderDB.getOrderIdByBarcode(mockOrder2.barcode)
        .then(function (orderId) {
          assert.equal(orderId, mockOrder.orderId);
        });
    });

    it('#updateStatus - in progress', function(){
      return OrderDB.getLastOrderId()
        .then(function(orderId){
          return OrderDB.updateStatus(orderId, 'in progress');
        })
        .then(function(result){
          assert.equal(result.status, 'ok');
        });
    });

    it('#updateOrder: set a new status', function(){
      return OrderDB.getLastOrderId()
        .then(function(orderId){
          var newOrder = {
            orderId: orderId,
            status: 'accepted'
          };
          return OrderDB.updateOrder(newOrder);
    })
        .then(function(result){
          assert.equal(result.status, 'ok');
        });
    });

    it('#updateOrder: set estimatedTimeOfCompletion', function(){
      return OrderDB.getLastOrderId()
        .then(function(orderId){
          var newOrder = {
            orderId: orderId,
            estimatedTimeOfCompletion: '2015-11-16T19:05:06+01:00'
          };
          return OrderDB.updateOrder(newOrder);
        })
        .then(function(result){
          assert.equal(result.status, 'ok');
        });
    });

    it('#updateStatus asdf with wrong id', function(){
      return OrderDB.updateStatus(0, 'asdf') // no order with id 0 should exist
        .catch(function(result){
          assert.equal(result.status, 'err');
        });
    });

    it('#getOrdersByStatus in progress', function(){
      return OrderDB.getOrdersByStatus('in progress')
        .then(function(result){
          assert.isArray(result);
          console.log(result);
        });
    });

    it('#getOrdersFiltered', function(){
      var ix = ['Cocktails', 'Cookies'];
      var filter = {
        type: ix.toString(),
        limit: 1
      };
      return OrderDB.getOrdersFiltered(filter)
        .then(function(result){
          assert.isArray(result);
          console.log(result);
        });
    });


  });
});