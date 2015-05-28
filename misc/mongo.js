/**
 * Created by Thomas on 20.05.2015.
 */
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
    // yay!

    var deviceSchema = mongoose.Schema({
        regId     : String
        , date      : { type: Date, default: Date.now }
    });
    var Device = mongoose.model('Device', deviceSchema);

    var NewDevice = new Device({regId: 'asdf1234'});

    NewDevice.save(function (err) {
        if (err) return console.error(err);
        console.log('saved');
    });

    Device.find({}, function(err, devices){
        console.log('find', devices);
    });
});