(function (window, document, undefined)
{
	'use strict';
	
	//If EliyaJS is not defined, let's init it
	if( ! window.EliyaJS)
		window.EliyaJS	=	{};
	
	define(function () {

		function Page(once, always)
		{
			var	_this		=	this,
				_initOnce	=	once,
				_initAlways	=	always;

			_this.initOnce	=	function(callback)
			{
				if(callback === undefined)
					return _initOnce;

				_initOnce	=	callback;
				return _this;
			};

			_this.initAlways	=	function(callback)
			{
				if(callback === undefined)
					return _initAlways;

				_initAlways	=	callback;
				return _this;
			};

			_this.exec			=	function()
			{
				_initAlways();

				if(_initOnce)
				{
					_initOnce();
					_initOnce	=	null;
				}

				return _this;
			};
		}

		//Expose new module to EliyaJS
		EliyaJS.Page	=	Page;
		
		return Page;
	});

})(window, document);