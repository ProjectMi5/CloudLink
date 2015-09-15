/**
 * Created by Thomas on 02.06.2015.
 */
var config = require('./../config.js');
var assert = require('better-assert');
//var assert = require('assert');
var mongoose = require('mongoose-q')();
var _ = require('underscore');
var Q = require('q');

try {
    mongoose.connect(config.MongoDBHost);
} catch(err){
    console.log(err);
}

// Create the Mongoose Schema
var deviceSchema = mongoose.Schema({
    regId     : String
    , date      : { type: Date, default: Date.now }
});
var Device = mongoose.model('Device', deviceSchema);

/**
 * Register a new Device
 *
 * Check if regId already exist, do not save then
 * Check if regId is a string
 *
 * @param regId (string)
 * @returns {*}
 */
function registerNewDeviceQ(regId){
    assert(typeof regId == 'string');
    return Device.findQ({regId: regId})
        .then(function(result){
            if (_.isEmpty(result)){
                return saveDeviceQ(regId);
            }
            else {
                return Q.fcall(function (){
                    return 'device already exists';
                });
            }
        });
}
exports.registerNewDeviceQ = registerNewDeviceQ;
function saveDeviceQ(regId){
    var NewDevice = new Device({regId: regId});
    return NewDevice.saveQ();
}

function getRegIdsQ(){
    return Device.findQ({}).then(function(devices){
        return devices.map(function(device){ return device.regId; });
    }, function(err){
        //console.log(err);
        return err;
    });
}
exports.getRegIdsQ = getRegIdsQ;

/**
 *
 * @param gcm.result
 */
function cleanRegIdsQ(result){
    getRegIdsQ()
        .then(function(regIds){
            console.log(regIds,result.results);
            return cleanRegIds(regIds, result.results);
        });


    function cleanRegIds(regIds, results){
        return _.reduce(results, function(memo, result, key){
            if('InvalidRegistration' == result.error || 'NotRegistered' == result.error){
                console.log('found error:', regIds[key]);
                return deleteRegIdQ(regIds[key]);
            }
        }, Promise.resolve());
    }
    function deleteRegIdQ(regId){
        console.log('now delete',regId);
        return Device.findOneAndRemoveQ({regId: regId});
    }
}
exports.cleanRegIdsQ = cleanRegIdsQ;

function deleteAllRegIdsQ(result){
    return Q.Promise(function(resolve, reject){
        Device.remove(function(err){
            if(!err) resolve();
            else reject(err);
        });
    });
}