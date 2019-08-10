'use strict';

var http = require('http');
var htmlParser = require('node-html-parser');

exports.index = function(req, res) {
  var config = req.app.get('config');
  var routerProvider = req.app.get('routerProvider');
  routerProvider.getBlockedDevices(config, function(devices) {
    console.log("Blocked devices: " + JSON.stringify(devices));
    config.members.forEach(member => {
      member.devices.forEach(device => {
        if (devices.includes(device.macAddress)) {
          device['blocked'] = true;
        } else {
          device['blocked'] = false;
        }
      });
    });
    return res.status(200).json(config.members);
  })
}
