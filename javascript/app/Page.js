(function (window, document, undefined)
{
	'use strict';

	define(['DOM', 'Ajax'], function($, Ajax) {

		var overlay			=	$('overlay'),
			main_content	=	$('main_content'),
			main_title		=	$('main_title'),
			subtitle		=	$('sub_title'),
			error			=	$('error'),
			error_msg		=	$('error_msg');

		return {
			change:	function(hash)
			{
				if( ! hash)
					hash	=	'';

				if(hash.length && hash.charAt(0) === '#')
					hash	=	hash.substr(1);

				$.show(overlay).hide(error);

				Ajax({
					url:	'./views/'+hash,
					success:	function(data)
					{
						main_content.innerHTML	=	data;
					},
					error: function(req)
					{
						$.replaceContent(error_msg, $.text(req.status+' - ' + req.statusText))
						 .empty(main_content)
						 .show(error);

						console.log(req);
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