var Q = require('q');
var _ = require('underscore');
var assert = require('assert');

var config = require('./../config.js');
var CONFIG = {};
CONFIG.DatabaseHost = config.MongoDBHost;

mi5database = function() {
  this.mongoose = require('mongoose-q')();

  console.log('Mi5 - Database loaded');

  // Connect to database - somehow not needed?
  try {
    this.mongoose.connect(CONFIG.DatabaseHost);
  } catch(err){
    console.log(err);
  }
  console.log('Database connected');

  // Create the Schemas
  var orderSchema = this.mongoose.Schema({
    taskId          : Number
    , recipeId      : Number
    , parameters    : [Number]
    , date          : { type: Date, default: Date.now }
  });
  this.Order = this.mongoose.model('Order', orderSchema);

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

  var recipeSchema = this.mongoose.Schema({
    recipeId  : Number,
    name      : String,
    description : String,
    dummy     : Boolean,
    userparameters : this.mongoose.Schema.Types.Mixed
  });
  this.Recipe = this.mongoose.model('Recipe', recipeSchema);
};
var instance = new mi5database();
exports.instance = instance;

// ============================================================================================================
// ==================================  recipes                         ========================================
// ============================================================================================================


mi5database.prototype.translateRecipe = function(recipe){
  var deferred = Q.defer();

  var mongoRecipe = {
    recipeId: recipe.RecipeID,
    name: recipe.Name,
    description: recipe.Description,
    dummy: recipe.Dummy,
    userparameters: recipe.userparameters
  };

  deferred.resolve(mongoRecipe);
  return deferred.promise;
};

mi5database.prototype.getRecipe = function(recipeId){
  var self = instance;
  var deferred = Q.defer();

  self.Recipe.find({'recipeId': recipeId}).limit(1).exec(function(err, post){
    if(err) deferred.reject(err);

    deferred.resolve(post.pop()); //due to limit 1, there is only 1 entry in post[]
  });

  return deferred.promise;
};

mi5database.prototype.getRecipes = function(){
  var self = instance;
  var deferred = Q.defer();

  self.Recipe.find().exec(function(err, post){
    if(err) deferred.reject(err);

    deferred.resolve(post);
  });

  return deferred.promise;
};

/**
 * should remove __v, and _id - not working
 * @param posts
 * @returns {*}
 */
mi5database.prototype.removeMongoDBattributes = function(posts){
  var deferred = Q.defer();

  var blankPosts = posts.map(function(post){
    var temp = post;
    delete temp.__v;
    delete temp._id;
    return temp;
  });

  deferred.resolve(blankPosts);

  return deferred.promise;
};

/**
 * Recipe
 *
 * @param recipe
 * @returns {*}
 */
mi5database.prototype.parseRecipeRequest = function(recipe){
  var self = instance;

  return Q.fcall(function(){
    return JSON.parse(recipe);
  });
};

mi5database.prototype.manageRecipe = function(recipe){
  var self = instance;

  return self.getRecipe(recipe.recipeId)
    .then(function(oldRecipe){
      if(typeof oldRecipe == 'undefined'){ // no recipe found
        return self.saveRecipe(recipe);
      }
      else {
        return self.updateRecipe(recipe);
      }
    });
};

mi5database.prototype.updateRecipe = function(recipe){
  var self = instance;

  return self.Recipe.updateQ({recipeId: recipe.recipeId}, recipe);
};

mi5database.prototype.saveRecipe = function(recipe){
  var self = instance;

  var NewRecipe = new self.Recipe(recipe);
  //console.log('new recipe saving:'+recipe);
  return NewRecipe.saveQ();
};

mi5database.prototype.deleteAllRecipes = function(){
  var self = this;

  return Q.Promise(function(resolve, reject){
    self.Recipe.remove(function(err){
      if(!err) resolve();
      else reject(err);
    });
  });
};

// ============================================================================================================
// ==================================  Order                           ========================================
// ============================================================================================================

mi5database.prototype.checkOrder = function(order){
  var self = this;
  var deferred = Q.defer();

  var taskId = parseInt(order.taskId, 10);
  var recipeId = parseInt(order.recipeId, 10);
  var parameters = [];
  if(_.isArray(order.parameters)){
    order.parameters.forEach(function(parameter){
      parameters.push(parseInt(parameter, 10));
    });
  }

  if(!_.isNumber(taskId)) {
    deferred.reject('taskId is not a number');
  }
  if(!_.isNumber(recipeId)){
    deferred.reject('recipeId is not a number');
  }

  // Check if order already exists
  self.getOrder(taskId)
    .then(function(order){
      // undefined if order with this taskId does not exist
      if(typeof order == 'undefined'){
        deferred.resolve([taskId, recipeId, parameters]); //used with promise.spread()
      } else {
        deferred.reject('an order with the taskId '+taskId+' already exists!');
      }
    });

  return deferred.promise;
};

mi5database.prototype.saveOrder = function(taskId, recipeId, userParameters){
  var self = instance;

  var order = {taskId: taskId,
              recipeId: recipeId,
              parameters: userParameters};

  var NewOrder = new self.Order(order);
  return NewOrder.saveQ();
};

mi5database.prototype.saveRecommendation = function(recommendation){
  var self = instance;

  var NewRecommendation = new self.Recommendation(recommendation);
  //console.log('new recommendation saved:'+recommendation);
  return NewRecommendation.saveQ();
};

mi5database.prototype.getRecommendation = function(taskId){
  var self = instance;
  var deferred = Q.defer();

  self.Recommendation.find({'productId': taskId}).limit(1).exec(function(err, post){
    if(err) deferred.reject(err);

    deferred.resolve(post.pop());
  });

  return deferred.promise;
};


mi5database.prototype.checkFeedback = function(feedback) {
  var self = instance;
  var deferred = Q.defer();

  console.log('feedback', feedback);

  if(_.isEmpty(feedback) || typeof feedback == 'undefined'){
    deferred.reject('no feedback was given');
    return deferred.promise;
  };

  feedback = JSON.parse(feedback);

  var productId = parseInt(feedback.productId, 10);
  var like = !!feedback.like; // !! is equivalent to a boolean cast
  var feedback = String(feedback.feedback);

  deferred.resolve([productId, like, feedback]);

  return deferred.promise;
};

mi5database.prototype.saveFeedback = function(productId, like, feedback){
  var self = instance;

  var feedback = {
    productId: productId,
    like: like,
    feedback: feedback
  };

  var NewFeedback = new self.Feedback(feedback);
  return NewFeedback.saveQ();
}

mi5database.prototype.getFeedbacks = function(){
  var self = instance;
  var deferred = Q.defer();

  self.Feedback.find().limit().exec(function(err, post){
    if(err) deferred.reject(err);

    deferred.resolve(post);
  });

  return deferred.promise;
};

/**
 * Returns a promised-order object
 * @param taskId
 * @returns {*|promise}
 */
mi5database.prototype.getOrder = function(taskId){
  var self = instance;
  var deferred = Q.defer();

  self.Order.find({'taskId': taskId}).limit(1).exec(function(err, post){
    if(err) deferred.reject(err);

    deferred.resolve(post.pop());
  });

  return deferred.promise;
};

mi5database.prototype.getOrders = function(){
  var self = instance;
  var deferred = Q.defer();

  self.Order.find().limit().exec(function(err, post){
    if(err) deferred.reject(err);

    deferred.resolve(post);
  });

  return deferred.promise;
};

/**
 * Returns a promised-order task object
 *
 * @returns {*|promise}
 */
mi5database.prototype.getLastTaskId = function(){
  var self = instance;
  var deferred = Q.defer();

  //var lastTaskId = self.Order.findQ().sort({_id:-1}).limit(1);
  self.Order.find().sort({'taskId': -1}).limit(1).exec(function(err, post){
    if(err) deferred.reject(err);
    if(false === _.isEmpty(post)){
      // post[0].taskId == [1456]? -> parse to int
      var taskId = parseInt(post.pop().taskId,10);
      deferred.resolve(taskId);
    } else {
      deferred.reject('no task has been found');
    }
  });

  return deferred.promise;
};

mi5database.prototype.getLastOrder = function(){
  var self = instance;

  return self.getLastTaskId().then(self.getOrder);
};

mi5database.prototype.getLastRecommendationId = function(){
  var self = instance;
  var deferred = Q.defer();

  //var lastTaskId = self.Order.findQ().sort({_id:-1}).limit(1);
  self.Recommendation.find().sort({'productId': -1}).limit(1).exec(function(err, post){
    if(err) deferred.reject(err);
    if(false === _.isEmpty(post)){
      // post[0].taskId == [1456]? -> pop -> parse to int
      var productId = parseInt(post.pop().productId,10);
      deferred.resolve(productId);
    } else {
      deferred.reject('no task has been found');
    }
  });

  return deferred.promise;
};

mi5database.prototype.getLastRecommendation = function(){
  var self = instance;

  return self.getLastRecommendationId().then(self.getRecommendation);
};