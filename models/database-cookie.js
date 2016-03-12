var Q = require('q');
var _ = require('underscore');

CookieDB = function() {
  this.mongoose = require('mongoose-q')();

  console.log('Mi5 - Database loaded');

  // Connect to database - somehow not needed?
  try {
    this.mongoose.connect(CONFIG.DatabaseHost);
  } catch(err){
    console.log(err);
  }
  console.log('Database connected');

  var cookieLevelSchema = this.mongoose.Schema({
    date          : { type: Date, default: Date.now },
    count         : Number
  });
  this.CookieLevel = this.mongoose.model('CookieLevel', cookieLevelSchema);
};
var instance = new CookieDB();
exports.instance = instance;

// ============================================================================================================
// ==================================  cookies                         ========================================
// ============================================================================================================

CookieDB.prototype.recordCookieLevel = function(level){
  var self = instance;

  var NewLevel = new self.CookieLevel({count: level});
  //console.log('new voucher saving:'+voucher);
  return NewLevel.saveQ();
};

CookieDB.prototype.getLastCookieLevel = function(){
  var self = instance;
  var deferred = Q.defer();

  self.CookieLevel.find({}, '-_id -__v').sort({'date': -1}).limit(1).exec(function(err, post){
    if(err) deferred.reject(err);
    if(false === _.isEmpty(post)){
      deferred.resolve(post.pop());
    } else {
      deferred.reject('no data has been found');
    }
  });

  return deferred.promise;
};

CookieDB.prototype.getCookieLevelHistory = function(){
  var self = instance;
  var deferred = Q.defer();

  self.CookieLevel.find({},'-_id -__v').sort({'date': -1}).exec(function(err, result){
    if(err) deferred.reject(err);
    deferred.resolve(result);
  });

  return deferred.promise;
};

CookieDB.prototype.deleteCookieLevelHistory = function(){
  var self = this;

  return Q.Promise(function(resolve, reject){
    self.CookieLevel.remove(function(err){
      if(!err) resolve();
      else reject(err);
    });
  });
};