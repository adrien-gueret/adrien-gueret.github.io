(function (window, document, undefined)
{
	'use strict';

	require(['app/Page','DOM', 'lib/jquery/jquery.fullPage'], function (Page, DOM) {

		DOM.insertStyleSheet('./stylesheets/jquery.fullPage.css');

		$(document).ready(function() {

			var $fullpage	=	$('#fullpage');

			$fullpage.fullpage({
				slidesColor: ['#f2f2f2', '#4BBFC3', '#7BAABE', 'whitesmoke', '#ccddff', '#ffddcc'],
				navigation: true
			});

			Page.destruct(function()
			{
				//Let's destroy FullpageJS in order to remove all attached events
				$fullpage.fullpage.destroy();
			})
		});
	});

})(window, document);