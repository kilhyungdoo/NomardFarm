// constructor
Manager = function(targetDocument, roomId, iframeId) {
  console.info('Manager init: ', roomId);
  this.roomId = roomId;
  this.targetDocument = targetDocument;
  this.iframeId = iframeId;

  // api connection start
  var msg = {"roomID":roomId, "data":"NOT REQUIRED"};
  socket.emit('joinRoom', JSON.stringify(msg));

  // Layout init
  var id = this.getId('WSRoomID', this.iframeId);
//  this.targetDocument.getElementById(id).innerHTML = roomId;

};

// callback for getting data real time
Manager.prototype.vehicleSpeedCallBack = function(vehicleSpeed) {
  var id = this.getId('VehicleSpeed', this.iframeId);
  this.log("vehicle speed changed to: ", vehicleSpeed.speed);
  this.targetDocument.getElementById(id).innerHTML = Math.floor(vehicleSpeed.speed /1000) + "<span class='unit'>km/h</span>";

  // 車のアニメーションを変化させる
  var id = this.getId('CarAni', this.iframeId);

  if (vehicleSpeed.speed / 1000 > 2) {
      this.targetDocument.getElementById(id).innerHTML = "<img src='img/animation_close.gif'>";
  } else {
      this.targetDocument.getElementById(id).innerHTML = "<img src='img/animation_open.gif'>";
  }
};

Manager.prototype.engineSpeedCallBack = function(engineSpeed) {
  var id = this.getId('EngineSpeed', this.iframeId);
  this.log("engine speed changed to: ", engineSpeed.speed);
//  this.targetDocument.getElementById(id).innerHTML = Math.floor(engineSpeed.speed /1000);
};

Manager.prototype.locationCallBack = function(location) {
  var latitudeId = this.getId('LocationLatitude', this.iframeId);
  var longitudeId = this.getId('LocationLongitude', this.iframeId);

  this.log('location: ', location);
  var latitude = location.latitude;
  var longitude = location.longitude;

//  this.targetDocument.getElementById(latitudeId).innerHTML = latitude;
//  this.targetDocument.getElementById(longitudeId).innerHTML = longitude;

  // 降雨量予測更新
  renderWeather(latitude, longitude);

};

Manager.prototype.fuelCallBack = function(fuel) {
  var id = this.getId('Fuel', this.iframeId);
  var level = fuel.level; // percentage of 100
  var consumption = fuel.instantConsumption;
  this.log('fuel level: ', level);
  this.log('fuel consumption: ', consumption);
  this.targetDocument.getElementById(id).innerHTML = level + "<span class='unit'>%</span>";
};

Manager.prototype.log = function(message, object) {
  var header = '[' + this.roomId + '] ';
  console.log(header + message, object);
  var id = 'logBox-' + this.iframeId;
  var log = this.targetDocument.getElementById(id);
  log.innerHTML = log.innerHTML + '<br>' + header + message + object;

  var scrollHeight = log.scrollHeight;
  log.scrollTop = scrollHeight;
};

Manager.prototype.getId = function(string, iframeId) {
  return string + '-' + iframeId;
};


// 降雨量関連
var labelsArray = []
var precipitationArray = []

function renderWeather(latitude, longitude) {
	getJSONP(latitude, longitude);

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

	var canvas = document.getElementById('canvas-1');
    if (canvas == null) {
        canvas = parent.document.getElementById('canvas-1');
        if (canvas == null) {
            this.log('canvas is null');
        }
    }
    
	// canvas.width = 455;
	// canvas.height = 300;
	canvas.width = 500;
	canvas.height = 180;

	var ctx = canvas.getContext("2d");
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
	//console.info('get json success');
	console.info(data);

    //forecast
    console.info('forecast length:' + data.forecast.length);
    labelsArray = []
    precipitationArray = []
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
