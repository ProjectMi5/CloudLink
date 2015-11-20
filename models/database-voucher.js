var Q = require('q');
var _ = require('underscore');

VoucherDB = function() {
  this.mongoose = require('mongoose-q')();

  console.log('Mi5 - Database loaded');

  // Connect to database - somehow not needed?
  try {
    this.mongoose.connect(CONFIG.DatabaseHost);
  } catch(err){
    console.log(err);
  }
  console.log('Database connected');

  var voucherSchema = this.mongoose.Schema({
    identifier    : String,
    recipeId      : Number,
    marketPlaceId : String,
    parameters    : [Number],
    valid         : { type: Boolean, default: true },
    humanReadable : String
  });
  this.Voucher = this.mongoose.model('Voucher', voucherSchema);
};
var instance = new VoucherDB();
exports.instance = instance;

// ============================================================================================================
// ==================================  vouchers                         ========================================
// ============================================================================================================

VoucherDB.prototype.saveVoucher = function(voucher){
  var self = instance;

  var NewVoucher = new self.Voucher(voucher);
  //console.log('new voucher saving:'+voucher);
  return NewVoucher.saveQ();
};

VoucherDB.prototype.translateVoucher = function(voucher){
  var deferred = Q.defer();

  var mongoVoucher = {
    identifier: voucher.identifier,
    recipeId: voucher.recipeId,
    marketPlaceId: voucher.marketPlaceId,
    parameters: JSON.parse(voucher.parameters),
    humanReadable: voucher.humanReadable
  };

  deferred.resolve(mongoVoucher);
  return deferred.promise;
};

VoucherDB.prototype.getVoucher = function(identifier) {
  var self = instance;
  var deferred = Q.defer();


  self.Voucher.find({'identifier': identifier}, '-_id -__v').limit(1).exec(function (err, post) {
    if (err) deferred.reject(err);

    deferred.resolve(post.pop()); //due to limit 1, there is only 1 entry in post[]
  });

  return deferred.promise;
};

/**
 *
 * @param req is an object with attributes recipeId, limit
 * @returns {*|promise}
 */
VoucherDB.prototype.getVouchersForRecipeId = function(req){
  var self = instance;
  var deferred = Q.defer();
  var recipeId = parseInt(req.recipeId,10);
  var limit = parseInt(req.limit,10);

  if (isNaN(limit)){
    limit = {};
  }

  self.Voucher.find({'recipeId': req.recipeId}, '-_id -__v').limit(limit).exec(function(err, post){
    if(err) deferred.reject(err);

    deferred.resolve(post);
  });

  return deferred.promise;
};

VoucherDB.prototype.getVouchers = function(){
  var self = instance;
  var deferred = Q.defer();

  self.Voucher.find({},'-_id -__v').exec(function(err, post){
    if(err) deferred.reject(err);

    deferred.resolve(post);
  });

  return deferred.promise;
};


VoucherDB.prototype.parseVoucherRequest = function(voucher){
  return Q.fcall(function(){
    return JSON.parse(voucher);
  });
};

VoucherDB.prototype.updateVoucher = function(req){
  console.log(req);
  var self = instance;
  var identifier = req.identifier;
  delete req.identifier;


  return self.Voucher.updateQ({identifier: identifier}, { $set: req})
    .then(function(result){
      console.log(result);
      return Q.Promise(function(resolve, reject){
        if(result.n == 1){
          resolve({status: 'ok', description: 'voucher with id ' + identifier + 'was updated with: '
          + JSON.stringify(req)});
        } else {
          reject({status: 'err', description: 'no voucher has been modified, probably the identifier is wrong, or the status has not changed'});
        }
      });
    });
};


VoucherDB.prototype.deleteAllVouchers = function(){
  var self = instance;

  return Q.Promise(function(resolve, reject){
    self.Voucher.remove(function(err){
      if(!err) resolve();
      else reject(err);
    });
  });
};