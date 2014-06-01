(function (window, document, undefined) {
	'use strict';

	require(['Role'], function(Role)
	{
		var menus	=	document.querySelectorAll('[data-role="menu"]');

		for(var i = 0, l = menus.length; i < l; i++)
		{
			var links	=	menus[i].getElementsByTagName('a');

			for(var j = 0, l2 = links.length; j < l2; j++)
			{
				if(links[j].href === window.location.href)
					Role.add(links[j], 'active');
				else
					Role.remove(links[j], 'active');
			}
		}
	});

})(window, document);