(function (window, document, undefined)
{
	'use strict';

	require(['DOM', 'Role', 'lib/circles'], function ($, Role) {

		var container	=	$('circles_section'),

			all_circles	=	{
				sample1:	Circles.create({
					id:         'sample1',
					value:		50,
					radius:     40,
					width:      5,
					colors:     ['#aaa', '#d50005'],
					duration:   400
				}),
				sample2:	Circles.create({
					id:         'sample2',
					value:		20,
					radius:     40,
					width:      5,
					text:		function(value)
					{
						return 	value + '%';
					},
					colors:     ['#aaa', '#333'],
					duration:   250
				}),
				sample3:	Circles.create({
					id:         'sample3',
					value:		4.2,
					maxValue:	17.73,
					radius:     40,
					width:      10,
					colors:     ['#D3B6C6', '#4B253A'],
					duration:   250
				}),
				sample4:	Circles.create({
					id:         'sample4',
					value:		5,
					maxValue:   20,
					radius:     40,
					width:      40,
					text:		null,
					colors:     ['#FCE6A4', '#EFB917'],
					duration:   500
				}),
				sample5:	Circles.create({
					id:         'sample5',
					value:		10,
					maxValue:   20,
					radius:     40,
					width:      20,
					text:		function(value)
					{
						var src;

						if(value < 5)
						{
							src	=	'very_bad';
							this.updateColors(['#ff7381', '#840000']);
						}
						else if(value < 10)
						{
							src	=	'bad';
							this.updateColors(['#ffc58e', '#c97b00']);
						}
						else if(value < 15)
						{
							src	=	'neutral';
							this.updateColors(['#73d3ff', '#0077c9']);
						}
						else if(value < 20)
						{
							src	=	'good';
							this.updateColors(['#82ff7b', '#027100']);
						}
						else
						{
							src	=	'very_good';
							this.updateColors(['#f8bfff', '#ff35de']);
						}

						return '<img src="./images/circles/'+src+'.gif" alt="" />';
					},
					colors:     ['#000', '#000']
				})
			};

		Role.define(container, {
			add_percent:	function()
			{
				var circle	=	all_circles[this.getAttribute('data-target')];
				circle.update(circle._value + parseFloat(this.getAttribute('data-value')));
			},
			substract_percent:	function()
			{
				var circle	=	all_circles[this.getAttribute('data-target')];
				circle.update(circle._value - parseFloat(this.getAttribute('data-value')));
			},
			add_width:	function()
			{
				var circle		=	all_circles[this.getAttribute('data-target')],
					newWidth	=	circle._strokeWidth + parseInt(this.getAttribute('data-value'), 10);

				circle.updateWidth(Math.min(circle._radius, newWidth));
			},
			substract_width:	function()
			{
				var circle		=	all_circles[this.getAttribute('data-target')],
					newWidth	=	circle._strokeWidth - parseInt(this.getAttribute('data-value'), 10);

				circle.updateWidth(Math.max(10, newWidth));
			}
		});
	});

})(window, document);