var Q = require('q');
var Tail = require('tail').Tail;
var io = require('./../models/socket-io').io;

CLOUDLINKHANDLING = function(){
};
var CloudlinkHandling = new CLOUDLINKHANDLING();
module.exports = CloudlinkHandling;

CLOUDLINKHANDLING.prototype.showLog = function(req, res){
  var i = 0;
  setInterval(function(){
    io.emit('news','hallo ');
    i = i+1;
  },1000);

  res.render('showLog');
};