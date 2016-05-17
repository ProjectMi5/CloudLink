/** requires module: q */
var Q = require('q');
/** requires module: underscore */
var _ = require('underscore');

/** requires module: ./../models/database-recipe */
var RecipeDB = require('./../models/database-recipe').instance;

/**@function RecipeHandling
 *
 * @constructor
 */
RecipeHandling = function(){
};
var instance =  new RecipeHandling();
exports.RecipeHandling = instance;

/** Prototype to get Recipes
 * @memberof RecipeHandling
 * @function getRecipes
 * @param  req 
 * @param  res recipes
 */
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

/** Prototype to manage a Recipe
 * @memberof RecipeHandling
 * @function manageRecipes
 * @param  req recipe
 * @param  res 
 */
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

/** Prototype to delete all Recipes
 * @memberof RecipeHandling
 * @function deleteAllRecipes
 * @param  req
 * @param  res Status
 */
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
 *
 * @memberof RecipeHandling
 * @function loadDefaultRecipes
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
    .then(function(results) {
      res.json({status: 'ok', description: 'all recipes have been loaded in the database', results: results});
    })
    .catch(function(){
      res.json({status: 'err', description: 'error loading def recipes', err: err});
    });
}

var manageRecipe = function(recipe) {
  var recipe = recipe;
  return RecipeDB.parseRecipeRequest(recipe)
    .then(RecipeDB.translateRecipe)
    .then(RecipeDB.manageRecipe)
    .then(function (){
      recipe = JSON.parse(recipe); // beware of inconsistency in recipe on database and from showcase mi5
      console.log('/manageRecipe successful', 'RecipeID:', recipe.RecipeID);
      return {status: 'ok', description: 'recipe has been pushed', recipe: recipe};
    })
    .catch(function (err) {
      console.log('manageRecipe err:', err);
    });
};