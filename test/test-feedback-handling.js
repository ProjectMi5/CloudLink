var assert = require('chai').assert;
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);


describe('Mi5 Feedback Interface', function() {
  var Q = require('q');
  var mi5Database = require('./../models/mi5Database').instance;

  var mockFeedback = {
    productId: 4242,
    like: false,
    feedback: 'Too sweet'
  };
  var mockOrder = {
    orderId: 4242,
    recipeId: 10051,
    parameters: [127, 100, 80, 10]
  };
  var mockFeedbackPush = {
    "productId": 4242,
    "timestamp": "2015-05-01T14:02:05",
    "recipe": {
      "id": 10051,
      "name": "Free Passion"
    },
    "order": {
      "amount": 127,
      "mixRatio":  {
        "ingredientName": [
          "Maracuja Juice",
          "Orange Juice",
          "Grenadine Syrup"],
        "ratio": [
          0.5263157894736842,
          0.42105263157894735,
          0.05263157894736842]
      }
    },
      "review": {
        "like": false,
        "feedback": "Too sweet"
    }
  };
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


  // clean database
  before('Clean database: delete all orders, recipes and feedbacks', function(){
    return Q.all(
      [mi5Database.deleteAllFeedbacks(),
      mi5Database.deleteAllOrders()],
      mi5Database.deleteAllRecipes());
  });

  after('Clean database: delete all orders, recipes and feedbacks', function(){
    return Q.all(
      [mi5Database.deleteAllFeedbacks(),
        mi5Database.deleteAllOrders()],
      mi5Database.deleteAllRecipes());
  });

  describe('Test Feedback Handling', function(){
    it('/checkFeedback with JSON stringified mockFeedback', function(){
      return mi5Database.checkFeedback(JSON.stringify(mockFeedback))
        .spread(function(productId, like, feedback){
          assert.equal(productId, mockFeedback.productId);
          assert.equal(like, mockFeedback.like);
          assert.equal(feedback, mockFeedback.feedback);
        })
        .catch(function(err){
          assert.isNull(err);
        });
    });

    it('/checkFeedback with plain mockFeedback', function(){
      return mi5Database.checkFeedback(mockFeedback)
        .spread(function(productId, like, feedback){
          assert.equal(productId, mockFeedback.productId);
          assert.equal(like, mockFeedback.like);
          assert.equal(feedback, mockFeedback.feedback);
        });
    });

    it('/saveFeedback', function(){
      return mi5Database.checkFeedback(mockFeedback)
        .spread(mi5Database.saveFeedback)
        .then(function(saved){
          assert.equal(saved.__v, 0);
          assert.equal(saved.productId, mockFeedback.productId);
          assert.equal(saved.like, mockFeedback.like);
          assert.equal(saved.feedback, mockFeedback.feedback);
          assert.isDefined(saved._id);
        });
    });

    it('/enrichFeedback', function(){
      var _ = require('underscore');

      // Save a test order
      return mi5Database.checkOrderLite(mockOrder)
        .spread(mi5Database.saveOrderLite)
        // Save a test recipe
        .then(function(saved){
          return Q.fcall(function(){
            return JSON.stringify(recipePOST);
          });
        })
        .then(mi5Database.parseRecipeRequest)
        .then(mi5Database.translateRecipe)
        .then(mi5Database.manageRecipe)
        // Enrich now
        .then(function(){
          return Q.fcall(function(){
            return mockFeedback;
          });
        })
        .then(mi5Database.checkFeedback)
        .spread(mi5Database.saveFeedback)
        .then(mi5Database.enrichFeedback)
        .then(function(feedback){
          //assert.isDefined(feedback.recipe, 'recipe must be defined');
          assert.isDefined(feedback.order, 'order must be defined');

          // check recipe part
          assert.deepEqual(feedback.recipe, mockFeedbackPush.recipe);

          // check mixRatios
          assert.deepEqual(feedback.order.mixRatio, mockFeedbackPush.order.mixRatio); // TODO deepEqual doesnt work
          // check if sum of mixRatios equals 1
          var sum = _.reduce(feedback.order.mixRatio.ratio, function(memo, num){return memo+num;},0);
          assert.equal(sum, 1);
        });
    });
  });
});