var Q = require('q');

var OrderDB = require('./../models/database-order').instance;
var VoucherDB = require('./../models/database-voucher').instance;

OrderHandling = function () {
};
exports.OrderHandling = new OrderHandling();

OrderHandling.prototype.getLastOrder = function (req, res) {
  OrderDB.getLastOrder()
    .then(function (order) {
      console.log('getlastorder', order);
      res.json(order);
    })
    .catch(function (err) {
      res.json({err: err});
      console.log(err);
    })
};

OrderHandling.prototype.getOrders = function (req, res) {
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
  console.log('/QR Request to place an order:',req.params);

  VoucherDB.getVoucher(req.params.identifier)
    .then(function(voucher) {
      if (typeof voucher == 'undefined') {
        var deferred = Q.defer();
        deferred.reject('Your identifier seems to be missing in our database. Try another one!');
        return deferred.promise;
      } else if (voucher.valid == true) {
        return OrderDB.placeOrder({recipeId: voucher.recipeId, parameters: voucher.parameters});
      } else {
        var deferred = Q.defer();
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

OrderHandling.prototype.setBarcode = function (req, res) {
  var orderId = JSON.parse(req.body.id);
  var barcode = JSON.parse(req.body.barcode);
  console.log('Requested to set barcode of order ' + orderId + ' to ' + barcode);

  OrderDB.setBarcode(orderId, barcode)
    .then(function (feedback) {
      res.json({status: 'ok', description: 'barcode has been saved'});
    })
    .catch(function (err) {
      res.json({status: 'err', description: err});
    });
};

OrderHandling.prototype.getOrderIdByBarcode = function (req, res) {
  var barcode = JSON.parse(req.body.barcode);

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

  OrderDB.getOrderSave(id)
    .then(OrderDB.returnEnrichedCocktailData)
    .then(function (ret) {
      res.json(ret);
    })
    .catch(function (err) {
      res.json({err: err});
      console.log(err);
    });
};

OrderHandling.prototype.getActiveOrders = function (req, res){
  var filter = {status: ['accepted', 'in progress'], types: ['Cocktails', 'Cookies']};
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
  var filter = {createdSince: req.body.timestamp,types: ['Cocktails', 'Cookies']};

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
  var filter = {updatedSince: req.body.timestamp,types: ['Cocktails', 'Cookies']};
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
  var filter = {
    status: req.body.status,
    createdSince: req.body.createdSince,
    updatedSince: req.body.updatedSince,
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
  req = req.body.order;

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