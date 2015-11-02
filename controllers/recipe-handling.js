var Q = require('q');

var RecipeDB = require('./../models/database-recipe').instance;

RecipeHandling = function(){
};
exports.RecipeHandling = new RecipeHandling();

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