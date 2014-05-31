(function (window, document, undefined)
{
	'use strict';

	define(['DOM', 'Ajax'], function($, Ajax) {

		var overlay				=	$('overlay'),
			main_content		=	$('main_content'),
			error				=	$('error'),
			error_msg			=	$('error_msg');

		return {
			destruct: function(callback)
			{
				window.addEventListener('hashchange', function destructCallback()
				{
					callback();
					window.removeEventListener('hashchange', destructCallback);
				});

				return this;
			},
			change:	function(hash, callback)
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

						if(callback)
							callback(main_content);
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

				return this;
			}
		};
	});

})(window, document);