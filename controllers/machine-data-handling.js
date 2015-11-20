var Q = require('q');


MachineDataHandling = function(){
};
exports.MachineDataHandling = new MachineDataHandling();

MachineDataHandling.prototype.hasStandstill = function(req, res){

    res.json({"hasStandstill": false});
};
