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
			change:	function(hash, callback, context)
			{
				var Page	=	this;

				context		=	context || main_content;

				if( ! hash)
					hash	=	'';

				if(hash.length && hash.charAt(0) === '#')
					hash	=	hash.substr(1);

				$.show(overlay).hide(error);

				Ajax({
					url:	'./views/'+hash,
					success:	function(data)
					{
						context.innerHTML	=	data;

						//Check for include instructions
						var includes	=	context.querySelectorAll('[data-include]');

						for(var i = 0, l = includes.length; i < l; i++)
							Page.change(includes[i].getAttribute('data-include'), null, includes[i]);

						//Execute inline JS tag (with src attributes only)
						var scripts	=	context.getElementsByTagName('script'), src, script;

						for(var i = 0, l = scripts.length; i < l; i++)
						{
							if(scripts[i].src)
							{
								src		=	scripts[i].getAttribute('src');
								script	=	$.remove(scripts[i]).create('script');
								script.setAttribute('src', src);
								$.append(script, document.body);

								Page.destruct(function()
								{
									$.remove(script);
								});
							}
						}

						if(callback)
							callback(context);

						if(window.scrollTo)
							window.scrollTo(0, 0);
					},
					error: function(req)
					{
						$.replaceContent(error_msg, $.text(req.status+' - ' + req.statusText))
						 .empty(context)
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