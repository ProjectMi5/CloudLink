var Q = require('q');
var _ = require('underscore');
var moment = require('moment');

var config = require('./../config.js');
var CONFIG = {};
CONFIG.DatabaseHost = config.MongoDBHost;
CONFIG.OrderHandling = config.OrderHandling;

OrderDB = function() {
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
};
var instance = new OrderDB();
exports.instance = instance;


// ============================================================================================================
// ==================================  Order                           ========================================
// ============================================================================================================

OrderDB.prototype.checkOrderLite = function(order){
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

  if(isNaN(orderId)) {
    deferred.reject('orderId is not a number');
  }
  if(isNaN(recipeId)){
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

OrderDB.prototype.saveOrderLite = function(orderId, recipeId, userParameters){
  var self = instance;
  var deferred = Q.defer();

  var order = {orderId: orderId,
    recipeId: recipeId,
    parameters: userParameters};

  deferred.resolve([orderId, recipeId, userParameters]); //used with promise.spread()

  var NewOrder = new self.Order(order);
  return NewOrder.saveQ();
};

OrderDB.prototype.checkOrder = function(order){
  var deferred = Q.defer();

  var RecipeDB = require('./database-recipe').instance;

  var recipeId = parseInt(order.recipeId, 10);
  var parameters = [];
  var priority = parseInt(order.priority, 10);
  var orderedTimeOfCompletion = order.orderedTimeOfCompletion;

  // the following inputs are crucial and therefore checked:
  // recipeId, parameters
  if(isNaN(recipeId)){
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


  RecipeDB.getRecipe(recipeId)
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

OrderDB.prototype.prepareOrder = function(order){
  console.log('order: ' + JSON.stringify(order));
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
    })
    .catch(function(err){
      deferred.reject(err);
    });

  return deferred.promise;
};

OrderDB.prototype.idHelper = function(){
  var self = instance;

  return self.getLastOrderId()
    .then(function(id){
      return id + 1;
    })
    .catch(function(err){
      if(err == "no order has been found"){
        return 1;
      } else {
        var deferred = Q.defer();
        deferred.reject(err);
        return deferred.promise;
      }
    });
};

OrderDB.prototype.returnPriority = function(marketplaceId){
  if(typeof CONFIG.OrderHandling.prioritySettings[marketplaceId] != 'undefined'){
    console.log('priority Settings: ' + CONFIG.OrderHandling.prioritySettings[marketplaceId] + ' ('+marketplaceId+')');
    return CONFIG.OrderHandling.prioritySettings[marketplaceId];
  } else {
    console.log('priority Settings standard: ' + CONFIG.OrderHandling.prioritySettings.standard);
    return CONFIG.OrderHandling.prioritySettings.standard;
  }
};

OrderDB.prototype.saveOrder = function(order){
  var self = instance;
  var deferred = Q.defer();

  deferred.resolve(order);

  var NewOrder = new self.Order(order);
  return NewOrder.saveQ();
};

OrderDB.prototype.placeOrder = function(order){
  var self = instance;
  var deferred = Q.defer();

  self.checkOrder(order)
    .then(self.prepareOrder)
    .then(self.saveOrder)
    .then(deferred.resolve)
    .catch(function(err){
      deferred.reject(err)
    });

  return deferred.promise;
};

OrderDB.prototype.getOrder = function(orderId){
  var self = instance;
  var deferred = Q.defer();

  self.Order.find({'orderId': orderId}).limit(1).exec(function(err, post){
    if(err) deferred.reject(err);

    //if(typeof post == 'undefined') deferred.reject('no order with orderId '+orderId+' found.');
    if(typeof post == 'undefined') deferred.reject('undefined order id');

    deferred.resolve(post.pop());
  });

  return deferred.promise;
};

OrderDB.prototype.getOrderSave = function(orderId){
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

OrderDB.prototype.returnEnrichedCocktailData = function(order){
  console.log(order);
  var self = instance;
  var ret = {};

  // timestamp
  ret.timestamp = order.date;

  // recipe part
  ret.recipe = {};
  ret.recipe.id = order.recipeId;
  var recipe = require('./database-recipe').instance.getRecipe(order.recipeId);
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

OrderDB.prototype.getOrders = function(){
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
OrderDB.prototype.getLastOrderId = function(){
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

OrderDB.prototype.getLastOrder = function(){
  var self = instance;

  return self.getLastOrderId().then(self.getOrder);
};

OrderDB.prototype.deleteAllOrders = function(){
  var self = this;

  return Q.Promise(function(resolve, reject){
    self.Order.remove(function(err){
      if(!err) resolve();
      else reject(err);
    });
  });
};

OrderDB.prototype.checkBarcode = function(barcode){
  console.log('check barcode');
  if(isNaN(barcode)){
    throw new Error("barcode is not a number");
  }
  if ((barcode < 0) || (barcode>99999999)){
    throw new Error("barcode out of range");
  }

};

OrderDB.prototype.setBarcode = function(orderId, barcode){
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

OrderDB.prototype.getBarcode = function(orderId){
  var self = instance;

  return self.getOrderSave(orderId)
    .then(function(order){
      return order.barcode;
    });
};

OrderDB.prototype.getOrderIdByBarcode = function(barcode){
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

/**
 *
 * @param orderid int
 * @param reviewed bool
 * @returns {*}
 */
OrderDB.prototype.setReviewed = function(orderid, reviewed){
  var self = instance;

  return instance.Order.updateQ({orderId: orderid}, { $set: {reviewed: reviewed}});
};