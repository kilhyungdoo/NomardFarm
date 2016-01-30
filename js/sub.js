document.addEventListener( 'DOMContentLoaded', function() {
  "use strict";
  // this is chlid js
  // use same js by different car(iframe, roomID)

  var parentDocument = parent.document;

  var roomId = document.getElementById('roomId').value;
  var iframeId = document.getElementById('iframeId').value;
  console.info('roomId: ', roomId);
  console.info('iframeId: ', roomId);

  var manager = new Manager(parentDocument, roomId, iframeId);

  // Vehicle Speed
  var vehicleSpeedSub = navigator.vehicle.vehicleSpeed.subscribe(function(vehicleSpeed) {
    manager.vehicleSpeedCallBack(vehicleSpeed);
  });

  // Engine Speed
  var engineSpeedSub = navigator.vehicle.engineSpeed.subscribe(function(engineSpeed) {
    manager.engineSpeedCallBack(engineSpeed);
  });

  // Location
  var locationSub = navigator.vehicle.location.subscribe(function(location) {
    manager.locationCallBack(location);
  });

});


