var Q = require('q');

var database = require('./../models/database.js');
var gcm = require('./../models/google-cloud-messaging.js');

DeviceHandling = function(){
};
exports.DeviceHandling = new DeviceHandling();

DeviceHandling.prototype.register = function(req, res){
  var regId = req.body.regid;

  if (undefined === regId || regId == '') {
    // Error
    res.json({status: "BAD", msg: "No regId-parameter given"});
  } else {
    database.registerNewDeviceQ(regId)
      .then(function(result){
        console.log('saved');
        res.json({status: "OK", msg: "Your regId: " + regId, result: result});
      });
  }
};

DeviceHandling.prototype.getRegIds = function(req, res){
  database.getRegIdsQ()
    .then(function(regIds){
      res.json(JSON.stringify(regIds));
    });
};

DeviceHandling.prototype.pushMessage = function(req, res){
  var data = req.body.data;

  if (undefined === data) {
    // Error
    res.json({status: "BAD", msg: "No data to push"});
  } else {
    // Push message via gcm
    database.getRegIdsQ()
      .then(function(regIds){
        return gcm.pushMessage(data,regIds);
      })
      .then(database.cleanRegIdsQ)
      .then(function(){
        res.json({"status:":"ok", "description": "message has been pushed to all registered devices via gcm"});
      })
      .catch(function(err){
        res.json({"status":"err", "description": "there was an error pushing", "err": err});
      });
  }
};