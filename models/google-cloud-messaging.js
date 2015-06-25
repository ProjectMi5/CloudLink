/**
 * Created by Thomas on 04.06.2015.
 */

var config = require('./../config.js');
var assert = require('better-assert');
//var assert = require('assert');
var Promise = require('promise');

var gcm = require('node-gcm');

function pushMessage(text,regIds){
    return new Promise(function (fullfill, reject){

        var message = new gcm.Message({
            collapseKey: 'collapseKey',
            delayWhileIdle: false,
            timeToLive: 3,
            data: {
                mi5: text
            }
        });

        var sender = new gcm.Sender(config.GoogleAPI);

        sender.sendNoRetry(message, regIds, function(err, result) {
            if (err) {
                return reject(err);
            } else {
                //console.log('gcm:',JSON.stringify(result)); //hiermit funktionierts
                return fullfill(result);
            }
        });
    });
}
exports.pushMessage = pushMessage;