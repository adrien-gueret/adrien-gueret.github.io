(function (window, document, console, undefined)
{
	'use strict';

	//If EliyaJS is not defined, let's init it
	if( ! window.EliyaJS)
		window.EliyaJS	=	{};

	//Use define() function to define your new module. You can provide as first parameter a list of dependencies.
	define(['Ajax', 'Role', 'Loader', 'Page'], function (Ajax, Role) {

		var	$					=	EliyaJS.DOM,
			Events				=	EliyaJS.CustomEvent,

		App		=	function(basePath, idMainContainer)
		{
			//== Private properties
			var	_this				=	this,
				_mainLoader			=	null,
				_subLoader			=	null,
				_mainContainer		=	$(idMainContainer),
				_firstLoaderCall	=	true,
				_busy				=	false,
				_resolved_content	=	{};

			//== Public methods
			_this.mainLoader	=	function(loader)
			{
				if(loader === undefined)
					return _mainLoader;

				_mainLoader	=	loader;
				return _this;
			};

			_this.subLoader	=	function(loader)
			{
				if(loader === undefined)
					return _subLoader;

				_subLoader	=	loader;
				return _this;
			};

			_this.getLoader	=	function(forced_loader)
			{
				switch(forced_loader)
				{
					case App.MAIN_LOADER:
						return _mainLoader;

					case App.SUB_LOADER:
						return _subLoader;

					default:
						if(_firstLoaderCall)
						{
							_firstLoaderCall	=	false;
							return _mainLoader ? _mainLoader : _subLoader;
						}
						return _subLoader;

				}
			};

			_this.addResolveContent	=	function(pageName, data)
			{
				_resolved_content[pageName]	=	data;
				return _this;
			};

			_this.resolve	=	function(pageName)
			{
				var data	=	_resolved_content[pageName];

				if( ! data)
				{
					if(data === undefined)
						console.warn('EliyaJS.App.resolve(pageName) > "'+pageName+'" is not found and can\'t be resolved.');

					return _this;
				}

				data.target.innerHTML	=	data.content;

				if(data.title)
					document.title	=	data.title;

				if(data.description)
				{
					var meta	=	document.querySelector('meta[name="description"]');

					if( ! meta)
					{
						meta	= $.create('meta');
						meta.setAttribute('name', 'description');
						$.append(meta, document.head);
					}

					meta.setAttribute('content', data.description);
				}

				Events.trigger('app.page.resolved', _this, [data]);

				_resolved_content[pageName] = false;

				return _this;
			};

			_this.getBasePath	=	function()
			{
				return basePath;
			};

			_this.getMainContainer	=	function()
			{
				return _mainContainer;
			};

			_this.busy	=	function(busy)
			{
				if(busy === undefined)
				{
					var mainLoader	=	_this.mainLoader(),
						subLoader	=	_this.subLoader(),
						mainIsBusy	=	mainLoader && mainLoader.isStarted(),
						subIsBusy	=	subLoader && subLoader.isStarted();

					return _busy || mainIsBusy || subIsBusy;
				}

				_busy	=	busy;
				return this;
			};

			//Define role for links
			Role.define(document.body, 'app.link', function(){
				var target	=	this.hasAttribute('data-target') ? $(this.getAttribute('data-target')) : _mainContainer;

				if(this.href !== window.location.href)
					_this.getPage(this.href, target);
			});

			//Handle history API
			if(window.history)
			{
				window.addEventListener('popstate', function(e)
				{
					if(e.state)
						_this.getPage(e.state.url, $(e.state.target_id), false);
				});
			}

		};

		App.MAIN_LOADER		=	'main_loader';
		App.SUB_LOADER		=	'sub_loader';

		App.prototype.exec	=	function(pageName)
		{
			if(pageName)
			{
				var	_this	=	this;

				require([_this.getBasePath() + pageName], function(page)
				{
					page.exec();
				});
			}

			return _this;
		};

		App.prototype.getPage	=	function(url, target, updateHistory)
		{
			if(this.busy())
				return this;

			updateHistory	=	updateHistory === undefined ? true : updateHistory;

			var	_this	=	this;

			_this.busy(true);

			Events.trigger('app.page.get', _this, [url, target]);

			Ajax({
				url		:	url,
				method	:	'get',
				success	:	function(response, xhr)
				{
					updateHistory	=	updateHistory && window.history && target === _this.getMainContainer() && target.id

					var js_page_name	=	xhr.getResponseHeader('js_page_name'),
						data			=	{
							target:			target,
							content:		response,
							title:			xhr.getResponseHeader('document_title'),
							description:	xhr.getResponseHeader('document_description')
						};

					if(js_page_name)
					{
						if(updateHistory)
							window.history.pushState({url: url, target_id: target.id}, js_page_name, url);

						_this.addResolveContent(js_page_name, data);
						_this.exec(js_page_name);
					}
					else
					{
						if(updateHistory)
							window.history.pushState({url: url, target_id: target.id}, url, url);

						_this.addResolveContent(url, data).resolve(url);
					}

					Events.trigger('app.page.gotten', _this, [url, target]);
				},
				error	:	function(xhr)
				{

				},
				abort	:	function(xhr)
				{

				},
				complete	:	function()
				{
					_this.busy(false);
				}
			});

			return _this;
		};

		//Expose new module to EliyaJS
		EliyaJS.App	=	App;

		//And return it!
		return App;
	});

})(window, document, console);