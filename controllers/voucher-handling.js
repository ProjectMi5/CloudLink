/** requires module: q */
var Q = require('q');
/** requires module: underscore */
var _ = require('underscore');

/** requires module: ./../models/database-voucher */
var VoucherDB = require('./../models/database-voucher').instance;

/**@function VoucherHandling
 *
 * @constructor
 */
VoucherHandling = function(){
};
var instance =  new VoucherHandling();
exports.VoucherHandling = instance;

/** Prototype to save Voucher
 * @memberof VoucherHandling
 * @function saveVoucher
 * @param  req Voucher
 * @param  res Status
 */
VoucherHandling.prototype.saveVoucher = function(req, res){
  var voucher = JSON.parse(req.body.voucher);

  console.log('/saveVoucher', JSON.stringify(voucher));
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
      console.log('/saveVoucher err:',err);
    });
};

/** Prototype to get Vouchers
 * @memberof VoucherHandling
 * @function getVouchers
 * @param  req
 * @param  res Vouchers
 */
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

/** Prototype to get Voucher by Id
 * @memberof VoucherHandling
 * @function getVoucherById
 * @param  req Id
 * @param  res Voucher
 */
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

/** Prototype to get Vouchers for RecipeID
 * @memberof VoucherHandling
 * @function getVouchersForRecipeId
 * @param  req recipeId, limit
 * @param  res Vouchers
 */
VoucherHandling.prototype.getVouchersForRecipeId = function(req, res){
  var query = {
    recipeId: parseInt(req.body.recipeId, 10),
    limit: parseInt(req.body.limit, 10),
    valid: true
  };

  VoucherDB.getVouchersForRecipeId(query)
    .then(function(vouchers){
      console.log('/getVouchersForRecipeId called with req '+ req);
      res.json(vouchers);
    })
    .catch(function(err){
      res.json({err: err});
      console.log(err);
    });
};

/** Prototype to get update Voucher
 * @memberof VoucherHandling
 * @function updateVoucher
 * @param  req voucher
 * @param  res status
 */
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

/** Prototype to validate all Vouchers
 * @memberof VoucherHandling
 * @function validateAllVouchers
 * @param  req
 * @param  res status
 */
VoucherHandling.prototype.validateAllVouchers = function(req, res){
  console.log('/validateAllVouchers');
  VoucherDB.validateAllVouchers()
    .then(function(result){
      console.log('/validateAllVouchers successfull');
      res.json(result)
    })
    .catch(function(err){
      res.json(err);
      console.log('err in validating all vouchers:',err);
    });
};

/** Prototype to delete all Vouchers
 * @memberof VoucherHandling
 * @function deleteAllVouchers
 * @param  req
 * @param  res status
 */
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

