(function (window, document, console, undefined)
{
	'use strict';
	
	//If EliyaJS is not defined, let's init it
	if( ! window.EliyaJS)
		window.EliyaJS	=	{};
	
	define(function () {
		var	_events		=	{},
			_last_id	= 0,

			_removeSpecificCallback	=	function(eventObject, callback)
			{
				for(var i = 0, l = eventObject.callbacks.length; i < l; i++)
				{
					if(eventObject.callbacks[i] === callback)
					{
						eventObject.callbacks.splice(i, 1);
						break;
					}
				}
			},
		
		CustomEvent	=
		{	
			on	:	function(eventName, object, callback)
			{
				if( ! _events[eventName])
					_events[eventName]	=	{};

				//If signature is on(eventName, callback)
				if( ! callback)
				{
					callback	=	object;
					object		=	document.body;
				}

				if( ! object['data-custom-events-id'])
					object['data-custom-events-id']	=	'_custom_event_' + (++_last_id);
										
				var id	=	object['data-custom-events-id'];
				
				if( ! _events[eventName][id])
					_events[eventName][id]	=	{callbacks: [], object: object};
					
				_events[eventName][id].callbacks.push(callback);

				return CustomEvent;
			},
			
			off	:	function(eventName, object, callbackToRemove)
			{
				if( ! _events[eventName])
				{
					console.warn('EliyaJS.CustomEvent.off() > try to removing event "'+eventName+'" which is not binded.');
					return;
				}
				
				if(object)
				{
					if( ! object['data-custom-events-id'])
					{
						console.warn('EliyaJS.CustomEvent.off() > try to removing a custom event "'+eventName+'" to a non-binded object.');
						return;
					}
					
					var id	=	object['data-custom-events-id'];
					
					if( ! _events[eventName][id])
					{
						console.warn('EliyaJS.CustomEvent.off() > try to removing event "'+eventName+'" which is not binded to given element.');
						return;
					}

					if(callbackToRemove)
						_removeSpecificCallback(_events[eventName][id], callbackToRemove);
					else
						delete _events[eventName][id];
				}
				else
				{
					if(callbackToRemove)
						for(var id_object in _events[eventName])
							_removeSpecificCallback(_events[eventName][id_object], callbackToRemove);
					else
						delete _events[eventName];
				}

				return CustomEvent;
			},
			
			
			//.trigger(eventName)
			//.trigger(eventName, params)
			//.trigger(eventName, object)
			//.trigger(eventName, object, params)
			trigger	:	function(eventName, object, params)
			{
				if( ! _events[eventName])
					return CustomEvent;
					
				//Check signature
				if( ! object || object instanceof Array)
				{
					//First or second signature
					params	=	object ? object : [];
					
					for(var id_object in _events[eventName])
					{
						for(var i = 0, l = _events[eventName][id_object].callbacks.length; i < l; i++)
							_events[eventName][id_object].callbacks[i].apply(_events[eventName][id_object].object, params);
					}
				}
				else
				{
					//Third or fourth signature
					params	=	params || [];
					
					if( ! object['data-custom-events-id'])
					{
						console.warn('EliyaJS.CustomEvent.trigger() > try to fire a custom event "'+eventName+'" to a non-binded object.');
						return CustomEvent;
					}
					
					var id	=	object['data-custom-events-id'];
					
					if( ! _events[eventName][id])
					{
						console.warn('EliyaJS.CustomEvent.trigger() > try to fire event "'+eventName+'" which is not binded to given element.');
						return CustomEvent;
					}
					
					for(var i = 0, l = _events[eventName][id].callbacks.length; i < l; i++)
						_events[eventName][id].callbacks[i].apply(_events[eventName][id].object, params);
				}
				return CustomEvent;
			}
		};
		
		//Expose new module to EliyaJS
		EliyaJS.CustomEvent	=	CustomEvent;
		
		return CustomEvent;
	});

})(window, document, console);