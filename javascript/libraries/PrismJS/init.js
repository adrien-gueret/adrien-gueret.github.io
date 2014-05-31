(function (window, document, undefined) {
	'use strict';

	define(['prismjs/prismjs'], function () {

		function parse(elements)
		{
			for(var i = 0, l = elements.length; i < l; i++)
			{
				if(elements[i].getAttribute('data-prism-init') == 1)
					continue;

				elements[i].setAttribute('data-prism-init', 1);
				console.log(elements[i]);
				Prism.highlightElement(elements[i]);
			}
		}

		return function(context)
		{
			parse(context.querySelectorAll('[class^="language-"]'));
		};
	});

})(window, document);