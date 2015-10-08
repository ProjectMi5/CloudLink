var assert = require('chai').assert;
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);


describe('Mi5 Order Interface', function() {
  var mi5Database = require('./../models/mi5Database').instance;

  var mockOrder = {
    orderId: 4242,
    recipeId: 10051,
    parameters: [40, 100, 80, 20]
  };

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

  // clean database
  before('Clean database: delete all orders', function(){
    return mi5Database.deleteAllOrders()
        .then(mi5Database.deleteAllRecipes())
        .then(function(){
          mi5Database.saveRecipe(recipeParsed)
        });
  });

  after('Clean database: delete all orders', function(){
    return mi5Database.deleteAllOrders();
  });

  describe('Test Order Handling', function(){
    it('/saveOrder', function(){
      return mi5Database.checkOrderLite(mockOrder)
        .spread(mi5Database.saveOrderLite)
        .then(function(saved){
          //console.log(saved);
          assert.equal(saved.__v, 0);
          assert.equal(saved.orderId, mockOrder.orderId);
          assert.equal(saved.recipeId, mockOrder.recipeId);
          //assert.equal(saved.parameters, mockOrder.parameters); // TODO: check fo an array comparison function
          assert.isDefined(saved._id);
        });
    });

    it('/placeOrder', function(){
      return mi5Database.checkOrder(mockOrder)
          .then(mi5Database.prepareOrder)
          .then(mi5Database.saveOrder)
          .then(function(saved){
            //console.log(saved);
            assert.equal(saved.__v, 0);
            assert.equal(saved.recipeId, mockOrder.recipeId);
            //assert.equal(saved.parameters, mockOrder.parameters); // TODO: check fo an array comparison function
            assert.isDefined(saved._id);
            console.log('{' +
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

                '}');
          });
    });

    it('/getOrder', function(){
      return mi5Database.getOrder(mockOrder.orderId)
        .then(function(order){
          assert.equal(order.orderId, mockOrder.orderId);
          assert.equal(order.recipeId, mockOrder.recipeId);
          //assert.equal(order.parameters, mockOrder.parameters); // TODO: check for an array comparison function
        });
    });
  });
});