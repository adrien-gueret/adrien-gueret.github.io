(function (window, document, undefined)
{
	'use strict';
		
	//If EliyaJS is not defined, let's init it
	if( ! window.EliyaJS)
		window.EliyaJS	=	{};
		
	define(function () {
		
		var DOM	=	function (id, ignoreWarning) {
			var elem	=	document.getElementById(id);

			if( ! elem && ! ignoreWarning)
				console.warn('EliyaJS.DOM(id) > element with id "'+id+'" is not found.');

			return elem;
		};
		
		DOM.insertScript	=	function(url, callback)
		{
			var script		=	DOM.create('script');
			script.onload	=	callback;
			script.src		=	url;
			
			return DOM.append(script, document.body);
		};
		
		DOM.text	=	function(textContent)
		{
			return document.createTextNode(textContent);
		};
		
		DOM.create	=	function(tagName, textContent)
		{
			var newTag	=	document.createElement(tagName);
			
			if(textContent)
				DOM.append(DOM.text(textContent), newTag);
				
				return newTag;
		};
			
		DOM.empty	=	function(element)
		{		
			while(element.hasChildNodes()) {
				element.removeChild(element.lastChild);
			}
			
			return DOM;
		};
		
		DOM.remove	=	function(element)
		{		
			element.parentNode.removeChild(element);
			
			return DOM;
		};

		DOM.replaceContent	=	function(element, newContent)
		{
			if(typeof newContent === 'string')
				newContent	=	DOM.text(newContent);

			DOM.empty(element).append(newContent, element);

			return DOM;
		};
			
		DOM.append	=	function(source_element, parent_element)
		{
			if(source_element && parent_element)
				parent_element.appendChild(source_element);

			return DOM;
		};
		
		DOM.prepend	=	function(source_element, parent_element)
		{
			if(parent_element.firstChild)
				DOM.insertBefore(source_element, parent_element.firstChild);
			else
				DOM.append(source_element, parent_element);
				
			return DOM;
		};
		
		DOM.insertBefore	=	function(source_element, target_element)
		{
			if(source_element && target_element)
				target_element.parentNode.insertBefore(source_element, target_element);
				
			return DOM;
		};
		
		DOM.insertAfter	=	function(source_element, target_element)
		{			
			if(target_element.nextSibling)
				DOM.insertBefore(source_element, target_element.nextSibling);
			else
				DOM.append(source_element, target_element.parentNode);
				
			return DOM;
		};

		DOM.insertContentOf	=	function(source_element, target_element)
		{
			while(source_element.hasChildNodes())
				target_element.appendChild(source_element.firstChild);

			return DOM;
		};
		
		DOM.style	=	function(element, properties)
		{
			if(typeof properties === 'string')
			{
				if(properties === 'opacity')
					return DOM.opacity(element);
				else
				{
					if(window.getComputedStyle)
						return window.getComputedStyle(element, null)[properties];
					else
						return element.currentStyle[properties];
				}
			}

			for(var i in properties)
			{
				if(i === 'opacity')
					DOM.opacity(element, i);
				else
					element.style[i]	=	properties[i];
			}

			return DOM;
		};
		
		DOM.hide	=	function(element)
		{
			element.style.display	=	'none';
				
			return DOM;
		};
		
		DOM.show	=	function(element, display)
		{
			element.style.display	=	display === undefined ? 'block' : display;

			return DOM;
		};
		
		DOM.getClasses	=	function(element)
		{
			return element.className.split(' ');
		};
		
		DOM.hasClass	=	function(element, wantedClass)
		{
			if(element.classList)
				return element.classList.contains(wantedClass);
				
			var classes	=	DOM.getClasses(element);
			
			for(var i = 0, l = classes.length; i < l;)
			{
				if(classes[i] === wantedClass)
					return true;
			}
			
			return false;
		};
		
		DOM.addClass	=	function(element, newClass)
		{
			if(element.classList)
				element.classList.add(newClass);
			else if( ! DOM.hasClass(element, newClass))
				element.className	+=	' ' + newClass;
			
			return DOM;
		};
		
		DOM.removeClass	=	function(element, removedClass)
		{
			if(element.classList)
				element.classList.remove(removedClass);
			else
			{
				var	classes			=	DOM.getClasses(element),
						newClasses	=	'';
						
				for(var i = 0, l = classes.length; i < l; i++)
				{
					if(classes[i] !== removeClass)
						newClasses	+=	' ' + classes[i];
				}
				
				element.className	=	newClasses;
			}
			
			return DOM;
		};

		DOM.opacity	=	function(element, opacity)
		{
			var style	=	window.getComputedStyle ? window.getComputedStyle(element, null) : element.currentStyle;

			if(opacity !== undefined)
			{
				if(style.opacity !== undefined)
					element.style.opacity	=	opacity;
				else
					element.style.filter	=	'alpha(opacity='+(opacity * 100)+')';

				return DOM;
			}

			if(style.opacity !== undefined)
				return style.opacity;

			if( ! element.style.filter)
				return undefined;

			var reg		=	/alpha\(opacity=([0-9]+)\)/gim,
				results	=	reg.exec(element.style.filter);

			if (! results)
				return undefined;

			return Math.floor(parseInt(results[1], 10) / 100);
		};

		DOM.fadeOut	=	function(element, delay, callback)
		{
			if( ! delay === undefined)
				delay		=	100;
			else if(typeof delay === 'function')
			{
				callback	=	delay;
				delay		=	100;
			}

			if(callback === undefined)
				callback	=	function(){};

			var opacity	=	DOM.opacity(element) - 0.1;

			DOM.opacity(element, opacity);

			if(opacity <= 0.1)
			{
				DOM.hide(element);
				callback.call(element);
			}
			else
			{
				window.setTimeout(function()
				{
					DOM.fadeOut(element, delay, callback);
				}, delay);
			}
		};

		DOM.fadeIn	=	function(element, delay, display, callback)
		{
			if( ! delay === undefined)
				delay		=	100;
			else
			{
				var type	=	typeof delay;

				if(type === 'string')
				{
					callback	=	display;
					display		=	delay;
					delay		=	100;
				}
				else if(type === 'function')
				{
					callback	=	delay;
					delay		=	100;
				}
			}

			if(callback === undefined)
				callback	=	function(){};

			DOM.show(element, display);

			var opacity	=	DOM.opacity(element) + 0.1;

			if(opacity >= 0.9)
				opacity	=	1;

			DOM.opacity(element, opacity);

			if(opacity < 1)
			{
				window.setTimeout(function()
				{
					DOM.fadeIn(element, delay, display);
				}, delay);
			}
			else
				callback.call(element);
		};

		//Expose new module to EliyaJS
		EliyaJS.DOM	=	DOM;

		//And return it!
		return DOM;		
	});

})(window, document);