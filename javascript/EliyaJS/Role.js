(function (window, document, undefined)
{
	'use strict';
	
	//If EliyaJS is not defined, let's init it
	if( ! window.EliyaJS)
		window.EliyaJS	=	{};

	//Define here some private variables/functions

	//Use define() function to define your new module. You can provide as first parameter a list of dependencies.
	define(function () {

		var	_define	=	function(dom_context, roleName, callback)
			{
				dom_context.addEventListener('click', function(e)
				{
					var elem			=	e.target,
						elementWithRole	=	Role.has(elem, roleName);

					if(elementWithRole)
					{
						callback.call(elementWithRole);
						e.preventDefault();
					}
				});
			},

		Role	=	{
			get	:	function(element)
			{
				if( ! element.hasAttribute || ! element.hasAttribute('data-role'))
					return  [];

				return element.getAttribute('data-role').replace(/ /g, '').split(',');
			},
			has	:	function(element, roleName)
			{
				var roles	=	Role.get(element);

				for(var i = 0, l = roles.length; i < l; i++)
				{
					if(roles[i] === roleName)
						return element;
				}

				if(element.parentNode)
					return Role.has(element.parentNode, roleName);

				return false;
			},
			define	:	function(dom_context, roleName, callback)
			{
				if(callback)
					_define(dom_context, roleName, callback);
				else
				{
					//Second signature
					for(var i in roleName)
						_define(dom_context, i, roleName[i]);
				}

				return Role;
			}
		};
		
		//Expose new module to EliyaJS
		EliyaJS.Role	=	Role;

		//And return it!
		return Role;
	});

})(window, document);