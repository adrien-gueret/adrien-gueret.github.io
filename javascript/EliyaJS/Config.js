(function (window, document, undefined)
{
	'use strict';
	
	//If EliyaJS is not defined, let's init it
	if( ! window.EliyaJS)
		window.EliyaJS	=	{};
	
	var	MAIN_APP_CONFIG_ID	=	'mainAppConfig',
			_configs		=	{};
	
	define(function () {
		var Config	=	function(namespace, prop)
		{
			if( ! _configs[namespace])
			{
				var script	=	document.getElementById(namespace);
				
				if( ! script)
					throw new Error('EliyaJS.Config(namespace, prop) > namespace "'+namespace+'" does not exist.');
				
				_configs[namespace]	=	JSON.parse(script.textContent);
			}
			
			if( ! prop)
				return _configs[namespace];
			else
				return _configs[namespace][prop];
		};
		
		//Try getting main app config if exists
		try
		{
			var mainConfig	=	Config(MAIN_APP_CONFIG_ID);
			_configs[MAIN_APP_CONFIG_ID]	=	mainConfig;
			
			for(var prop in mainConfig)
			{
				if(Config[prop])
					console.warn('Can\'t add property "'+prop+'" to EliyaJS.Config: it already exists and can\'t be erased.');
				else
					Config[prop]	=	mainConfig[prop];
			}
		}
		catch(e){}

		Config.clearCache	=	function(namespace)
		{
			if( ! namespace)
				_configs	=	{};
			else
				delete _configs[namespace];

			return Config;
		};
		
		//Expose new module to EliyaJS
		EliyaJS.Config	=	Config;
		
		return Config;
	});

})(window, document);