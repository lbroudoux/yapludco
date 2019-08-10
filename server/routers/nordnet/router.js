'use strict';

var http = require('http');
var htmlParser = require('node-html-parser');

exports.getBlockedDevices = function(config, callback) {
  var data = '';
  var devices = [];
  var credentials = Buffer.from(config.router.username + ':' + config.router.password, 'ascii');

  var routerReq = http.request({
    hostname: config.router.internalIP,
    path: '/todmngr.tod?action=view',
    method: 'GET',
    headers: {
      'Authorization': 'Basic ' + credentials.toString('base64')
    }
  }, function (response) {
    response.setEncoding('utf-8');
    response.on('data', function (chunk) {
      data += chunk;
    });
    response.on('error', function (e) {
      console.error(e);
    });
    response.on('end', function(e) {
      var html = htmlParser.parse(data);
      var tableNode = html.querySelector("table")
      for (let i = 0; i < tableNode.childNodes.length; i++) {
        const element = tableNode.childNodes[i];
        if (i > 2 && element.nodeType == 1 && element.tagName === 'tr') {
          var macAddress = element.childNodes[3].firstChild.rawText;
          devices.push(macAddress);
        }
      }
      return callback(devices);
    });
  });
  routerReq.on('error', function (err) {
    console.log('Problem with request for getBlockedDevices(): ' + err.message);
  });
  routerReq.end();
}

exports.blockDevice = function (config, member, device, callback) {
  var sessionKey = null;
  var credentials = Buffer.from(config.router.username + ':' + config.router.password, 'ascii');

  retrieveSessionKeyAndApply(config, 
    function(sessionKey) {
      var queryString = "&sessionKey=" + sessionKey;
      queryString += "&mac=" + device.macAddress;
      queryString += "&username=" + member.name + "_" + device.id.replace(" ", "_");

      var routerReq = http.request({
        hostname: config.router.internalIP,
        path: '/todmngr.tod?action=add&days=127&start_time=0&end_time=1439' + queryString,
        method: 'GET',
        headers: {
          'Authorization': 'Basic ' + credentials.toString('base64')
        }
      }, function (response) {
        response.setEncoding('utf-8');
        response.on('data', function (chunk) {
          //console.log("Receiving data: " + chunk);
        });
        response.on('error', function (e) {
          console.error(e);
          callback(e);
        });
        response.on('end', function(e) {
          callback();
        });
      });
      routerReq.on('error', function (err) {
        console.log('Problem with request for blockDevice(): ' + err.message);
      });
      routerReq.end();
    },
    function() {
      console.log('Error callback called for blockDevice()');
    });

  // GET 'http://192.168.5.1/todmngr.tod?action=view' -H 'Authorization: Basic bm9yZG5ldDpub3JkbmV0' -v | grep sessionKey
  // GET http://192.168.5.1/todmngr.tod?action=add&username=test&mac=e8:9e:b4:9b:49:53&days=127&start_time=0&end_time=1439&sessionKey=863469328
  // 'Authorization': 'Basic bm9yZG5ldDpub3JkbmV0'
}

exports.unblockDevice = function (config, member, device, callback) {
  var sessionKey = null;
  var credentials = Buffer.from(config.router.username + ':' + config.router.password, 'ascii');

  retrieveSessionKeyAndApply(config, 
    function(sessionKey) {
      var queryString = "&sessionKey=" + sessionKey;
      queryString += "&rmLst=" + member.name + "_" + device.id.replace(" ", "_");

      var routerReq = http.request({
        hostname: config.router.internalIP,
        path: '/todmngr.tod?action=remove' + queryString,
        method: 'GET',
        headers: {
          'Authorization': 'Basic ' + credentials.toString('base64')
        }
      }, function (response) {
        response.setEncoding('utf-8');
        response.on('data', function (chunk) {
          //console.log("Receiving data: " + chunk);
        });
        response.on('error', function (e) {
          console.error(e);
          callback(e);
        });
        response.on('end', function (e) {
          callback();
        });
      });
      routerReq.on('error', function (err) {
        console.log('Problem with request for unblockDevice(): ' + err.message);
      });
      routerReq.end();
    },
    function() {
      console.log('Error callback called for unblockDevice()');
    });

  // GET 'http://192.168.5.1/todmngr.tod?action=view' -H 'Authorization: Basic bm9yZG5ldDpub3JkbmV0' -v | grep sessionKey
  // GET http://192.168.5.1/todmngr.tod?action=remove&rmLst=test&sessionKey=496782000
  // 'Authorization': 'Basic bm9yZG5ldDpub3JkbmV0'
}

function retrieveSessionKeyAndApply(config, successCB, errorCB) {
  var sessionKey = null;
  var credentials = Buffer.from(config.router.username + ':' + config.router.password, 'ascii');

  var routerReq = http.request({
    hostname: config.router.internalIP,
    path: '/todmngr.tod?action=view',
    method: 'GET',
    headers: {
      'Authorization': 'Basic ' + credentials.toString('base64')
    }
  }, function (response) {
    response.setEncoding('utf-8');
    response.on('data', function (chunk) {
      if (chunk.includes("&sessionKey=")) {
        sessionKey = chunk.substr(chunk.indexOf("&sessionKey=") + "&sessionKey=".length, 12);
        // Remove trailing ' if any.
        if (sessionKey.indexOf("'") != -1) {
          sessionKey = sessionKey.substr(0, sessionKey.indexOf("'"));
        }
        console.log('Found sessionKey=' + sessionKey);
      } 
    });
    response.on('error', function (e) {
      console.error(e);
    });
    response.on('end', function(e) {
      if (sessionKey != null) {
        return successCB(sessionKey);
      }
      return errorCB();
    });
  });
  routerReq.on('error', function (err) {
    console.log('Problem with request for retrieveSessionKeyAndApply(): ' + err.message);
  });
  routerReq.end();
}