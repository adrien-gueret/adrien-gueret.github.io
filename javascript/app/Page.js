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

						//Execute inline JS tag (with src attributes only)
						var scripts	=	main_content.getElementsByTagName('script'), src, script;

						for(var i = 0, l = scripts.length; i < l; i++)
						{
							if(scripts[i].src)
							{
								src		=	scripts[i].getAttribute('src');
								script	=	$.remove(scripts[i]).create('script');
								script.setAttribute('src', src);
								$.append(script, document.body);
							}
						}
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