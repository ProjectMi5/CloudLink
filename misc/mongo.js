/**
 * Created by Thomas on 20.05.2015.
 */
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/test');

var Schema = mongoose.Schema;

var Device = new Schema({
    regId     : String
    , date      : { type: Date, default: Date.now }
});

var NewDevice = mongoose.model('Device', Device);
NewDevice.regId = '12345678asdf';
NewDevice.save(function(err){
    console.log('saved', err);
});