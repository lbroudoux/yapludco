'use strict';

var async = require('async');

exports.update = function (req, res) {
  var config = req.app.get('config');
  var routerProvider = req.app.get('routerProvider');
  var memberName = req.params.name;
  var enable = req.body.enable;

  for (let i = 0; i < config.members.length; i++) {
    const member = config.members[i];
    if (member.name === memberName) {
      async.eachSeries(member.devices, function(device, callback) {
        if (enable) {
          console.log("Unblocking device with mac " + device.macAddress);
          routerProvider.unblockDevice(config, member, device, function () {
            device["blocked"] = false;
            callback();
          });
        } else {
          console.log("Blocking device with mac " + device.macAddress);
          routerProvider.blockDevice(config, member, device, function () {
            device["blocked"] = true;
            callback();
          });
        }
      }, function(err, results) {
        if (err == null) {
          return res.status(200).json(member);
        }
        return res.status(500).json(err);
      });
      break;
    }  
  }
}