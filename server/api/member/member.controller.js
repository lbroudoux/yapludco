'use strict';

exports.update = function (req, res) {
  var config = req.app.get('config');
  var routerProvider = req.app.get('routerProvider');
  var memberName = req.params.name;
  var enable = req.body.enable;

  for (let i = 0; i < config.members.length; i++) {
    const member = config.members[i];
    if (member.name === memberName) {
      member.devices.forEach(device => {
        if (enable) {
          routerProvider.blockDevice(config, device);
        } else {
          routerProvider.unblockDevice(config, device);
        }
      });
      breaks;
    }  
  }
}