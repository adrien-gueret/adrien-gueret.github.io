(function (window, document, undefined)
{
	'use strict';
	
	//If EliyaJS is not defined, let's init it
	if( ! window.EliyaJS)
		window.EliyaJS	=	{};

	//Define here some private variables/functions
	var	myVariable	=	'myValue';

	//Use define() function to define your new module. You can provide as first parameter a list of dependencies.
	define(/*['DOM'],*/function () {

		//Define your new module here (could be a function, a JS object... What you want!)
		var myNewModule	=	function(){};
		
		//Do what you want here
		
		//Expose new module to EliyaJS
		EliyaJS.myNewModule	=	myNewModule;

		//And return it!
		return myNewModule;
	});

})(window, document);