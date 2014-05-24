(function (window, document, undefined)
{
	'use strict';

	define(['DOM', 'Ajax'], function($, Ajax) {

		var overlay			=	$('overlay'),
			main_content	=	$('main_content'),
			main_title		=	$('main_title'),
			subtitle		=	$('sub_title');

		return {
			change:	function(hash)
			{
				if( ! hash)
					hash	=	'';

				if(hash.length && hash.charAt(0) === '#')
					hash	=	hash.substr(1);

				$.show(overlay);

				Ajax({
					url:	'./views/'+hash,
					success:	function(data)
					{
						main_content.innerHTML	=	data;
					},
					complete:	function()
					{
						$.hide(overlay);
					}
				});
			}
		};
	});

})(window, document);