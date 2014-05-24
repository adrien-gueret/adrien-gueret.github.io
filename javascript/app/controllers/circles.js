(function (window, document, undefined)
{
	'use strict';

	require(['DOM', 'Role', 'lib/circles'], function ($, Role) {

		var container	=	$('circles_section'),

			all_circles	=	{
				sample1:	Circles.create({
					id:         'sample1',
					percentage: 50,
					radius:     40,
					width:      5,
					number:     100,
					colors:     ['#aaa', '#d50005'],
					duration:   400
				})
			};

		Role.define(container, {
			add_percent:	function()
			{
				var circle	=	all_circles[this.getAttribute('data-target')];
				circle.updatePercent(circle._percentage + parseInt(this.getAttribute('data-value'), 10));
			},
			substract_percent:	function()
			{
				var circle	=	all_circles[this.getAttribute('data-target')];
				circle.updatePercent(circle._percentage - parseInt(this.getAttribute('data-value'), 10));
			}
		});
	});

})(window, document);