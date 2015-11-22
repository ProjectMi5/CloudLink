var Q = require('q');

var hasStandstill = false;

MachineDataHandling = function(){
};
exports.MachineDataHandling = new MachineDataHandling();

MachineDataHandling.prototype.hasStandstill = function(req, res){
    res.json({"hasStandstill": hasStandstill});
};

MachineDataHandling.prototype.reportMachineStatus = function(req, res){
  console.log('/setStandstill '+JSON.stringify(req.body.standstill));
  hasStandstill = JSON.parse(req.body.standstill);
  res.json({"standstill": hasStandstill});
};
