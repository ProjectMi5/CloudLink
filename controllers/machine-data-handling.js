var Q = require('q');


MachineDataHandling = function(){
};
exports.MachineDataHandling = new MachineDataHandling();

MachineDataHandling.prototype.hasStandstill = function(req, res){
  var number = Math.floor(Math.random() * 100);
  if(number > 5){
    res.json({"hasStandstill": true});
  } else {
    res.json({"hasStandstill": false});
  }
};
