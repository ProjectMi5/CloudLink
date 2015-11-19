var Q = require('q');
var _ = require('underscore');

var RecipeDB = require('./../models/database-recipe').instance;

RecipeHandling = function(){
};
var instance =  new RecipeHandling();
exports.RecipeHandling = instance;

RecipeHandling.prototype.getRecipes = function(req, res){
  RecipeDB.getRecipes()
    .then(function(recipes){
      console.log('/getRecipes called');
      res.json(recipes);
    })
    .catch(function(err){
      res.json({err: err});
      console.log(err);
    });
};

RecipeHandling.prototype.manageRecipe = function(req, res){
  var recipe = req.body.recipe;

  console.log('managing recipe', recipe);
  RecipeDB.parseRecipeRequest(recipe)
    .then(RecipeDB.translateRecipe)
    .then(RecipeDB.manageRecipe)
    .then(function(){

      // this chain is only to get the recipeId;
      RecipeDB.parseRecipeRequest(recipe)
        .then(RecipeDB.translateRecipe)
        .then(RecipeDB.extractRecipeId)
        .then(function(recipeId){
          console.log('/manageRecipe succesfull', 'RecipeID:', recipeId );
          res.json({status: 'ok', description: 'recipe has been managed'})
        });

    })
    .catch(function(err){
      res.json({err: err});
      console.log('manageRecipe err:',err);
    });
};

RecipeHandling.prototype.deleteAllRecipes = function(req, res){
  RecipeDB.deleteAllRecipes()
    .then(function(){
      console.log('/deleteAllRecipes succesfull');
      res.json({status: 'ok', description: 'all recipes have been removed'});
    })
    .catch(function(err){
      res.json({err: err});
      console.log('deleteAllRecipes err:',err);
    })
};

/**
 * experimental feature only for localhost loading recipes
 * @param req
 * @param res
 */
RecipeHandling.prototype.loadDefaultRecipes = function(req, res){
  var recipes = require('./../test/mocks/getRecipes');

  console.log('/loadDefaultRecipes');

  var recipePromises =[]
  _.each(recipes, function(recipePost){
    //console.log(recipePost);
    var recipe = JSON.stringify({
      RecipeID: recipePost.recipeId,
      Name: recipePost.name,
      Dummy: false,
      Description: recipePost.description,
      userparameters: recipePost.userparameters
    });
    recipePromises.push(manageRecipe(recipe));
  });

  Promise.all(recipePromises)
    .then(function() {
      res.json({status: 'ok', description: 'all recipes have been loaded in the database'});
    })
    .catch(function(){
      res.json({status: 'err', description: 'error loading def recipes', err: err});
    });
}

var manageRecipe = function(recipe) {
  return RecipeDB.parseRecipeRequest(recipe)
    .then(RecipeDB.translateRecipe)
    .then(RecipeDB.manageRecipe)
    .then(function () {

      // this chain is only to get the recipeId;
      RecipeDB.parseRecipeRequest(recipe)
        .then(RecipeDB.translateRecipe)
        .then(RecipeDB.extractRecipeId)
        .then(function (recipeId) {
          console.log('/manageRecipe succesfull', 'RecipeID:', recipeId);
        })
        .catch(console.log);

    })
    .catch(function (err) {
      console.log('manageRecipe err:', err);
    });
};