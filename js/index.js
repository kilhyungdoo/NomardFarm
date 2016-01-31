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
		var code = "13"
		renderTemperatureWeather(code);
	});
	setTab('./tab.html', 'tab2', "2", function() {
		console.info('setTab 2');
	});
	setTab('./tab.html', 'tab3', "3", function() {
		console.info('setTab 3');
	});



});

function setTab(htmlURL, tabId, idSuffix, callBack) {
	$.get(htmlURL, function(html) {
		html = html.replace(/{{id}}/g, idSuffix);
		document.getElementById(tabId).insertAdjacentHTML('afterbegin', html);
		callBack();
	});
}

// 温度と天気
function renderTemperatureWeather(code) {
	getForcastPrefJSONP(code);
}

function getForcastPrefJSONP(code) {
	var element = document.createElement("script");
	element.src = 'http://api.yumake.jp/1.1/forecastPref.php?code=' + code + '&key=0251f12288edabb56b3559173587cc54&format=jsonp&callback=getForcastPrefJSON';
	document.body.appendChild(element);
}

function getForcastPrefJSON(data) {
	console.info('getForcastPrefJSONP success');
	console.info(data);

    var temperature = data.temperatureStation[0].temperature[0]
    var weatherName = data.area[0].weather[0]
	console.info('temp: ' + temperature);
	console.info('weatherName: ' + weatherName);

    $('#temp-1').text(temperature);
    if (weatherName == "晴れ") {
        $('#weather-1').attr("src","img/weather_sunny.png");
    } else if (weatherName == "くもり") {
        $('#weather-1').attr("src","img/weather_cloudy.png")
    } else if (weatherName == "雪") {
        $('#weather-1').attr("src","img/weather_snow.png")
    } else if (weatherName == "雷") {
        $('#weather-1').attr("src","img/weather_thunder.png")
    } else {
        $('#weather-1').attr("src","img/weather_rain.png");
    }

}
