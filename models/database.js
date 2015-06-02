/**
 * Created by Thomas on 02.06.2015.
 */
var config = require('./../config.js');
var assert = require('better-assert');
//var assert = require('assert');
var mongoose = require('mongoose-q')();

mongoose.connect(config.MongoDBHost);

// Create the Mongoose Schema
var deviceSchema = mongoose.Schema({
    regId     : String
    , date      : { type: Date, default: Date.now }
});
var Device = mongoose.model('Device', deviceSchema);

function registerNewDeviceQ(regId){
    assert(typeof regId == 'string');
    var NewDevice = new Device({regId: regId});
    return NewDevice.saveQ();
}
exports.registerNewDevice = registerNewDeviceQ;

function getRegIdsQ(){
    return Device.findQ({}).then(function(devices){
        var regIds = devices.map(function(device){ return device.regId; });
        //console.log(regIds);
        return regIds;
    }, function(err){
        //console.log(err);
        return err;
    });
}
exports.getRegIdsQ = getRegIdsQ;

//NewDevice.save(function (err) {
//    if (err) return console.error(err);
//    console.log('saved');
//    res.json({status: "OK", msg: "Your regId: " + regId}); //TODO: scope compatibility?
//});
//
//
//kitty.saveQ()
//    .then(function(){
//        console.log('meow');
//    })
//    .fail(function (err) {
//        console.log(err);
//    });
