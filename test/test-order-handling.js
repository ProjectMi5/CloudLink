var assert = require('chai').assert;
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);


describe('Mi5 Order Interface', function() {
  var mi5Database = require('./../models/mi5Database').instance;

  var mockOrder = {
    taskId: 4242,
    recipeId: 10010,
    parameters: [40, 100, 80]
  };

  // clean database
  before('Clean database: delete all orders', function(){
    return mi5Database.deleteAllOrders();
  });

  after('Clean database: delete all orders', function(){
    return mi5Database.deleteAllOrders();
  });

  describe('Test Order Handling', function(){
    it('/saveOrder', function(){
      return mi5Database.checkOrder(mockOrder)
        .spread(mi5Database.saveOrder)
        .then(function(saved){
          //console.log(saved);
          assert.equal(saved.__v, 0);
          assert.equal(saved.taskId, mockOrder.taskId);
          assert.equal(saved.recipeId, mockOrder.recipeId);
          //assert.equal(saved.parameters, mockOrder.parameters); // TODO: check fo an array comparison function
          assert.isDefined(saved._id);
        });
    });

    it('/getOrder', function(){
      return mi5Database.getOrder(mockOrder.taskId)
        .then(function(order){
          assert.equal(order.taskId, mockOrder.taskId);
          assert.equal(order.recipeId, mockOrder.recipeId);
          //assert.equal(order.parameters, mockOrder.parameters); // TODO: check for an array comparison function
        });
    });
  });
});