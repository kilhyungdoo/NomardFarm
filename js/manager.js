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
};

Manager.prototype.initMap = function() {
  console.info('initMap');
  var id = this.getId('map', this.iframeId);
  console.info(id);

  //TODO:初期値を直値で入れている @ 幕張
  initLatitude = 35.650495;
  initLongitude = 140.03604833333;

  map = L.map(id).setView([initLatitude, initLongitude], 16);

  //OSMレイヤー追加
  L.tileLayer(
    'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a>',
      maxZoom: 17
    }
  ).addTo(map);

};

// callback for getting data real time
Manager.prototype.vehicleSpeedCallBack = function(vehicleSpeed) {
  var id = this.getId('VehicleSpeed', this.iframeId);
  this.log("vehicle speed changed to: ", vehicleSpeed.speed);
//  this.targetDocument.getElementById(id).innerHTML = Math.floor(vehicleSpeed.speed /1000);
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

};

Manager.prototype.fuelCallBack = function(fuel) {
  var level = fuel.level; // percentage of 100
  var consumption = fuel.instantConsumption;
  this.log('fuel level: ', level);
  this.log('fuel consumption: ', consumption);
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