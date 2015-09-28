/**
 * Created by Thomas on 04.06.2015.
 */

var config = require('./../config.js');
var Q = require('q');

var gcm = require('node-gcm');

function pushMessage(text,regIds){
  console.log('gcm.pushMessage');
  return Q.Promise(function (fullfill, reject){

    var message = new gcm.Message({
      collapseKey: 'collapseKey',
      delayWhileIdle: false,
      timeToLive: 3,
      data: {
          mi5: text
      }
    });

    var sender = new gcm.Sender(config.GoogleAPI);
    console.log('gcmSender', message);
    console.log('regIds', regIds);

    try{
      sender.sendNoRetry(message, regIds, function(err, result) {
        if (err) {
          console.log('sender.sendNoRetry - rejected:', err, result);
          return reject(err);
        } else {
          console.log('sender.sendNoRetry gcm:',JSON.stringify(result)); //hiermit funktionierts
          return fullfill(result);
        }
      });
    } catch(err){
      reject(err);
      throw new Error('sendNoRetry was not successfull',err);
    }
});
}
exports.pushMessage = pushMessage;