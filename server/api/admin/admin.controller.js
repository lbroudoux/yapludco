'use strict';

exports.check = function (req, res) {
  console.log("[admin.controller] check() called with username: " + req.body.username);

  var found = false;
  var config = req.app.get('config');
  
  config.admins.forEach(admin => {
    if (admin.username === req.body.username 
          && admin.password === req.body.password) {
      found = true;
      return res.status(200).json(admin);
    }
  });
  if (!found) {
    return res.status(403).json({error: "Username unknown or bad password"});
  }
}
