var Q = require('q');
var _ = require('underscore');

Recipes = function() {
  this.mongoose = require('mongoose-q')();

  console.log('Mi5 - Database loaded');

  // Connect to database - somehow not needed?
  try {
    this.mongoose.connect(CONFIG.DatabaseHost);
  } catch(err){
    console.log(err);
  }
  console.log('Database connected');

  var recipeSchema = this.mongoose.Schema({
    recipeId  : Number,
    name      : String,
    description : String,
    dummy     : Boolean,
    userparameters : this.mongoose.Schema.Types.Mixed
  });
  this.Recipe = this.mongoose.model('Recipe', recipeSchema);
};
var instance = new Recipes();
exports.instance = instance;

// ============================================================================================================
// ==================================  recipes                         ========================================
// ============================================================================================================

Recipes.prototype.translateRecipe = function(recipe){
  var deferred = Q.defer();

  var mongoRecipe = {
    recipeId: recipe.RecipeID,
    name: recipe.Name,
    description: recipe.Description,
    dummy: recipe.Dummy,
    userparameters: recipe.userparameters
  };

  deferred.resolve(mongoRecipe);
  return deferred.promise;
};

Recipes.prototype.extractRecipeId = function(recipe){
  return recipe.recipeId;
};

Recipes.prototype.getRecipe = function(recipeId) {
  var self = instance;
  var deferred = Q.defer();

  self.Recipe.find({'recipeId': recipeId}).limit(1).exec(function (err, post) {
    if (err) deferred.reject(err);

    deferred.resolve(post.pop()); //due to limit 1, there is only 1 entry in post[]
  });

  return deferred.promise;
};

Recipes.prototype.getRecipes = function(){
  var self = instance;
  var deferred = Q.defer();

  self.Recipe.find().exec(function(err, post){
    if(err) deferred.reject(err);

    deferred.resolve(post);
  });

  return deferred.promise;
};

Recipes.prototype.parseRecipeRequest = function(recipe){
  return Q.fcall(function(){
    return JSON.parse(recipe);
  });
};

Recipes.prototype.manageRecipe = function(recipe){
  var self = instance;

  return self.getRecipe(recipe.recipeId)
    .then(function(oldRecipe){
      if(typeof oldRecipe == 'undefined'){ // no recipe found
        return self.saveRecipe(recipe);
      }
      else {
        return self.updateRecipe(recipe);
      }
    });
};

Recipes.prototype.updateRecipe = function(recipe){
  var self = instance;

  return self.Recipe.updateQ({recipeId: recipe.recipeId}, recipe);
};

Recipes.prototype.saveRecipe = function(recipe){
  var self = instance;

  var NewRecipe = new self.Recipe(recipe);
  //console.log('new recipe saving:'+recipe);
  return NewRecipe.saveQ();
};

Recipes.prototype.deleteAllRecipes = function(){
  var self = instance;

  return Q.Promise(function(resolve, reject){
    self.Recipe.remove(function(err){
      if(!err) resolve();
      else reject(err);
    });
  });
};
