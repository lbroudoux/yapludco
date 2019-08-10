'use strict'

var express = require('express');
var controller = require('./device.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.put('/:name', auth.isAuthenticated(), controller.update);

module.exports = router;