'use strict'

var express = require('express');
var controller = require('./admin.controller');

var router = express.Router();

router.post('/', controller.check);

module.exports = router;