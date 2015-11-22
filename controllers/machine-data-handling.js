var Q = require('q');

var hasStandstill = false;

MachineDataHandling = function(){
};
exports.MachineDataHandling = new MachineDataHandling();

MachineDataHandling.prototype.hasStandstill = function(req, res){
    res.json({"hasStandstill": hasStandstill});
};

MachineDataHandling.prototype.reportMachineStatus = function(req, res){
  console.log('/setStandstill '+JSON.stringify(req.body.status));
  status = req.body.status;
  console.log(status);
  if(status == 'out of order'){
    hasStandstill = true;
    res.json({"status": "ok","description": "Set machine status to "+status});
  } else if (status == 'working'){
    hasStandstill = false;
    res.json({"status": "ok", "description": "Set machine status to "+status});
  } else {
    res.json({"err": "unknown status"});
  }


};
