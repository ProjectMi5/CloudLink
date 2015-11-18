var Q = require('q');


MachineDataHandling = function(){
};
exports.MachineDataHandling = new MachineDataHandling();

MachineDataHandling.prototype.hasStandstill = function(req, res){
  var number = Math.floor(Math.random() * 100);
  if(number > 30){
    res.json({"hasStandstill": false});
  } else {
    res.json({"hasStandstill": true});
  }
};
