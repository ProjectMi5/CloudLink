var Q = require('q');
var _ = require('underscore');

var CookieDB = require('./../models/database-cookie').instance;

CookieHandling = function () {
};
exports.CookieHandling = new CookieHandling();

CookieHandling.prototype.getLastCookieLevel = function (req, res) {
  CookieDB.getLastCookieLevel()
    .then(function (cookieLevel) {
      res.json(cookieLevel);
    })
    .catch(function (err) {
      res.json({err: err});
      console.log(err);
    })
};

OrderHandling.prototype.getCookieLevelHistory = function (req, res) {
  CookieDB.getCookieLevelHistory()
    .then(function (history) {
      res.json(history);
    })
    .catch(function (err) {
      res.json({err: err});
      console.log(err);
    });
};

CookieHandling.prototype.deleteCookieLevelHistory = function (req, res) {
  CookieDB.deleteCookieLevelHistory()
    .then(function(){
      res.json({status: 'ok', description: 'cookie level history has been deleted'});
    })
    .catch(function(err){
      res.json({err: err});
    })
};