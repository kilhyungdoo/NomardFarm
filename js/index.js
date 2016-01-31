document.addEventListener( 'DOMContentLoaded', function() {
  "use strict";
  // this is parent js

	setTab('./tab.html', 'tab1', "1", function() {
	  var latitude = 35.686533327621;
	  var longitude = 139.69192653894;
      
		// document.getElementById('#navTabs1-1').addEventListener('click', function() {
		// 	setTimeout(function() {
		// 		console.info('weathre chart render start');
		// 		renderWeather(latitude, longitude);
		// 	}, 1000);
		// });
		renderWeather(latitude, longitude);
	});
	setTab('./tab.html', 'tab2', "2", function() {

	});
	setTab('./tab.html', 'tab3', "3", function() {
		
	});



});

function setTab(htmlURL, tabId, idSuffix, callBack) {
	$.get(htmlURL, function(html) {
		html = html.replace(/{{id}}/g, idSuffix);
		document.getElementById(tabId).insertAdjacentHTML('afterbegin', html);
		callBack();
	});
}
