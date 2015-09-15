var Q = require('q');

var mi5Database = require('./../models/mi5Database').instance;

RecipeHandling = function(){
};
exports.RecipeHandling = new RecipeHandling();

RecipeHandling.prototype.getRecipes = function(req, res){
  mi5Database.getRecipes()
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

  mi5Database.parseRecipeRequest(recipe)
    .then(mi5Database.translateRecipe)
    .then(mi5Database.manageRecipe)
    .then(function(){
      console.log('/manageRecipe called');
      res.json({status: 'ok', description: 'recipe has been managed'})
    })
    .catch(function(err){
      res.json({err: err});
      console.log('manageRecipe err:',err);
    });
};