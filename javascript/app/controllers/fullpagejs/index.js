(function (window, document, undefined)
{
	'use strict';

	require(['DOM', 'lib/jquery/jquery.fullPage'], function (DOM) {
		DOM.insertStyleSheet('./stylesheets/jquery.fullPage.css');

		$(document).ready(function() {

			var $fullpage	=	$('#fullpage');

			$fullpage.fullpage({
				slidesColor: ['#f2f2f2', '#4BBFC3', '#7BAABE', 'whitesmoke', '#ccddff', '#ffddcc'],
				navigation: true
			});

			//When we click on a link (= when we want to perform an Ajax loading!)
			$fullpage.on('click', 'a', function()
			{
				//Let's destroy FullpageJS in order to remove all attached events
				$fullpage.fullpage.destroy();
			});
		});
	});

})(window, document);