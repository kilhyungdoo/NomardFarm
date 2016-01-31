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

  var self = this;
  setTimeout(function() {
    self.initMap();
  }, 1000);

  this.targetDocument.getElementById('navTabsTop').addEventListener('click', function() {
    setTimeout(function() {
      self.reloadMap();
    }, 700);
  });
};

Manager.prototype.initMap = function() {
  console.info('initMap');
  var id = this.getId('map', this.iframeId);
  console.info(id);

  //TODO:初期値を直値で入れている @ 幕張
  initLatitude = 35.650495;
  initLongitude = 140.03604833333;

  this.map = L.map(id).setView([initLatitude, initLongitude], 16);
  this.marker = [];
  this.polyline = [];
  this.polylinePoints = [];

  //OSMレイヤー追加
  L.tileLayer(
    'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a>',
      maxZoom: 17
    }
  ).addTo(this.map);

  var redCarIcon = L.Icon.Default.extend({
     options: {
           iconUrl: './img/redcar.png',
           iconSize:  [36, 24],
           iconAnchor: [20, 10],
           popupAnchor: [0, 0]
     }
  });
  this.redCarIcon = new redCarIcon();

  this.gCount = 0;

};

Manager.prototype.reloadMap = function() {
  console.log('reload map:' + this.iframeId);
  this.map._onResize();

};

Manager.prototype.addMarker2 = function(vspeed, espeed, latitude, longitude) {
  var polylineOptions = {
        color: 'blue',
        weight: 3,
        opacity: 0.9
  };

  var zIn = 0;
  while(this.gCount > 0){
    console.log('remove layer: ' + this.gCount);
    this.map.removeLayer(this.marker[this.gCount-1]);
    delete this.marker[this.gCount-1];
    this.gCount--;
  }

  var self = this;
/*  this.map.eachLayer(function (layer) {
    if (layer._url) {
      console.warn('map not delete');
    } else {
      self.map.removeLayer(layer);
    }
  });*/
  
  if(latitude === "" || longitude === ""){
    return;
  }
  
  var latitudeStr = Math.floor(latitude * 10000) / 10000.0;
  var longitudeStr = Math.floor(longitude * 10000) / 10000.0;
  var popupText = '<div class="popup">緯度:' + latitudeStr + '<br>経度: ' + longitudeStr + '</div>';
//  <h2>Vehicle Speed: " + vspeed + "km/h" + "</h2><h2>Engine Speed:  " + espeed + "rpm</h2>"
  this.marker[this.gCount] = L.marker([latitude, longitude])
    .setIcon(this.redCarIcon)
    .bindPopup(popupText)
    .addTo(this.map)
    .openPopup();
  
  zIn = this.gCount * 10; // gCountをそのままsetZIndexOffset()に与えても新しいマーカーが必ずしも上にならないので、大きな差をつける。
  this.marker[this.gCount].setZIndexOffset(zIn);//マーカーにz-indexを設定
  this.map.panTo(new L.latLng(latitude, longitude));//地図の自動移動
  
  this.gCount++;
};

// callback for getting data real time
Manager.prototype.vehicleSpeedCallBack = function(vehicleSpeed) {
  var id = this.getId('VehicleSpeed', this.iframeId);
  this.log("vehicle speed changed to: ", vehicleSpeed.speed);
  this.targetDocument.getElementById(id).innerHTML = Math.floor(vehicleSpeed.speed /1000) + "<span class='unit'>km/h</span>";

  // 車のアニメーションを変化させる
  var car_id = this.getId('CarAni', this.iframeId);
  var line_id = this.getId('LineAni', this.iframeId);
  var pb_id = this.getId('ProgBar', this.iframeId);

  if (vehicleSpeed.speed / 1000 > 2) {
      this.targetDocument.getElementById(car_id).innerHTML = "<img src='img/animation_stopMode.gif'>";
      this.targetDocument.getElementById(line_id).innerHTML = "<img src='img/animation_moveLine.gif'>";
  } else {
      this.targetDocument.getElementById(car_id).innerHTML = "<img src='img/animation_open.gif'>";
      this.targetDocument.getElementById(line_id).innerHTML = "<img src='img/animation_stopLine.gif'>";

      this.targetDocument.getElementById(pb_id).style.width = '60%';
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


  var gVehicleSpeed = 10;
  var gEngineSpeed = 10;
  this.addMarker2(gVehicleSpeed, gEngineSpeed, location.latitude, location.longitude);

//  this.targetDocument.getElementById(latitudeId).innerHTML = latitude;
//  this.targetDocument.getElementById(longitudeId).innerHTML = longitude;

  // 降雨量予測更新
  renderWeather(latitude, longitude);

};

Manager.prototype.fuelCallBack = function(fuel) {
  var level = fuel.level; // percentage of 100
  var consumption = fuel.instantConsumption;
  this.log('fuel level: ', level);
  this.log('fuel consumption: ', consumption);

  var id = this.getId('Fuel', this.iframeId);
  this.targetDocument.getElementById(id).innerHTML = fuel.level;


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
