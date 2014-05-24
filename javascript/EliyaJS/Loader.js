(function (window, document, console, Date, undefined)
{
	'use strict';
	
	//If EliyaJS is not defined, let's init it
	if( ! window.EliyaJS)
		window.EliyaJS	=	{};

	//ie8 compat https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/now
	if ( ! Date.now)
	{
		Date.now = function()
		{
			return new Date().getTime();
		};
	}

	var MIN_DURATION	=	500,
		MAX_DURATION	=	15000; //ms

	//Use define() function to define your new module. You can provide as first parameter a list of dependencies.
	define(['CustomEvent', 'DOM'], function (Events, $) {

		var Loader	=	function(id_loader, min_duration, max_duration)
		{
			var _this 				=	this,
				_min_duration		=	0,
				_max_duration		=	0,
				_max_duration_clock	=	null,
				_is_started			=	false,
				_domElement			=	null,
				_progress			= 	0,
				_images_src			=	[],
				_callbacks			=	[],
				_total				=	0,
				_start_time			=	0,
				_progress_counters_dom	=	[],

				_reinit				=	function()
				{
					_is_started	=	false;
					_progress	=	0;
					_total		=	0;
					_start_time	=	0;
					_images_src.length	=	0;
					_callbacks.length	=	0;
					_progress_counters_dom	=	[];
				},

				_updatePercentElems	=	function()
				{
					var percent	=	_this.getPercentProgress();

					for(var i = 0, l = _progress_counters_dom.length; i < l; i++)
						$.replaceContent(_progress_counters_dom[i], $.text(percent));
				},

				_loadElement		=	function()
				{
					_progress++;

					_updatePercentElems();

					if(_progress >= _total)
						_this.stop();
					else
						Events.trigger('loader.progress', [_this]);
				};

			if(typeof id_loader === 'string')
				_domElement	=	$(id_loader);
			else
				_domElement	=	id_loader;

			if( ! _domElement)
				console.warn('EliyaJS.Loader('+id_loader+') > linked DOM element is not found.');
			else
				$.addClass(_domElement, 'loader');

			this.stop	=	function()
			{
				if( ! _is_started)
					return this;

				if(_max_duration_clock)
					window.clearTimeout(_max_duration_clock);

				_max_duration_clock	=	null;

				var loading_duration	=	Date.now() - _start_time;

				if(loading_duration >= _min_duration)
				{
					Events.trigger('loader.progress', [_this]);

					window.setTimeout(function()
					{
						_reinit();
						Events.trigger('loader.end', [_this]);
					}, 500); //Wait at least 500ms in order to see the 100%
				}
				else
				{
					_progress	=	_total;
					_updatePercentElems();
					Events.trigger('loader.progress', [_this]);

					window.setTimeout(function()
					{
						_reinit();
						Events.trigger('loader.end', [_this]);
					}, _min_duration - loading_duration);
				}

				return _this;
			};

			this.getDOMElement	=	function()
			{
				return _domElement;
			};

			this.minDuration		=	function(newValue)
			{
				if(newValue === undefined)
					return _min_duration;

				if(newValue > _max_duration)
				{
					_min_duration	=	_max_duration;
					_max_duration	=	newValue;
				}
				else
					_min_duration	=	newValue;

				return this;
			};

			this.maxDuration		=	function(newValue)
			{
				if(newValue === undefined)
					return _max_duration;

				if(newValue < _min_duration)
				{
					_max_duration	=	_min_duration;
					_min_duration	=	newValue;
				}
				else
					_max_duration	=	newValue;

				return this;
			};

			this.getTotalToReach	=	function()
			{
				return _total;
			};

			this.getProgress	=	function()
			{
				return _progress;
			};

			this.getPercentProgress	=	function()
			{
				if(_total > 0)
					return Math.floor((_progress * 100) / _total);

				return 100;
			};

			this.isStarted	=	function()
			{
				return _is_started;
			};

			this.start	=	function()
			{
				if(_is_started)
				{
					console.warn('EliyaJS.Loader.start() > this loader is already started.');
					return this;
				}

				_max_duration_clock	=	window.setTimeout(function()
				{
					console.warn('EliyaJS.Loader > Max duration ('+_max_duration+'ms) reached, forcing loader to stop.');
					_this.stop();
				}, _max_duration);

				$.show(_domElement).opacity(_domElement, 1);

				_progress_counters_dom	=	_domElement.querySelectorAll('[data-role="loader-progress"]');

				_start_time	=	Date.now();

				_is_started	=	true;

				_updatePercentElems();

				Events.trigger('loader.start', [this]);

				if( ! _images_src.length && ! _callbacks.length)
				{
					_loadElement();
					return this;
				}

				for(var i = 0, l = _images_src.length; i < l; i++)
				{
					var image	=	new Image();
					image.src	=	_images_src[i];

					if(image.complete)
						_loadElement();
					else
						image.onload	=	_loadElement;
				}

				for(i = 0, l = _callbacks.length; i < l; i++)
					_callbacks[i].call(_this, _loadElement);

				return this;
			};

			this.updateDescription	=	function(message)
			{
				var descriptions	=	_domElement.querySelectorAll('[data-role="loader-description"]');

				for(var i = 0, l = descriptions.length; i < l; i++)
					$.replaceContent(descriptions[i], message);

				return this;
			};

			this.addImages	=	function(images_src)
			{
				if( ! images_src.length)
				{
					console.warn('EliyaJS.Loader.addImages(images_src) > given array is empty.');
					return this;
				}

				_total	+=	images_src.length;

				_images_src	=	_images_src.concat(images_src);

				return this;
			};

			this.addCallbacks	=	function(callbacks)
			{
				if( ! callbacks.length)
				{
					console.warn('EliyaJS.Loader.addCallbacks(callbacks) > given array is empty.');
					return this;
				}

				_total	+=	callbacks.length;

				_callbacks	=	_callbacks.concat(callbacks);

				return this;
			};

			//And init loader!

			this.maxDuration(max_duration === undefined ? MAX_DURATION : max_duration)
				.minDuration(min_duration === undefined ? MIN_DURATION : min_duration);
		};

		Loader.prototype.onStart	=	function(callback, justNextEvent)
		{
			Events.on('loader.start', this, function onStartCallback(loader)
			{
				var _this	=	this;
				if(loader === _this)
				{
					if(justNextEvent)
						Events.off('loader.start', this, onStartCallback);

					callback.call(loader);
				}
			});

			return this;
		};

		Loader.prototype.onProgress	=	function(callback, justNextEvents)
		{
			Events.on('loader.progress', this, function onProgressCallback(loader)
			{
				var _this	=	this;
				if(loader === _this)
				{
					if(justNextEvents)
						Events.off('loader.progress', this, onProgressCallback);

					callback.call(loader);
				}
			});

			return this;
		};

		Loader.prototype.onEnd	=	function(callback, justNextEvent)
		{
			Events.on('loader.end', this, function onEndCallback(loader)
			{
				var _this	=	this;
				if(loader === _this)
				{
					if(justNextEvent)
						Events.off('loader.end', this, onEndCallback);

					callback.call(loader);
				}
			});

			return this;
		};

		Loader.prototype.onNextStart	=	function(callback)
		{
			return this.onStart(callback, true);
		};

		Loader.prototype.onNextProgress	=	function(callback)
		{
			return this.onProgress(callback, true);
		};

		Loader.prototype.onNextEnd	=	function(callback)
		{
			return this.onEnd(callback, true);
		};

		//Expose new module to EliyaJS
		EliyaJS.Loader	=	Loader;

		//And return it!
		return Loader;
	});

})(window, document, console, Date);