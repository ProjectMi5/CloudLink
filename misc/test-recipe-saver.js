// Mi5 Database Model - MongoDB
mi5Database = require('./../models/mi5Database').instance;

mi5Database.getLastTaskId().then(function(taskId){
  console.log('current taskId: ', taskId);
});

//mi5Database.manageRecipe(9998, 'Test recipe 2 - Server', 'This is the second test recipe in the database', [{'unit': 'ml', 'name': 'grenadine'}])
//  .then(function(aha){
//    console.log(aha);
//  })
//  .then(function(){
//    return mi5Database.getRecipes();
//  })
//  .then(function(recipes){
//    console.log(recipes);
//  })
//  .fail(function(err){
//    console.log('err', err);
//  });

mi5Database.saveOrder(1003, 9999, []);

