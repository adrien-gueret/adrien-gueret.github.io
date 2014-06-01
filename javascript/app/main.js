//Main app file: it's a EliyaJS module
(function (window, document, undefined)
{
	'use strict';

	//If EliyaJS is not defined, let's init it
	if( ! window.EliyaJS)
		window.EliyaJS	=	{};

	//Declare dependencies of our app
	define(['Role', 'app/Page', 'prismjs/init'], function (Role, Page, PrismJSInit) {

		function initPrism(container)
		{
			PrismJSInit(container);
		}

		function doNothing()
		{
			return false;
		}

		window.addEventListener('hashchange', function(e)
		{
			e.preventDefault();
			e.stopPropagation();

			Page.change(window.location.hash, initPrism);
		});

		Page.change(window.location.hash, initPrism);

		Role.define(document.body, 'disabled', doNothing);
		Role.define(document.body, 'active', doNothing);
	});

})(window, document);