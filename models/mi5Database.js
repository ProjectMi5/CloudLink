var Q = require('q');
var _ = require('underscore');
var assert = require('assert');
var moment = require('moment');

var config = require('./../config.js');
var CONFIG = {};
CONFIG.DatabaseHost = config.MongoDBHost;
CONFIG.OrderHandling = config.OrderHandling;

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
    orderId                      : Number
    , recipeId                   : Number
    , parameters                 : [Number]
    , date                       : { type: Date, default: Date.now }
    , marketPlaceId              : String
    , customerName               : String
    , priority                   : Number
    , status                     : String
    , reviewed                   : { type: Boolean, default: false }
    , estimatedTimeOfCompletion  : this.mongoose.Schema.Types.Date
    , orderedTimeOfCompletion    : this.mongoose.Schema.Types.Date
    , taskId                     : Number
    , barcode                    : Number
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

mi5database.prototype.extractRecipeId = function(recipe){
  return recipe.recipeId;
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

mi5database.prototype.checkOrderLite = function(order){
  var self = this;
  var deferred = Q.defer();

  var orderId = parseInt(order.orderId, 10);
  var recipeId = parseInt(order.recipeId, 10);
  var parameters = [];
  if(_.isArray(order.parameters)){
    order.parameters.forEach(function(parameter){
      parameters.push(parseInt(parameter, 10));
    });
  }

  if(!_.isNumber(orderId)) {
    deferred.reject('orderId is not a number');
  }
  if(!_.isNumber(recipeId)){
    deferred.reject('recipeId is not a number');
  }

  // Check if order already exists
  self.getOrder(orderId)
    .then(function(order){
      // undefined if order with this orderId does not exist
      if(typeof order == 'undefined'){
        deferred.resolve([orderId, recipeId, parameters]); //used with promise.spread()
      } else {
        deferred.reject('an order with the orderId '+orderId+' already exists!');
      }
    });

  return deferred.promise;
};

mi5database.prototype.saveOrderLite = function(orderId, recipeId, userParameters){
  var self = instance;
  var deferred = Q.defer();

  var order = {orderId: orderId,
    recipeId: recipeId,
    parameters: userParameters};

  deferred.resolve([orderId, recipeId, userParameters]); //used with promise.spread()

  var NewOrder = new self.Order(order);
  return NewOrder.saveQ();
};

mi5database.prototype.checkOrder = function(order){
  var self = instance;
  var deferred = Q.defer();

  var recipeId = parseInt(order.recipeId, 10);
  var parameters = [];
  var priority = parseInt(order.priority, 10);
  var orderedTimeOfCompletion = order.orderedTimeOfCompletion;

  // the following inputs are crucial and therefore checked:
  // recipeId, parameters
  if(!_.isNumber(recipeId)){
    deferred.reject('recipeId is not a number');
  }

  if(typeof recipeId == 'undefined'){
    deferred.reject('recipeId is undefined');
  }

  if(!_.isArray(order.parameters)){
    deferred.reject('parameters is not an array')
  }

  order.parameters.forEach(function(parameter){
    parameters.push(parseInt(parameter, 10));
  });

  // the following inputs are accepted to be 'undefined':
  //  marketPlaceId, customerName, priority, orderedTimeOfCompletion

  if((typeof order.priority != 'undefined') && (isNaN(priority))){
    deferred.reject('priority is not a number');
  }

  if(!moment(orderedTimeOfCompletion).isValid()){
    // undefined is also valid!
    deferred.reject('orderedTimeOfCompletion is not a valid date');
  }

  self.getRecipe(recipeId)
      .then(function(recipe){
        if(typeof recipe == 'undefined'){
          deferred.reject('recipe with id '+ recipeId + ' does not exist');
        }
        if(parameters.length != recipe.userparameters.length){
          deferred.reject('number of parameters (' + parameters.length + ') does not fit recipe requirements ('+
          recipe.userparameters.length + ' parameters)');
        }
        deferred.resolve(order);
      })
      .catch(function(err){
        deferred.reject(err);
      });

  return deferred.promise;
};

mi5database.prototype.prepareOrder = function(order){
  console.log('order: ' + order);
  var self = instance;
  var deferred = Q.defer();

  var recipeId = parseInt(order.recipeId, 10);
  var parameters = order.parameters;
  var marketPlaceId = order.marketPlaceId;
  var customerName = order.customerName;
  var priority = parseInt(order.priority, 10);
  var status;
  var orderedTimeOfCompletion = order.orderedTimeOfCompletion;

  // set undefined variables
  if(typeof marketPlaceId == 'undefined'){
    marketPlaceId = 'undefined';
  }

  if(typeof customerName == 'undefined'){
    customerName = 'undefined';
  }

  if(typeof orderedTimeOfCompletion != 'undefined'){
    orderedTimeOfCompletion = moment(orderedTimeOfCompletion);
  }

  if(isNaN(priority)){
    priority = self.returnPriority(marketPlaceId);
  }

  status = 'pending approval';

  CONFIG.OrderHandling.withoutApproval.forEach(function(item){
    if(item == order.marketPlaceId){
      status = 'accepted';
    }
  });


  // create OrderId

  self.idHelper()
      .then(function(id){
        console.log('priority: ' + priority);
        order = {
          orderId:                  id,
          recipeId:                 recipeId,
          parameters:               parameters,
          marketPlaceId:            marketPlaceId,
          customerName:             customerName,
          priority:                 priority,
          status:                   status,
          orderedTimeOfCompletion:  orderedTimeOfCompletion
        };
        deferred.resolve(order);
      });

  return deferred.promise;
};

mi5database.prototype.idHelper = function(){
  var self = instance;
  var deferred = Q.defer();

  self.getLastOrderId()
      .then(function(id){
        // undefined if there are no existing orders
        if(typeof id == 'undefined'){
           deferred.resolve(1);
        } else {
           deferred.resolve(id + 1);
        }
      });

  return deferred.promise;
};

mi5database.prototype.returnPriority = function(marketplaceId){
  if(typeof CONFIG.OrderHandling.prioritySettings[marketplaceId] != 'undefined'){
    console.log('priority Settings: ' + CONFIG.OrderHandling.prioritySettings[marketplaceId] + ' ('+marketplaceId+')');
    return CONFIG.OrderHandling.prioritySettings[marketplaceId];
  } else {
    console.log('priority Settings standard: ' + CONFIG.OrderHandling.prioritySettings.standard);
    return CONFIG.OrderHandling.prioritySettings.standard;
  }
};

mi5database.prototype.saveOrder = function(order){
  var self = instance;
  var deferred = Q.defer();

  deferred.resolve(order);

  var NewOrder = new self.Order(order);
  return NewOrder.saveQ();
};

mi5database.prototype.placeOrder = function(order){
  var self = instance;
  var deferred = Q.defer();

  self.checkOrder(order)
      .then(self.prepareOrder)
      //.then(self.saveOrder)
      //.then(deferred.resolve)
      .catch(deferred.reject(err));

  return deferred.promise;
};

mi5database.prototype.getOrder = function(orderId){
    var self = instance;
    var deferred = Q.defer();

    self.Order.find({'orderId': orderId}).limit(1).exec(function(err, post){
        if(err) deferred.reject(err);

        //if(typeof post == 'undefined') deferred.reject('no order with orderId '+orderId+' found.');
        if(typeof post == 'undefined') deferred.resolve(undefined);

        deferred.resolve(post.pop());
    });

    return deferred.promise;
};

mi5database.prototype.getOrderSave = function(orderId){
    var self = instance;
    var deferred = Q.defer();

    self.getOrder(orderId)
        .then(function(order){
           if(typeof order == 'undefined'){
               deferred.reject('There is no order with id ' + orderId + '!');
           } else {
               deferred.resolve(order);
           }
        });

    return deferred.promise;
};

mi5database.prototype.returnEnrichedCocktailData = function(order){
    console.log(order);
    var self = instance;
    var ret = {};

    // timestamp
    ret.timestamp = order.date;

    // recipe part
    ret.recipe = {};
    ret.recipe.id = order.recipeId;
    var recipe = self.getRecipe(order.recipeId);
    var temp1 = recipe.then(function(recipe){
        ret.recipe.name = recipe.name;
        return recipe;
    });

    // to do: ensure this is a cocktail

    // order part
    ret.order = {};
    ret.order.customerName = order.customerName;
    ret.order.marketPlaceId = order.marketPlaceId;
    ret.order.priority = order.priority;
    ret.order.status = order.status;
    ret.order.estimatedTimeOfCompletion = order.estimatedTimeOfCompletion;
    ret.order.mixRatio = {};
    ret.order.mixRatio.ingredientName = [];
    ret.order.mixRatio.ratio = [];

    // calculate mix ratio
    var intermediateTotal = _.reduce(order.parameters, function (memo, num) {
        return memo + num;
    }, 0);
    intermediateTotal = intermediateTotal - order.parameters[0]; //parameters[0] = total amount
    var temp2 = temp1.then(function(recipe){
        var el = 0;
        _.each(recipe.userparameters, function (parameter) {
            if (el == 0) {
                // Total Amount
                ret.order.amount = order.parameters[el];
            } else {
                ret.order.mixRatio.ingredientName.push(parameter.Name);
                // Ratio for other liquids
                ret.order.mixRatio.ratio.push(order.parameters[el] / intermediateTotal);
            }
            el = el + 1;
        });
    });

    // append feedback and return
    if(order.reviewed){
        return temp2.then(self.getFeedback(order.orderId))
            .then(function(feedback){
                console.log('feedback: '+feedback);
                ret.feedback = feedback;
                return ret;
            });
    } else {
        return temp2.then(function(){
            ret.feedback = "";
            return ret;
        });
    }

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
mi5database.prototype.getLastOrderId = function(){
  var self = instance;
  var deferred = Q.defer();

  //var lastOrderId = self.Order.findQ().sort({_id:-1}).limit(1);
  self.Order.find().sort({'orderId': -1}).limit(1).exec(function(err, post){
    if(err) deferred.reject(err);
    if(false === _.isEmpty(post)){
      // post[0].orderId == [1456]? -> parse to int
      var orderId = parseInt(post.pop().orderId,10);
      deferred.resolve(orderId);
    } else {
      deferred.reject('no order has been found');
    }
  });

  return deferred.promise;
};

mi5database.prototype.getLastOrder = function(){
  var self = instance;

  return self.getLastOrderId().then(self.getOrder);
};

mi5database.prototype.deleteAllOrders = function(){
  var self = this;

  return Q.Promise(function(resolve, reject){
    self.Order.remove(function(err){
      if(!err) resolve();
      else reject(err);
    });
  });
};

mi5database.prototype.checkBarcode = function(barcode){
    var self = instance;
    console.log('check barcode');
    if(isNaN(barcode)){
        throw new Error("barcode is not a number");
    }
    if ((barcode < 0) | (barcode>99999999)){
        throw new Error("barcode out of range");
    }

};

mi5database.prototype.setBarcode = function(orderId, barcode){
    var self = instance;

    return self.getOrderSave(orderId)
        .then(function(order){
            self.checkBarcode(barcode);
            if(typeof order.barcode == 'undefined'){
                order.barcode = barcode;
                return self.Order.updateQ({orderId: orderId}, { $set: {barcode: barcode}});
            } else {
                throw new Error("barcode is already set to " + order.barcode);
            }
        });
};

mi5database.prototype.getBarcode = function(orderId){
    var self = instance;

    return self.getOrderSave(orderId)
        .then(function(order){
            return order.barcode;
        });
};

mi5database.prototype.getOrderIdByBarcode = function(barcode){
    var self = instance;
    var deferred = Q.defer();

    self.Order.find({'barcode': barcode}).limit(1).exec(function(err, post){
        if(err) deferred.reject(err);
        //if(typeof post == 'undefined') deferred.reject('no order with orderId '+orderId+' found.');
        var order = post.pop();
        if (typeof order == 'undefined'){
            deferred.resolve('');
        } else {
            deferred.resolve(order.orderId);
        }
    });

    return deferred.promise;
};


// ============================================================================================================
// ==================================  Recommendation/Feedback         ========================================
// ============================================================================================================

mi5database.prototype.saveRecommendation = function(recommendation){
  var self = instance;

  var NewRecommendation = new self.Recommendation(recommendation);
  //console.log('new recommendation saved:'+recommendation);
  return NewRecommendation.saveQ();
};

mi5database.prototype.getRecommendation = function(orderId){
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
mi5database.prototype.checkFeedback = function(feedback) {
  var self = instance;
  var deferred = Q.defer();

  //console.log('feedback', feedback);

  if(_.isEmpty(feedback) || typeof feedback == 'undefined'){
    deferred.reject('no feedback was given');
    throw new Error('ERROR: no feedback was given');
    //return deferred.promise;
  }
  if(self._isJsonString(feedback)){
    feedback = JSON.parse(feedback);
  }

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
  var newFeedback = NewFeedback.saveQ();

  return newFeedback.then(function(feedback){
          self.Order.updateQ({orderId: productId}, { $set: {reviewed: true}});
      })
      .then(function(){
          return newFeedback;
      });
};

mi5database.prototype.getFeedbacks = function(){
  var self = instance;
  var deferred = Q.defer();

  self.Feedback.find().limit().exec(function(err, post){
    if(err) deferred.reject(err);

    deferred.resolve(post);
  });

  return deferred.promise;
};

mi5database.prototype.getFeedback = function(orderId){
    var self = instance;
    var deferred = Q.defer();

    self.Feedback.find({'productId': orderId}).limit(1).exec(function(err, post){
        if(err) deferred.reject(err);

        deferred.resolve(post.pop());
    });

    return deferred.promise;
};

mi5database.prototype.getLastRecommendationId = function(){
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

mi5database.prototype.getLastRecommendation = function(){
  var self = instance;

  return self.getLastRecommendationId().then(self.getRecommendation);
};

mi5database.prototype.deleteAllFeedbacks = function(){
  var self = this;

  return Q.Promise(function(resolve, reject){
    self.Feedback.remove(function(err){
      if(!err) resolve();
      else reject(err);
    });
  });
};

mi5database.prototype.enrichFeedback = function(feedback){
  var self = instance;
  var ret = {};
  var temp = {};

  ret.productId = feedback.productId;
  ret.timestamp = feedback.timestamp;
  ret.order = {};
  ret.review = {};
  ret.review.like = feedback.like;
  ret.review.feedback = feedback.feedback;

  // create the amount and mixRatio only for cocktails
  if(true){
    return self.getOrder(feedback.productId)
      .then(function(order){
        temp.order = order;
        return self.getRecipe(order.recipeId);
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
            temp.mixRatio.ingredientName.push(parameter.Name);
            // Ratio for other liquids
            temp.mixRatio.ratio.push(temp.order.parameters[el]/intermediateTotal);
          }

          el = el + 1;
        });
        ret.order.mixRatio = temp.mixRatio;
        // Order part end ----------------

        console.log('Feedback has been enriched, example output:', ret.order);
        return ret;
      });
  } else {
    return self.getOrder(feedback.productId)
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


// ============================================================================================================
// ==================================  Helper                          ========================================
// ============================================================================================================

/**
 * should remove __v, and _id - not working
 * @param posts
 * @returns {*}
 */
mi5database.prototype._removeMongoDBattributes = function(posts){
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
 * Check if string is JSON.stringified or nit
 *
 * http://stackoverflow.com/questions/3710204/how-to-check-if-a-string-is-a-valid-json-string-in-javascript-without-using-try
 *
 */
mi5database.prototype._isJsonString = function(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};