var Q = require('q');
var _ = require('underscore');

var VoucherDB = require('./../models/database-voucher').instance;

VoucherHandling = function(){
};
var instance =  new VoucherHandling();
exports.VoucherHandling = instance;

VoucherHandling.prototype.saveVoucher = function(req, res){
  var voucher = JSON.parse(req.body.voucher);

  console.log('A vew voucher is being saved', voucher);
  VoucherDB.getVoucher(voucher.identifier)
    .then(function(result){
      if (typeof result == 'undefined'){
        return voucher;
      } else {
        var deferred = Q.defer();
        deferred.reject('A voucher with identifier '+voucher.identifier+' already exists.');
        return deferred.promise;
      }
    })
    .then(VoucherDB.translateVoucher)
    .then(VoucherDB.saveVoucher)
    .then(function(){
      console.log('/saveVoucher successful', 'identifier:', voucher.identifier );
      res.json({status: 'ok', description: 'voucher has been saved'})
    })
    .catch(function(err){
      res.json({err: err});
      console.log('manageVoucher err:',err);
    });
};


VoucherHandling.prototype.getVouchers = function(req, res){
  VoucherDB.getVouchers()
    .then(function(vouchers){
      console.log('/getVouchers called');
      res.json(vouchers);
    })
    .catch(function(err){
      res.json({err: err});
      console.log(err);
    });
};

VoucherHandling.prototype.getVoucherById = function(req, res){
  var identifier = req.body.identifier.toString();

  VoucherDB.getVoucher(identifier)
    .then(function(voucher){
      if(typeof voucher == 'undefined'){
        res.json({err: "There is no voucher with identifier " + identifier});
      } else {
        console.log('/getVoucherById called with identifier '+identifier);
        res.json(voucher);
      }

    })
    .catch(function(err){
      res.json({err: err});
      console.log(err);
    });
};

VoucherHandling.prototype.getVouchersForRecipeId = function(req, res){
  req = JSON.parse(req.body);

  VoucherDB.getVouchersForRecipeId(req)
    .then(function(vouchers){
      console.log('/getVouchersForRecipeId called with req '+ req);
      res.json(vouchers);
    })
    .catch(function(err){
      res.json({err: err});
      console.log(err);
    });
};

VoucherHandling.prototype.manageVoucher = function(req, res){
  var voucher = JSON.parse(req.body.voucher);

  console.log('managing voucher', voucher);
  VoucherDB.parseVoucherRequest(voucher)
    .then(VoucherDB.translateVoucher)
    .then(VoucherDB.manageVoucher)
    .then(function(){
          console.log('/manageVoucher successfull', 'identifier:', voucher.identifier );
          res.json({status: 'ok', description: 'voucher has been managed'})
    })
    .catch(function(err){
      res.json({err: err});
      console.log('manageVoucher err:',err);
    });
};

VoucherHandling.prototype.updateVoucher = function(req, res){
  var voucher = JSON.parse(req.body.voucher);

  console.log('updating voucher', voucher);
  VoucherDB.updateVoucher(voucher)
    .then(function(){
      console.log('/updateVoucher successfull', 'request:', voucher );
      res.json({status: 'ok', description: 'voucher has been updated'})
    })
    .catch(function(err){
      res.json({err: err});
      console.log('updateVoucher err:',err);
    });
};

VoucherHandling.prototype.deleteAllVouchers = function(req, res){
  VoucherDB.deleteAllVouchers()
    .then(function(){
      console.log('/deleteAllVouchers succesfull');
      res.json({status: 'ok', description: 'all vouchers have been removed'});
    })
    .catch(function(err){
      res.json({err: err});
      console.log('deleteAllVouchers err:',err);
    })
};

