document.addEventListener( 'DOMContentLoaded', function() {
  "use strict";
  // this is parent js

    var latitude = 35.686533327621
    var longitude = 139.69192653894
	document.getElementById('#navTabs1').addEventListener('click', function() {
		setTimeout(function() {
			console.info('weathre chart render start');
			renderWeather(latitude, longitude);
		}, 1000);
	});
	renderWeather(latitude, longitude);

});

var labelsArray = []
var precipitationArray = []

function renderWeather(latitude, longitude) {
	getJSONP(latitude, longitude);

	//var randomScalingFactor = function(){ return Math.round(Math.random()*100)};
	//var sampleArray = '{"name":"tom","Second":"smith","age":"20","value":"180","status":"success"}'
	//var json = JSON.parse(sampleArray);
	//var jsonSampleData = json.value;

	var lineChartData = {
        labels : labelsArray,
		datasets : [
			{
				label: "My Second dataset",
				fillColor : "rgba(151,187,205,0.2)",
				strokeColor : "rgba(151,187,205,1)",
				pointColor : "rgba(151,187,205,1)",
				pointStrokeColor : "#fff",
				pointHighlightFill : "#fff",
				pointHighlightStroke : "rgba(151,187,205,1)",
                data : precipitationArray
			}
		]
	};

	var canvas = document.getElementById('canvas');
	canvas.width = 455;
	canvas.height = 300;

	var ctx = document.getElementById("canvas").getContext("2d");
	window.myLine = new Chart(ctx).Line(lineChartData, {
		responsive: true
	});
}

function getJSONP(latitude, longitude) {
	var element = document.createElement("script");
	element.src = 'http://api.yumake.jp/1.0/forecastMsm.php?lat=' + latitude + '&lon=' + longitude + '&key=0251f12288edabb56b3559173587cc54&format=jsonp&callback=getJSON';
	document.body.appendChild(element);
}

function getJSON(data) {
	console.info('get json success');
	console.info(data);

    //forecast
    console.info('forecast length:' + data.forecast.length);
    for (var i = 0; i < data.forecast.length && i < 10; i++) {
        var value = data.forecast[i].precipitation
        // (降水無しの場合は999.99)
        if (data.forecast[i].precipitation == 999.99) {
            value = 0
        }
        //console.info('forecast[' + i + ']:' + value);
        precipitationArray.push(value)
        
        var dateObj = new Date(data.forecast[i].forecastDateTime);

        var y = dateObj.getFullYear();
        var m = dateObj.getMonth() + 1;
        var d = dateObj.getDate();
        var h = dateObj.getHours();
        var minutes = dateObj.getMinutes();

        // var yyyymmdd = y + "/" + (m < 10 ? "0" + m : m) + "/" + (d < 10 ? "0" + d : d)
        //                  + "." +(h < 10 ? "0" + h : h) + ":" +(minutes < 10 ? "0" + minutes : minutes);
        var yyyymmdd = (m < 10 ? "0" + m : m) + "/" + (d < 10 ? "0" + d : d)
                            + "." +(h < 10 ? "0" + h : h) + ":" +(minutes < 10 ? "0" + minutes : minutes);

        labelsArray.push(yyyymmdd)
    }
}
