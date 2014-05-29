//Main app file: it's a EliyaJS module
(function (window, document, undefined)
{
	'use strict';

	//If EliyaJS is not defined, let's init it
	if( ! window.EliyaJS)
		window.EliyaJS	=	{};

	//Declare dependencies of our app
	define(['Role', 'app/Page'], function (Role, Page) {

		window.addEventListener('hashchange', function(e)
		{
			e.preventDefault();
			e.stopPropagation();

			Page.change(window.location.hash);
		});

		Page.change(window.location.hash);

		Role.define(document.body, 'disabled', function()
		{
			return false;
		});
	});

})(window, document);