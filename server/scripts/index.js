'use strict';

var express = require('express');
var config = require('../config/environment');
var auth = require('../auth/auth.service');
var User = require('../api/user/user.model');

var router = express.Router();

router.get("/gravatar-hash", auth.isAuthenticated(), require("./update-gravatar-hash").run);

module.exports = router;