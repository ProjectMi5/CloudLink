var Q = require('q');

var OrderDB = require('./../models/database-order').instance;

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
  OrderDB.getOrdersFiltered(['accepted', 'in progress'], null, null, ['Cocktails', 'Cookies'])
    .then(function(ret){
      res.json(ret);
    })
    .catch(function(err){
      res.json({err: err});
      console.log(err);
    });
};

OrderHandling.prototype.getOrdersSince = function (req, res){
  var date = new Date(req.body.timestamp);
  OrderDB.getOrdersFiltered(null, date, null, ['Cocktails', 'Cookies'])
    .then(function(ret){
      res.json(ret);
    })
    .catch(function(err){
      res.json({err: err});
      console.log(err);
    });

};

OrderHandling.prototype.getOrdersUpdatedSince = function (req, res){
  var date = new Date(req.body.timestamp);
  OrderDB.getOrdersFiltered(null, null, date, ['Cocktails', 'Cookies'])
    .then(function(ret){
      res.json(ret);
    })
    .catch(function(err){
      res.json({err: err});
      console.log(err);
    });
};

OrderHandling.prototype.getOrdersFiltered = function (req, res){
  var status = req.body.status;
  var createdSince = new Date(req.body.createdSince);
  var updatedSince = new Date(req.body.updatedSince);
  var type = req.body.type;

  OrderDB.getOrdersFiltered(status, createdSince, updatedSince, type)
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