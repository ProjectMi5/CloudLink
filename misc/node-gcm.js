var gcm = require('node-gcm');
var config = require('./../config.js');

// ... or some given values
var message = new gcm.Message({
    collapseKey: 'collapse',
    delayWhileIdle: true,
    timeToLive: 3,
    data: {
        mi5: 'message1'
    }
});

// Set up the sender with you API key
var sender = new gcm.Sender(config.GoogleAPI);

// Add the registration IDs of the devices you want to send to
var registrationIds = [  "APA91bHbjqtZoQe7CkvaiNFJqIwiwc-NVWTB5EPiKXPz7aFI_ZIgGhWAt_acSpMrKBbF2cbkPnbqHqkdX3BGZgTnWvbjpfhybOL4kcTWrtP6tD8AbyN6rCF-nty9MgtQfKPx6eePu8Uo16oysPjFl7y60lDhhAahbLUfhCuvFHmUBPTgRP8BfLQ",
    "APA91bHbjqtZoQe7CkvaiNFJqIwiwc-NVWTB5EPiKXPz7aFI_ZIgGhWAt_acSpMrKBbF2cbkPnbqHqkdX3BGZgTnWvbjpfhybOL4kcTWrtP6tD8AbyN6rCF-nty9MgtQfKPx6eePu8Uo16oysPjFl7y60lDhhAahbLUfhCuvFHmUBPTgRP8BfLQ",
    "APA91bENNiqKsuH9iPaueLnMQZ0TqorGY9ctH9jt48oacyddgAyZHyaBZ1KrZ6-bO_Y2ObQnC_BUrhYO-47dk8mzBBLoRVYjTCvJm5F7LL5uIV42PfOWTQp4oOkGCkBeXfZFD1Ey0HQi",
    "APA91bHbjqtZoQe7CkvaiNFJqIwiwc-NVWTB5EPiKXPz7aFI_ZIgGhWAt_acSpMrKBbF2cbkPnbqHqkdX3BGZgTnWvbjpfhybOL4kcTWrtP6tD8AbyN6rCF-nty9MgtQfKPx6eePu8Uo16oysPjFl7y60lDhhAahbLUfhCuvFHmUBPTgRP8BfLQ"];

// Send the message
// ... trying only once
sender.sendNoRetry(message, registrationIds, function(err, result) {
  if(err) console.error(err);
  else    console.log(result);
});
