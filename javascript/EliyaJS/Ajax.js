(function (window, document, undefined)
{
	'use strict';
	
	//If EliyaJS is not defined, let's init it
	if( ! window.EliyaJS)
		window.EliyaJS	=	{};

	define(function () {

		var forEach	=	function(collection, callback)
		{
			var index	=	'',
				length	=	0,

				performCallback = function (index)
				{
					callback.call(collection[index].valueOf(), index);
				};

			if(collection instanceof Array || collection instanceof window.NodeList)
			{
				length	=	collection.length;

				for(index = 0; index < length; index++)
					performCallback(index);

			}
			else
				for (index in collection)
					if (collection.hasOwnProperty(index))
						performCallback(index);
		},

		objectToStringData = function (index, value, prefix) {
			index = prefix === undefined ? index : prefix + '[' + index + ']';

			if (typeof value.valueOf() == 'object')
			{
				var d = '';

				forEach(value, function (i)
				{
					d += objectToStringData(i, this, index);
				});

				return d;
			}
			else
				return index + '=' + value + '&';
		},

		_prefilters	=	[],

		Ajax	=	function (options)
		{
			///  'url': URL to call. (required),<br />
			///  'async': Boolean indicating if request must be asynchronous (true) or synchronous (false). Default: true,<br />
			///  'type': 'GET' or 'POST'. Default: 'GET',<br />
			///  'dataType': Type of data to receive from server: 'TEXT', 'XML' or 'JSON'. Default: 'TEXT',<br />
			///  'data': Object containing values to send to the server. Default: {},<br />
			///  'cached': If false, a cache breaker will be added. Default: false,<br />
			///	 'historyState': Object containing some data to store as History state. If false, History is not modified. Default: false,
			///  'abort': function () { Function called if request is aborted },<br />
			///  'error': function () { Function called if an errors occurs },<br />
			///  'success': function () { Function called when the request is successfully finished }<br />
			///  'complete': function () { Function called after request is finished, after error() or success() }<br />

			var req	=	window.XMLHttpRequest ? new XMLHttpRequest() : new window.ActiveXObject('Microsoft.XMLHTTP'),
				defaults	=
				{
					url: './',
					async: true,
					historyState: false,
					cached: false,
					type: 'GET',
					dataType: 'TEXT',
					data: {},
					abort: function () {},
					error: function () {},
					success: function () {},
					complete: function () {}
				},
				data	=	'',
				isPost;

			//Merge defaults with given options
			forEach(defaults, function (i)
			{
				if (options[i] === undefined)
					options[i]	=	defaults[i];
			});

			options.dataType	=	options.dataType.toUpperCase();

			if(req)
			{
				//Format datas
				forEach(options.data, function (i)
				{
					data += objectToStringData(i, this);
				});

				options.data	=	data.substr(0, data.length - 1);

				for(var i = 0, l = _prefilters.length; i < l; i++)
					_prefilters[i](options);

				isPost	=	options.type.toUpperCase() === 'POST';

				var url	=	options.url + (isPost ? '' : '?' + options.data);

				req.onreadystatechange	=	function ()
				{
					//Only if req is "loaded"
					if (req.readyState == 4) {

						var ok	=	true;

						//Only if "OK"
						if (req.status == 200 || req.status == 304)
						{
							options.success(options.dataType == 'JSON' ? JSON.parse(req.responseText)
								: (options.dataType == 'XML' ? req.responseXML
								: req.responseText), req);

							if(options.historyState && window.history && window.history.pushState)
							{
								if( ! options.historyState.url)
									options.historyState.url	=	url;

								window.history.pushState(options.historyState, options.historyState.url, options.historyState.url);
							}
						}
						else
						{
							ok	=	false;
							options.error(req);
						}
						options.complete(req, ok);
					}
				};

				if(options.cached === false)
				{
					var cache_breaker	=	(new Date()).getTime();

					if(isPost)
						url	+=	'?' + cache_breaker;
					else
						url	+=	'&' + cache_breaker;
				}

				req.open(options.type, url, options.async);

				//Indicating that request is from an Ajax call
				req.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

				if (isPost)
					req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

				req.send(isPost ? options.data : null);
			}
			else
				options.abort();
		};

		Ajax.prefilter	=	function(callback)
		{
			_prefilters.push(callback);
			return Ajax;
		};
		
		//Expose new module to EliyaJS
		EliyaJS.Ajax	=	Ajax;

		//And return it!
		return Ajax;
	});

})(window, document);