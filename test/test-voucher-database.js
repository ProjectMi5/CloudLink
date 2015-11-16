var assert = require('chai').assert;
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);


describe('Voucher', function () {
  var VoucherDB = require('./../models/database-voucher').instance;

  beforeEach('Clean database and load mock data', function () {
  });

  describe('Voucher Database', function () {
    it('#save', function () {
    });

    it('#update', function () {
    });

    it('#delete', function(){
    });

    it('#get', function(){
    });

  });
});