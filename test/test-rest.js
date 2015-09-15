var assert = require('chai').assert;
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

describe('Test REST api', function() {

  // Mock-Data
  var recipePOST = {
    userparameters:
      [ { Default: 200,
        Description: 'Gives the total fluid amount in the glass',
        Dummy: false,
        MaxValue: 200,
        MinValue: 10,
        Name: 'Total Liquid Amount',
        Step: 0,
        Unit: 'ml' },
        { Default: 50,
          Description: 'Maracuja Juice',
          Dummy: false,
          MaxValue: 100,
          MinValue: 1,
          Name: 'Maracuja Juice',
          Step: 0,
          Unit: 'ml' },
        { Default: 35,
          Description: 'Orange Juice',
          Dummy: false,
          MaxValue: 100,
          MinValue: 1,
          Name: 'Orange Juice',
          Step: 0,
          Unit: 'ml' },
        { Default: 15,
          Description: 'Grenadine Syrup',
          Dummy: false,
          MaxValue: 50,
          MinValue: 1,
          Name: 'Grenadine Syrup',
          Step: 0,
          Unit: 'ml' } ],
    Description: 'Sweet cocktail combining the sourness of maracuja and orange juice with the sweetness of grenadine syrup',
    Dummy: false,
    Name: 'Free Passion',
    RecipeID: 10051 };
  var recipeParsed = { recipeId: 10051,
    name: 'Free Passion',
    description: 'Sweet cocktail combining the sourness of maracuja and orange juice with the sweetness of grenadine syrup',
    dummy: false,
    userparameters:
      [ { Default: 200,
        Description: 'Gives the total fluid amount in the glass',
        Dummy: false,
        MaxValue: 200,
        MinValue: 10,
        Name: 'Total Liquid Amount',
        Step: 0,
        Unit: 'ml' },
        { Default: 50,
          Description: 'Maracuja Juice',
          Dummy: false,
          MaxValue: 100,
          MinValue: 1,
          Name: 'Maracuja Juice',
          Step: 0,
          Unit: 'ml' },
        { Default: 35,
          Description: 'Orange Juice',
          Dummy: false,
          MaxValue: 100,
          MinValue: 1,
          Name: 'Orange Juice',
          Step: 0,
          Unit: 'ml' },
        { Default: 15,
          Description: 'Grenadine Syrup',
          Dummy: false,
          MaxValue: 50,
          MinValue: 1,
          Name: 'Grenadine Syrup',
          Step: 0,
          Unit: 'ml' } ] };

  before(function(){
    var config = require('./../config');
    // Prepare the database
    var mi5Database = require('./../models/mi5Database').instance;
    mi5Database.deleteAllRecipes();
    mi5Database.saveRecipe(recipeParsed);

    // Start webserver
    var express = require('express');
    var app = express();
    var bodyParser = require('body-parser');
    var basicAuth = require('basic-auth-connect');
    app.use(bodyParser.urlencoded({extended: true})); // for parsing application/x-www-form-urlencoded

    var RecipeHandling  = require('./../controllers/recipe-handling').RecipeHandling;

    // Recipes
    app.get('/getRecipes', RecipeHandling.getRecipes);
    app.post('/manageRecipe', RecipeHandling.manageRecipe);

    // Start web-server
    app.listen(config.HTTPPort);
  });

  after(function(){
    // clean up database
    var mi5Database = require('./../models/mi5Database').instance;
    mi5Database.deleteAllRecipes();
  });

  describe('Test RecipeHandling', function(){
    var config = require('./../config');
    var request = require('request');

    it('/getRecipes', function(done){
      var options = {
        url:  'http://localhost:'+config.HTTPPort+'/getRecipes'
      };
      request.get(options, function(err, res, body){
        var recipes = JSON.parse(body);
        assert.isNull(err);
        done();
      });
    });

    it('/manageRecipe', function(done){
      var options = {
        url:  'http://localhost:'+config.HTTPPort+'/manageRecipe',
        form: {recipe: JSON.stringify(recipePOST)}
      };
      request.post(options, function(err, res, body){
        assert.isNull(err);

        body = JSON.parse(body);
        assert.equal(body.status, 'ok');

        done();
      });
    })
  });


});