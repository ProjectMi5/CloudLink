var Q = require('q');
var _ = require('underscore');

var database = require('./../models/database.js');
var mi5Database = require('./../models/database-feedback').instance;
var gcm = require('./../models/google-cloud-messaging.js');

FeedbackHandling = function(){
};

FeedbackHandling.prototype.giveFeedback = function(req, res){
  var feedback = req.body.feedback;

  var enrichedFeedback;

  mi5Database.checkFeedback(feedback)
    .spread(mi5Database.saveFeedback)
    .then(mi5Database.enrichFeedback)
    .then(function(feedback){
      enrichedFeedback = feedback;
      return Q.fcall(function(){return 'Promise';}); // just continue in the promise chain
    })
    .then(function(){
      return Q.fcall(function(){
        console.log('saved, now pushing...');
      });
    })
    .then(database.getRegIdsQ)
    .then(function(regIds){
      console.log('pushing...');
      return gcm.pushMessage(JSON.stringify(enrichedFeedback).toString(),regIds);
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

exports.FeedbackHandling = new FeedbackHandling();