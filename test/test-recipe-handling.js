var assert = require('chai').assert;
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);


describe('Mi5 Specific interface', function() {
  var mi5Database = require('./../models/database-recipe').instance;

  // clean database
  before('Clean database: delete all recipes', function(){
    return mi5Database.deleteAllRecipes();
  });

  after(function(){
    return mi5Database.deleteAllRecipes();
  });

  describe('test recipe handling', function(){
    // recipePOST is coming from HMI
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
    var recipeId = 10051; //see recipePOST.RecipeID

    it('parse incoming data from post request', function(){
      return mi5Database.parseRecipeRequest(JSON.stringify(recipePOST))
        .then(function(recipe){
          assert.deepEqual(recipe, recipePOST);
        })
    });

    it('parse a post Recipe', function(){
      return mi5Database.translateRecipe(recipePOST)
        .then(function(recipe){
          assert.deepEqual(recipe, recipeParsed);
          assert.equal(recipe.recipeId, recipeId);
        });
    });

    it('save a recipe', function(){
      return mi5Database.saveRecipe(recipeParsed);
    });

    it('get a recipe', function(){
      return mi5Database.getRecipe(recipeId)
        .then(function(recipe){
          // TODO: make better assert
          assert.equal(recipe.recipeId, recipeId);
        });
    });

    it('update one recipe', function(){
      return mi5Database.updateRecipe(recipeParsed)
        .then(function(result){
          var expectedResult = { ok: 1, nModified: 1, n: 1 };
          assert.deepEqual(result, expectedResult);
        })
    });

    it('manage a recipe', function(){
      return mi5Database.manageRecipe(recipeParsed);
    });

    it('handle post and manage', function(){
        return mi5Database.parseRecipeRequest(JSON.stringify(recipePOST))
            .then(mi5Database.translateRecipe)
            .then(mi5Database.manageRecipe);
    });

  });

  describe('test order handling', function(){

  });
});