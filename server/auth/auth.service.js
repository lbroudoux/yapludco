'use strict';

/**
 * Check that user is authenticated through Authorization Basic headers.
 */
function isAuthenticated() {
  return function(req, res, next) {
    // Check for Basic authorization method only.
    if (req && req.headers && req.headers.authorization 
        && req.headers.authorization.startsWith('Basic')) {

      var parts = req.headers.authorization.split(' ');
      if (parts.length == 2) {
        var credentials = Buffer.from(parts[1], 'base64').toString()
        var username = credentials.split(':')[0];
        var password = credentials.split(':')[1];

        // Check username and password are allowed from config.
        var config = req.app.get('config');
        var found = false;
        config.admins.forEach(admin => {
          if (admin.username === username
              && admin.password === password) {
            found = true;
          }
        });
        if (found) {
          next();
        } else {
          // Problems with credentials.
          res.sendStatus(403);
        }
      } else {
        // No credentials found.
        res.sendStatus(403);
      }
    } else {
      // No Authorization headers.
      res.sendStatus(403);
    }
  }
}

exports.isAuthenticated = isAuthenticated;