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

  mi5Database.checkOrder(order)
    .spread(mi5Database.saveOrder)
    .then(function(){
      res.json({status: 'ok', description: 'order has been saved'});
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