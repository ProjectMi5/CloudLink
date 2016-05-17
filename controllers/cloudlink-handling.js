/** requires module: q */
var Q = require('q');
/** requires module: tail */
var Tail = require('tail').Tail;
/** requires module: ./../models/socket-io */
var io = require('./../models/socket-io').io;

/**@function CLOUDLINKHANDLING
 *
 * @constructor
 */
CLOUDLINKHANDLING = function(){
};

var CloudlinkHandling = new CLOUDLINKHANDLING();
module.exports = CloudlinkHandling;

/** Prototype to show log
 * @memberof CLOUDLINKHANDLING
 * @function showLog
 * @param {HttpRequest} req
 * @param {HttpResponse} res res.render('showLog')
 */
CLOUDLINKHANDLING.prototype.showLog = function(req, res){
  var i = 0;
  setInterval(function(){
    io.emit('news','hallo ');
    i = i+1;
  },1000);

  res.render('showLog');
};