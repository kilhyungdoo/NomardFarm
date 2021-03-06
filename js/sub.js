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
  var interval = 2000;
  var currentTime1 = Date.now();
  var vehicleSpeedSub = navigator.vehicle.vehicleSpeed.subscribe(function(vehicleSpeed) {
    console.log('speed');
    if (Date.now() - currentTime1 > interval) {
      currentTime1 = Date.now();
      manager.vehicleSpeedCallBack(vehicleSpeed);
    }
  });

  // Engine Speed
  var currentTime2 = Date.now();
  var engineSpeedSub = navigator.vehicle.engineSpeed.subscribe(function(engineSpeed) {
    if (Date.now() - currentTime2 > interval) {
      currentTime2 = Date.now();
      manager.engineSpeedCallBack(engineSpeed);
    }
  });

  // Location
  var currentTime3 = Date.now();
  var locationSub = navigator.vehicle.location.subscribe(function(location) {
    if (Date.now() - currentTime3 > interval) {
      currentTime3 = Date.now();
      manager.locationCallBack(location);
    }
  });

  // Fuel
  var currentTime4 = Date.now();
  var fuelSub = navigator.vehicle.fuel.subscribe(function(fuel) {
    if (Date.now() - currentTime4 > interval) {
      currentTime4 = Date.now();
      manager.fuelCallBack(fuel);
    }
  });

});
