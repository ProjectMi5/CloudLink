var Q = require('q');
var _ = require('underscore');

var database = require('./../models/database.js');
var mi5Database = require('./../models/mi5Database').instance;
var gcm = require('./../models/google-cloud-messaging.js');

FeedbackHandling = function(){
};
exports.FeedbackHandling = new FeedbackHandling();

FeedbackHandling.prototype.giveFeedback = function(req, res){
  var feedback = req.body.feedback;

  mi5Database.checkFeedback(feedback)
    .spread(mi5Database.saveFeedback)
    .then(function(){
      return Q.fcall(function(){
        console.log('saved, now pushing...');
      });
    })
    .then(database.getRegIdsQ)
    .then(function(regIds){
      console.log('pushing...');
      return gcm.pushMessage(JSON.stringify(feedback).toString(),regIds);
    })
    .then(database.cleanRegIdsQ)
    .then(function(){
      console.log('feedback saved and pushed');
      res.json({status: 'ok', description: 'feedback saved and pushed'});
    })
    .catch(function(err){
      console.log('error while saving feedback:', err);
      res.json({status: 'err', description: err});
    });
};

FeedbackHandling.prototype.getFeedbacks = function(req, res){
  mi5Database.getFeedbacks()
    .then(function(feedbacks){
      res.json(feedbacks);
    })
    .catch(function(err){
      res.json({status: 'err', description: err});
    });
};