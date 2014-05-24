(function (window, document, console, undefined)
{
	'use strict';
	
	//If EliyaJS is not defined, let's init it
	if( ! window.EliyaJS)
		window.EliyaJS	=	{};

	var REG_EMAIL	=	/^(?!(?:(?:\x22?\x5C[\x00-\x7E]\x22?)|(?:\x22?[^\x5C\x22]\x22?)){255,})(?!(?:(?:\x22?\x5C[\x00-\x7E]\x22?)|(?:\x22?[^\x5C\x22]\x22?)){65,}@)(?:(?:[\x21\x23-\x27\x2A\x2B\x2D\x2F-\x39\x3D\x3F\x5E-\x7E]+)|(?:\x22(?:[\x01-\x08\x0B\x0C\x0E-\x1F\x21\x23-\x5B\x5D-\x7F]|(?:\x5C[\x00-\x7F]))*\x22))(?:\.(?:(?:[\x21\x23-\x27\x2A\x2B\x2D\x2F-\x39\x3D\x3F\x5E-\x7E]+)|(?:\x22(?:[\x01-\x08\x0B\x0C\x0E-\x1F\x21\x23-\x5B\x5D-\x7F]|(?:\x5C[\x00-\x7F]))*\x22)))*@(?:(?:(?!.*[^.]{64,})(?:(?:(?:xn--)?[a-z0-9]+(?:-[a-z0-9]+)*\.){1,126}){1,}(?:(?:[a-z][a-z0-9]*)|(?:(?:xn--)[a-z0-9]+))(?:-[a-z0-9]+)*)|(?:\[(?:(?:IPv6:(?:(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){7})|(?:(?!(?:.*[a-f0-9][:\]]){7,})(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){0,5})?::(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){0,5})?)))|(?:(?:IPv6:(?:(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){5}:)|(?:(?!(?:.*[a-f0-9]:){5,})(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){0,3})?::(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){0,3}:)?)))?(?:(?:25[0-5])|(?:2[0-4][0-9])|(?:1[0-9]{2})|(?:[1-9]?[0-9]))(?:\.(?:(?:25[0-5])|(?:2[0-4][0-9])|(?:1[0-9]{2})|(?:[1-9]?[0-9]))){3}))\]))$/i,
		REG_URL		=	/^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i;

	//Use define() function to define your new module. You can provide as first parameter a list of dependencies.
	define(['CustomEvent'], function (Events) {

		var removeBlank	=	function(str)
		{
			return str.replace(/ /gim, '').replace(/\n/gim, '')
		},

		Form	=	function(id_form, definition)
		{
			var _this			=	this,
				_domElement		=	null,
				_definition		=	definition,

				_is_submitted	=	false,

				_execCheck		=	function(callback, input)
				{
					var error_message	=	null;

					if(typeof callback !== 'function')
					{
						error_message	=	callback.error_message;
						callback		=	callback.rule;
					}

					if( ! callback(input))
					{
						Events.trigger('form.error', _this, [_this, input, error_message]);
						return false;
					}
					return true;
				};

			if(typeof id_form === 'string')
				_domElement	=	document.getElementById(id_form);
			else
				_domElement	=	id_form;

			if( ! _domElement)
			{
				console.warn('EliyaJS.Form('+id_form+') > linked DOM element is not found.');
				return _this;
			}

			if(_domElement.nodeName.toLowerCase() !== 'form')
			{
				console.warn('EliyaJS.Form('+id_form+') > linked DOM element is not a <form>.');
				return _this;
			}

			//Public method
			_this.getDOMElement	=	function()
			{
				return _domElement;
			};

			_this.isSubmitted	=	function()
			{
				return _is_submitted;
			};

			_this.validate	=	function()
			{
				var success	=	true;

				for(var fieldName in _definition)
				{
					var def	=	_definition[fieldName];

					if(def instanceof Array)
					{
						for(var i = 0, l = def.length; i < l; i++)
							success	=	_execCheck(def[i], _domElement[fieldName]) && success;
					}
					else
						success	=	_execCheck(def, _domElement[fieldName]) && success;
				}

				if(success)
					Events.trigger('form.success', _this, [_this, _this.serialize()]);

				_is_submitted	=	false;

				return _this;
			};

			_this.serialize	=	function()
			{
				var params		=	[],
					addParam	=	function(elem, value)
					{
						params.push(elem.name + '=' + encodeURIComponent(value === undefined ? elem.value : value));
					};

				for(var i = 0, l = _domElement.elements.length; i < l; i++)
				{
					var elem	=	_domElement.elements[i];

					switch (elem.nodeName.toLowerCase()) {
						case 'input':
							switch (elem.type.toLowerCase()) {
								case 'text':
								case 'hidden':
								case 'password':
								case 'button':
								case 'reset':
								case 'submit':
									addParam(elem);
									break;
								case 'checkbox':
								case 'radio':
									if (elem.checked)
										addParam(elem);
									break;
							}
							break;
						case 'file': break;
						case 'textarea':
							addParam(elem);
							break;
						case 'select':
							switch (elem.type) {
								case 'select-one':
									addParam(elem);
									break;
								case 'select-multiple':
									for (var j = elem.options.length - 1; j >= 0; j = j - 1)
										if (elem.options[j].selected)
											addParam(elem, elem.options[j].value);
									break;
							}
							break;
						case 'button':
							switch (elem.type) {
								case 'reset':
								case 'submit':
								case 'button':
									if(elem.value !== undefined && elem.name)
										addParam(elem);
								break;
							}
							break;
					}

				}

				return params.join('&');
			};

			//Listen for form submission
			_domElement.addEventListener('submit', function(e)
			{
				e.stopPropagation();
				e.preventDefault();

				if(_is_submitted)
					return;

				_is_submitted	=	true;

				Events.trigger('form.submit', _this, [_this]);

				_this.validate();
			});
		};

		Form.prototype.onSubmit		=	function(callback)
		{
			Events.on('form.submit', this, function(form)
			{
				var _this	=	this;

				if(form === _this)
					callback.call(_this);
			});

			return this;
		};

		Form.prototype.onError		=	function(callback)
		{
			Events.on('form.error', this, function(form, input_error, error_message)
			{
				var _this	=	this;

				if(form === _this)
					callback.call(_this, input_error, error_message);
			});

			return this;
		};

		Form.prototype.onSuccess	=	function(callback)
		{
			Events.on('form.success', this, function(form, data)
			{
				var _this	=	this;

				if(form === _this)
					callback.call(_this, data);
			});

			return this;
		};

		//Static checking methods
		Form.REQUIRED	=	function(input)
		{
			var value	=	input.value;

			if(typeof value === 'string' && removeBlank(value).length === 0)
				return false;

			var emptyValues = [undefined, null, false, 0, '0'];

			for(var i = 0, l = emptyValues.length; i < l; i++)
			{
				if(value === emptyValues[i])
					return false;
			}

			if(value instanceof Array && ! value.length)
				return false;

			return true;
		};

		Form.NUMBER		=	function(input)
		{
			return ! isNaN(input.value);
		};

		Form.EMAIL		=	function(input)
		{
			return REG_EMAIL.test(input.value);
		};

		Form.EMAIL_OR_EMPTY	=	function(input)
		{
			return ! removeBlank(input.value).length || Form.EMAIL(input);
		};

		Form.URL	=	function(input)
		{
			return REG_URL.test(input.value);
		};

		Form.URL_OR_EMPTY	=	function(input)
		{
			return ! removeBlank(input.value).length || Form.URL(input);
		};

		Form.CHECKED		=	function(input)
		{
			return input.checked;
		};

		Form.MIN_LENGTH		=	function(min)
		{
			return function(input)
			{
				return input.value.length >= min;
			};
		};

		Form.MAX_LENGTH		=	function(max)
		{
			return function(input)
			{
				return input.value.length <= max;
			};
		};

		Form.GREATER_THAN	=	function(value)
		{
			return function(input)
			{
				return Form.NUMBER(input) && input.value > value;
			};
		};

		Form.LESS_THAN	=	function(value)
		{
			return function(input)
			{
				return Form.NUMBER(input) && input.value < value;
			};
		};

		Form.BETWEEN	=	function(min, max)
		{
			return function(input)
			{
				return Form.GREATER_THAN(min)(input) && Form.LESS_THAN(max)(input);
			};
		};

		Form.BETWEEN_INCLUSIVE	=	function(min, max)
		{
			return Form.BETWEEN(min - 1, max + 1);
		};

		//Expose new module to EliyaJS
		EliyaJS.Form	=	Form;

		//And return it!
		return Form;
	});

})(window, document, console);