document.addEventListener( 'DOMContentLoaded', function() {
  "use strict";
  // this is parent js

	document.getElementById('#navTabs1').addEventListener('click', function() {
		setTimeout(function() {
			console.info('weathre chart render start');
			renderWeather();
		}, 1000);
	});
	renderWeather();

});


function renderWeather() {
  var dataArray = [];
  var sampleData = 25;
  var jsonData;
	getJSONP();

	var randomScalingFactor = function(){ return Math.round(Math.random()*100)};
	//var sampleArray = '{"name":"tom","Second":"smith","age":"20","value":"180","status":"success"}'
	//var json = JSON.parse(sampleArray);
	//var jsonSampleData = json.value;

	var lineChartData = {
		labels : ["January","February","March","April","May","June","July"],
		datasets : [
			{
				label: "My First dataset",
				fillColor : "rgba(220,220,220,0.2)",
				strokeColor : "rgba(220,220,220,1)",
				pointColor : "rgba(220,220,220,1)",
				pointStrokeColor : "#fff",
				pointHighlightFill : "#fff",
				pointHighlightStroke : "rgba(220,220,220,1)",
				data : [sampleData,sampleData,randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor()]
			},
			{
				label: "My Second dataset",
				fillColor : "rgba(151,187,205,0.2)",
				strokeColor : "rgba(151,187,205,1)",
				pointColor : "rgba(151,187,205,1)",
				pointStrokeColor : "#fff",
				pointHighlightFill : "#fff",
				pointHighlightStroke : "rgba(151,187,205,1)",
				data : [sampleData,randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor()]
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

function getJSONP() {
	var element = document.createElement("script");
	element.src = "http://api.yumake.jp/1.0/forecastMsm.php?lat=35.686533327621&lon=139.69192653894&key=0251f12288edabb56b3559173587cc54&format=jsonp&callback=getJSON";
	document.body.appendChild(element);
}

function getJSON(data) {
	console.info('get json success');
	console.info(data);
}
