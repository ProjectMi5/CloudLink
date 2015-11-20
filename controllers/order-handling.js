var Q = require('q');

var OrderDB = require('./../models/database-order').instance;
var VoucherDB = require('./../models/database-voucher').instance;

OrderHandling = function () {
};
exports.OrderHandling = new OrderHandling();

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

/**
 * deprecated?
 * @param req
 * @param res
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

OrderHandling.prototype.placeOrderQR = function (req, res){
  console.log('/placeOrderQR:',req.params);

  VoucherDB.getVoucher(req.params.identifier)
    .then(function(voucher) {
      var deferred = Q.defer();
      if (typeof voucher == 'undefined') {
        deferred.reject('Your identifier seems to be missing in our database. Try another one!');
        return deferred.promise;
      } else if (voucher.valid == true) {
        console.log('placeOrder', voucher.recipeId, voucher.parameters);
        return OrderDB.placeOrder({recipeId: voucher.recipeId, parameters: voucher.parameters, marketPlaceId: voucher.marketPlaceId});
      } else {
        deferred.reject('Your identifier is invalid!');
        return deferred.promise;
      }
    })
    .then(function(order){
      res.json({status: 'ok', description: 'order has been saved', orderId: order.orderId, orderStatus: order.status});
    })
    .catch(function(err){
      res.json({status: 'err', description: err});
    });
};

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
      res.render('placeOrderSuccess',{title: 'OK', orderId: order.orderId, message: 'order has been saved with orderId '+order.orderId});
    })
    .catch(function(err){
      res.render('placeOrderSuccess',{title: 'ERR', message:  err.toString()});
    });
};

OrderHandling.prototype.setBarcode = function (req, res) {
  var orderId = JSON.parse(req.body.id);
  var barcode = JSON.parse(req.body.barcode);
  console.log('/setBarcode of order ' + orderId + ' to ' + barcode);

  OrderDB.setBarcode(orderId, barcode)
    .then(function (feedback) {
      res.json({status: 'ok', description: 'barcode has been saved'});
    })
    .catch(function (err) {
      res.json({status: 'err', description: err});
    });
};

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

OrderHandling.prototype.getOrdersSince = function (req, res){
  //console.log('/getOrdersSince '+req.body.timestamp);
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

OrderHandling.prototype.getOrdersUpdatedSince = function (req, res){
  //console.log('/getOrdersUpdatedSince ' + req.body.timestamp);
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

OrderHandling.prototype.getOrdersFiltered = function (req, res){
  console.log('/getOrdersFiltered ' + JSON.stringify(req.body.filter));
  console.log(filter);
  var filter = {
    status: req.body.status,
    createdSince: req.body.createdSince,
    createdBefore: req.body.createdBefore,
    updatedSince: req.body.updatedSince,
    updatedBefore: req.body.updatedBefore,
    type: req.body.type,
    limit: req.body.limit
  };


  OrderDB.getOrdersFiltered(filter)
    .then(function(ret){
      res.json(ret);
    })
    .catch(function(err){
      res.json({err: err});
      console.log(err);
    });
};


OrderHandling.prototype.deleteAllOrders = function (req, res) {
  res.json({err: 'not yet implemented'});
};

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