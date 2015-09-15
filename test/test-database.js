/**
 * Created by Thomas on 02.06.2015.
 */
var database = require('./../models/database.js');
var assert = require('chai').assert;
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

describe('Device Handling GCM', function() {

    //before(function(){
    //    database.
    //});

    describe('check device registering', function(){
        var regId = 'APA91bENNiqKsuH9iPaueLnMQZ0TqorGY9ctH9jt48oacyddgAyZHyaBZ1KrZ6-bO_Y2ObQnC_BUrhYO-47dk8mzBBLoRVYjTCvJm5F7LL5uIV42PfOWTQp4oOkGCkBeXfZFD1Ey0HQi';

        it('Register New Device', function () {
            return database.registerNewDeviceQ(regId);
        });
        it('Get all regIds', function(){
            return database.getRegIdsQ()
              .then(function(regids) {
                  assert.isArray(regids);

              });
        });
    });

    // check that duplicate entires dont get saved
    // check for regId cleaning on gcm result
});