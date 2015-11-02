var assert = require('chai').assert;
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);


describe('Mi5 Feedback Interface', function () {
  var Q = require('q');
  var FeedbackDB = require('./../models/database-feedback').instance;
  var OrderDB = require('./../models/database-order').instance;
  var RecipeDB = require('./../models/database-recipe').instance;

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
      "mixRatio": {
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
      }],
    Description: 'Sweet cocktail combining the sourness of maracuja and orange juice with the sweetness of grenadine syrup',
    Dummy: false,
    Name: 'Free Passion',
    RecipeID: 10051
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
  before('Clean database: delete all orders, recipes and feedbacks', function () {
    return Q.all([
        FeedbackDB.deleteAllFeedbacks(),
        OrderDB.deleteAllOrders(),
        RecipeDB.deleteAllRecipes()]
    );
  });

  after('Clean database: delete all orders, recipes and feedbacks', function () {
    return Q.all([
        FeedbackDB.deleteAllFeedbacks(),
        OrderDB.deleteAllOrders(),
        RecipeDB.deleteAllRecipes()]
    );
  });

  describe('Test Feedback Handling', function () {
    it('/checkFeedback with JSON stringified mockFeedback', function () {
      return FeedbackDB.checkFeedback(JSON.stringify(mockFeedback))
        .spread(function (productId, like, feedback) {
          assert.equal(productId, mockFeedback.productId);
          assert.equal(like, mockFeedback.like);
          assert.equal(feedback, mockFeedback.feedback);
        })
        .catch(function (err) {
          assert.isNull(err);
        });
    });

    it('/checkFeedback with plain mockFeedback', function () {
      return FeedbackDB.checkFeedback(mockFeedback)
        .spread(function (productId, like, feedback) {
          assert.equal(productId, mockFeedback.productId);
          assert.equal(like, mockFeedback.like);
          assert.equal(feedback, mockFeedback.feedback);
        });
    });


    it('/saveFeedback with a new order', function () {
      // Save a test order
      return OrderDB.checkOrderLite(mockOrder)
        .spread(OrderDB.saveOrderLite)
        // Save a test recipe
        .then(function (saved) {
          return Q.fcall(function () {
            return JSON.stringify(recipePOST);
          });
        })
        .then(RecipeDB.parseRecipeRequest)
        .then(RecipeDB.translateRecipe)
        .then(RecipeDB.manageRecipe)
        // Enrich now
        .then(function () {
          return Q.fcall(function () {
            return mockFeedback;
          });
        })
        .then(FeedbackDB.checkFeedback)
        .spread(FeedbackDB.saveFeedback)
        .then(function (saved) {
          assert.equal(saved.__v, 0);
          assert.equal(saved.productId, mockFeedback.productId);
          assert.equal(saved.like, mockFeedback.like);
          assert.equal(saved.feedback, mockFeedback.feedback);
          assert.isDefined(saved._id);
        });
    });

    it('/enrichFeedback', function () {
      var _ = require('underscore');

      return FeedbackDB.checkFeedback(mockFeedback)
        .spread(FeedbackDB.saveFeedback)
        .then(FeedbackDB.enrichFeedback)
        .then(function (feedback) {
          //assert.isDefined(feedback.recipe, 'recipe must be defined');
          assert.isDefined(feedback.order, 'order must be defined');

          // check recipe part
          assert.deepEqual(feedback.recipe, mockFeedbackPush.recipe);

          // check mixRatios
          assert.deepEqual(feedback.order.mixRatio, mockFeedbackPush.order.mixRatio); // TODO deepEqual doesnt work
          // check if sum of mixRatios equals 1
          var sum = _.reduce(feedback.order.mixRatio.ratio, function (memo, num) {
            return memo + num;
          }, 0);
          assert.equal(sum, 1);
        });
    });

    it.skip('/getFeedback', function () {
      // TODO
      return FeedbackDB.getFeedback(mockFeedback.productId)
        .then(function (feedback) {
        });
    });

    it.skip('/enrichedCocktailData', function () {
      return OrderDB.getOrderSave(mockFeedback.productId)
        .then(function (order) {
          return order;
        })
        .then(OrderDB.returnEnrichedCocktailData)
        .then(function (ret) {
        })
        .then(FeedbackDB.getFeedbacks)
        .then(function (ret) {
        });
    });
  });
});