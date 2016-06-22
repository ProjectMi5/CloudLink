/**
 * Created by Thomas on 18.09.2015.
 * Rewritten by Dominik on 20.06.2016
 */
var recipes = [
	{
		"description": "One Single Transport",
		"dummy": false,
		"name": "XTS one Round",
		"recipeId": 10001,
		"userparameters": []
	},
	{
		"description": "This recipe lets the XTS transport and block/unblock on 3 different stations",
		"dummy": false,
		"name": "XTS Test Recipe",
		"recipeId": 10010,
		"userparameters": []
	},
	{
		"description": "Butter Cookies framing your choosen Topping",
		"dummy": false,
		"name": "Double Cookie",
		"recipeId": 10017,
		"userparameters": [
			{
				"Default": 1,
				"Description": "Choose your first Topping (Top Layer)",
				"Dummy": false,
				"MaxValue": 2,
				"MinValue": 1,
				"Name": "Topping",
				"Step": 1,
				"Unit": "Strawberry, Apple"
			},
			{
				"Default": 50,
				"Description": "Amount of the selected Topping",
				"Dummy": false,
				"MaxValue": 100,
				"MinValue": 0,
				"Name": "Amount",
				"Step": 1,
				"Unit": ""
			}
		]
	},
	{
		"description": "Butter Cookies framing your choosen Topping",
		"dummy": false,
		"name": "Triple Cookie",
		"recipeId": 10018,
		"userparameters": [
			{
				"Default": 1,
				"Description": "Choose your first Topping",
				"Dummy": false,
				"MaxValue": 2,
				"MinValue": 1,
				"Name": "Topping",
				"Step": 1,
				"Unit": "Strawberry, Apple"
			},
			{
				"Default": 40,
				"Description": "Amount of the selected Topping",
				"Dummy": false,
				"MaxValue": 100,
				"MinValue": 0,
				"Name": "Amount",
				"Step": 1,
				"Unit": ""
			},
			{
				"Default": 1,
				"Description": "Choose your second Topping",
				"Dummy": false,
				"MaxValue": 2,
				"MinValue": 1,
				"Name": "Topping",
				"Step": 1,
				"Unit": "Strawberry, Apple"
			},
			{
				"Default": 60,
				"Description": "Amount of the selected Topping",
				"Dummy": false,
				"MaxValue": 100,
				"MinValue": 0,
				"Name": "Amount",
				"Step": 1,
				"Unit": ""
			}
		]
	},
	{
		"description": "Flavoursome cocktail painting a picture of a beautiful summer day",
		"dummy": false,
		"name": "Summerday - Barcode",
		"recipeId": 10065,
		"userparameters": [
			{
				"Default": 200,
				"Description": "Gives the total fluid amount in the glass",
				"Dummy": false,
				"MaxValue": 200,
				"MinValue": 10,
				"Name": "Total Liquid Amount",
				"Step": 0,
				"Unit": "ml"
			},
			{
				"Default": 19,
				"Description": "Strawberry Syrup",
				"Dummy": false,
				"MaxValue": 100,
				"MinValue": 1,
				"Name": "Strawberry Syrup",
				"Step": 0,
				"Unit": "ml"
			},
			{
				"Default": 19,
				"Description": "Lemon Juice",
				"Dummy": false,
				"MaxValue": 100,
				"MinValue": 1,
				"Name": "Lemon Juice",
				"Step": 0,
				"Unit": "ml"
			},
			{
				"Default": 41,
				"Description": "Pineapple Juice",
				"Dummy": false,
				"MaxValue": 100,
				"MinValue": 1,
				"Name": "Pineapple Juice",
				"Step": 0,
				"Unit": "ml"
			},
			{
				"Default": 41,
				"Description": "Orange Juice",
				"Dummy": false,
				"MaxValue": 100,
				"MinValue": 1,
				"Name": "Orange Juice",
				"Step": 0,
				"Unit": "ml"
			}
		]
	},
	{
		"description": "Sweet cocktail combining the sourness of maracuja and orange juice with the sweetness of grenadine syrup",
		"dummy": false,
		"name": "Free Passion",
		"recipeId": 10051,
		"userparameters": [
			{
				"Default": 200,
				"Description": "Gives the total fluid amount in the glass",
				"Dummy": false,
				"MaxValue": 200,
				"MinValue": 10,
				"Name": "Total Liquid Amount",
				"Step": 0,
				"Unit": "ml"
			},
			{
				"Default": 50,
				"Description": "Maracuja Juice",
				"Dummy": false,
				"MaxValue": 100,
				"MinValue": 1,
				"Name": "Maracuja Juice",
				"Step": 0,
				"Unit": "ml"
			},
			{
				"Default": 35,
				"Description": "Orange Juice",
				"Dummy": false,
				"MaxValue": 100,
				"MinValue": 1,
				"Name": "Orange Juice",
				"Step": 0,
				"Unit": "ml"
			},
			{
				"Default": 15,
				"Description": "Grenadine Syrup",
				"Dummy": false,
				"MaxValue": 50,
				"MinValue": 1,
				"Name": "Grenadine Syrup",
				"Step": 0,
				"Unit": "ml"
			}
		]
	},
	{
		"description": "A fruit explosion in your mouth",
		"dummy": false,
		"name": "911 Targa - Barcode",
		"recipeId": 10063,
		"userparameters": [
			{
				"Default": 200,
				"Description": "Gives the total fluid amount in the glass",
				"Dummy": false,
				"MaxValue": 200,
				"MinValue": 10,
				"Name": "Total Liquid Amount",
				"Step": 0,
				"Unit": "ml"
			},
			{
				"Default": 29,
				"Description": "Maracuja Juice",
				"Dummy": false,
				"MaxValue": 100,
				"MinValue": 1,
				"Name": "Maracuja Juice",
				"Step": 0,
				"Unit": "ml"
			},
			{
				"Default": 29,
				"Description": "Orange Juice",
				"Dummy": false,
				"MaxValue": 100,
				"MinValue": 1,
				"Name": "Orange Juice",
				"Step": 0,
				"Unit": "ml"
			},
			{
				"Default": 29,
				"Description": "Pineapple Juice",
				"Dummy": false,
				"MaxValue": 100,
				"MinValue": 1,
				"Name": "Pineapple Juice",
				"Step": 0,
				"Unit": "ml"
			},
			{
				"Default": 14,
				"Description": "Lemon Juice",
				"Dummy": false,
				"MaxValue": 100,
				"MinValue": 1,
				"Name": "Lemon Juice",
				"Step": 0,
				"Unit": "ml"
			},
			{
				"Default": 14,
				"Description": "Grenadine Syrup",
				"Dummy": false,
				"MaxValue": 100,
				"MinValue": 1,
				"Name": "Grenadine Syrup",
				"Step": 0,
				"Unit": "ml"
			}
		]
	},
	{
		"description": "Remember spring feelings in autumn",
		"dummy": false,
		"name": "Green Five - Barcode",
		"recipeId": 10067,
		"userparameters": [
			{
				"Default": 200,
				"Description": "Gives the total fluid amount in the glass",
				"Dummy": false,
				"MaxValue": 200,
				"MinValue": 10,
				"Name": "Total Liquid Amount",
				"Step": 0,
				"Unit": "ml"
			},
			{
				"Default": 20,
				"Description": "Orange Juice",
				"Dummy": false,
				"MaxValue": 100,
				"MinValue": 1,
				"Name": "Orange Juice",
				"Step": 0,
				"Unit": "ml"
			},
			{
				"Default": 10,
				"Description": "Lemon Juice",
				"Dummy": false,
				"MaxValue": 100,
				"MinValue": 1,
				"Name": "Lemon Juice",
				"Step": 0,
				"Unit": "ml"
			},
			{
				"Default": 30,
				"Description": "Pineapple Juice",
				"Dummy": false,
				"MaxValue": 100,
				"MinValue": 1,
				"Name": "Pineapple Juice",
				"Step": 0,
				"Unit": "ml"
			},
			{
				"Default": 30,
				"Description": "Maracuja Juice",
				"Dummy": false,
				"MaxValue": 100,
				"MinValue": 1,
				"Name": "Maracuja Juice",
				"Step": 0,
				"Unit": "ml"
			},
			{
				"Default": 10,
				"Description": "Blue Curacao",
				"Dummy": false,
				"MaxValue": 100,
				"MinValue": 1,
				"Name": "Blue Curacao",
				"Step": 0,
				"Unit": "ml"
			}
		]
	},
	{
		"description": "Contrastful arrangement of sweet syrup and sour juice",
		"dummy": false,
		"name": "Blue Sunrise - Barcode",
		"recipeId": 10066,
		"userparameters": [
			{
				"Default": 200,
				"Description": "Gives the total fluid amount in the glass",
				"Dummy": false,
				"MaxValue": 200,
				"MinValue": 10,
				"Name": "Total Liquid Amount",
				"Step": 0,
				"Unit": "ml"
			},
			{
				"Default": 30,
				"Description": "Lemon Juice",
				"Dummy": false,
				"MaxValue": 100,
				"MinValue": 1,
				"Name": "Lemon Juice",
				"Step": 0,
				"Unit": "ml"
			},
			{
				"Default": 8,
				"Description": "Strawberry Syrup",
				"Dummy": false,
				"MaxValue": 100,
				"MinValue": 1,
				"Name": "Strawberry Syrup",
				"Step": 0,
				"Unit": "ml"
			},
			{
				"Default": 54,
				"Description": "Pineapple Juice",
				"Dummy": false,
				"MaxValue": 100,
				"MinValue": 1,
				"Name": "Pineapple Juice",
				"Step": 0,
				"Unit": "ml"
			},
			{
				"Default": 8,
				"Description": "Blue Curacao",
				"Dummy": false,
				"MaxValue": 100,
				"MinValue": 1,
				"Name": "Blue Curacao",
				"Step": 0,
				"Unit": "ml"
			}
		]
	},
	{
		"description": "Flavoursome cocktail with some special fluid from Havanna",
		"dummy": false,
		"name": "Summernight - Barcode",
		"recipeId": 10070,
		"userparameters": [
			{
				"Default": 200,
				"Description": "Gives the total fluid amount in the glass",
				"Dummy": false,
				"MaxValue": 200,
				"MinValue": 10,
				"Name": "Total Liquid Amount",
				"Step": 0,
				"Unit": "ml"
			},
			{
				"Default": 6,
				"Description": "Strawberry Syrup",
				"Dummy": false,
				"MaxValue": 100,
				"MinValue": 1,
				"Name": "Strawberry Syrup",
				"Step": 0,
				"Unit": "ml"
			},
			{
				"Default": 15,
				"Description": "Lemon Juice",
				"Dummy": false,
				"MaxValue": 100,
				"MinValue": 1,
				"Name": "Lemon Juice",
				"Step": 0,
				"Unit": "ml"
			},
			{
				"Default": 29,
				"Description": "Pineapple Juice",
				"Dummy": false,
				"MaxValue": 100,
				"MinValue": 1,
				"Name": "Pineapple Juice",
				"Step": 0,
				"Unit": "ml"
			},
			{
				"Default": 35,
				"Description": "Orange Juice",
				"Dummy": false,
				"MaxValue": 100,
				"MinValue": 1,
				"Name": "Orange Juice",
				"Step": 0,
				"Unit": "ml"
			},
			{
				"Default": 15,
				"Description": "Rum",
				"Dummy": false,
				"MaxValue": 100,
				"MinValue": 1,
				"Name": "Rum",
				"Step": 0,
				"Unit": "ml"
			}
		]
	},
	{
		"description": "Caribbean Cocktail with a fine shot of grenadine syrup",
		"dummy": false,
		"name": "Planters Punch - Barcode ",
		"recipeId": 10071,
		"userparameters": [
			{
				"Default": 100,
				"Description": "Gives the total fluid amount in the glass",
				"Dummy": false,
				"MaxValue": 200,
				"MinValue": 10,
				"Name": "Total Liquid Amount",
				"Step": 0,
				"Unit": "ml"
			},
			{
				"Default": 25,
				"Description": "Rum",
				"Dummy": false,
				"MaxValue": 100,
				"MinValue": 1,
				"Name": "Rum",
				"Step": 0,
				"Unit": "ml"
			},
			{
				"Default": 30,
				"Description": "Orange Juice",
				"Dummy": false,
				"MaxValue": 100,
				"MinValue": 1,
				"Name": "Orange Juice",
				"Step": 0,
				"Unit": "ml"
			},
			{
				"Default": 30,
				"Description": "Pineapple Juice",
				"Dummy": false,
				"MaxValue": 100,
				"MinValue": 1,
				"Name": "Pineapple Juice",
				"Step": 0,
				"Unit": "ml"
			},
			{
				"Default": 10,
				"Description": "Lemon Juice",
				"Dummy": false,
				"MaxValue": 100,
				"MinValue": 1,
				"Name": "Lemon Juice",
				"Step": 0,
				"Unit": "ml"
			},
			{
				"Default": 5,
				"Description": "Grenadine Syrup",
				"Dummy": false,
				"MaxValue": 100,
				"MinValue": 1,
				"Name": "Grenadine Syrup",
				"Step": 0,
				"Unit": "ml"
			}
		]
	},
	{
		"description": "Juicy cocktail with a lot of rum",
		"dummy": false,
		"name": "Hurricane - Barcode",
		"recipeId": 10072,
		"userparameters": [
			{
				"Default": 100,
				"Description": "Gives the total fluid amount in the glass",
				"Dummy": false,
				"MaxValue": 200,
				"MinValue": 10,
				"Name": "Total Liquid Amount",
				"Step": 0,
				"Unit": "ml"
			},
			{
				"Default": 30,
				"Description": "Rum",
				"Dummy": false,
				"MaxValue": 100,
				"MinValue": 1,
				"Name": "Rum",
				"Step": 0,
				"Unit": "ml"
			},
			{
				"Default": 20,
				"Description": "Orange Juice",
				"Dummy": false,
				"MaxValue": 100,
				"MinValue": 1,
				"Name": "Orange Juice",
				"Step": 0,
				"Unit": "ml"
			},
			{
				"Default": 20,
				"Description": "Pineapple Juice",
				"Dummy": false,
				"MaxValue": 100,
				"MinValue": 1,
				"Name": "Pineapple Juice",
				"Step": 0,
				"Unit": "ml"
			},
			{
				"Default": 15,
				"Description": "Lemon Juice",
				"Dummy": false,
				"MaxValue": 100,
				"MinValue": 1,
				"Name": "Lemon Juice",
				"Step": 0,
				"Unit": "ml"
			},
			{
				"Default": 15,
				"Description": "Maracuja Juice",
				"Dummy": false,
				"MaxValue": 100,
				"MinValue": 1,
				"Name": "Maracuja Juice",
				"Step": 0,
				"Unit": "ml"
			}
		]
	}
];

module.exports = recipes;