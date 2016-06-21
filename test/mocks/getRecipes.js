/**
 * Created by Thomas on 18.09.2015.
 * Rewritten by Dominik on 20.06.2016
 */
var recipes = [
	{
		"description": "This recipe lets the XTS transport and block/unblock on 3 different stations",
		"dummy": false,
		"name": "XTS Test Recipe",
		"recipeId": 10010,
		"userparameters": []
	},
	{
		"description": "Execution of  skill 1337 for Simulation Testing",
		"dummy": false,
		"name": "Simulation module Task",
		"recipeId": 10011,
		"userparameters": [
			{
				"Default": 0.5,
				"Description": "Simulation blinking frequency",
				"Dummy": false,
				"MaxValue": 50,
				"MinValue": 0,
				"Name": "Production Frequenz",
				"Step": 1,
				"Unit": "HZ"
			},
			{
				"Default": 0,
				"Description": "Do you want a manual Output?",
				"Dummy": false,
				"MaxValue": 1,
				"MinValue": 0,
				"Name": "Topping",
				"Step": 1,
				"Unit": "Disabled, Enabled"
			}
		]
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
		"description": "One Single Transport",
		"dummy": false,
		"name": "XTS one Round",
		"recipeId": 10001,
		"userparameters": []
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
		"description": "Double Cookie with additional Simulation Step",
		"dummy": false,
		"name": "Double Cookie + Simulation",
		"recipeId": 10019,
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
			},
			{
				"Default": 3,
				"Description": "Choose the blinking frequency of simulation module",
				"Dummy": false,
				"MaxValue": 20,
				"MinValue": 0.1,
				"Name": "Virtual Module Frequency",
				"Step": 0.1,
				"Unit": "HZ"
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
			},
			{
				"Default": 0,
				"Description": "Identifier assignment / Barcode",
				"Dummy": false,
				"MaxValue": 1,
				"MinValue": 0,
				"Name": "Identifier assignment / Barcode",
				"Step": 0,
				"Unit": "True/False, 1/0"
			}
		]
	},
	{
		"description": "A fruit explosion in your mouth",
		"dummy": false,
		"name": "911 Targa",
		"recipeId": 10053,
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
		"description": "Flavoursome cocktail painting a picture of a beautiful summer day",
		"dummy": false,
		"name": "Summerday",
		"recipeId": 10055,
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
				"Description": "Strawberry",
				"Dummy": false,
				"MaxValue": 100,
				"MinValue": 1,
				"Name": "Strawberry",
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
		"description": "Contrastful arrangement of sweet syrup and sour juice",
		"dummy": false,
		"name": "Blue Sunrise",
		"recipeId": 10056,
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
		"description": "Remember spring feelings in autumn",
		"dummy": false,
		"name": "Green Five",
		"recipeId": 10057,
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
		"description": "Juicy cocktail with a lot of rum",
		"dummy": false,
		"name": "Hurricane",
		"recipeId": 10062,
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
				"Default": 35,
				"Description": "Water",
				"Dummy": false,
				"MaxValue": 100,
				"MinValue": 1,
				"Name": "Water",
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
				"Default": 10,
				"Description": "Maracuja Juice",
				"Dummy": false,
				"MaxValue": 100,
				"MinValue": 1,
				"Name": "Maracuja Juice",
				"Step": 0,
				"Unit": "ml"
			}
		]
	},
	{
		"description": "A fruit explosion in your mouth",
		"dummy": false,
		"name": "911 Targa",
		"recipeId": 10153,
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
		"description": "Flavoursome cocktail with some special fluid from Havanna",
		"dummy": false,
		"name": "Summernight",
		"recipeId": 10060,
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
				"Description": "Strawberry",
				"Dummy": false,
				"MaxValue": 100,
				"MinValue": 1,
				"Name": "Strawberry",
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
				"Description": "Water",
				"Dummy": false,
				"MaxValue": 100,
				"MinValue": 1,
				"Name": "Water",
				"Step": 0,
				"Unit": "ml"
			}
		]
	},
	{
		"description": "Caribbean Cocktail with a fine shot of grenadine syrup",
		"dummy": false,
		"name": "PlanterÂ´s Punch ",
		"recipeId": 10061,
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
				"Description": "Water",
				"Dummy": false,
				"MaxValue": 100,
				"MinValue": 1,
				"Name": "Water",
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
				"Description": "Strawberry",
				"Dummy": false,
				"MaxValue": 100,
				"MinValue": 1,
				"Name": "Strawberry",
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
		"description": "Flavoursome cocktail with some special fluid from Havanna",
		"dummy": false,
		"name": "Summernight _ Barcode",
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
				"Description": "Strawberry",
				"Dummy": false,
				"MaxValue": 100,
				"MinValue": 1,
				"Name": "Strawberry",
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
				"Description": "Water",
				"Dummy": false,
				"MaxValue": 100,
				"MinValue": 1,
				"Name": "Water",
				"Step": 0,
				"Unit": "ml"
			}
		]
	},
	{
		"description": "Caribbean Cocktail with a fine shot of grenadine syrup",
		"dummy": false,
		"name": "PlanterÂ´s Punch - Barcode ",
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
				"Description": "Water",
				"Dummy": false,
				"MaxValue": 100,
				"MinValue": 1,
				"Name": "Water",
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
				"Default": 35,
				"Description": "Water",
				"Dummy": false,
				"MaxValue": 100,
				"MinValue": 1,
				"Name": "Water",
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
				"Default": 10,
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