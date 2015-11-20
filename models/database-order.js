var Q = require('q');
var _ = require('underscore');
var moment = require('moment');

var config = require('./../config.js');
var CONFIG = {};
CONFIG.DatabaseHost = config.MongoDBHost;
CONFIG.OrderHandling = config.OrderHandling;
CONFIG.Cocktails = config.Cocktails; // Array with RecipeIds of Cocktails
CONFIG.Cookies = config.Cookies;     // Array with RecipeIds of Cookies

OrderDB = function() {
  this.mongoose = require('mongoose-q')();
  this.validStates = ['pending', 'rejected', 'accepted', 'in progress', 'done', 'delivered', 'archived', 'aborted', 'failure'];
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
    , recipeName                 : String
    , parameters                 : [Number]
    , date                       : { type: Date, default: Date.now }
    , marketPlaceId              : String
    , customerName               : String
    , priority                   : Number
    , status                     : String
    , reviewed                   : { type: Boolean, default: false }
    , estimatedTimeOfCompletion  : Date
    , orderedTimeOfCompletion    : Date
    , taskId                     : Number
    , barcode                    : Number
    , timeOfCompletion           : Date
    , lastUpdate                 : Date
  });
  this.Order = this.mongoose.model('Order', orderSchema);

  /**
   * add the timestamp for lastUpdate for every save request
   */
  orderSchema.pre('save', function(next){
    this.lastUpdate = new Date();
    console.log('A document is being saved.');
    next();
  });
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
      order.recipeName = recipe.name;
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
  var recipeName = order.recipeName;
  var parameters = order.parameters;
  var marketPlaceId = order.marketPlaceId;
  var customerName = order.customerName;
  var priority = parseInt(order.priority, 10);
  var status = 'pending';
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


  // create OrderId

  self.idHelper()
    .then(function(id){
      console.log('priority: ' + priority);
      order = {
        orderId:                  id,
        recipeId:                 recipeId,
        recipeName:               recipeName,
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

  self.Order.find({'orderId': orderId}, '-_id -__v').limit(1).exec(function(err, post){
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

  // check if order is a cocktail
  if(CONFIG.Cocktails.indexOf(order.recipeId) < 0){
    return  Q.Promise(function(resolve, reject){reject('The order you picked is not a Cocktail.')});
  }

  var ret = {};
  // timestamp
  ret.timestamp = order.date;

  // recipe part
  ret.recipe = {};
  ret.recipe.id = order.recipeId;
  var recipe = require('./database-recipe').instance.getRecipe(order.recipeId)
    .then(function(recipe){
      // remove "Identifier assignment" from Recipe userparameters
      var parameters = recipe.userparameters;
      console.log(parameters);
      //parameters = _.map(parameters, function(item){
      //  console.log(item);
      //  if(item.Name != "Identifier assignment / Barcode"){
      //    return item;
      //  }
      //});
      console.log('using _.without');
      parameters = _.without(parameters, _.findWhere(parameters, {Name: 'Identifier assignment / Barcode'}));
      recipe.userparameters = parameters;
      return recipe;
    });
  var temp1 = recipe.then(function(recipe){
    ret.recipe.name = recipe.name;
    return recipe;
  });

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
    console.log('calculating ratios');
    try{
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
    } catch (err){
      console.log('error in calculating ratios', err);
    }
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

  self.Order.find({},'-_id -__v').limit().exec(function(err, post){
    if(err) deferred.reject(err);

    deferred.resolve(post);
  });

  return deferred.promise;
};

/**
 * Returns the last highest order id
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
  var self = instance;
  var deferred = Q.defer();

  if(isNaN(barcode)){
    deferred.reject("barcode is not a number");
  }
  if ((barcode < 0) || (barcode>99999999)){
    deferred.reject("barcode out of range");
  }

  self.getOrderIdByBarcode(barcode)
      .then(function(id){
        if(id != ''){
          deferred.reject("barcode already exists");
        } else {
          console.log('true');
          deferred.resolve(true);
        }
      });

  return deferred.promise;
};

OrderDB.prototype.setBarcode = function(orderId, barcode){
  var self = instance;
  var deferred = Q.defer();

  self.getOrderSave(orderId)
    .then(function(order){
      if(typeof order.barcode != 'undefined'){
        deferred.reject("barcode is already set to " + order.barcode);
      }
      console.log(order.barcode);
    })
    .then(self.checkBarcode(barcode))
    .then(function(){
      console.log('set Barcode '+barcode+' of order '+orderId);
      deferred.resolve(self.Order.updateQ({orderId: orderId}, { $set: {barcode: barcode, lastUpdate: new Date()}}));
    })
    .catch(function(err){
      deferred.reject(err);
    });

  return deferred.promise;
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

  return self.Order.updateQ({orderId: orderid}, { $set: {reviewed: reviewed, lastUpdate: new Date()}});
};

OrderDB.prototype.updateStatus = function(orderid, status){
  var self = instance;

  return self.Order.updateQ({orderId: orderid}, { $set: {status: status, lastUpdate: new Date()}})
    .then(function(result){
      return Q.Promise(function(resolve, reject){
        if(result.n == 1){
          resolve({status: 'ok', description: 'order with id ' + orderid + ' is now ' + status});
        } else {
          reject({status: 'err', description: 'no order has been modified, probably the orderId is wrong, or the status has not changed'});
        }
      });
    });
};


/**
 *
 * @param order object with orderId and other attributes
 * @returns {*}
 */
OrderDB.prototype.updateOrder = function(order){
  var self = instance;
  var orderId = parseInt(order.orderId, 10);
  delete order.orderId;
  var finishTime = order.estimatedTimeOfCompletion;
  if(typeof finishTime != 'undefined'){
    order.estimatedTimeOfCompletion = new Date(finishTime);
  }

  order.lastUpdate = new Date();

  return self.Order.updateQ({orderId: orderId}, { $set: order})
    .then(function(result){
      return Q.Promise(function(resolve, reject){
        if(result.n == 1){
          resolve({status: 'ok', description: 'order with id ' + orderId + 'was updated with: '
            + JSON.stringify(order)});
        } else {
          reject({status: 'err', description: 'no order has been modified, probably the orderId is wrong, or the status has not changed'});
        }
      });
    });
};



OrderDB.prototype.getOrdersByStatus = function(status){
  var self = instance;

  if (_.contains(self.validStates, status)){
    return self.Order.findQ({status: status},'-_id -__v')
  } else {
    return Q.Promise(function(resolve, reject){
      reject({status: 'err', description: status + ' is not a valid status'});
    })
  }
};

/**
 * getFilteredOrdersByStatus
 * @param filter with possible attributes {status, createdSince, updatedSince, type, marketPlaceId, limit, reatedBefore}
 * @returns orders
 */


OrderDB.prototype.getOrdersFiltered = function(filter){
  var self = instance;
  var deferred = Q.defer();
  var query = {};

  if (typeof filter != 'undefined'){
    var status = filter.status;
    var createdSince = filter.createdSince;
    var createdBefore = filter.createdBefore;
    var lastUpdateSince = filter.updatedSince;
    var updatedBefore = filter.updatedBefore;
    var type = filter.type;
    var limit = parseInt(filter.limit,10);

    if (typeof status != 'undefined'){
      status.forEach(function(item){
        if(self.validStates.indexOf(item)<0){
          deferred.reject(item+' is not a valid status.');
        }
      });
      query.status = {$in: status};
    }

    var date = {};
    var setDate = false;

    if (typeof createdSince != 'undefined'){
      createdSince = new Date(createdSince);
      if(isNaN(createdSince.getTime())){
        deferred.reject(createdSince+' is not a valid date.');
      }
      date.$gte = createdSince;
      setDate = true;
    }

    if (typeof createdBefore != 'undefined'){
      createdBefore = new Date(createdBefore);
      if(isNaN(createdBefore.getTime())){
        deferred.reject(createdBefore+' is not a valid date.');
      }
      date.$lte = createdBefore;
      setDate = true;
    }

    if(setDate){
      query.date = date;
    }

    var lastUpdate = {};
    var setLastUpdate = false;

    if (typeof updatedBefore != 'undefined'){
      updatedBefore = new Date(updatedBefore);
      if(isNaN(updatedBefore.getTime())){
        deferred.reject(updatedBefore+' is not a valid date.');
      }
      lastUpdate.$lte = updatedBefore;
      setLastUpdate = true;
    }

    if (typeof lastUpdateSince != 'undefined'){
      lastUpdateSince = new Date(lastUpdateSince);
      if(isNaN(lastUpdateSince.getTime())){
        deferred.reject(lastUpdateSince+' is not a valid date.');
      }
      lastUpdate.$gte = lastUpdateSince;
      setLastUpdate = true;
    }

    if(setLastUpdate){
      query.lastUpdate = lastUpdate;
    }

    if(typeof type != 'undefined'){
      var arr = [];
      if(type.indexOf('Cocktails') > -1){
        arr = _.union(arr, CONFIG.Cocktails);
      }
      if(type.indexOf('Cookies') > -1){
        arr = _.union(arr,CONFIG.Cookies);
      }
      query.recipeId = {$in: arr};
    }

    if (isNaN(limit)){
      limit = {};
    }
  }

  self.Order.find(query,'-_id -__v').sort({'estimatedTimeOfCompletion': -1}).limit(limit).exec(function(err, result){
    if(err) deferred.reject(err);
    deferred.resolve(result);
  });

  return deferred.promise;
};

/**
 * @sync
 * @returns {Array}
 */
OrderDB.prototype.getValidStates = function(){
  var self = instance;
  return self.validStates;
};
