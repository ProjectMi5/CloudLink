var Q = require('q');

var mi5Database = require('./../models/mi5Database').instance;

RecipeHandling = function(){
};
exports.RecipeHandling = new RecipeHandling();

RecipeHandling.prototype.getRecipes = function(req, res){
  mi5Database.getRecipes()
    .then(function(recipes){
      console.log(recipes);
      res.json(recipes);
    })
    .catch(function(err){
      res.json({err: err});
      console.log(err);
    });
};

RecipeHandling.prototype.manageRecipe = function(req, res){
  //mi5Database.
  res.json({status:'err', description:'this feature is not yet implemented'})
}