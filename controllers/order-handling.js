/**
 * requires module: q
 */
var Q = require('q');
/** requires module: underscore */
var _ = require('underscore');

/** requires module: ./../models/database-order */
var OrderDB = require('./../models/database-order').instance;
/** requires module: ./../models/database-voucher */
var VoucherDB = require('./../models/database-voucher').instance;
/** requires module: ./../models/database-recipe */
var RecipeDB = require('./../models/database-recipe').instance;

/**@function OrderHandling
 *
 * @constructor
 */
OrderHandling = function () {
};

exports.OrderHandling = new OrderHandling();

/** Prototype to define last order
 * @memberof OrderHandling
 * @function getLastOrder 
 * @param {HttpRequest} req /getLastOrder
 * @param {HttpResponse} res
 */
OrderHandling.prototype.getLastOrder = function (req, res) {
  console.log('/getLastOrder');
  OrderDB.getLastOrder()
    .then(function (order) {
      console.log('/getLastOrder', order);
      res.json(order);
    })
    .catch(function (err) {
      res.json({err: err});
      console.log(err);
    })
};

/** Prototype to define orders
 * @memberof OrderHandling
 * @function getOrders
 * @param {HttpRequest} req /getOrders
 * @param {HttpResponse} res
 */
OrderHandling.prototype.getOrders = function (req, res) {
  console.log('/getOrders');
  OrderDB.getOrders()
    .then(function (orders) {
      console.log('getOrders', orders);
      res.json(orders);
    })
    .catch(function (err) {
      res.json({err: err});
      console.log(err);
    });
};

/** Prototype to define save Order
 * @memberof OrderHandling
 * @function saveOrder
 * @param {HttpRequest} req /saveOrder
 * @param {HttpResponse} res
 */
OrderHandling.prototype.saveOrder = function (req, res) {
  console.log('/saveOrder '+JSON.stringify(req.body.order));
  var order = JSON.parse(req.body.order);
  console.log(order);

  OrderDB.checkOrderLite(order)
    .spread(OrderDB.saveOrderLite)
    .then(function () {
      res.json({status: 'ok', description: 'order has been saved'});
    })
    .catch(function (err) {
      res.json({status: 'err', description: err});
    });
};

/** Prototype to place Order
 * @memberof OrderHandling
 * @function placeOrder
 * @param {HttpRequest} req /placeOrder
 * @param {HttpResponse} res
 */
OrderHandling.prototype.placeOrder = function (req, res) {
  console.log('/placeOrder '+JSON.stringify(req.body.order));
  var order = JSON.parse(req.body.order);
  console.log(order);

  OrderDB.placeOrder(order)
    .then(function (order) {
      res.json({status: 'ok', description: 'order has been saved', orderId: order.orderId, orderStatus: order.status});
    })
    .catch(function (err) {
      res.json({status: 'err', description: err});
    });
};

/** Prototype to place Order by QR
 * @memberof OrderHandling
 * @function placeOrderQR
 * @param {HttpRequest} req /placeOrderQR
 * @param {HttpResponse} res
 */
OrderHandling.prototype.placeOrderQR = function (req, res){
  console.log('/placeOrderQR:',req.params);
  var identifier = req.params.identifier;

  VoucherDB.getVoucher(identifier)
    .then(function(voucher) {
      var deferred = Q.defer();
      if (typeof voucher == 'undefined') {
        deferred.reject('Your identifier seems to be missing in our database. Try another one!');
        return deferred.promise;
      } else if (voucher.valid == true) {
        console.log('placeOrder', voucher.recipeId, voucher.parameters);
        VoucherDB.updateVoucher({identifier: identifier, valid: 'false'});
        return OrderDB.placeOrder({recipeId: voucher.recipeId, parameters: voucher.parameters, marketPlaceId: voucher.marketPlaceId});
      } else {
        deferred.reject('Your identifier is invalid!');
        return deferred.promise;
      }
    })
    .then(function(order){
      res.render('feedbackQR', {resdescrpt: 'Your Cocktail was successfully ordered',
        check: '&#x2714;', orderId: order.orderId,
        orderdescrpt: 'You can use the ID above to identify your Cocktail!'});
    })
    .catch(function(err){
      res.render('feedbackQR', {resdescrpt: err.toString(), check: '&#x2716', orderId: '',
        orderdescrpt: ''});
    });
};

/** Prototype to get placed Order
 * @memberof OrderHandling
 * @function placeOrderGet
 * @param {HttpRequest} req /placeOrderGet
 * @param {HttpResponse} res
 */
OrderHandling.prototype.placeOrderGet = function (req, res){
  console.log('/placeOrderGet',req.params);

  var order = {
    recipeId: parseInt(req.params.recipeId,10),
    parameters: JSON.parse(req.params.parameters),
    marketPlaceId: req.params.marketPlaceId
  };
  console.log('order',order);

  OrderDB.placeOrder(order)
    .then(function(order){
      res.render('feedbackQR', {resdescrpt: 'Order successfull',
        check: '&#x2714;', orderId: order.orderId,
        orderdescrpt: 'You can use the ID above to identify your order!'});
    })
    .catch(function(err){
      res.render('feedbackQR', {resdescrpt: err.toString(), check: '&#x2716', orderId: '',
        orderdescrpt: ''});
    });
};

/** Prototype to set Barcode
 * @memberof OrderHandling
 * @function setBarcode
 * @param {HttpRequest} req [id,barcode]
 * @param {HttpResponse} res
 */
OrderHandling.prototype.setBarcode = function (req, res) {
  var orderId = parseInt(req.body.id, 10);
  var barcode = parseInt(req.body.barcode, 10);
  console.log('/setBarcode of order ' + orderId + ' to ' + barcode);

  OrderDB.setBarcode(orderId, barcode)
    .then(function (feedback) {
      res.json({status: 'ok', description: 'barcode has been saved'});
    })
    .catch(function (err) {
      res.json({status: 'err', description: err});
    });
};

/** Prototype to reset Barcode
 * @memberof OrderHandling
 * @function resetBarcode
 * @param {HttpRequest} req [barcode]
 * @param {HttpResponse} res
 */
OrderHandling.prototype.resetBarcode = function (req, res) {
  var barcode = parseInt(req.body.barcode, 10);
  console.log('/resetBarcode ' + barcode);

  OrderDB.resetBarcode(barcode)
      .then(function (feedback) {
        console.log(feedback);
        res.json({status: 'ok', description: feedback.n + ' barcodes have been reset'});
      })
      .catch(function (err) {
        res.json({status: 'err', description: err});
      });
};

/** Prototype to reset all Barcodes
 * @memberof OrderHandling
 * @function resetBarcodes
 * @param {HttpRequest} req []
 * @param {HttpResponse} res
 */
OrderHandling.prototype.resetBarcodes = function (req, res) {
  console.log('/resetBarcodes');

  OrderDB.resetBarcodes()
      .then(function (feedback) {
        console.log(feedback);
        res.json({status: 'ok', description: feedback.n + ' barcodes have been reset'});
      })
      .catch(function (err) {
        res.json({status: 'err', description: err});
      });
};

/** Prototype to get OrderId by Barcode
 * @memberof OrderHandling
 * @function getOrderIdByBarcode
 * @param {HttpRequest} req barcode
 * @param {HttpResponse} res
 */
OrderHandling.prototype.getOrderIdByBarcode = function (req, res) {
  var barcode = parseInt(req.body.barcode,10);
  console.log('/getOrderIdByBarcode '+barcode);
  if(isNaN(barcode)){
    return res.json({status: 'err', description: 'No valid barcode.'});
  }

  OrderDB.getOrderIdByBarcode(barcode)
    .then(function (orderId) {
      if (typeof orderId == 'undefined') {
        orderId = "";
      }
      res.json({orderId: orderId});
    })
    .catch(function (err) {
      res.json({status: 'err', description: err});
    });
};

/** Prototype to get Order by Id
 * @memberof OrderHandling
 * @function getOrderById
 * @param {HttpRequest} req /getOrderById
 * @param {HttpResponse} res
 */
OrderHandling.prototype.getOrderById = function (req, res) {
  var id = parseInt(req.body.id, 10);
  console.log('/getOrderById '+id);
  if(isNaN(id)){
    return res.json({err: 'orderId is not a number'});
  }

  if(typeof id == 'undefined'){
    return res.json({err: 'orderId is undefined'});
  }

  OrderDB.getOrder(id)
    .then(function (order) {
      res.json(order);
    })
    .catch(function (err) {
      res.json({err: err});
      console.log(err);
    })
};

/** Prototype to get CocktailData by OrderId
 * @memberof OrderHandling
 * @function getCocktailDataByOrderId
 * @param {HttpRequest} req id
 * @param {HttpResponse} res
 */
OrderHandling.prototype.getCocktailDataByOrderId = function (req, res) {
  var id = parseInt(req.body.id, 10);
  console.log('/getCocktailDataByOrderId id '+id);

  OrderDB.getOrder(id)
    .then(OrderDB.returnEnrichedCocktailData)
    .then(function (ret) {
      res.json(ret);
    })
    .catch(function (err) {
      console.log('error chatched');
      res.json({err: err});
      console.log(err);
    });
};

/** Prototype to get active orders
 * @memberof OrderHandling
 * @function getActiveOrders
 * @param {HttpRequest} req /getActiveOrders
 * @param {HttpResponse} res
 */
OrderHandling.prototype.getActiveOrders = function (req, res){
  console.log('/getActiveOrders');
  var filter = {status: ['accepted', 'in progress'], type: ['Cocktails', 'Cookies']};
  OrderDB.getOrdersFiltered(filter)
    .then(function(ret){
      res.json(ret);
    })
    .catch(function(err){
      res.json({err: err});
      console.log(err);
    });
};

/** Prototype to get orders since timestamp
 * @memberof OrderHandling
 * @function getOrdersSince
 * @param {HttpRequest} req timestamp
 * @param {HttpResponse} res
 */
OrderHandling.prototype.getOrdersSince = function (req, res){
  console.log('/getOrdersSince '+req.body.timestamp);
  var filter = {
    status: ['accepted', 'in progress','done'],
    createdSince: req.body.timestamp,
    type: ['Cocktails', 'Cookies']};

  OrderDB.getOrdersFiltered(filter)
    .then(function(ret){
      res.json(ret);
    })
    .catch(function(err){
      res.json({err: err});
      console.log(err);
    });

};

/** Prototype to get orders updated since timestamp
 * @memberof OrderHandling
 * @function getOrdersUpdatedSince
 * @param {HttpRequest} req timestamp
 * @param {HttpResponse} res
 */
OrderHandling.prototype.getOrdersUpdatedSince = function (req, res){
  console.log('/getOrdersUpdatedSince ' + req.body.timestamp);
  var filter = {
    status: ['accepted', 'in progress','done'],
    updatedSince: req.body.timestamp,
    createdBefore: req.body.timestamp,
    type: ['Cocktails', 'Cookies']};

  OrderDB.getOrdersFiltered(filter)
    .then(function(ret){
      res.json(ret);
    })
    .catch(function(err){
      res.json({err: err});
      console.log(err);
    });
};

/** Prototype to filter Orders by status, createdSince, createdBefore,
 * updatedSince, updatedBefore, type, limit
 * @memberof OrderHandling
 * @function getOrdersFiltered
 * @param {HttpRequest} req [status, createdSince, createdBefore,
 * updatedSince, updatedBefore, type, limit]
 * @param {HttpResponse} res
 */
OrderHandling.prototype.getOrdersFiltered = function (req, res){
  var filter = {
    status: req.body.status,
    createdSince: req.body.createdSince,
    createdBefore: req.body.createdBefore,
    updatedSince: req.body.updatedSince,
    updatedBefore: req.body.updatedBefore,
    type: req.body.type,
    limit: req.body.limit
  };

  console.log('/getOrdersFiltered ' + JSON.stringify(filter));
  //console.log(filter);


  OrderDB.getOrdersFiltered(filter)
    .then(function(ret){
      res.json(ret);
    })
    .catch(function(err){
      res.json({err: err});
      console.log(err);
    });
};

/** Prototype to delete all orders
 * @memberof OrderHandling
 * @function deleteAllOrders
 * @param {HttpRequest} req
 * @param {HttpResponse} res
 */
OrderHandling.prototype.deleteAllOrders = function (req, res) {
  OrderDB.deleteAllOrders()
      .then(function(ret){
        res.json({status: 'ok', description: ret});
      })
      .catch(function(err){
        res.json({status: 'err', description: err});
      });
};

/** Prototype to delete one order
 * @memberof OrderHandling
 * @function deleteOrder
 * @param {HttpRequest} req [id]
 * @param {HttpResponse} res
 */
OrderHandling.prototype.deleteOrder = function (req, res) {
  var id = parseInt(req.body.id,10);
  OrderDB.deleteOrder(id)
      .then(function(ret){
        res.json({status: 'ok', description: ret.result.n + ' orders deleted'});
      })
      .catch(function(err){
        res.json({status: 'err', description: err});
      });
};

/** Prototype to get ordersByStatus
 * @memberof OrderHandling
 * @function getOrdersByStatus
 * @param {HttpRequest} req status
 * @param {HttpResponse} res
 */
OrderHandling.prototype.getOrdersByStatus = function (req, res) {
  var _ = require('underscore');

  var status = req.body.status;

  if(_.contains(OrderDB.getValidStates(), status)) {
    OrderDB.getOrdersByStatus(status)
      .then(function (ret) {
        res.json(ret);
      })
      .catch(function (err) {
        res.json(err);
        console.log(err);
      });
  }
};

/** Prototype to update order status
 * @memberof OrderHandling
 * @function updateOrderStatus
 * @param {HttpRequest} req [id,status]
 * @param {HttpResponse} res
 */
OrderHandling.prototype.updateOrderStatus = function (req, res) {
  var _ = require('underscore');

  var id = parseInt(req.body.id, 10);
  var status = req.body.status;

  console.log('/updateOrderStatus', id, status);

  if(_.contains(OrderDB.getValidStates(), status)) {
    OrderDB.updateStatus(id, status)
      .then(function (ret) {
        res.json(ret);
      })
      .catch(function (err) {
        res.json(err);
        console.log(err);
      });
  } else {
    res.json({status: 'err', description: 'the status is not valid'});
  }

};

/** Prototype to update order
 * @memberof OrderHandling
 * @function updateOrder
 * @param {HttpRequest} req order
 * @param {HttpResponse} res
 */
OrderHandling.prototype.updateOrder = function (req, res) {
  req = JSON.parse(req.body.order);

  console.log('/updateOrder', req);

  OrderDB.updateOrder(req)
    .then(function (ret) {
      res.json(ret);
    })
    .catch(function (err) {
      res.json(err);
      console.log(err);
    });

};

/** Prototype to browse orders
 * @memberof OrderHandling
 * @function browseOrders
 * @param {HttpRequest} req
 * @param {HttpResponse} res
 */
OrderHandling.prototype.browseOrders = function(req, res){
  console.log('/order --- browseOrders');
  var config = require('./../config.js');

  RecipeDB.getRecipes()
    .then(function(recipes){
      var newRecipes = [];
      recipes.forEach(function(recipe){
        var parameters = recipe.userparameters;
        recipe.userparameters = _.without(parameters, _.findWhere(parameters, {Name: 'Identifier assignment / Barcode'})||
          _.findWhere(parameters, {Name: 'Total Liquid Amount'})||
          _.findWhere(parameters, {Name: 'Amount'})|| _.findWhere(parameters, {Name: 'Topping'}));

        //only push cocktails and cookies
        if(_.contains(config.Cocktails, recipe.recipeId) || _.contains(config.Cookies, recipe.recipeId)){
          newRecipes.push(recipe);
        }
      });
      res.render('browseOrders', {recipes: newRecipes});
    })
    .catch(function(err){
      res.json(err);
    });
};