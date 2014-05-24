(function (window, document, console, undefined)
{
	'use strict';
	
	//If EliyaJS is not defined, let's init it
	if( ! window.EliyaJS)
		window.EliyaJS	=	{};

	define(['Role', 'CustomEvent', 'DOM'], function (Role, Events, $) {

		var Dialog	=	function(id_dialog, id_overlay)
		{
			var _this 		=	this,
				_domElement	=	null,
				_domOverlay	=	null;

			if(typeof id_dialog === 'string')
				_domElement	=	$(id_dialog);
			else
				_domElement	=	id_dialog;

			if( ! _domElement)
				console.warn('EliyaJS.Dialog('+id_dialog+') > linked DOM element is not found.');
			else
			{
				$.addClass(_domElement, 'dialog');

				Role.define(_domElement, 'dialog.close', function()
				{
					_this.close();
				});
			}

			if(id_overlay)
			{
				if(typeof id_overlay === 'string')
					_domOverlay	=	$(id_overlay);
				else
					_domOverlay	=	id_overlay;

				if( ! _domOverlay)
					console.warn('EliyaJS.Dialog('+id_dialog+', '+id_overlay+') > linked overlay element is not found.');
				else
					$.addClass(_domOverlay, 'modal_overlay');
			}
			else
			{
				_domOverlay	= $.create('div');
				$.addClass(_domOverlay, 'modal_overlay');
			}

			$.append(_domOverlay, document.body).append(_domElement, document.body);

			this.getDOMElement	=	function()
			{
				return _domElement;
			};

			this.getDOMOverlay	=	function()
			{
				return _domOverlay;
			};
			
			window.addEventListener('resize', function()
			{
				_this.center();
			});
		};

		Dialog.prototype.open	=	function()
		{
			$.show(this.getDOMElement());

			this.center();

			Events.trigger('dialog.open', [this]);

			return this;
		};

		Dialog.prototype.modal	=	function()
		{
			$.show(this.getDOMElement())
			 .show(this.getDOMOverlay());

			this.center();

			Events.trigger('dialog.open', [this]);

			return this;
		};

		Dialog.prototype.close	=	function()
		{
			$.hide(this.getDOMElement()).hide(this.getDOMOverlay());

			Events.trigger('dialog.close', [this]);

			return this;
		};

		Dialog.prototype.onOpen	=	function(callback)
		{
			Events.on('dialog.open', this, function(dialog)
			{
				var _this	=	this;
				if(dialog === _this)
					callback.call(dialog);
			});

			return this;
		};

		Dialog.prototype.onClose	=	function(callback)
		{
			Events.on('dialog.close', this, function(dialog)
			{
				var _this	=	this;
				if(dialog === _this)
					callback.call(dialog);
			});

			return this;
		};

		Dialog.prototype.center	=	function()
		{
			var elem	=	this.getDOMElement();

			if(elem.style.display === 'none')
				return this;

			$.style(elem, {
				top	:	(window.innerHeight / 2 - parseInt($.style(elem, 'height'), 10) / 2) + 'px',
				left:	(window.innerWidth / 2 - parseInt($.style(elem, 'width'), 10) / 2) + 'px'
			});

			return this;
		};
		
		//Expose new module to EliyaJS
		EliyaJS.Dialog	=	Dialog;

		//And return it!
		return Dialog;
	});

})(window, document, console);