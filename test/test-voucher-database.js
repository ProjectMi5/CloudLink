var assert = require('chai').assert;
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);


describe('Voucher', function () {
  var VoucherDB = require('./../models/database-voucher').instance;
  var VoucherHandling = require('./../controllers/voucher-handling').VoucherHandling;
  var mockVoucher1 = {
    identifier: 'mwaoiejfroas8eoiero932u98oeaijflksadnfhwareoi',
    recipeId: '1051',
    parameters: [100,20,50,49],
    humanReadable: 'humanReadable1'
  };
  var mockVoucher2 = {
    identifier: 'sdkfjrosaijefkane884848399äpo3920u29o3jpojrrqoi',
    recipeId: '1051',
    parameters: [100,20,50,49],
    humanReadable: 'humanReadable2'
  };

  beforeEach('Clean database and load mock data', function () {
    return VoucherDB.deleteAllVouchers()
      .then(VoucherDB.saveVoucher(mockVoucher1));
  });

  describe('Voucher Database', function () {
    it('#save', function () {
      return VoucherDB.saveVoucher(mockVoucher2)
        .then(function(result){
          console.log(result);
        });
    });

    it('#update', function () {
      var mockVoucher3 =  {};
      mockVoucher3.identifier = mockVoucher1.identifier;
      mockVoucher3.valid = false;
      mockVoucher3 = JSON.stringify(mockVoucher3);
      mockVoucher3 = JSON.parse(mockVoucher3);
      return VoucherDB.updateVoucher(mockVoucher3)
        .then(function(result){
          console.log(result);
        })
    });

    it('#getVoucher', function(){
      return VoucherDB.getVoucher(mockVoucher1.identifier)
        .then(function(res){
          console.log(res);
        })
    });

    it('#getVouchers', function(){
      return VoucherDB.getVouchers()
        .then(function(result){
          console.log(result);
        });
    });

  });

  describe('Voucher Handler', function () {
    it('#getVoucherById', function () {
 
    });

    it('#update', function () {

    });

    it('#delete', function(){
    });

    it('#get', function(){

    });

  });
});