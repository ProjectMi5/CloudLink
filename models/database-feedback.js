var Q = require('q');
var _ = require('underscore');

var config = require('./../config.js');
var CONFIG = {};
CONFIG.DatabaseHost = config.MongoDBHost;
CONFIG.OrderHandling = config.OrderHandling;

FeedbackDB = function() {
  this.mongoose = require('mongoose-q')();

  console.log('Mi5 - Database loaded');

  // Connect to database - somehow not needed?
  try {
    this.mongoose.connect(CONFIG.DatabaseHost);
  } catch(err){
    console.log(err);
  }
  console.log('Database connected');

  var recommendationSchema = this.mongoose.Schema({
    productId: Number,
    timestamp: { type: Date, default: Date.now },
    recipe: this.mongoose.Schema.Types.Mixed,
    order: this.mongoose.Schema.Types.Mixed,
    review: this.mongoose.Schema.Types.Mixed,
    recommendation: this.mongoose.Schema.Types.Mixed
  });
  this.Recommendation = this.mongoose.model('Recommendation', recommendationSchema);

  var feedbackSchema = this.mongoose.Schema({
    productId: Number,
    like: Boolean,
    feedback: String,
    timestamp: { type: Date, default: Date.now }
  });
  this.Feedback = this.mongoose.model('Feedback', feedbackSchema);
};
var instance = new FeedbackDB();
exports.instance = instance;

// ============================================================================================================
// ==================================  Recommendation/Feedback         ========================================
// ============================================================================================================

FeedbackDB.prototype.saveRecommendation = function(recommendation){
  var self = instance;

  var NewRecommendation = new self.Recommendation(recommendation);
  //console.log('new recommendation saved:'+recommendation);
  return NewRecommendation.saveQ();
};

FeedbackDB.prototype.getRecommendation = function(orderId){
  var self = instance;
  var deferred = Q.defer();

  self.Recommendation.find({'productId': orderId}).limit(1).exec(function(err, post){
    if(err) deferred.reject(err);

    deferred.resolve(post.pop());
  });

  return deferred.promise;
};

/**
 * check feedback for productId, like and 'feedback'
 * usage:
 * checkFeedback().spread(function(productId, like, feedback){
 *    // your code
 * });
 * @param feedback
 * @returns {*|promise}
 */
FeedbackDB.prototype.checkFeedback = function(feedback) {
  var deferred = Q.defer();

  //console.log('feedback', feedback);

  if(_.isEmpty(feedback) || typeof feedback == 'undefined'){
    deferred.reject('no feedback was given');
    throw new Error('ERROR: no feedback was given');
    //return deferred.promise;
  }
  if(_isJsonString(feedback)){
    feedback = JSON.parse(feedback);
  }

  var productId = parseInt(feedback.productId, 10);
  var like = !!feedback.like; // !! is equivalent to a boolean cast
  var feed = String(feedback.feedback);

  deferred.resolve([productId, like, feed]);

  return deferred.promise;
};

FeedbackDB.prototype.saveFeedback = function(productId, like, feedback){
  var self = instance;

  var feedback = {
    productId: productId,
    like: like,
    feedback: feedback
  };

  var NewFeedback = new self.Feedback(feedback);
  var newFeedback = NewFeedback.saveQ();

  return newFeedback.then(function(feedback){
      return require('./database-order').instance.setReviewed(productId, true);
    })
    .then(function(){
      return newFeedback;
    });
};

FeedbackDB.prototype.getFeedbacks = function(){
  var self = instance;
  var deferred = Q.defer();

  self.Feedback.find().limit().exec(function(err, post){
    if(err) deferred.reject(err);

    deferred.resolve(post);
  });

  return deferred.promise;
};

FeedbackDB.prototype.getFeedback = function(orderId){
  var self = instance;
  var deferred = Q.defer();
  console.log('getFeedback', orderId);

  self.Feedback.find({'productId': orderId},'-_id -__v').limit(1).exec(function(err, post){
      if(err) deferred.reject(err);

      deferred.resolve(post.pop());
  });

  return deferred.promise;
};

FeedbackDB.prototype.getLastRecommendationId = function(){
  var self = instance;
  var deferred = Q.defer();

  //var lastOrderId = self.Order.findQ().sort({_id:-1}).limit(1);
  self.Recommendation.find().sort({'productId': -1}).limit(1).exec(function(err, post){
    if(err) deferred.reject(err);
    if(false === _.isEmpty(post)){
      // post[0].orderId == [1456]? -> pop -> parse to int
      var productId = parseInt(post.pop().productId,10);
      deferred.resolve(productId);
    } else {
      deferred.reject('no task has been found');
    }
  });

  return deferred.promise;
};

FeedbackDB.prototype.getLastRecommendation = function(){
  var self = instance;

  return self.getLastRecommendationId().then(self.getRecommendation);
};

FeedbackDB.prototype.deleteAllFeedbacks = function(){
  var self = this;

  return Q.Promise(function(resolve, reject){
    self.Feedback.remove(function(err){
      if(!err) resolve();
      else reject(err);
    });
  });
};

FeedbackDB.prototype.enrichFeedback = function(feedback){
  var self = instance;
  var ret = {};
  var temp = {};

  var OrderDB = require('./database-order').instance;
  var RecipeDB = require('./database-recipe').instance;

  ret.productId = feedback.productId;
  ret.timestamp = feedback.timestamp;
  ret.order = {};
  ret.review = {};
  ret.review.like = feedback.like;
  ret.review.feedback = feedback.feedback;

  // create the amount and mixRatio only for cocktails
  if(true){
    return OrderDB.getOrder(feedback.productId)
      .then(function(order){
        temp.order = order;
        return RecipeDB.getRecipe(order.recipeId);
      })
      .then(function(recipe){
        temp.recipe = recipe;

        // Recipe part ------------------
        ret.recipe = {};
        ret.recipe.id = recipe.recipeId;
        ret.recipe.name = recipe.name;
        // Recipe part end --------------

        // Order part -------------------
        temp.mixRatio = {};
        temp.mixRatio.ingredientName = [];
        temp.mixRatio.ratio = [];

        // Calculate intermediateTotal by summing all parameters and subtracting the total amount
        var intermediateTotal = _.reduce(temp.order.parameters, function(memo, num){return memo+num;}, 0);
        intermediateTotal = intermediateTotal - temp.order.parameters[0]; //parameters[0] = total amount
        console.log('intermediateTotal', intermediateTotal);

        // Calculate mixRatio.ratio;
        var el = 0;
        _.each(recipe.userparameters, function(parameter){
          //console.log('ELEMENT: ',el);
          //console.log(parameter.Name);
          //console.log('Max',parameter.MaxValue);
          //console.log('UserParam', temp.order.parameters[el]);

          if(el == 0){
            // Total Amount
            ret.order.amount = temp.order.parameters[el];
          } else {
            // Do not add if ingridient Name is Barcode
            if(parameter.Name != 'Identifier assignment / Barcode'){
              temp.mixRatio.ingredientName.push(parameter.Name);
              // Ratio for other liquids
              temp.mixRatio.ratio.push(temp.order.parameters[el]/intermediateTotal);
            } else {
              //nothing
            }
          }
          el = el + 1;
        });
        ret.order.mixRatio = temp.mixRatio;
        // Order part end ----------------

        console.log('Feedback has been enriched, example output:', ret.order);
        return ret;
      });
  } else {
    return OrderDB.getOrder(feedback.productId)
      .then(function(order){
        ret.order = order;
        return self.getRecipe(order.recipeId);
      })
      .then(function(recipe){
        ret.recipe = recipe;
        return ret;
      });
  }
};

/**
 * Check if string is JSON.stringified or nit
 *
 * http://stackoverflow.com/questions/3710204/how-to-check-if-a-string-is-a-valid-json-string-in-javascript-without-using-try
 *
 */
_isJsonString = function(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};