var Q = require('q');

var mi5Database = require('./../models/mi5Database').instance;

OrderHandling = function(){
};
exports.OrderHandling = new OrderHandling();

OrderHandling.prototype.getLastOrder = function(req,res){
  mi5Database.getLastOrder()
    .then(function(order){
      console.log('getlastorder', order);
      res.json(order);
    })
    .catch(function(err){
      res.json({err: err});
      console.log(err);
    })
};

OrderHandling.prototype.getOrders = function(req,res){
  mi5Database.getOrders()
    .then(function(orders){
      console.log('getOrders', orders);
      res.json(orders);
    })
    .catch(function(err){
      res.json({err: err});
      console.log(err);
    });
};

OrderHandling.prototype.saveOrder = function(req,res){
  var order = JSON.parse(req.body.order);
  console.log(order);

  mi5Database.checkOrderLite(order)
    .spread(mi5Database.saveOrderLite)
    .then(function(){
      res.json({status: 'ok', description: 'order has been saved'});
    })
    .catch(function(err){
      res.json({status: 'err', description: err});
    });
};

OrderHandling.prototype.placeOrder = function(req,res){
  var order = JSON.parse(req.body.order);
  console.log(order);

  mi5Database.placeOrder(order)
      .then(function(order){
        res.json({status: 'ok', description: 'order has been saved', orderId: order.orderId, orderStatus: order.status});
      })
      .catch(function(err){
        res.json({status: 'err', description: err});
      });
};

OrderHandling.prototype.setBarcode = function(req,res){
    var orderId = JSON.parse(req.body.id);
    var barcode = JSON.parse(req.body.barcode);
    console.log('Requested to set barcode of order ' + orderId + ' to ' + barcode);

    mi5Database.setBarcode(orderId, barcode)
        .then(function(feedback){
            res.json({status: 'ok', description: 'barcode has been saved'});
        })
        .catch(function(err){
            res.json({status: 'err', description: err});
        });
};

OrderHandling.prototype.getOrderIdByBarcode = function(req,res){
    var barcode = JSON.parse(req.body.barcode);

    mi5Database.getOrderIdByBarcode(barcode)
        .then(function(orderId){
            if(typeof orderId == 'undefined'){
                orderId = "";
            }
            res.json({orderId: orderId});
        })
        .catch(function(err){
            res.json({status: 'err', description: err});
        });


};

OrderHandling.prototype.getOrderById = function(req,res){
  var id = parseInt(req.body.id, 10);

  mi5Database.getOrder(id)
    .then(function(order){
      console.log('getlastorder', order);
      res.json(order);
    })
    .catch(function(err){
      res.json({err: err});
      console.log(err);
    })
};

OrderHandling.prototype.getCocktailDataByOrderId = function(req,res){
    var id = parseInt(req.body.id, 10);

    mi5Database.getOrderSave(id)
        .then(mi5Database.returnEnrichedCocktailData)
        .then(function(ret){
            res.json(ret);
        })
        .catch(function(err){
            res.json({err: err});
            console.log(err);
        })
};

OrderHandling.prototype.deleteAllOrders() = function(req, res){
  res.json({err: 'not yet implemented'});
}