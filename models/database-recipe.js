var Q = require('q');
var _ = require('underscore');

RecipeDB = function() {
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
var instance = new RecipeDB();
exports.instance = instance;

// ============================================================================================================
// ==================================  recipes                         ========================================
// ============================================================================================================

RecipeDB.prototype.translateRecipe = function(recipe){
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

RecipeDB.prototype.extractRecipeId = function(recipe){
  return recipe.recipeId;
};

RecipeDB.prototype.getRecipe = function(recipeId) {
  var self = instance;
  var deferred = Q.defer();

  console.log('/getRecipe');
  self.Recipe.find({'recipeId': recipeId}).limit(1).exec(function (err, post) {
    if (err) {
      deferred.reject(err);
      return;
    }

    console.log('/no error in getrecipe');
    deferred.resolve(post.pop()); //due to limit 1, there is only 1 entry in post[]
  });

  return deferred.promise;
};

RecipeDB.prototype.getRecipes = function(){
  var self = instance;
  var deferred = Q.defer();

  self.Recipe.find().exec(function(err, post){
    if(err) deferred.reject(err);

    deferred.resolve(post);
  });

  return deferred.promise;
};

RecipeDB.prototype.parseRecipeRequest = function(recipe){
  return Q.fcall(function(){
    return JSON.parse(recipe);
  });
};

RecipeDB.prototype.manageRecipe = function(recipe){
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

RecipeDB.prototype.updateRecipe = function(recipe){
  var self = instance;

  return self.Recipe.updateQ({recipeId: recipe.recipeId}, recipe);
};

RecipeDB.prototype.saveRecipe = function(recipe){
  var self = instance;

  var NewRecipe = new self.Recipe(recipe);
  //console.log('new recipe saving:'+recipe);
  return NewRecipe.saveQ();
};

RecipeDB.prototype.deleteAllRecipes = function(){
  var self = instance;

  return Q.Promise(function(resolve, reject){
    self.Recipe.remove(function(err){
      if(!err) resolve();
      else reject(err);
    });
  });
};
