document.addEventListener( 'DOMContentLoaded', function() {
  "use strict";
  // this is chlid js
  // use same js by different car(iframe, roomID)

  console.info('sub.js');

  var parentDocument = parent.document;

  var roomId = document.getElementById('roomId').value;
  var iframeId = document.getElementById('iframeId').value;
  console.info('roomId: ', roomId);
  console.info('iframeId: ', roomId);

  var manager = new Manager(parentDocument, roomId, iframeId);

  // Vehicle Speed
  var currentTime1 = Date.now();
  var vehicleSpeedSub = navigator.vehicle.vehicleSpeed.subscribe(function(vehicleSpeed) {
    if (currentTime1 - Date.now() < 1000) {
      currentTime1 = Date.now();
      manager.vehicleSpeedCallBack(vehicleSpeed);
    }
  });

  // Engine Speed
  var currentTime2 = Date.now();
  var engineSpeedSub = navigator.vehicle.engineSpeed.subscribe(function(engineSpeed) {
    if (currentTime2 - Date.now() < 1000) {
      currentTime2 = Date.now();
      manager.engineSpeedCallBack(engineSpeed);
    }
  });

  // Location
  var currentTime3 = Date.now();
  var locationSub = navigator.vehicle.location.subscribe(function(location) {
    if (currentTime3 - Date.now() < 1000) {
      currentTime3 = Date.now();
      manager.locationCallBack(location);
    }
  });

  // Fuel
  var currentTime4 = Date.now();
  var fuelSub = navigator.vehicle.fuel.subscribe(function(fuel) {
    if (currentTime4 - Date.now() < 1000) {
      currentTime4 = Date.now();
      manager.fuelCallBack(fuel);
    }
  });

//  var mapId = 'map-' + iframeId;
//  initMap(mapId);

  console.info('setTimeout');
/*  setTimeout(function() {
    initMap();

//    addMarker2(gVehicleSpeed, gEngineSpeed, location.latitude, location.longitude);
    addMarker2(34, 34, 35.687825, 139.71856833333334);

  }, 1000);*/

});


/*
var map;
var marker = [];
var gCount = 0;
var polyline = [];
var polylinePoints = [];
var polylineOptions = {
        color: 'blue',
        weight: 3,
        opacity: 0.9
};

//Extend the Default marker class
var redCarIcon = L.Icon.Default.extend({
   options: {
         iconUrl: './img/redcar.png',
         iconSize:  [36, 24],
         iconAnchor: [20, 10],
         popupAnchor: [0, 0]
   }
});
var redCarIcon = new redCarIcon();

function initMap() {
  console.info('initMap');

  //TODO:初期値を直値で入れている @ 幕張
  initLatitude = 35.650495;
  initLongitude = 140.03604833333;

  map = L.map('map').setView([initLatitude, initLongitude], 16);

  //OSMレイヤー追加
  L.tileLayer(
    'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a>',
      maxZoom: 17
    }
  ).addTo(map);
}

function clearMap() {
  var i=0;
  for(i=0; i<gCount; i++){
    map.removeLayer(marker[i]);
  }
  polylinePoints.splice(0, gCount);//gCountの数が、マーカーの数

  for(i=1; i<gCount; i++){
    map.removeLayer(polyline[i]);
  }
  polyline.splice(0, gCount);

  gCount=0;
}


function addMarker2(vspeed, espeed, latitude, longitude) {
  var zIn = 0;
  if(gCount > 0){
    map.removeLayer(marker[gCount-1]);
  }
  
  if(latitude === "" || longitude === ""){
    return;
  }
  
  marker[gCount] = L.marker([latitude, longitude])
    .setIcon(redCarIcon)
    .bindPopup("<h2>Vehicle Speed: " + vspeed + "km/h" + "</h2><h2>Engine Speed:  " + espeed + "rpm</h2>")
    .addTo(map)
    .openPopup();
  
  zIn = gCount * 10; // gCountをそのままsetZIndexOffset()に与えても新しいマーカーが必ずしも上にならないので、大きな差をつける。
  marker[gCount].setZIndexOffset(zIn);//マーカーにz-indexを設定
  map.panTo(new L.latLng(latitude, longitude));//地図の自動移動
  
  gCount++; 
}
*/
