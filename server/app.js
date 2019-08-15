/**
 * Main application file
 */

'use strict';

const express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser'),
    cors = require('cors');

// Retrieve config
const port = process.env.PORT || 4000;
const configFile = process.env.CONFIG || './config/default-config.json'
const config = require(configFile);
const routerProvider = require('./routers/' + config.router.type + '/router')

// Setup server
const app = express();
app.use(bodyParser.json());
app.use(cors());
app.set('config', config);
app.set('routerProvider', routerProvider)

// Configure paths for static resources in production mode
var root = path.normalize(__dirname + '/..')
app.use(express.static(path.join(root, 'public')));
app.set('appPath', path.join(root, 'public'));

// Then configure other API routes
require('./routes')(app);

// Start server
const server = app.listen(port, function(){
  console.log('Express server listening on port ' + port);
});

// Expose app
exports = module.exports = app;
exports.config = config;