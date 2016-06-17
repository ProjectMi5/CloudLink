/*
Helper function to rewrite the recipe file.

The input file contains the recipe JSON structure which the HMI loads from the recipe tool through OPC. This JSON is reformatted such that it can be used to load it in the CloudLink as default recipes. Make sure to delete the old recipes before.

-i: input filename
-o: output filename
*/

var fs = require('fs');

var input = undefined;
var output = undefined;

process.argv.forEach(function(value, index, array){
	if(value == '-i'){
		input = './'+array[index+1];
	}
	if(value == '-o'){
		output = './'+array[index+1];
	}
});

if(!input||!output){
	console.error('Input or output is not defined correctly.\n'+
	'usage: node translate -i {inputFile} -o {outputFile}');
	return;
}
  
  
/*
Read file
*/
function ReadFile(callback){
	// read file
	console.log("Reading file: " + input);
	fs.readFile(input,function(err,data){
		if (err) {
			throw err;
		}
		fileContent = JSON.parse(data.toString());
		return callback(fileContent);
	})
}

/*
 Write data to a file
 */
function writeDataFile(data){

  fs.writeFile(output,JSON.stringify(data),function(err){
    if(err){
      throw(err);

    }else{
      console.log("File written: " + output)
    }
  });
}

/*
Parse Data
*/
function rewriteArray(array){
	var newArray = []
	array.forEach(function(item){
		newArray.push(rewriteObject(item));
	});
	return newArray;
}

function rewriteKeys(recipeArray){
	oldKeys = ["Name","RecipeID","Dummy","Description","UserParameter"];
	newKeys = ["name","recipeId","dummy","description","userparameters"];
	var newArray = [];
	
	recipeArray.forEach(function(recipe){
		for(key in recipe)
		{
			var index = oldKeys.indexOf(key);
			if (index>-1)
			{
				recipe[newKeys[index]] = recipe[key];

				delete recipe[key];
			}
		}
		newArray.push(recipe);
	});
	return newArray;
}

function rewriteObject(object){
	var newObject = {};
	for(key in object){
		var item = object[key];
		if((!!item) && (item.constructor == Array)){
			newObject[key] = rewriteArray(item);
		}
		else if ((!!item) && (item.constructor == Object)) {
			if(item.nodeId){
				newObject[key] = item.value;
			}
			else 
				newObject[key] = rewriteObject(item);
		}
		else
			newObject[key] = item;
	}

	return newObject;
}

// Execute
ReadFile(function(fileContent){
	var newData = rewriteArray(fileContent);
	newData = rewriteKeys(newData);
	writeDataFile(newData);
});
