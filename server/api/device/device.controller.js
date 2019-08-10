'use strict';

exports.update = function (req, res) {
  var config = req.app.get('config');
  var routerProvider = req.app.get('routerProvider');
  var memberName = req.params.name;
  var enable = req.body.enable;
  var device = req.body.device;

  for (let i = 0; i < config.members.length; i++) {
    const member = config.members[i];
    if (member.name === memberName) {
      if (enable) {
        console.log("Unblocking device with mac " + device.macAddress);
        routerProvider.unblockDevice(config, member, device, function () {
          device["blocked"] = false;
          return res.status(200).json(device);
        });
      } else {
        console.log("Blocking device with mac " + device.macAddress);
        routerProvider.blockDevice(config, member, device, function () {
          device["blocked"] = true;
          return res.status(200).json(device);
        });
      }
      break;
    }
  }
}