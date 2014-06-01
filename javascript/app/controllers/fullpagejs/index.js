(function (window, document, undefined)
{
	'use strict';

	var styleSheet	=	'./stylesheets/jquery.fullPage.css';

	require(['app/Page','DOM', 'lib/jquery/jquery.fullPage'], function (Page, DOM) {

		DOM.insertStyleSheet(styleSheet);

		$(document).ready(function() {

			var $fullpage	=	$('#fullpage');

			$fullpage.fullpage({
				slidesColor: ['#f2f2f2', '#4BBFC3', '#7BAABE', 'whitesmoke', '#ccddff', '#ffddcc'],
				navigation: true
			});

			$fullpage.css('text-align', 'center');

			Page.destruct(function()
			{
				//Let's destroy FullpageJS in order to remove all attached events
				$fullpage.fullpage.destroy();
				DOM.removeStyleSheet(styleSheet);
			})
		});
	});

})(window, document);