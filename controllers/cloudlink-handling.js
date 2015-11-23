var Q = require('q');
var Tail = require('tail').Tail;

CloudlinkHandling = function(){
};
exports.CloudlinkHandling = new CloudlinkHandling();

CloudlinkHandling.prototype.showLog = function(req, res){
    res.json({"hasStandstill": hasStandstill});
};